/**
 * 秘密空间背景音乐：单例 Audio + 跨组件共享状态。
 *
 * 背景与约定：
 * - /secret 下的页面跳转都是整页加载（见 Layout.vue 的路由拦截），
 *   播放进度存 sessionStorage，翻页后从断点续播，听感上接近连续；
 * - 浏览器可能拦截有声自动播放：tryPlayMusic 失败后进入 blocked 态，
 *   由 SecretMusic 组件在首次点击页面任意处时再试一次；
 * - 主人手动暂停后记入 localStorage（off），之后不再自动起播；
 * - 语音录入会串音：SecretWrite 录音开始时 suspendMusic() 自动暂停，录完 resumeMusic()。
 */

import { ref } from "vue";

// 音频文件只存本机与服务器镜像（docs/public/secret/ 已 gitignore），
// 经 Caddy /secret* 门禁保护，不公开可访问。
const SRC = "/secret/right-here-waiting.mp3";
const POS_KEY = "secret-music:pos";
const OFF_KEY = "secret-music:off";

export type MusicState = "idle" | "playing" | "blocked" | "off" | "error";

export const musicState = ref<MusicState>("idle");

let audio: HTMLAudioElement | null = null;
let suspendedByRecording = false;

function ensureAudio(): HTMLAudioElement | null {
  if (typeof window === "undefined") return null;
  if (audio) return audio;
  audio = new Audio(SRC);
  audio.loop = true;
  audio.volume = 0.7;

  // 从上次翻页前的位置续播
  const pos = Number(sessionStorage.getItem(POS_KEY));
  if (pos > 0) {
    const seek = () => {
      if (audio && Number.isFinite(audio.duration) && pos < audio.duration) audio.currentTime = pos;
    };
    if (audio.readyState >= 1) seek();
    else audio.addEventListener("loadedmetadata", seek, { once: true });
  }

  audio.addEventListener("timeupdate", () => {
    if (audio) sessionStorage.setItem(POS_KEY, String(Math.floor(audio.currentTime)));
  });
  audio.addEventListener("play", () => {
    musicState.value = "playing";
  });
  audio.addEventListener("pause", () => {
    // 手动暂停（toggle）已经把状态置为 off，不要覆盖
    if (musicState.value === "playing") musicState.value = "idle";
  });
  audio.addEventListener("error", () => {
    // 音频文件还没部署上来（或加载失败）：进入 error 态，按钮整体隐藏
    musicState.value = "error";
  });
  return audio;
}

/** 尝试起播；被浏览器拦截时进入 blocked 态，交给点击兜底 */
export async function tryPlayMusic(): Promise<void> {
  const a = ensureAudio();
  if (!a || musicState.value === "error") return;
  if (localStorage.getItem(OFF_KEY)) {
    musicState.value = "off";
    return;
  }
  try {
    await a.play();
  } catch {
    musicState.value = "blocked";
  }
}

/** 悬浮按钮：播放中 → 暂停并记住；否则 → 起播（处于真实点击手势内，不会被拦） */
export function toggleMusic(): void {
  const a = ensureAudio();
  if (!a) return;
  if (musicState.value === "playing") {
    localStorage.setItem(OFF_KEY, "1");
    musicState.value = "off";
    a.pause();
  } else {
    localStorage.removeItem(OFF_KEY);
    void tryPlayMusic();
  }
}

/** 语音录入开始：音乐在播则自动暂停（不改动主人的 off 选择） */
export function suspendMusic(): void {
  const a = ensureAudio();
  if (!a) return;
  if (musicState.value === "playing") {
    suspendedByRecording = true;
    a.pause();
  }
}

/** 语音录入结束：恢复因录音而暂停的播放 */
export function resumeMusic(): void {
  if (!suspendedByRecording) return;
  suspendedByRecording = false;
  if (localStorage.getItem(OFF_KEY)) return;
  void audio?.play().catch(() => {
    musicState.value = "blocked";
  });
}
