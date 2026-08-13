<script setup lang="ts">
import { onMounted, ref } from "vue";
import { formatTime, getCommentCounts, getMe, listEntries, switchIdentity, type EntrySummary } from "../secret/api";

const entries = ref<EntrySummary[]>([]);
const counts = ref<Record<number, number>>({});
const role = ref("anon");
const state = ref<"loading" | "ready" | "error">("loading");
const error = ref("");

onMounted(async () => {
  try {
    const [me, list] = await Promise.all([getMe(), listEntries()]);
    role.value = me.role;
    entries.value = list;
    state.value = "ready";
    // 评论条数（批量，一次请求；失败不影响列表）
    try {
      const c = await getCommentCounts(list.map((e) => `/secret/entry?id=${e.id}`));
      const map: Record<number, number> = {};
      list.forEach((e, i) => {
        map[e.id] = Number(c[i]) || 0;
      });
      counts.value = map;
    } catch {
      /* 计数失败静默 */
    }
  } catch (e) {
    error.value = (e as Error).message;
    state.value = "error";
  }
});

const fmt = formatTime;
</script>

<template>
  <div class="secret-app">
    <h1 class="secret-title">秘密空间</h1>
    <blockquote class="secret-intro">
      向下扎根，向上生长，也向光之外的地方生长。<br />
      这里记录一些当下的、未完成的、野蛮生长的念头。
    </blockquote>

    <p v-if="state === 'loading'" class="secret-tip">正在破土…</p>
    <p v-else-if="state === 'error'" class="secret-tip">{{ error }}</p>

    <template v-else>
      <p v-if="role === 'owner'" class="secret-actions">
        <a class="secret-btn" href="/secret/write.html">✍️ 写日记</a>
      </p>

      <p v-if="entries.length === 0" class="secret-tip">土壤刚翻过，还没有日记。</p>
      <ul class="entry-list">
        <li v-for="e in entries" :key="e.id">
          <a :href="`/secret/entry.html?id=${e.id}`" class="entry-link">
            <span class="entry-date">{{ fmt(e.created_at) }}</span>
            <span class="entry-title">{{ e.title }}</span>
            <span class="entry-excerpt">
              {{ e.excerpt }}
              <span v-if="counts[e.id]" class="entry-comments">💬 {{ counts[e.id] }}</span>
            </span>
          </a>
        </li>
      </ul>

      <p class="who">
        当前身份：{{ role === "owner" ? "主人" : "朋友" }} ·
        <a href="#" @click.prevent="switchIdentity">换身份</a>
      </p>
    </template>
  </div>
</template>

<style scoped>
.secret-app {
  max-width: 720px;
  margin: 0 auto;
  padding: 3rem 1.5rem;
}

.secret-title {
  font-size: 2rem;
  text-shadow: 0 0 28px rgba(92, 232, 160, 0.28);
  margin-bottom: 1rem;
}

.secret-intro {
  border-left: 3px solid var(--vp-c-brand-2, #3ddc84);
  background: rgba(61, 220, 132, 0.05);
  padding: 0.8rem 1.2rem;
  color: var(--vp-c-text-2, #b6c7b1);
  line-height: 1.9;
  margin-bottom: 2rem;
}

.secret-actions {
  margin-bottom: 1.5rem;
}

.secret-btn {
  display: inline-block;
  padding: 0.5rem 1.4rem;
  border-radius: 8px;
  background: linear-gradient(135deg, #5ce8a0, #2bb86c);
  color: #0b0f0c;
  font-weight: 600;
  text-decoration: none;
}

.secret-tip {
  color: var(--vp-c-text-3, #7f917c);
}

.who {
  margin-top: 2.5rem;
  font-size: 0.8rem;
  color: var(--vp-c-text-3, #7f917c);
}

.who a {
  color: var(--vp-c-brand-2, #3ddc84);
  text-decoration: none;
}

.entry-list {
  list-style: none;
  padding: 0;
}

.entry-link {
  display: grid;
  grid-template-columns: 10.5rem 1fr;
  gap: 0.2rem 1rem;
  padding: 1rem 0.8rem;
  border-bottom: 1px solid var(--vp-c-divider, rgba(92, 232, 160, 0.14));
  text-decoration: none;
  color: var(--vp-c-text-1, #eaf2e6);
  border-radius: 6px;
  transition: background 0.2s;
}

.entry-link:hover {
  background: rgba(61, 220, 132, 0.06);
}

.entry-date {
  color: var(--vp-c-text-3, #7f917c);
  font-variant-numeric: tabular-nums;
}

.entry-title {
  font-weight: 600;
}

.entry-excerpt {
  grid-column: 2;
  font-size: 0.85rem;
  color: var(--vp-c-text-3, #7f917c);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.entry-comments {
  margin-left: 0.6rem;
  font-size: 0.78rem;
  opacity: 0.85;
  white-space: nowrap;
}
</style>
