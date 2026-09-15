<script setup lang="ts">
import { onMounted, ref } from "vue";
import { renderEntryMarkdown } from "../secret/render";
import { formatTime } from "../secret/api";

// 公开单篇分享页：只渲染这一篇，没有列表入口、没有编辑评论，拿不到其他任何篇
const state = ref<"loading" | "ready" | "error">("loading");
const error = ref("");
const title = ref("");
const createdAt = ref("");
const html = ref("");

// location 仅浏览器可用，SSR 阶段不能碰
const token = typeof location !== "undefined" ? new URLSearchParams(location.search).get("t") || "" : "";

onMounted(async () => {
  if (!token) {
    error.value = "缺分享令牌";
    state.value = "error";
    return;
  }
  try {
    // 不走 secret/api 的 request()：公开页面 401/404 不该被重定向去登录门
    const resp = await fetch(`/api/share/${encodeURIComponent(token)}`);
    if (!resp.ok) {
      let msg = "链接不存在或已失效";
      try {
        const d = await resp.json();
        if (d.errmsg) msg = d.errmsg;
      } catch {
        /* 保持默认提示 */
      }
      throw new Error(msg);
    }
    const d = await resp.json();
    title.value = String(d.title || "");
    createdAt.value = String(d.created_at || "");
    html.value = renderEntryMarkdown(String(d.content || ""));
    document.title = `${title.value} | 秘密花园`;
    state.value = "ready";
  } catch (e) {
    error.value = (e as Error).message;
    state.value = "error";
  }
});
</script>

<template>
  <div class="secret-app">
    <p v-if="state === 'loading'" class="secret-tip">正在破土…</p>
    <p v-else-if="state === 'error'" class="secret-tip">{{ error }}</p>

    <template v-else>
      <h1 class="entry-title">{{ title }}</h1>
      <p class="entry-meta">
        <span>{{ formatTime(createdAt) }}</span>
      </p>
      <article class="entry-body vp-doc" v-html="html" />
      <p class="share-tail">这一篇，只给拿到链接的人看。</p>
    </template>
  </div>
</template>

<style scoped>
.secret-app {
  max-width: 720px;
  margin: 0 auto;
  padding: 3rem 1.5rem;
}

.entry-title {
  font-size: 1.9rem;
  text-shadow: 0 0 28px rgba(92, 232, 160, 0.28);
  margin: 1.2rem 0 0.4rem;
}

.entry-meta {
  display: flex;
  align-items: center;
  gap: 1rem;
  color: var(--vp-c-text-3, #7f917c);
  font-size: 0.9rem;
  font-variant-numeric: tabular-nums;
  border-bottom: 1px solid var(--vp-c-divider, rgba(92, 232, 160, 0.14));
  padding-bottom: 1rem;
  margin-bottom: 1.6rem;
}

.entry-body {
  line-height: 2;
}

.entry-body :deep(p) {
  margin: 1.15em 0;
}

.entry-body :deep(blockquote) {
  margin: 1.3em 0;
  padding: 0.6em 1.1em;
  background: rgba(61, 220, 132, 0.05);
  border-left: 3px solid var(--vp-c-brand-2, #3ddc84);
  color: var(--vp-c-text-2, #b6c7b1);
}

.entry-body :deep(.video-embed) {
  margin: 1.3em 0;
  aspect-ratio: 16 / 9;
  border-radius: 10px;
  overflow: hidden;
  background: #000;
  border: 1px solid rgba(92, 232, 160, 0.14);
}

.entry-body :deep(.video-embed iframe) {
  display: block;
  width: 100%;
  height: 100%;
  border: 0;
}

.share-tail {
  margin-top: 3rem;
  text-align: center;
  font-size: 0.82rem;
  color: var(--vp-c-text-3, #7f917c);
  opacity: 0.75;
}

.secret-tip {
  color: var(--vp-c-text-3, #7f917c);
}
</style>
