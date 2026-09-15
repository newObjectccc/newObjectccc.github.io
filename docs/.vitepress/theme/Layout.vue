<script setup lang="ts">
import DefaultTheme from "vitepress/theme";
import { inBrowser, useData, useRoute, useRouter } from "vitepress";
import { computed, onUnmounted, watch } from "vue";
import Comment from "./components/Comment.vue";
import ConfirmDialog from "./components/ConfirmDialog.vue";
import GrowthCanvas from "./components/GrowthCanvas.vue";
import SecretMusic from "./components/SecretMusic.vue";

const { frontmatter } = useData();
const route = useRoute();
const router = useRouter();

// 秘密空间在密码门后：客户端路由只拉页面 chunk，被 302 带去登录页后会渲染成 404。
// 凡是跳往 /secret 的路由变化，一律改为整页跳转，让门禁流程正常走完。
router.onBeforeRouteChange = (to) => {
  if (inBrowser && to.startsWith("/secret")) {
    location.href = to;
    return false;
  }
};

const isSecret = computed(() => route.path.startsWith("/secret"));
// 公开分享页共用秘密花园的皮肤与藤蔓画布，但不给评论、音乐这些门内物件
const isShare = computed(() => route.path.startsWith("/share"));
const isGarden = computed(() => isSecret.value || isShare.value);

watch(
  isGarden,
  (on) => {
    if (inBrowser) {
      document.documentElement.classList.toggle("secret-garden", on);
    }
  },
  { immediate: true, flush: "post" }
);

onUnmounted(() => {
  if (inBrowser) {
    document.documentElement.classList.remove("secret-garden");
  }
});
</script>

<template>
  <DefaultTheme.Layout>
    <template #doc-after>
      <Comment v-if="isSecret && frontmatter.comment" />
    </template>
    <template #layout-bottom>
      <GrowthCanvas v-if="isGarden" />
      <ConfirmDialog v-if="isSecret" />
      <SecretMusic v-if="isSecret" />
    </template>
  </DefaultTheme.Layout>
</template>
