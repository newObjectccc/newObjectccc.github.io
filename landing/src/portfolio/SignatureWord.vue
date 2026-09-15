<template>
  <svg
    ref="signature"
    class="signature-word"
    :data-running="visible && pageVisible && !paused"
    viewBox="0 0 310 100"
    aria-hidden="true"
    focusable="false"
  >
    <path
      v-for="(outline, index) in wordmarkGlyphs"
      :key="index"
      class="signature-glyph"
      :d="outline"
      pathLength="1"
      :style="{ '--letter-delay': `${index * 90}ms` }"
    />
  </svg>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref } from "vue";
import { wordmarkGlyphs } from "./wordmark-paths.js";

defineProps({ paused: Boolean });
const signature = ref(null);
const visible = ref(false);
const pageVisible = ref(true);
let observer;
const syncVisibility = () => {
  pageVisible.value = !document.hidden;
};
onMounted(() => {
  syncVisibility();
  observer = new IntersectionObserver(([entry]) => {
    visible.value = entry.isIntersecting;
  });
  observer.observe(signature.value);
  document.addEventListener("visibilitychange", syncVisibility);
});
onBeforeUnmount(() => {
  observer?.disconnect();
  document.removeEventListener("visibilitychange", syncVisibility);
});
</script>
