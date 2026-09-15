/**
 * 视频链接嵌入：正文里独占一行的 bilibili / YouTube 裸 URL，
 * 渲染时变成响应式内嵌播放器；夹在句子里面的链接不受影响，仍是普通链接。
 * bilibili App 分享出来的 b23.tv 短链由服务端展开（/api/video/resolve），
 * 见 resolveShortVideoLines；展开失败或不是视频时保留原样，仍是普通链接。
 */

export interface VideoEmbed {
  platform: "bilibili" | "youtube";
  embedUrl: string;
}

const BV_RE = /^\/video\/(BV[0-9A-Za-z]{10})/;
const YT_ID_RE = /^[A-Za-z0-9_-]{11}$/;

/** 一行文本恰好是一个视频页 URL 时，返回嵌入信息；否则返回 null */
export function parseVideoLine(line: string): VideoEmbed | null {
  const text = line.trim();
  if (!/^https?:\/\/\S+$/.test(text)) return null;
  let u: URL;
  try {
    u = new URL(text);
  } catch {
    return null;
  }
  const host = u.hostname.replace(/^www\./, "");

  if (host === "bilibili.com" || host === "m.bilibili.com") {
    const m = u.pathname.match(BV_RE);
    if (!m) return null;
    const p = u.searchParams.get("p") || "1";
    const page = /^\d+$/.test(p) ? p : "1";
    return {
      platform: "bilibili",
      embedUrl: `https://player.bilibili.com/player.html?bvid=${m[1]}&page=${page}&autoplay=0`,
    };
  }

  if (host === "youtu.be") {
    const id = u.pathname.slice(1);
    return YT_ID_RE.test(id) ? youtube(id) : null;
  }

  if (host === "youtube.com" || host === "m.youtube.com") {
    if (u.pathname === "/watch") {
      const id = u.searchParams.get("v") || "";
      return YT_ID_RE.test(id) ? youtube(id) : null;
    }
    const m = u.pathname.match(/^\/(?:shorts|live|embed)\/([A-Za-z0-9_-]{11})/);
    if (m) return youtube(m[1]);
  }

  return null;
}

function youtube(id: string): VideoEmbed {
  // youtube-nocookie：免 cookie 域，访客不被追踪也能播
  return { platform: "youtube", embedUrl: `https://www.youtube-nocookie.com/embed/${id}` };
}

/** 独占一行的 b23.tv 短链 */
const SHORT_LINK_RE = /^\s*https?:\/\/b23\.tv\/\S+\s*$/;
const SHORT_LINK_SCAN_RE = /^\s*https?:\/\/b23\.tv\/\S+\s*$/m;

function embedHtml(v: VideoEmbed): string {
  const attrs =
    v.platform === "bilibili"
      ? 'scrolling="no" frameborder="no" allowfullscreen'
      : 'allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen';
  const label = v.platform === "bilibili" ? "bilibili 视频" : "YouTube 视频";
  // 前后各补一个空行：即使上下行没有空段，也保证 marked 把它当作独立 HTML 块而不是行内 HTML
  return `\n<div class="video-embed"><iframe src="${v.embedUrl}" title="${label}" ${attrs} loading="lazy"></iframe></div>\n`;
}

/** 逐行处理，跳过 ``` 代码围栏内部 */
function mapLines(markdown: string, fn: (line: string) => string | null): string {
  let inFence = false;
  return markdown
    .split("\n")
    .map((line) => {
      if (/^\s*```/.test(line)) inFence = !inFence;
      if (inFence) return line;
      const replaced = fn(line);
      return replaced === null ? line : replaced;
    })
    .join("\n");
}

/** 把独占一行的视频 URL 替换成内嵌播放器 HTML 块（marked 会原样透传 HTML） */
export function embedVideoLines(markdown: string): string {
  return mapLines(markdown, (line) => {
    const v = parseVideoLine(line);
    return v ? embedHtml(v) : null;
  });
}

/**
 * 把独占一行的 b23.tv 短链展开成视频嵌入。
 * resolve 由调用方注入（走带门禁跳转的 API 封装）；展开不了或不是视频就保留原行。
 */
export async function resolveShortVideoLines(
  markdown: string,
  resolve: (url: string) => Promise<string | null>
): Promise<string> {
  if (!SHORT_LINK_SCAN_RE.test(markdown)) return markdown;
  const lines = markdown.split("\n");
  let inFence = false;
  for (let i = 0; i < lines.length; i++) {
    if (/^\s*```/.test(lines[i])) inFence = !inFence;
    if (inFence || !SHORT_LINK_RE.test(lines[i])) continue;
    try {
      const finalUrl = await resolve(lines[i].trim());
      const v = finalUrl ? parseVideoLine(finalUrl) : null;
      if (v) lines[i] = embedHtml(v);
    } catch {
      /* 保留原样，仍显示为普通链接 */
    }
  }
  return lines.join("\n");
}

/** 朗读前把视频链接行整行去掉（URL 念出来没有意义） */
export function stripVideoLines(markdown: string): string {
  return mapLines(markdown, (line) => (parseVideoLine(line) || SHORT_LINK_RE.test(line) ? "" : null));
}
