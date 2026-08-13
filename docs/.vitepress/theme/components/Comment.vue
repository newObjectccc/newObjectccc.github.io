<script setup lang="ts">
import { init, type WalineInstance } from "@waline/client";
import "@waline/client/style";
import { useRoute } from "vitepress";
import { onMounted, onUnmounted, ref, watch } from "vue";

const props = defineProps<{ path?: string }>();

const route = useRoute();
const el = ref<HTMLElement>();
let waline: WalineInstance | undefined;

function mount() {
  destroy();
  if (!el.value) return;
  waline = init({
    el: el.value,
    serverURL: "https://vesper.qyqmedu.com/waline",
    path: props.path || route.path,
    lang: "zh-CN",
    dark: true,
    meta: ["nick", "mail"],
    requiredMeta: ["nick"],
    pageview: false,
  });
}

function destroy() {
  waline?.destroy();
  waline = undefined;
}

onMounted(mount);
watch(() => route.path, mount);
onUnmounted(destroy);
</script>

<template>
  <div class="secret-comment">
    <p class="secret-comment-tip">知道密码的人，欢迎留几句话。</p>
    <div ref="el" />
  </div>
</template>

<style scoped>
.secret-comment {
  margin-top: 3rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--vp-c-divider);
}

.secret-comment-tip {
  font-size: 0.85rem;
  color: var(--vp-c-text-3);
  margin-bottom: 1rem;
}
</style>
