"use strict";

/**
 * vesper-server — 秘密空间的小后端
 * - 门禁：登录/验证/登出（cookie 会话，配合 Caddy forward_auth）
 * - 日记：SQLite 存储，created_at 只在创建时写入（时间戳稳定）
 * - 语音成文：音频 → ffmpeg → OpenRouter（音频理解）→ markdown
 * - 朗读：文本 → qyqm-local-tts（分句合成）→ 拼接 WAV
 * - 图片：上传 → COS（不可猜测 URL）
 * - PPT/PDF：LibreOffice 转 PDF → pdftoppm 出每页图 → COS，之后走 AI 插图排版
 */

const http = require("http");
const crypto = require("crypto");
const fs = require("fs");
const os = require("os");
const path = require("path");
const { spawn } = require("child_process");
const WebSocket = require("ws");
const Database = require("better-sqlite3");

const env = (k, d = "") => process.env[k] || d;

const PORT = 7000;
const COOKIE_NAME = "vesper_gate";
const COOKIE_SECRET = env("GATE_COOKIE_SECRET");
const FRIEND_HASH = env("GATE_FRIEND_HASH");
const OWNER_HASH = env("GATE_OWNER_HASH");
const COOKIE_TTL_S = 30 * 24 * 3600; // 30 天
const TTS_BASE = env("TTS_BASE_URL", "http://tts:8000");
const OR_BASE = env("OPENROUTER_BASE_URL", "https://openrouter.ai/api/v1");
const OR_KEY = env("OPENROUTER_API_KEY");
// 出海代理（proxy-hk.qyqmedu.com 的 edge-proxy，绕开 OpenRouter 区域限制）
const EDGE_PROXY_SECRET = env("EDGE_PROXY_SECRET");
// FunASR 自托管语音识别（vesper-refactory-funasr，复用现有容器）
const FUNASR_URL = env("FUNASR_WS_URL", "ws://host.docker.internal:10095");
// Waline 评论后端（compose 内网）
const WALINE_BASE = env("WALINE_BASE_URL", "http://waline:8360");
const AI_COMMENT_NICK = env("AI_COMMENT_NICK", "园丁");
const SCRIBE_MODEL = env("SCRIBE_MODEL", "google/gemini-2.5-flash");
const ILLUSTRATE_MODEL = env("ILLUSTRATE_MODEL", "qwen/qwen2.5-vl-72b-instruct");
const COS_BUCKET = env("COS_BUCKET");
const COS_REGION = env("COS_REGION");
const COS_PUBLIC = env("COS_PUBLIC_BASE_URL").replace(/\/$/, "");
const DATA_DIR = env("DATA_DIR", "/app/data");

// ---------------------------------------------------------------- 存储

fs.mkdirSync(DATA_DIR, { recursive: true });
fs.mkdirSync(path.join(DATA_DIR, "tts-cache"), { recursive: true });
const db = new Database(path.join(DATA_DIR, "diary.db"));
db.exec(`CREATE TABLE IF NOT EXISTS entries(
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
)`);

// ---------------------------------------------------------------- 工具

const sha256 = (s) => crypto.createHash("sha256").update(s, "utf8").digest("hex");
const hmac = (s) => crypto.createHmac("sha256", COOKIE_SECRET).update(s).digest("hex");

function makeToken(role) {
  const exp = Date.now() + COOKIE_TTL_S * 1000;
  return `${role}.${exp}.${hmac(`${role}.${exp}`)}`;
}

function parseToken(raw) {
  if (!raw) return null;
  const parts = raw.split(".");
  if (parts.length !== 3) return null;
  const [role, exp, sig] = parts;
  if (role !== "owner" && role !== "friend") return null;
  if (!/^\d+$/.test(exp) || Number(exp) < Date.now()) return null;
  const expect = hmac(`${role}.${exp}`);
  const a = Buffer.from(sig);
  const b = Buffer.from(expect);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
  return role;
}

function roleFromReq(req) {
  const cookie = req.headers.cookie || "";
  const m = cookie.match(new RegExp(`(?:^|;\\s*)${COOKIE_NAME}=([^;]+)`));
  return m ? parseToken(decodeURIComponent(m[1])) : null;
}

function json(res, status, payload, headers = {}) {
  const body = JSON.stringify(payload);
  res.writeHead(status, {
    "content-type": "application/json; charset=utf-8",
    ...headers,
  });
  res.end(body);
}

function readBody(req, limit) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let size = 0;
    req.on("data", (c) => {
      size += c.length;
      if (size > limit) {
        reject(Object.assign(new Error("payload too large"), { status: 413 }));
        req.destroy();
        return;
      }
      chunks.push(c);
    });
    req.on("end", () => resolve(Buffer.concat(chunks)));
    req.on("error", reject);
  });
}

async function readJson(req, limit = 1 << 20) {
  const buf = await readBody(req, limit);
  try {
    return JSON.parse(buf.toString("utf8") || "{}");
  } catch {
    throw Object.assign(new Error("invalid json"), { status: 400 });
  }
}

function clientIp(req) {
  const xff = req.headers["x-forwarded-for"];
  return (typeof xff === "string" && xff.split(",")[0].trim()) || req.socket.remoteAddress || "unknown";
}

// 登录限流：连续失败 5 次锁 10 分钟（内存态，容器重启即清零，可接受）
const loginFails = new Map(); // ip -> { fails, lockedUntil }
function isLocked(ip) {
  const rec = loginFails.get(ip);
  return !!(rec && rec.lockedUntil > Date.now());
}
function recordFail(ip) {
  const rec = loginFails.get(ip) || { fails: 0, lockedUntil: 0 };
  rec.fails += 1;
  if (rec.fails >= 5) {
    rec.lockedUntil = Date.now() + 10 * 60 * 1000;
    rec.fails = 0;
  }
  loginFails.set(ip, rec);
}

// ---------------------------------------------------------------- 门禁

const IMAGE_EXT = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/gif": "gif",
  "image/webp": "webp",
};

function handleGate(req, res, pathname) {
  if (pathname === "/api/gate/verify" && req.method === "GET") {
    // Caddy forward_auth 子请求：原请求的 Accept/X-Forwarded-Uri 会被带过来
    const role = roleFromReq(req);
    if (role) {
      res.writeHead(200, { "x-auth-role": role });
      res.end();
      return true;
    }
    const fwd = String(req.headers["x-forwarded-uri"] || "/");
    if (fwd.startsWith("/api") || fwd.startsWith("/waline")) {
      json(res, 401, { errno: 401, errmsg: "unauthorized" });
      return true;
    }
    res.writeHead(302, { location: `/gate/?next=${encodeURIComponent(fwd)}` });
    res.end();
    return true;
  }

  if (pathname === "/api/gate/login" && req.method === "POST") {
    return (async () => {
      const ip = clientIp(req);
      if (isLocked(ip)) {
        return json(res, 429, { errno: 429, errmsg: "试错太多次了，过十分钟再来。" });
      }
      const { answer } = await readJson(req);
      const h = sha256(String(answer || "").trim().toLowerCase());
      let role = null;
      if (h === OWNER_HASH) role = "owner";
      else if (h === FRIEND_HASH) role = "friend";
      if (!role) {
        recordFail(ip);
        return json(res, 401, { errno: 401, errmsg: "答案不对。" });
      }
      loginFails.delete(ip);
      json(res, 200, { role }, {
        "set-cookie":
          `${COOKIE_NAME}=${encodeURIComponent(makeToken(role))}; ` +
          `Path=/; HttpOnly; SameSite=Lax; Secure; Max-Age=${COOKIE_TTL_S}`,
      });
    })();
  }

  if (pathname === "/api/gate/logout" && req.method === "POST") {
    json(res, 200, { ok: true }, {
      "set-cookie": `${COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Secure; Max-Age=0`,
    });
    return true;
  }

  if (pathname === "/api/gate/me" && req.method === "GET") {
    json(res, 200, { role: roleFromReq(req) || "anon" });
    return true;
  }

  return null; // 未命中
}

/** 日记发布后，园丁（AI）来留一段回应 —— 挂在 Waline 评论里，失败不影响发布 */
async function postAiComment(id, title, content) {
  if (!OR_KEY) return;
  try {
    const prompt = [
      "你是这片秘密花园的园丁，一个温柔、敏锐、真诚的朋友。主人刚写了一篇日记，请读完后写一段回应（50~120 字）：",
      "- 具体：要点到日记里的细节，让主人感到被认真读了；",
      "- 真诚：可以共鸣、可以轻轻提问；不说教、不总结、不空洞夸奖；",
      "- 平实的口语，一两段话，不要用列表和标题。",
      "",
      `【日记标题】${title}`,
      "【日记正文】",
      String(content).slice(0, 3000),
    ].join("\n");
    const text = (await callLlm(SCRIBE_MODEL, prompt)).trim();
    if (!text) return;
    await fetch(`${WALINE_BASE}/api/comment`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        origin: "https://vesper.qyqmedu.com",
      },
      body: JSON.stringify({
        comment: text,
        nick: AI_COMMENT_NICK,
        url: `/secret/entry?id=${id}`,
        ua: "vesper-server",
      }),
    });
  } catch (e) {
    console.error("ai comment failed:", e.message);
  }
}

// ---------------------------------------------------------------- 日记

function excerptOf(content) {
  return content
    .replace(/[#>*`\-[\]()!]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 120);
}

function handleEntries(req, res, pathname, role) {
  if (pathname === "/api/entries" && req.method === "GET") {
    const rows = db
      .prepare("SELECT id, title, content, created_at, updated_at FROM entries ORDER BY created_at DESC, id DESC")
      .all()
      .map(({ content, ...r }) => ({ ...r, excerpt: excerptOf(content) }));
    json(res, 200, rows);
    return true;
  }

  const m = pathname.match(/^\/api\/entries\/(\d+)$/);
  if (m && req.method === "GET") {
    const row = db.prepare("SELECT * FROM entries WHERE id = ?").get(Number(m[1]));
    if (row) json(res, 200, row);
    else json(res, 404, { errno: 404, errmsg: "不存在" });
    return true;
  }

  // 以下为主人专属
  if (pathname === "/api/entries" && req.method === "POST") {
    return (async () => {
      if (role !== "owner") return json(res, 403, { errno: 403, errmsg: "只有主人能写日记" });
      const { title, content, created_at } = await readJson(req);
      if (!title || !content) return json(res, 400, { errno: 400, errmsg: "缺标题或内容" });
      const now = new Date().toISOString();
      // created_at 仅迁移旧文时允许指定；一经写入不再变化
      const created = created_at && /^\d{4}-\d{2}-\d{2}/.test(created_at) ? new Date(created_at).toISOString() : now;
      const info = db
        .prepare("INSERT INTO entries (title, content, created_at, updated_at) VALUES (?, ?, ?, ?)")
        .run(String(title).slice(0, 200), String(content), created, now);
      json(res, 200, { id: info.lastInsertRowid });
      // 园丁来留言：异步，不阻塞发布
      postAiComment(info.lastInsertRowid, String(title), String(content)).catch(() => {});
    })();
  }

  if (m && req.method === "PUT") {
    return (async () => {
      if (role !== "owner") return json(res, 403, { errno: 403, errmsg: "只有主人能改日记" });
      const { title, content } = await readJson(req);
      if (!title || !content) return json(res, 400, { errno: 400, errmsg: "缺标题或内容" });
      const info = db
        .prepare("UPDATE entries SET title = ?, content = ?, updated_at = ? WHERE id = ?")
        .run(String(title).slice(0, 200), String(content), new Date().toISOString(), Number(m[1]));
      json(res, info.changes ? 200 : 404, info.changes ? { ok: true } : { errno: 404, errmsg: "不存在" });
    })();
  }

  if (m && req.method === "DELETE") {
    if (role !== "owner") {
      json(res, 403, { errno: 403, errmsg: "只有主人能删日记" });
      return true;
    }
    const info = db.prepare("DELETE FROM entries WHERE id = ?").run(Number(m[1]));
    if (info.changes) json(res, 200, { ok: true });
    else json(res, 404, { errno: 404, errmsg: "不存在" });
    return true;
  }

  return null;
}

// ---------------------------------------------------------------- 语音成文

const SCRIBE_PROMPT = [
  "这是一段语音日记的 ASR 转写文本。转写里有口头禅、气口、停顿重复，也可能有同音错字。请你把它处理成一篇日记。",
  "",
  "【第一原则：真实】",
  "- 这是日记主人的口述实录，真实性高于一切：只清理，不创作。",
  "- 不得增加原文没有的事实、感受、细节、评价；不得改变事实、数字、人名、时间、地点；不得把口语原意“升华”成别的意思。",
  "",
  "【必须做的清理】",
  "1. 去掉口头禅与气口（如“嗯”“啊”“那个”“就是说”“然后然后”）、无意义的停顿、结巴和重复；",
  "2. 结合上下文修正明显的同音错字、识别错误（人名、专有名词按语境还原）；拿不准怎么改的地方，原样保留，不许猜；",
  "3. 把断续的口语理顺成通顺的句子，但保持第一人称和说话人自己的口气。",
  "",
  "【格式】",
  "- markdown：自然分段，可适当用小标题，不要列表腔、不要总结腔；",
  "- 起一个简短的日记标题。",
  "",
  '严格只输出 JSON，格式：{"title":"标题","markdown":"日记正文"}',
  "",
  "【转写文本】",
].join("\n");

/** 音频 → FunASR（自托管）→ 转写文本 */
function transcribeFunasr(wav) {
  return new Promise((resolve, reject) => {
    const ws = new WebSocket(FUNASR_URL, { handshakeTimeout: 10000 });
    const texts = [];
    let settled = false;
    const finish = (fn, val) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      try { ws.close(); } catch { /* 忽略 */ }
      fn(val);
    };
    // 长音频识别耗时与时长成正比（CPU），按音频长度放宽容限
    const pcmSeconds = Math.max(0, (wav.length - 44) / 32000);
    const timeoutMs = Math.min(600000, Math.max(120000, pcmSeconds * 1500 + 60000));
    const timer = setTimeout(() => finish(reject, new Error("funasr 识别超时")), timeoutMs);

    ws.on("open", () => {
      ws.send(JSON.stringify({
        mode: "offline",
        chunk_size: [5, 10, 5],
        chunk_interval: 10,
        wav_name: "scribe",
        is_speaking: true,
        wav_format: "pcm",
        audio_fs: 16000,
        itn: true,
      }));
      // FunASR online 只认裸 PCM 流：剥掉 44 字节 WAV 头（ffmpeg 输出为 16k/16bit/mono）
      const pcm = wav.subarray(44);
      const CHUNK = 96 * 1024;
      for (let i = 0; i < pcm.length; i += CHUNK) {
        ws.send(pcm.subarray(i, i + CHUNK));
      }
      ws.send(JSON.stringify({ is_speaking: false }));
    });
    ws.on("message", (data) => {
      try {
        const msg = JSON.parse(data.toString());
        // 长音频会分批返回结果，必须全部收完；服务器发完才断开连接
        if (msg.text) texts.push(String(msg.text));
        if (msg.is_final === true) finish(resolve, texts.join(""));
      } catch { /* 非 JSON 帧忽略 */ }
    });
    ws.on("close", () => finish(resolve, texts.join("")));
    ws.on("error", (e) => finish(reject, e));
  });
}

function toWav16k(input) {
  return new Promise((resolve, reject) => {
    const p = spawn("ffmpeg", [
      "-hide_banner", "-loglevel", "error",
      "-i", "pipe:0", "-ar", "16000", "-ac", "1", "-f", "wav", "pipe:1",
    ]);
    const out = [];
    const err = [];
    p.stdout.on("data", (d) => out.push(d));
    p.stderr.on("data", (d) => err.push(d));
    p.on("error", reject);
    p.on("close", (code) =>
      code === 0 ? resolve(Buffer.concat(out)) : reject(new Error(Buffer.concat(err).toString() || `ffmpeg exit ${code}`))
    );
    p.stdin.end(input);
  });
}

/** 调 LLM（经出海代理），返回原始文本；失败自动重试一次 */
async function callLlm(model, content) {
  const headers = {
    authorization: `Bearer ${OR_KEY}`,
    "content-type": "application/json",
  };
  if (EDGE_PROXY_SECRET) headers["x-proxy-secret"] = EDGE_PROXY_SECRET;
  let lastErr;
  for (let attempt = 0; attempt < 2; attempt++) {
    if (attempt > 0) await new Promise((r) => setTimeout(r, 1500));
    try {
      const resp = await fetch(`${OR_BASE}/chat/completions`, {
        method: "POST",
        headers,
        body: JSON.stringify({ model, messages: [{ role: "user", content }] }),
      });
      if (!resp.ok) {
        const detail = await resp.text().catch(() => "");
        lastErr = Object.assign(new Error(`AI 服务错误 (${resp.status}) ${detail.slice(0, 200)}`), { status: 502 });
        continue;
      }
      const data = await resp.json();
      return data.choices?.[0]?.message?.content || "";
    } catch (e) {
      lastErr = Object.assign(new Error(`AI 请求失败 ${e.message}`), { status: 502 });
    }
  }
  throw lastErr;
}

/** 调 LLM 并把返回内容解析为 JSON 对象 */
async function callLlmJson(model, content) {
  const text = await callLlm(model, content);
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) throw Object.assign(new Error("AI 返回格式异常"), { status: 502 });
  try {
    return JSON.parse(match[0]);
  } catch {
    throw Object.assign(new Error("AI 返回解析失败"), { status: 502 });
  }
}

async function handleScribe(req, res, role) {
  if (role !== "owner") return json(res, 403, { errno: 403, errmsg: "只有主人能用语音成文" });
  if (!OR_KEY) return json(res, 503, { errno: 503, errmsg: "AI 服务未配置" });
  const audio = await readBody(req, 25 << 20);
  if (audio.length === 0) return json(res, 400, { errno: 400, errmsg: "空音频" });

  const wav = await toWav16k(audio);
  const transcript = await transcribeFunasr(wav);
  if (!transcript.trim()) {
    return json(res, 400, { errno: 400, errmsg: "没听清说了什么，再试一次？" });
  }

  const parsed = await callLlmJson(SCRIBE_MODEL, SCRIBE_PROMPT + transcript);
  json(res, 200, {
    title: String(parsed.title || ""),
    markdown: String(parsed.markdown || ""),
    transcript,
  });
}

// ---------------------------------------------------------------- AI 合并（追加录音）

const MERGE_PROMPT = [
  "这是一篇日记的当前正文，以及一段新的口述整理稿（主人刚刚追加录的）。",
  "请把新内容自然并入日记：按叙述顺序追加或与前文融合，衔接处可以轻轻带过。",
  "",
  "【第一原则：真实】",
  "- 新旧两部分的内容都不许增删改动事实、感受、人名、数字；保持第一人称和口气；拿不准的原样保留。",
  "- 已有的 markdown 格式（含图片链接）原样保留，不得改动 URL。",
  "- 不要总结腔、不要画蛇添足地补开头结尾。",
  "",
  '严格只输出 JSON，格式：{"markdown":"合并后的完整日记"}',
  "",
  "【当前正文】",
].join("\n");

async function handleMerge(req, res, role) {
  if (role !== "owner") return json(res, 403, { errno: 403, errmsg: "只有主人能合并日记" });
  if (!OR_KEY) return json(res, 503, { errno: 503, errmsg: "AI 服务未配置" });
  const { current, addition } = await readJson(req, 1 << 20);
  if (!addition || !String(addition).trim()) return json(res, 400, { errno: 400, errmsg: "缺追加内容" });
  if (String(current || "").length + String(addition).length > 30000) {
    return json(res, 400, { errno: 400, errmsg: "太长了" });
  }

  const text = `${MERGE_PROMPT}${String(current || "").trim()}\n\n【新口述整理稿】\n${String(addition).trim()}`;
  const parsed = await callLlmJson(SCRIBE_MODEL, text);
  json(res, 200, { markdown: String(parsed.markdown || "") });
}

// ---------------------------------------------------------------- AI 排版（手打文字）

const POLISH_PROMPT = [
  "这是一篇私人日记的原始文字。请你为它做排版设计——用 markdown 的结构把内容的呼吸感和层次呈现出来。",
  "",
  "【第一原则：真实】",
  "- 只改排版，不改文字：不增删、不改写任何事实、感受、人名、数字；保持第一人称与原文口气；拿不准的原样保留。",
  "",
  "【排版设计指南】",
  "1. 段落：按意思分成短段，段间空行；一口气太长的段落拆开，让阅读有呼吸感；",
  "2. 金句：文中点题的、最有分量的一两句话，用 **加粗** 标出（全文最多两三处，宁缺毋滥）；",
  "3. 引用：引用的古语、对话、书中的句子，用 > 引用块呈现；",
  "4. 小标题：内容有明显的场景或时间切换时，可以用简短的小标题分节；没有就不加；",
  "5. 列表：只有内容天然是清单或步骤时才用；",
  "6. 不要总结腔，不要补开头结尾，不要 emoji 堆砌，不要列表腔；",
  "7. 原文已有的 markdown 语法（包括图片链接）原样保留，不得改动 URL。",
  "",
  '严格只输出 JSON，格式：{"markdown":"排版后的完整日记"}',
  "",
  "【原文】",
].join("\n");

async function handlePolish(req, res, role) {
  if (role !== "owner") return json(res, 403, { errno: 403, errmsg: "只有主人能用 AI 排版" });
  if (!OR_KEY) return json(res, 503, { errno: 503, errmsg: "AI 服务未配置" });
  const { content: raw } = await readJson(req, 1 << 20);
  if (!raw || !String(raw).trim()) return json(res, 400, { errno: 400, errmsg: "内容为空" });
  if (String(raw).length > 20000) return json(res, 400, { errno: 400, errmsg: "太长了，分两篇吧" });

  const parsed = await callLlmJson(SCRIBE_MODEL, POLISH_PROMPT + String(raw));
  json(res, 200, { markdown: String(parsed.markdown || "") });
}

// ---------------------------------------------------------------- AI 插图

const ILLUSTRATE_PROMPT = [
  "这是一篇语音日记的 markdown 正文，后面跟着主人今天拍的照片/截图。",
  "请你先理解每张图片的内容，再把它们插入到日记中最贴切的位置（markdown 图片语法，alt 写一句简短的图注）。",
  "要求：",
  "1. 不改动日记原有文字与结构，只做图片插入；",
  "2. 每张图只用一次；插入图片的 URL 必须逐字取自文末【图片清单】，清单顺序与附图一致，禁止编造或修改 URL；",
  "3. 实在与正文无关的图，放到文末并配一句图注；",
  '4. 严格只输出 JSON，格式：{"markdown":"插入图片后的完整日记"}',
  "",
  "【日记正文】",
].join("\n");

async function handleIllustrate(req, res, role) {
  if (role !== "owner") return json(res, 403, { errno: 403, errmsg: "只有主人能用 AI 插图" });
  if (!OR_KEY) return json(res, 503, { errno: 503, errmsg: "AI 服务未配置" });
  const { markdown, images } = await readJson(req, 1 << 20);
  const urls = (Array.isArray(images) ? images : [])
    .map((u) => String(u))
    .filter((u) => /^https:\/\//.test(u))
    .slice(0, 24);
  if (!markdown || !markdown.trim() || urls.length === 0) {
    return json(res, 400, { errno: 400, errmsg: "缺正文或图片" });
  }

  const urlList = urls.map((u, i) => `${i + 1}. ${u}`).join("\n");
  const content = [
    { type: "text", text: `${ILLUSTRATE_PROMPT}${markdown}\n\n【图片清单】（与附图顺序一致）\n${urlList}` },
  ];
  for (const u of urls) content.push({ type: "image_url", image_url: { url: u } });

  const parsed = await callLlmJson(ILLUSTRATE_MODEL, content);
  json(res, 200, { markdown: String(parsed.markdown || "") });
}

// ---------------------------------------------------------------- 朗读

function splitText(text, maxLen) {
  const sentences = text.split(/(?<=[。！？!?；;\n])/).filter(Boolean);
  const chunks = [];
  let cur = "";
  for (const s of sentences) {
    if (cur && cur.length + s.length > maxLen) {
      chunks.push(cur);
      cur = "";
    }
    if (s.length > maxLen) {
      for (let i = 0; i < s.length; i += maxLen) chunks.push(s.slice(i, i + maxLen));
    } else {
      cur += s;
    }
  }
  if (cur) chunks.push(cur);
  return chunks;
}

function concatWav(wavs) {
  if (wavs.length === 1) return wavs[0];
  // sherpa-onnx 输出标准 44 字节头的 PCM WAV，参数一致，可直接拼接
  const parts = wavs.map((w) => w.subarray(44));
  const dataSize = parts.reduce((n, p) => n + p.length, 0);
  const header = Buffer.from(wavs[0].subarray(0, 44));
  header.writeUInt32LE(36 + dataSize, 4);
  header.writeUInt32LE(dataSize, 40);
  return Buffer.concat([header, ...parts]);
}

async function handleTts(req, res, role) {
  if (!role) return json(res, 401, { errno: 401, errmsg: "unauthorized" });
  const { text } = await readJson(req, 64 << 10);
  const clean = String(text || "").trim();
  if (!clean || clean.length > 5000) return json(res, 400, { errno: 400, errmsg: "文本为空或过长" });

  // 同一段文本只合成一次：内容哈希做缓存键
  const cacheKey = crypto.createHash("sha256").update(clean, "utf8").digest("hex");
  const cachePath = path.join(DATA_DIR, "tts-cache", `${cacheKey}.wav`);
  if (fs.existsSync(cachePath)) {
    const cached = fs.readFileSync(cachePath);
    res.writeHead(200, {
      "content-type": "audio/wav",
      "content-length": cached.length,
      "x-tts-cache": "hit",
    });
    return res.end(cached);
  }

  const chunks = splitText(clean, 480);
  const wavs = [];
  for (const c of chunks) {
    const r = await fetch(`${TTS_BASE}/speech`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ text: c, speed: 1.0 }),
    });
    if (!r.ok) return json(res, 502, { errno: 502, errmsg: `TTS 合成失败 (${r.status})` });
    wavs.push(Buffer.from(await r.arrayBuffer()));
  }
  const merged = concatWav(wavs);
  fs.writeFileSync(cachePath, merged);
  res.writeHead(200, { "content-type": "audio/wav", "content-length": merged.length, "x-tts-cache": "miss" });
  res.end(merged);
}

// ---------------------------------------------------------------- 图片上传

let cosClient = null;
function getCos() {
  if (!cosClient) {
    const COS = require("cos-nodejs-sdk-v5");
    cosClient = new COS({ SecretId: env("COS_SECRET_ID"), SecretKey: env("COS_SECRET_KEY") });
  }
  return cosClient;
}

async function handleUpload(req, res, role) {
  if (role !== "owner") return json(res, 403, { errno: 403, errmsg: "只有主人能传图" });
  const ctype = String(req.headers["content-type"] || "").split(";")[0];
  const ext = IMAGE_EXT[ctype];
  if (!ext) return json(res, 400, { errno: 400, errmsg: "只支持 png/jpg/gif/webp" });
  if (!COS_BUCKET || !COS_REGION || !COS_PUBLIC) {
    return json(res, 503, { errno: 503, errmsg: "COS 未配置" });
  }
  const body = await readBody(req, 10 << 20);
  if (body.length === 0) return json(res, 400, { errno: 400, errmsg: "空文件" });

  const key = `vesper-diary/${crypto.randomUUID()}.${ext}`;
  const cos = getCos();
  await new Promise((resolve, reject) => {
    cos.putObject({ Bucket: COS_BUCKET, Region: COS_REGION, Key: key, Body: body }, (err) =>
      err ? reject(err) : resolve()
    );
  });
  json(res, 200, { url: `${COS_PUBLIC}/${key}` });
}

// ---------------------------------------------------------------- PPT/PDF 转图

const DECK_EXT = {
  "application/pdf": "pdf",
  "application/vnd.ms-powerpoint": "ppt",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation": "pptx",
};
// 页数上限：再多转起来又慢，插图排版也用不上
const MAX_DECK_SLIDES = 60;

/** 跑外部命令，带超时；成功返回 stdout */
function run(cmd, args, timeoutMs) {
  return new Promise((resolve, reject) => {
    const p = spawn(cmd, args, { stdio: ["ignore", "pipe", "pipe"] });
    const out = [];
    const err = [];
    const timer = setTimeout(() => {
      p.kill("SIGKILL");
      reject(new Error(`${cmd} 转换超时`));
    }, timeoutMs);
    p.stdout.on("data", (d) => out.push(d));
    p.stderr.on("data", (d) => err.push(d));
    p.on("error", (e) => {
      clearTimeout(timer);
      reject(e);
    });
    p.on("close", (code) => {
      clearTimeout(timer);
      if (code === 0) resolve(Buffer.concat(out));
      else reject(new Error(Buffer.concat(err).toString().slice(0, 300) || `${cmd} exit ${code}`));
    });
  });
}

function putCos(key, body) {
  return new Promise((resolve, reject) => {
    getCos().putObject({ Bucket: COS_BUCKET, Region: COS_REGION, Key: key, Body: body }, (err) =>
      err ? reject(err) : resolve()
    );
  });
}

async function handleUploadDeck(req, res, role) {
  if (role !== "owner") return json(res, 403, { errno: 403, errmsg: "只有主人能传 PPT" });
  const ctype = String(req.headers["content-type"] || "").split(";")[0];
  const ext = DECK_EXT[ctype];
  if (!ext) return json(res, 400, { errno: 400, errmsg: "只支持 ppt/pptx/pdf" });
  if (!COS_BUCKET || !COS_REGION || !COS_PUBLIC) {
    return json(res, 503, { errno: 503, errmsg: "COS 未配置" });
  }
  const body = await readBody(req, 60 << 20);
  if (body.length === 0) return json(res, 400, { errno: 400, errmsg: "空文件" });

  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "vesper-deck-"));
  try {
    const input = path.join(tmp, `deck.${ext}`);
    fs.writeFileSync(input, body);

    // PPT 先过一道 LibreOffice 转成 PDF（独立 profile，避免并发互锁）；PDF 直接用
    let pdf = input;
    if (ext !== "pdf") {
      await run("soffice", [
        "--headless", "--norestore",
        `-env:UserInstallation=file://${path.join(tmp, "lo-profile")}`,
        "--convert-to", "pdf", "--outdir", tmp, input,
      ], 180000);
      pdf = path.join(tmp, "deck.pdf");
      if (!fs.existsSync(pdf)) throw new Error("PPT 转换失败，文件可能损坏");
    }

    // 页数兜底，超出直接拒，不浪费转换时间
    const info = await run("pdfinfo", [pdf], 30000);
    const pages = Number(String(info).match(/Pages:\s*(\d+)/)?.[1] || 0);
    if (!pages) throw new Error("读不出页数，文件可能损坏");
    if (pages > MAX_DECK_SLIDES) {
      return json(res, 400, { errno: 400, errmsg: `这份有 ${pages} 页，超过 ${MAX_DECK_SLIDES} 页上限，拆一下再传` });
    }

    // 每页转一张 PNG（110 DPI 够看清字，体积又不至于离谱）
    await run("pdftoppm", ["-png", "-r", "110", pdf, path.join(tmp, "slide")], 180000);
    const slides = fs.readdirSync(tmp).filter((f) => /^slide-\d+\.png$/.test(f)).sort();
    if (slides.length === 0) throw new Error("一页都没转出来，文件可能损坏");

    const deckId = crypto.randomUUID();
    const urls = await Promise.all(
      slides.map(async (f, i) => {
        const key = `vesper-diary/deck-${deckId}-${String(i + 1).padStart(2, "0")}.png`;
        await putCos(key, fs.readFileSync(path.join(tmp, f)));
        return `${COS_PUBLIC}/${key}`;
      })
    );
    json(res, 200, { urls });
  } finally {
    fs.rmSync(tmp, { recursive: true, force: true });
  }
}

// ---------------------------------------------------------------- 路由

const server = http.createServer(async (req, res) => {
  try {
    const pathname = new URL(req.url, "http://x").pathname;

    if (pathname === "/api/health") return json(res, 200, { ok: true });

    const gateResult = handleGate(req, res, pathname);
    if (gateResult) return await gateResult;

    // 门禁之后：日记/语音/朗读/上传。forward_auth 已在边缘拦一道，这里再校验一层。
    const role = roleFromReq(req);

    const entryResult = handleEntries(req, res, pathname, role);
    if (entryResult) return await entryResult;

    if (pathname === "/api/scribe" && req.method === "POST") return await handleScribe(req, res, role);
    if (pathname === "/api/merge" && req.method === "POST") return await handleMerge(req, res, role);
    if (pathname === "/api/polish" && req.method === "POST") return await handlePolish(req, res, role);
    if (pathname === "/api/illustrate" && req.method === "POST") return await handleIllustrate(req, res, role);
    if (pathname === "/api/tts" && req.method === "POST") return await handleTts(req, res, role);
    if (pathname === "/api/upload" && req.method === "POST") return await handleUpload(req, res, role);
    if (pathname === "/api/upload-deck" && req.method === "POST") return await handleUploadDeck(req, res, role);

    json(res, 404, { errno: 404, errmsg: "not found" });
  } catch (e) {
    const status = e.status || 500;
    if (status >= 500) console.error(e);
    json(res, status, { errno: status, errmsg: e.message || "服务器开小差了" });
  }
});

// PPT 转换 + 多页上传耗时较长，默认 5 分钟不够
server.requestTimeout = 600000;

server.listen(PORT, () => {
  console.log(`vesper-server listening on :${PORT}`);
});
