<script setup lang="ts">
import { onUnmounted, ref } from "vue";
import { tts } from "../secret/api";

const props = defineProps<{ text: string }>();

const state = ref<"idle" | "loading" | "playing">("idle");
const error = ref("");
let audio: HTMLAudioElement | null = null;

async function toggle() {
  if (state.value === "playing" && audio) {
    audio.pause();
    state.value = "idle";
    return;
  }
  if (!props.text) return;
  state.value = "loading";
  error.value = "";
  try {
    const blob = await tts(props.text);
    audio = new Audio(URL.createObjectURL(blob));
    audio.onended = () => {
      state.value = "idle";
    };
    await audio.play();
    state.value = "playing";
  } catch (e) {
    error.value = (e as Error).message;
    state.value = "idle";
  }
}

onUnmounted(() => {
  audio?.pause();
  audio = null;
});
</script>

<template>
  <button class="read-aloud" :disabled="state === 'loading'" @click="toggle">
    {{ state === "loading" ? "生长声音中…" : state === "playing" ? "⏸ 暂停" : "🔊 朗读" }}
  </button>
  <span v-if="error" class="read-aloud-error">{{ error }}</span>
</template>

<style scoped>
.read-aloud {
  background: none;
  border: 1px solid var(--vp-c-divider, rgba(92, 232, 160, 0.2));
  border-radius: 6px;
  color: var(--vp-c-brand-2, #3ddc84);
  font-size: 0.85rem;
  padding: 0.2rem 0.7rem;
  cursor: pointer;
  font-family: inherit;
}

.read-aloud:disabled {
  opacity: 0.6;
  cursor: wait;
}

.read-aloud-error {
  font-size: 0.8rem;
  color: #e8c56b;
}
</style>
