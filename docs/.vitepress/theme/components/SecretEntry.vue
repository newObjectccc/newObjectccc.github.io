<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { marked } from "marked";
import Comment from "./Comment.vue";
import ReadAloud from "./ReadAloud.vue";
import { deleteEntry, formatTime, getCommentCount, getEntry, getMe, type Entry } from "../secret/api";
import { askAlert, askConfirm } from "../secret/confirm";

const entry = ref<Entry | null>(null);
const commentCount = ref<number | null>(null);
const role = ref("anon");
const state = ref<"loading" | "ready" | "error">("loading");
const error = ref("");

// location 仅浏览器可用，SSR 阶段不能碰
const id = typeof location !== "undefined" ? Number(new URLSearchParams(location.search).get("id")) : 0;

onMounted(async () => {
  if (!id) {
    error.value = "缺日记 id";
    state.value = "error";
    return;
  }
  try {
    const [me, e] = await Promise.all([getMe(), getEntry(id)]);
    role.value = me.role;
    entry.value = e;
    document.title = `${e.title} | 秘密空间`;
    state.value = "ready";
    // 评论数展示失败不影响正文
    getCommentCount(`/secret/entry?id=${id}`)
      .then((n) => (commentCount.value = n))
      .catch(() => {});
  } catch (err) {
    error.value = (err as Error).message;
    state.value = "error";
  }
});

// GFM + 单换行转 <br>：手打的日记按 Enter 换行就该换行；
// 主人敲下的额外空行也保留——每多一个换行，多一条可见的呼吸缝
const html = computed(() => {
  if (!entry.value) return "";
  const withGaps = entry.value.content.replace(/\n{3,}/g, (m) => "\n\n" + "<br>\n\n".repeat(m.length - 2));
  return marked.parse(withGaps, { breaks: true, gfm: true });
});

/** 朗读前把 markdown 符号剥掉，只留可读文本 */
const speakable = computed(() =>
  entry.value
    ? entry.value.content
        .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
        .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
        .replace(/[#>*`\-]/g, "")
        .replace(/\n{2,}/g, "。")
        .trim()
    : ""
);

const fmt = formatTime;

async function onDelete() {
  if (!entry.value) return;
  if (!(await askConfirm(`删掉《${entry.value.title}》？不可恢复。`, { okText: "删掉", danger: true }))) return;
  try {
    await deleteEntry(entry.value.id);
    location.href = "/secret/";
  } catch (e) {
    await askAlert((e as Error).message);
  }
}
</script>

<template>
  <div class="secret-app">
    <p class="entry-back"><a href="/secret/">← 回到列表</a></p>

    <p v-if="state === 'loading'" class="secret-tip">正在破土…</p>
    <p v-else-if="state === 'error'" class="secret-tip">{{ error }}</p>

    <template v-else-if="entry">
      <h1 class="entry-title">{{ entry.title }}</h1>
      <p class="entry-meta">
        <span>{{ fmt(entry.created_at) }}</span>
        <span v-if="commentCount !== null" class="comment-count">{{ commentCount }} 条评论</span>
        <ReadAloud :text="speakable" />
        <template v-if="role === 'owner'">
          <a class="entry-edit" :href="`/secret/write.html?id=${entry.id}`">编辑</a>
          <a class="entry-delete" href="#" @click.prevent="onDelete">删除</a>
        </template>
      </p>
      <article class="entry-body vp-doc" v-html="html" />
      <Comment :path="`/secret/entry?id=${entry.id}`" />
    </template>
  </div>
</template>

<style scoped>
.secret-app {
  max-width: 720px;
  margin: 0 auto;
  padding: 3rem 1.5rem;
}

.entry-back a {
  color: var(--vp-c-text-3, #7f917c);
  text-decoration: none;
  font-size: 0.9rem;
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

.comment-count {
  font-size: 0.78rem;
  opacity: 0.7;
}

.entry-edit {
  margin-left: auto;
  color: var(--vp-c-brand-2, #3ddc84);
  text-decoration: none;
}

.entry-delete {
  color: var(--vp-c-text-3, #7f917c);
  text-decoration: none;
}

.entry-delete:hover {
  color: #e26d6d;
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

.secret-tip {
  color: var(--vp-c-text-3, #7f917c);
}
</style>
