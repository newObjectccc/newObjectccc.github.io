<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from "vue";
import { createEntry, getEntry, getMe, illustrate, polish, scribe, switchIdentity, updateEntry, uploadDeck, uploadImage } from "../secret/api";
import { askConfirm } from "../secret/confirm";

interface Photo {
  name: string;
  url: string;
  status: "uploading" | "converting" | "done" | "error";
}

// location 仅浏览器可用，SSR 阶段不能碰
const editId = typeof location !== "undefined" ? Number(new URLSearchParams(location.search).get("id")) || 0 : 0;

const role = ref("anon");
const title = ref("");
const content = ref("");
const photos = ref<Photo[]>([]);
const lastTranscript = ref("");
const pendingDraft = ref<{ title: string; markdown: string; transcript: string } | null>(null);
const state = ref<"loading" | "ready" | "denied">("loading");
const recording = ref(false);
const scribing = ref(false);
const illustrating = ref(false);
const publishing = ref(false);
const message = ref("");
const fileInput = ref<HTMLInputElement>();
const deckInput = ref<HTMLInputElement>();

let recorder: MediaRecorder | null = null;
let chunks: Blob[] = [];

// 录音反馈：实时波形 + 计时 + 防熄屏
const meterCanvas = ref<HTMLCanvasElement>();
const elapsed = ref(0);
let elapsedTimer = 0;
let audioCtx: AudioContext | null = null;
let meterRaf = 0;
let wakeLock: { release: () => Promise<void> } | null = null;

const elapsedText = computed(() => {
  const m = String(Math.floor(elapsed.value / 60)).padStart(2, "0");
  const s = String(elapsed.value % 60).padStart(2, "0");
  return `${m}:${s}`;
});

function startMeter(stream: MediaStream) {
  audioCtx = new AudioContext();
  const source = audioCtx.createMediaStreamSource(stream);
  const analyser = audioCtx.createAnalyser();
  analyser.fftSize = 256;
  source.connect(analyser);
  const data = new Uint8Array(analyser.frequencyBinCount);
  const draw = () => {
    if (!recording.value) return;
    const canvas = meterCanvas.value;
    if (!canvas) {
      // canvas 随 v-if 渲染有延迟，下一帧再试
      meterRaf = requestAnimationFrame(draw);
      return;
    }
    const ctx2d = canvas.getContext("2d");
    if (!ctx2d) return;
    if (canvas.width !== canvas.clientWidth * 2) {
      canvas.width = canvas.clientWidth * 2;
      canvas.height = canvas.clientHeight * 2;
    }
    analyser.getByteTimeDomainData(data);
    const { width, height } = canvas;
    ctx2d.clearRect(0, 0, width, height);
    ctx2d.lineWidth = 3;
    ctx2d.strokeStyle = "#5ce8a0";
    ctx2d.shadowBlur = 12;
    ctx2d.shadowColor = "rgba(92, 232, 160, 0.7)";
    ctx2d.beginPath();
    const step = width / data.length;
    for (let i = 0; i < data.length; i++) {
      const y = (data[i] / 255) * height * 0.9 + height * 0.05;
      if (i === 0) ctx2d.moveTo(0, y);
      else ctx2d.lineTo(i * step, y);
    }
    ctx2d.stroke();
    meterRaf = requestAnimationFrame(draw);
  };
  draw();
}

async function lockScreen() {
  try {
    // @ts-expect-error Wake Lock API（移动端防止录音中熄屏）
    wakeLock = (await navigator.wakeLock?.request("screen")) || null;
  } catch {
    wakeLock = null;
  }
}

function relockOnVisible() {
  if (!document.hidden && recording.value) lockScreen();
  if (!recording.value) document.removeEventListener("visibilitychange", relockOnVisible);
}

function stopRecordingFeedback() {
  cancelAnimationFrame(meterRaf);
  audioCtx?.close().catch(() => {});
  audioCtx = null;
  clearInterval(elapsedTimer);
  elapsed.value = 0;
  wakeLock?.release().catch(() => {});
  wakeLock = null;
  document.removeEventListener("visibilitychange", relockOnVisible);
}

onMounted(async () => {
  const me = await getMe();
  role.value = me.role;
  if (me.role !== "owner") {
    state.value = "denied";
    return;
  }
  if (editId) {
    try {
      const e = await getEntry(editId);
      title.value = e.title;
      content.value = e.content;
    } catch {
      message.value = "日记加载失败";
    }
  }
  state.value = "ready";
});

function say(text: string) {
  message.value = text;
  setTimeout(() => {
    if (message.value === text) message.value = "";
  }, 4000);
}

async function toggleRecord() {
  if (recording.value) {
    recorder?.stop();
    return;
  }
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mime = ["audio/webm;codecs=opus", "audio/webm", "audio/mp4"].find((m) =>
      MediaRecorder.isTypeSupported(m)
    );
    recorder = new MediaRecorder(stream, mime ? { mimeType: mime } : undefined);
    chunks = [];
    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunks.push(e.data);
    };
    recorder.onstop = async () => {
      stream.getTracks().forEach((t) => t.stop());
      recording.value = false;
      stopRecordingFeedback();
      const blob = new Blob(chunks, { type: recorder?.mimeType || "audio/webm" });
      await runScribe(blob);
    };
    recorder.start();
    recording.value = true;
    elapsed.value = 0;
    elapsedTimer = window.setInterval(() => elapsed.value++, 1000);
    startMeter(stream);
    lockScreen();
    // 切后台会丢 wake lock，回来时若还在录则重新拿
    document.addEventListener("visibilitychange", relockOnVisible);
  } catch {
    say("拿不到麦克风，检查一下浏览器权限。");
  }
}

async function runScribe(blob: Blob) {
  scribing.value = true;
  say("AI 正在聆听与整理…");
  try {
    const draft = await scribe(blob);
    if (!content.value.trim()) {
      // 正文为空：直接填入
      if (draft.title) title.value = draft.title;
      if (draft.markdown) content.value = draft.markdown;
      lastTranscript.value = draft.transcript || "";
      say("整理好了，可以再改改；不放心可以点开「对照原稿」核一核。");
    } else {
      // 已有正文：挂起草稿，由主人选择追加合并 / 覆盖 / 丢弃
      pendingDraft.value = draft;
      say("这段录音整理好了，选择怎么处理：");
    }
  } catch (e) {
    say((e as Error).message);
  } finally {
    scribing.value = false;
  }
}

// 追加放置规则（确定性，不过 LLM）：光标在输入框内 → 插到光标处；否则追加到末尾
const bodyInput = ref<HTMLTextAreaElement>();
let cursorPos = -1;

function trackCursor() {
  cursorPos = bodyInput.value?.selectionStart ?? -1;
}

function padAround(before: string, after: string) {
  const sepBefore = !before.trim()
    ? ""
    : before.endsWith("\n\n") ? "" : before.endsWith("\n") ? "\n" : "\n\n";
  const sepAfter = !after.trim()
    ? ""
    : after.startsWith("\n\n") ? "" : after.startsWith("\n") ? "\n" : "\n\n";
  return [sepBefore, sepAfter];
}

function applyMerge() {
  if (!pendingDraft.value) return;
  const draftText = pendingDraft.value.markdown;
  if (!draftText) return;
  const cur = content.value;
  const insertAt = cursorPos >= 0 && cursorPos <= cur.length ? cursorPos : cur.length;
  const before = cur.slice(0, insertAt);
  const after = cur.slice(insertAt);
  const [sepBefore, sepAfter] = padAround(before, after);
  content.value = before + sepBefore + draftText + sepAfter + after;
  cursorPos = (before + sepBefore + draftText).length;
  lastTranscript.value = [lastTranscript.value, pendingDraft.value.transcript]
    .filter(Boolean)
    .join("\n\n—— 追加的一段 ——\n\n");
  pendingDraft.value = null;
  say(insertAt < cur.length ? "已插入到光标位置。" : "已追加到末尾。");
}

async function applyOverwrite() {
  if (!pendingDraft.value) return;
  if (!(await askConfirm("用这段录音的内容覆盖当前正文？", { okText: "覆盖", danger: true }))) return;
  if (pendingDraft.value.title) title.value = pendingDraft.value.title;
  content.value = pendingDraft.value.markdown;
  lastTranscript.value = pendingDraft.value.transcript || "";
  pendingDraft.value = null;
  say("已覆盖。");
}

function discardDraft() {
  pendingDraft.value = null;
  say("已丢弃这段录音。");
}

async function onPickImages(e: Event) {
  const files = Array.from((e.target as HTMLInputElement).files || []);
  (e.target as HTMLInputElement).value = "";
  for (const file of files) {
    const photo: Photo = { name: file.name, url: "", status: "uploading" };
    photos.value.push(photo);
    try {
      const { url } = await uploadImage(file);
      photo.url = url;
      photo.status = "done";
    } catch {
      photo.status = "error";
    }
  }
}

function removePhoto(idx: number) {
  photos.value.splice(idx, 1);
}

// PPT/PDF：服务端转成每页图（较慢），转好后整份幻灯片进图槽，走同一个 AI 插图流程
async function onPickDeck(e: Event) {
  const files = Array.from((e.target as HTMLInputElement).files || []);
  (e.target as HTMLInputElement).value = "";
  for (const file of files) {
    const chip: Photo = { name: file.name, url: "", status: "converting" };
    photos.value.push(chip);
    say(`${file.name} 转换中，页数多的话要一两分钟…`);
    try {
      const { urls } = await uploadDeck(file);
      const slides: Photo[] = urls.map((url, i) => ({
        name: `${file.name} · 第${i + 1}页`,
        url,
        status: "done",
      }));
      const idx = photos.value.indexOf(chip);
      if (idx >= 0) photos.value.splice(idx, 1, ...slides);
      else photos.value.push(...slides);
      say(`${file.name} 转好了，共 ${urls.length} 页，可以「让 AI 把图插进日记」。`);
    } catch (err) {
      chip.status = "error";
      say((err as Error).message);
    }
  }
}

async function runIllustrate() {
  const urls = photos.value.filter((p) => p.status === "done").map((p) => p.url);
  if (!content.value.trim()) {
    say("先有点正文（比如先语音说一段）。");
    return;
  }
  if (urls.length === 0) {
    say("先传几张照片或截图。");
    return;
  }
  illustrating.value = true;
  say("AI 正在看图、找位置…");
  try {
    const { markdown } = await illustrate(content.value, urls);
    if (markdown) {
      content.value = markdown;
      photos.value = [];
      say("图已经插进日记了，看看位置合不合心意。");
    }
  } catch (e) {
    say((e as Error).message);
  } finally {
    illustrating.value = false;
  }
}

async function runPolish() {
  if (!content.value.trim()) {
    say("先写点什么再排版。");
    return;
  }
  if (!(await askConfirm("让 AI 重新排版当前正文？只顺格式，不改内容。"))) return;
  illustrating.value = true;
  say("AI 排版中…");
  try {
    const { markdown } = await polish(content.value);
    if (markdown) content.value = markdown;
    say("排版好了，检查一遍再发布。");
  } catch (e) {
    say((e as Error).message);
  } finally {
    illustrating.value = false;
  }
}

async function publish() {
  if (!title.value.trim() || !content.value.trim()) {
    say("标题和正文都要有点什么。");
    return;
  }
  publishing.value = true;
  try {
    // AI 排版只在首次发布时自动做；编辑保存不动格式（避免二次创作）
    let finalContent = content.value;
    if (!editId && !finalContent.includes("![")) {
      say("AI 排版中…");
      try {
        const { markdown } = await polish(finalContent);
        if (markdown) finalContent = markdown;
      } catch (e) {
        if (!(await askConfirm(`AI 排版失败（${(e as Error).message}），按原文发布？`, { okText: "按原文发布" }))) {
          publishing.value = false;
          say("");
          return;
        }
      }
    }
    say("种下中…");
    if (editId) {
      await updateEntry(editId, title.value.trim(), finalContent);
      location.href = `/secret/entry.html?id=${editId}`;
    } else {
      const { id } = await createEntry(title.value.trim(), finalContent);
      location.href = `/secret/entry.html?id=${id}`;
    }
  } catch (e) {
    say((e as Error).message);
    publishing.value = false;
  }
}

onUnmounted(() => {
  if (recorder && recording.value) recorder.stop();
  stopRecordingFeedback();
});
</script>

<template>
  <div class="secret-app">
    <p class="write-back"><a href="/secret/">← 回到列表</a></p>

    <p v-if="state === 'loading'" class="tip">正在破土…</p>
    <div v-else-if="state === 'denied'" class="tip">
      <p>这里是主人的书桌，朋友请去 <a href="/secret/">读日记</a>。</p>
      <p><a href="#" class="switch-link" @click.prevent="switchIdentity">我是主人，换身份进门 →</a></p>
    </div>

    <template v-else>
      <h1 class="write-title">{{ editId ? "修改日记" : "写日记" }}</h1>

      <input v-model="title" class="title-input" placeholder="给今天起个名字" maxlength="200" />

      <div class="toolbar">
        <button class="tool-btn record" :class="{ on: recording }" :disabled="scribing || !!pendingDraft" @click="toggleRecord">
          {{ recording ? "⏹ 说完啦" : "🎙 语音说今天" }}
        </button>
        <button class="tool-btn" @click="fileInput?.click()">🌄 相册 / 截图</button>
        <input
          ref="fileInput"
          type="file"
          accept="image/png,image/jpeg,image/gif,image/webp"
          multiple
          hidden
          @change="onPickImages"
        />
        <button class="tool-btn" title="PPT/PDF 会在服务端转成每页图片，页数多时要等一两分钟" @click="deckInput?.click()">
          📑 PPT / PDF
        </button>
        <input
          ref="deckInput"
          type="file"
          accept=".ppt,.pptx,.pdf"
          hidden
          @change="onPickDeck"
        />
        <button
          v-if="photos.length > 0"
          class="tool-btn illustrate"
          :disabled="illustrating"
          @click="runIllustrate"
        >
          {{ illustrating ? "AI 看图中…" : "✨ 让 AI 把图插进日记" }}
        </button>
        <button class="tool-btn" :disabled="illustrating" @click="runPolish">✨ AI 排版</button>
        <span v-if="scribing" class="tip">AI 整理中，稍等…</span>
      </div>

      <div v-if="recording" class="record-panel">
        <span class="rec-dot"></span>
        <span class="rec-time">{{ elapsedText }}</span>
        <canvas ref="meterCanvas" class="meter"></canvas>
        <span class="rec-hint">正在聆听，波形在动就是在采到你的声音</span>
      </div>

      <div v-if="pendingDraft" class="draft-bar">
        <p class="draft-tip">这段录音整理好了：</p>
        <p class="draft-preview">{{ pendingDraft.markdown.slice(0, 120) }}{{ pendingDraft.markdown.length > 120 ? "…" : "" }}</p>
        <div class="draft-actions">
          <button class="tool-btn illustrate" @click="applyMerge">➕ 追加到正文（光标处或末尾）</button>
          <button class="tool-btn" @click="applyOverwrite">覆盖正文</button>
          <button class="tool-btn" @click="discardDraft">丢弃</button>
        </div>
      </div>

      <div v-if="photos.length > 0" class="photo-row">
        <span v-for="(p, i) in photos" :key="i" class="photo-chip" :class="p.status">
          <template v-if="p.status === 'done'">
            <img :src="p.url" :alt="p.name" class="photo-thumb" />
          </template>
          <span class="photo-name">{{ p.status === "uploading" ? "上传中…" : p.status === "converting" ? "转换中…" : p.status === "error" ? "失败" : p.name }}</span>
          <button class="photo-remove" title="移除" @click="removePhoto(i)">×</button>
        </span>
      </div>

      <textarea
        ref="bodyInput"
        v-model="content"
        class="body-input"
        placeholder="随手说、随手写都行——发布前 AI 会帮你把格式理顺，内容一个字不动……"
        rows="16"
        @click="trackCursor"
        @keyup="trackCursor"
        @input="trackCursor"
        @focus="trackCursor"
      />

      <details v-if="lastTranscript" class="transcript-panel">
        <summary>对照原稿（ASR 原始转写）</summary>
        <p class="transcript-text">{{ lastTranscript }}</p>
      </details>

      <div class="publish-row">
        <button class="publish-btn" :disabled="publishing || scribing || illustrating" @click="publish">
          {{ publishing ? "种下中…" : editId ? "保存修改" : "🌱 种下这篇" }}
        </button>
      </div>

      <p class="message">{{ message }}</p>
    </template>
  </div>
</template>

<style scoped>
.secret-app {
  max-width: 720px;
  margin: 0 auto;
  padding: 3rem 1.5rem;
}

.write-back a {
  color: var(--vp-c-text-3, #7f917c);
  text-decoration: none;
  font-size: 0.9rem;
}

.write-title {
  font-size: 1.9rem;
  text-shadow: 0 0 28px rgba(92, 232, 160, 0.28);
  margin: 1.2rem 0 1.4rem;
}

.title-input {
  width: 100%;
  font-size: 1.15rem;
  font-family: inherit;
  color: var(--vp-c-text-1, #eaf2e6);
  background: rgba(11, 15, 12, 0.6);
  border: 1px solid rgba(92, 232, 160, 0.2);
  border-radius: 10px;
  padding: 0.8rem 1rem;
  outline: none;
  margin-bottom: 1rem;
}

.title-input:focus {
  border-color: #3ddc84;
  box-shadow: 0 0 24px rgba(61, 220, 132, 0.15);
}

.toolbar {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  flex-wrap: wrap;
  margin-bottom: 1rem;
}

.tool-btn {
  border: 1px solid rgba(92, 232, 160, 0.25);
  background: rgba(61, 220, 132, 0.08);
  color: var(--vp-c-brand-2, #3ddc84);
  border-radius: 8px;
  padding: 0.45rem 1rem;
  font-size: 0.92rem;
  font-family: inherit;
  cursor: pointer;
}

.tool-btn.record.on {
  background: rgba(232, 197, 107, 0.15);
  border-color: rgba(232, 197, 107, 0.5);
  color: #e8c56b;
  animation: pulse 1.6s ease-in-out infinite;
}

.tool-btn.illustrate {
  border-color: rgba(232, 197, 107, 0.4);
  color: #e8c56b;
  background: rgba(232, 197, 107, 0.08);
}

.tool-btn:disabled {
  opacity: 0.6;
  cursor: wait;
}

@keyframes pulse {
  50% { box-shadow: 0 0 18px rgba(232, 197, 107, 0.35); }
}

.photo-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
  margin-bottom: 1rem;
}

.record-panel {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  border: 1px solid rgba(232, 197, 107, 0.35);
  background: rgba(232, 197, 107, 0.06);
  border-radius: 10px;
  padding: 0.6rem 0.9rem;
  margin-bottom: 1rem;
}

.rec-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #e26d6d;
  animation: recpulse 1.2s ease-in-out infinite;
  flex-shrink: 0;
}

@keyframes recpulse {
  50% { opacity: 0.35; }
}

.rec-time {
  font-variant-numeric: tabular-nums;
  color: #e8c56b;
  font-size: 0.95rem;
  flex-shrink: 0;
}

.meter {
  flex: 1;
  height: 44px;
  min-width: 0;
}

.rec-hint {
  font-size: 0.75rem;
  color: var(--vp-c-text-3, #7f917c);
  flex-shrink: 0;
}

@media (max-width: 640px) {
  .rec-hint { display: none; }
}

.draft-bar {
  border: 1px solid rgba(232, 197, 107, 0.35);
  background: rgba(232, 197, 107, 0.06);
  border-radius: 10px;
  padding: 0.8rem 1rem;
  margin-bottom: 1rem;
}

.draft-tip {
  font-size: 0.85rem;
  color: #e8c56b;
  margin-bottom: 0.4rem;
}

.draft-preview {
  font-size: 0.85rem;
  color: var(--vp-c-text-2, #b6c7b1);
  line-height: 1.7;
  margin-bottom: 0.7rem;
}

.draft-actions {
  display: flex;
  gap: 0.6rem;
  flex-wrap: wrap;
}

.photo-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  border: 1px solid rgba(92, 232, 160, 0.2);
  border-radius: 8px;
  padding: 0.3rem 0.5rem;
  background: rgba(22, 31, 24, 0.6);
  font-size: 0.8rem;
  color: var(--vp-c-text-2, #b6c7b1);
}

.photo-chip.error {
  border-color: rgba(232, 107, 107, 0.5);
}

.photo-thumb {
  width: 28px;
  height: 28px;
  object-fit: cover;
  border-radius: 4px;
}

.photo-name {
  max-width: 10rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.photo-remove {
  background: none;
  border: none;
  color: var(--vp-c-text-3, #7f917c);
  cursor: pointer;
  font-size: 1rem;
  padding: 0 0.1rem;
}

.photo-remove:hover {
  color: #e8c56b;
}

.body-input {
  width: 100%;
  font-family: inherit;
  font-size: 1rem;
  line-height: 1.9;
  color: var(--vp-c-text-1, #eaf2e6);
  background: rgba(11, 15, 12, 0.6);
  border: 1px solid rgba(92, 232, 160, 0.2);
  border-radius: 10px;
  padding: 1rem;
  outline: none;
  resize: vertical;
}

.body-input:focus {
  border-color: #3ddc84;
  box-shadow: 0 0 24px rgba(61, 220, 132, 0.15);
}

.publish-row {
  margin-top: 1.2rem;
  text-align: right;
}

.transcript-panel {
  margin-top: 0.8rem;
  border: 1px dashed rgba(92, 232, 160, 0.2);
  border-radius: 8px;
  padding: 0.6rem 1rem;
}

.transcript-panel summary {
  cursor: pointer;
  color: var(--vp-c-text-3, #7f917c);
  font-size: 0.85rem;
}

.transcript-text {
  margin-top: 0.6rem;
  font-size: 0.85rem;
  line-height: 1.8;
  color: var(--vp-c-text-3, #7f917c);
  white-space: pre-wrap;
}

.publish-btn {
  padding: 0.7rem 2rem;
  font-size: 1rem;
  font-family: inherit;
  font-weight: 600;
  color: #0b0f0c;
  background: linear-gradient(135deg, #5ce8a0, #2bb86c);
  border: none;
  border-radius: 10px;
  cursor: pointer;
}

.publish-btn:disabled {
  filter: grayscale(0.5) brightness(0.7);
  cursor: wait;
}

.tip {
  color: var(--vp-c-text-3, #7f917c);
}

.tip a {
  color: var(--vp-c-brand-2, #3ddc84);
}

.switch-link {
  display: inline-block;
  margin-top: 0.6rem;
}

.message {
  margin-top: 1rem;
  min-height: 1.4rem;
  color: #e8c56b;
  font-size: 0.9rem;
}
</style>
