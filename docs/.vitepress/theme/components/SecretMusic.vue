<script setup lang="ts">
import { onMounted, onUnmounted } from "vue";
import { musicState, toggleMusic, tryPlayMusic } from "../secret/music";

let unblock: (() => void) | null = null;

onMounted(async () => {
  await tryPlayMusic();
  if (musicState.value === "blocked") {
    // 浏览器要求先有一次交互：第一次点击页面任意处时顺手起播
    unblock = () => {
      void tryPlayMusic();
      unblock = null;
    };
    document.addEventListener("pointerdown", unblock, { once: true });
  }
});

onUnmounted(() => {
  if (unblock) document.removeEventListener("pointerdown", unblock);
});
</script>

<template>
  <button
    v-if="musicState !== 'error'"
    class="music-btn"
    :class="musicState"
    :title="musicState === 'playing' ? '暂停背景音乐' : '播放背景音乐 · Right Here Waiting'"
    :aria-label="musicState === 'playing' ? '暂停背景音乐' : '播放背景音乐'"
    @click="toggleMusic"
  >
    <span v-if="musicState === 'playing'" class="bars" aria-hidden="true">
      <i></i><i></i><i></i>
    </span>
    <span v-else class="note" aria-hidden="true">♪</span>
  </button>
</template>

<style scoped>
.music-btn {
  position: fixed;
  right: 1.4rem;
  bottom: 1.4rem;
  z-index: 80;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: 1px solid rgba(92, 232, 160, 0.35);
  background: rgba(11, 15, 12, 0.72);
  backdrop-filter: blur(8px);
  color: var(--vp-c-brand-2, #3ddc84);
  font-size: 1.15rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: box-shadow 0.3s ease, border-color 0.3s ease;
}

.music-btn:hover {
  border-color: #3ddc84;
  box-shadow: 0 0 18px rgba(61, 220, 132, 0.35);
}

/* 被浏览器拦下、等一次点击：轻轻呼吸提示点一下 */
.music-btn.blocked {
  animation: invite 2s ease-in-out infinite;
}

@keyframes invite {
  50% { box-shadow: 0 0 22px rgba(92, 232, 160, 0.5); }
}

.music-btn.off .note,
.music-btn.idle .note {
  opacity: 0.55;
}

/* 播放中的跳动音柱 */
.bars {
  display: flex;
  align-items: flex-end;
  gap: 3px;
  height: 16px;
}

.bars i {
  width: 3px;
  border-radius: 2px;
  background: var(--vp-c-brand-2, #3ddc84);
  animation: dance 0.9s ease-in-out infinite;
}

.bars i:nth-child(1) { height: 60%; }
.bars i:nth-child(2) { height: 100%; animation-delay: 0.25s; }
.bars i:nth-child(3) { height: 40%; animation-delay: 0.5s; }

@keyframes dance {
  50% { transform: scaleY(0.35); }
}
</style>
