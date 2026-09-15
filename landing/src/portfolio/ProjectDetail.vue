<template>
  <dialog
    ref="dialog"
    class="project-dialog"
    :data-motion="paused ? 'off' : 'on'"
    aria-labelledby="detail-title"
    @click="closeOutside"
    @close="emit('close')"
  >
    <div class="detail-top">
      <span class="eyebrow">PROJECT NOTES / {{ project.number }}</span
      ><button
        class="close-detail"
        @click="dialog.close()"
        aria-label="关闭项目详情"
      >
        关闭 <span>×</span>
      </button>
    </div>
    <div class="detail-content">
      <span class="eyebrow"
        >{{ project.categoryLabel }} · {{ project.status }}</span
      >
      <h2 id="detail-title">{{ project.name }}</h2>
      <p class="detail-intro">{{ project.description }}</p>
      <div class="detail-meta">
        <div>
          <span>ROLE</span><b>{{ project.role }}</b>
        </div>
        <div>
          <span>BUILT WITH</span><b>{{ project.tags.join(" / ") }}</b>
        </div>
      </div>
      <ProjectCover :project="project" />
      <div class="detail-points">
        <article v-for="([title, body], index) in project.points" :key="title">
          <span class="eyebrow">0{{ index + 1 }}</span>
          <div>
            <h3>{{ title }}</h3>
            <p>{{ body }}</p>
          </div>
        </article>
      </div>
      <div v-if="project.images.length" class="detail-gallery">
        <p class="eyebrow">PRODUCT SCREENS / 产品画面</p>
        <img
          v-for="(image, i) in project.images"
          :key="image"
          :src="image"
          :alt="`${project.name}产品界面 ${i + 1}`"
          loading="lazy"
        />
      </div>
      <div class="detail-bottom">
        <span>{{ project.note }}</span
        ><a
          :href="project.url"
          target="_blank"
          rel="noopener noreferrer"
          class="round-link stroke-trigger"
          >{{ project.label }} <StrokeArrow
        /></a>
      </div>
    </div>
  </dialog>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import ProjectCover from "./ProjectCover.vue";
import StrokeArrow from "./StrokeArrow.vue";
defineProps({
  project: { type: Object, required: true },
  paused: { type: Boolean, default: false },
});
const emit = defineEmits(["close"]);
const dialog = ref(null);
let previousOverflow = "";
const closeOutside = (event) => {
  if (event.target === dialog.value) dialog.value.close();
};
onMounted(() => {
  previousOverflow = document.body.style.overflow;
  document.body.style.overflow = "hidden";
  dialog.value.showModal();
});
onBeforeUnmount(() => {
  document.body.style.overflow = previousOverflow;
  dialog.value?.close();
});
</script>
