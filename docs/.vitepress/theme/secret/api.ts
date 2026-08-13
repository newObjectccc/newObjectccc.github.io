/**
 * 秘密空间 API 封装：401 一律带去 /gate/ 门前。
 */

export interface EntrySummary {
  id: number;
  title: string;
  excerpt: string;
  created_at: string;
  updated_at: string;
}

export interface Entry {
  id: number;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
}

const JSON_HEADERS = { "content-type": "application/json" };

/** ISO 时间 → 本地 YYYY-MM-DD HH:mm:ss */
export function formatTime(iso: string): string {
  const d = new Date(iso);
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`;
}

function toGate(): never {
  const next = encodeURIComponent(location.pathname + location.search);
  location.href = `/gate/?next=${next}`;
  throw new Error("unauthorized");
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const resp = await fetch(path, init);
  if (resp.status === 401) toGate();
  if (!resp.ok) {
    let msg = `请求失败 (${resp.status})`;
    try {
      const d = await resp.json();
      if (d.errmsg) msg = d.errmsg;
    } catch {
      /* 保持默认提示 */
    }
    throw new Error(msg);
  }
  return resp.json() as Promise<T>;
}

export const getMe = () => request<{ role: string }>("/api/gate/me");

export const logout = () =>
  request<{ ok: boolean }>("/api/gate/logout", { method: "POST" });

/** 注销后回门前，答完题回到当前页 */
export async function switchIdentity() {
  await logout();
  const next = encodeURIComponent(location.pathname + location.search);
  location.href = `/gate/?next=${next}`;
}

export const listEntries = () => request<EntrySummary[]>("/api/entries");

export const getEntry = (id: number) => request<Entry>(`/api/entries/${id}`);

export const createEntry = (title: string, content: string) =>
  request<{ id: number }>("/api/entries", {
    method: "POST",
    headers: JSON_HEADERS,
    body: JSON.stringify({ title, content }),
  });

export const updateEntry = (id: number, title: string, content: string) =>
  request<{ ok: boolean }>(`/api/entries/${id}`, {
    method: "PUT",
    headers: JSON_HEADERS,
    body: JSON.stringify({ title, content }),
  });

export const deleteEntry = (id: number) =>
  request<{ ok: boolean }>(`/api/entries/${id}`, { method: "DELETE" });

export const scribe = (audio: Blob) =>
  request<{ title: string; markdown: string; transcript: string }>("/api/scribe", {
    method: "POST",
    headers: { "content-type": audio.type || "application/octet-stream" },
    body: audio,
  });

export const illustrate = (markdown: string, images: string[]) =>
  request<{ markdown: string }>("/api/illustrate", {
    method: "POST",
    headers: JSON_HEADERS,
    body: JSON.stringify({ markdown, images }),
  });

export const polish = (content: string) =>
  request<{ markdown: string }>("/api/polish", {
    method: "POST",
    headers: JSON_HEADERS,
    body: JSON.stringify({ content }),
  });

export const merge = (current: string, addition: string) =>
  request<{ markdown: string }>("/api/merge", {
    method: "POST",
    headers: JSON_HEADERS,
    body: JSON.stringify({ current, addition }),
  });

/** Waline 评论计数（单条路径） */
export async function getCommentCount(path: string): Promise<number> {
  const d = await request<{ data: number | number[] }>(
    `/waline/api/comment?type=count&url=${encodeURIComponent(path)}`
  );
  const v = d.data;
  return Array.isArray(v) ? Number(v[0]) || 0 : Number(v) || 0;
}

/** Waline 评论计数（批量：官方契约为 GET + 逗号分隔的 url 参数） */
export async function getCommentCounts(paths: string[]): Promise<number[]> {
  if (!paths.length) return [];
  const d = await request<{ data: number[] }>(
    `/waline/api/comment?type=count&url=${encodeURIComponent(paths.join(","))}`
  );
  return Array.isArray(d.data) ? d.data.map((n) => Number(n) || 0) : paths.map(() => 0);
}

export const uploadImage = (file: File) =>
  request<{ url: string }>("/api/upload", {
    method: "POST",
    headers: { "content-type": file.type },
    body: file,
  });

const DECK_MIME: Record<string, string> = {
  ppt: "application/vnd.ms-powerpoint",
  pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  pdf: "application/pdf",
};

/** PPT/PDF → 服务端转成每页图片，返回图片 URL 列表（转换较慢，调用处要有等待提示） */
export const uploadDeck = (file: File) => {
  // 有的浏览器对 .ppt 给不出 MIME，以扩展名为准
  const ext = (file.name.split(".").pop() || "").toLowerCase();
  const type = DECK_MIME[ext] || file.type || "application/octet-stream";
  return request<{ urls: string[] }>("/api/upload-deck", {
    method: "POST",
    headers: { "content-type": type },
    body: file,
  });
};

export async function tts(text: string): Promise<Blob> {
  const resp = await fetch("/api/tts", {
    method: "POST",
    headers: JSON_HEADERS,
    body: JSON.stringify({ text }),
  });
  if (resp.status === 401) toGate();
  if (!resp.ok) {
    let msg = `朗读失败 (${resp.status})`;
    try {
      const d = await resp.json();
      if (d.errmsg) msg = d.errmsg;
    } catch {
      /* 保持默认提示 */
    }
    throw new Error(msg);
  }
  return resp.blob();
}
