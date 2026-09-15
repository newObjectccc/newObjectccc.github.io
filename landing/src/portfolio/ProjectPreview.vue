<template>
  <div
    v-if="active"
    class="preview-atmosphere"
    :class="{ 'is-ready': ready }"
    :style="theme"
    :data-motion="paused ? 'off' : 'on'"
    aria-hidden="true"
  ></div>
  <aside
    :hidden="!active"
    ref="panel"
    class="project-preview"
    :class="{ 'is-engaged': engaged || keyboard, 'is-ready': ready }"
    :style="{ ...theme, ...position }"
    :data-motion="paused ? 'off' : 'on'"
    :data-project-id="project.id"
    :aria-hidden="!active"
    :inert="!active"
    role="dialog"
    tabindex="-1"
    :aria-label="`${project.name} 网站预览`"
    @pointerenter="enter"
    @pointerleave="leave"
    @focusin="active && emit('enter')"
    @focusout="onFocusOut"
  >
    <div class="preview-chrome">
      <span class="preview-lights" aria-hidden="true"
        ><i></i><i></i><i></i
      ></span>
      <span class="preview-domain">{{ hostname }}</span>
      <button
        class="preview-close"
        aria-label="关闭网站预览"
        @click="emit('close')"
      >
        ×
      </button>
    </div>
    <a
      ref="visitLink"
      class="preview-visit"
      :href="project.url"
      target="_blank"
      rel="noopener noreferrer"
      :aria-label="`在新窗口打开 ${project.name}`"
    >
      <div class="preview-stage" :style="{ height: `${stageHeight}px` }">
        <ProjectCover :project="project" />
        <iframe
          v-if="useFrame"
          ref="frame"
          class="preview-frame"
          :class="{ 'is-loaded': frameLoaded }"
          :src="project.url"
          :title="`${project.name} 实时网站画面`"
          :style="frameStyle"
          tabindex="-1"
          aria-hidden="true"
          inert
          sandbox="allow-scripts allow-same-origin"
          referrerpolicy="no-referrer"
          allow="autoplay 'none'; camera 'none'; microphone 'none'; geolocation 'none'"
          @load="onFrameLoad"
          @error="useCover('unavailable')"
        ></iframe>
        <div v-if="active" class="preview-frost" aria-hidden="true"></div>
        <div v-if="!ready" class="preview-loading" role="status">
          <span class="preview-spinner" aria-hidden="true"></span>
          <span
            >正在打开一个新世界<small>{{ project.name }}</small></span
          >
        </div>
        <div v-else class="preview-invitation">
          <span>走近一点</span><b>打开 {{ project.name }} ↗</b>
        </div>
      </div>
    </a>
    <div class="preview-caption">
      <div class="preview-state" role="status">
        <span class="preview-dot" :class="{ 'is-loading': !ready }"></span>
        <span>{{ statusLabel }}</span>
      </div>
      <div class="preview-options">
        <button
          v-if="useFrame && ready"
          @click="useCover('manual')"
          aria-label="画面未显示？切换项目封面"
        >
          切换封面
        </button>
        <button @click="emit('details', project)">项目介绍 ↗</button>
      </div>
    </div>
  </aside>
</template>

<script setup>
import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  watch,
} from "vue";
import ProjectCover from "./ProjectCover.vue";

const props = defineProps({
  project: { type: Object, required: true },
  anchor: { type: Object, required: true },
  active: Boolean,
  keyboard: Boolean,
  paused: Boolean,
});
const emit = defineEmits(["enter", "leave", "ready", "close", "details"]);
const panel = ref(null),
  visitLink = ref(null),
  engaged = ref(false);
const frame = ref(null);
const useFrame = ref(props.project.preview.mode === "live" && !props.paused);
const frameLoaded = ref(false),
  ready = ref(false),
  fallbackReason = ref("");
const hostname = new URL(props.project.url).hostname;
const theme = {
  "--preview-paper": props.project.preview.theme.paper,
  "--preview-ink": props.project.preview.theme.ink,
  "--preview-accent": props.project.preview.theme.accent,
};
const width = Math.min(
  props.project.preview.mobile ? 360 : 620,
  window.innerWidth - 80,
);
const stageHeight = Math.min(
  (width - 20) * (props.project.preview.mobile ? 1.38 : 0.63),
  window.innerHeight - 180,
);
const position = computed(() => ({
  width: `${width}px`,
  left: `${Math.max(32, Math.min(props.anchor.right - width - 24, window.innerWidth - width - 32))}px`,
  top: `${Math.max(32, Math.min(props.anchor.top + 48, window.innerHeight - stageHeight - 130))}px`,
}));
const frameWidth = props.project.preview.mobile ? 390 : 1280;
const frameScale = (width - 20) / frameWidth;
const frameStyle = {
  width: `${frameWidth}px`,
  height: `${stageHeight / frameScale}px`,
  transform: `scale(${frameScale})`,
};
const statusLabel = computed(() => {
  if (!ready.value) return "正在载入网站";
  if (useFrame.value) return "网站预览 · 点击在新窗口探索";
  return fallbackReason.value === "timeout"
    ? "加载较慢，先浏览项目封面"
    : "项目封面 · 点击访问完整网站";
});
let loadTimeout, coverTimeout, focusFrame, focusExitFrame;
function keepFrameDecorative() {
  cancelAnimationFrame(focusFrame);
  focusFrame = requestAnimationFrame(() => {
    // Some embedded apps autofocus their own inputs after hydration. Return
    // focus to the preview so Escape and the outgoing link remain usable.
    if (
      !document.hidden &&
      frame.value &&
      document.activeElement === frame.value
    ) {
      if (props.active) {
        (props.keyboard ? visitLink.value : panel.value)?.focus({
          preventScroll: true,
        });
      } else {
        // A retained, hidden app must not steal the parent document's focus.
        frame.value.blur();
      }
    }
  });
}
function markReady() {
  clearTimeout(loadTimeout);
  ready.value = true;
  emit("ready", props.project.id);
}
function onFrameLoad() {
  // A cross-origin load event is not proof that embedding succeeded. Known
  // restrictions use cover mode; the cover switch remains available otherwise.
  frameLoaded.value = true;
  markReady();
  keepFrameDecorative();
}
function useCover(reason) {
  useFrame.value = false;
  fallbackReason.value = reason;
  markReady();
}
function enter() {
  if (!props.active) return;
  engaged.value = true;
  emit("enter");
}
function leave() {
  if (!props.active) return;
  engaged.value = false;
  emit("leave");
}
function onFocusOut() {
  // relatedTarget can be null when focus enters a cross-origin document.
  // Inspect the settled parent-document focus before dismissing the window.
  cancelAnimationFrame(focusExitFrame);
  focusExitFrame = requestAnimationFrame(() => {
    if (
      props.active &&
      props.keyboard &&
      panel.value &&
      !panel.value.contains(document.activeElement)
    )
      emit("close");
  });
}
onMounted(() => {
  window.addEventListener("blur", keepFrameDecorative);
  if (useFrame.value && !ready.value)
    loadTimeout = setTimeout(() => useCover("timeout"), 10000);
  else if (!useFrame.value)
    coverTimeout = setTimeout(() => useCover("policy"), 320);
  if (props.keyboard) visitLink.value.focus({ preventScroll: true });
});
watch(
  () => [props.active, props.keyboard],
  ([active]) => {
    engaged.value = false;
    cancelAnimationFrame(focusExitFrame);
    if (active && props.keyboard) {
      // Focus only after the cached panel has become visible and non-inert.
      nextTick(() => {
        if (props.active && props.keyboard)
          visitLink.value?.focus({ preventScroll: true });
      });
    }
  },
  { flush: "post" },
);
onBeforeUnmount(() => {
  window.removeEventListener("blur", keepFrameDecorative);
  cancelAnimationFrame(focusFrame);
  cancelAnimationFrame(focusExitFrame);
  clearTimeout(loadTimeout);
  clearTimeout(coverTimeout);
});
</script>

<style>
.portfolio {
  background-color: var(--paper);
  color: var(--ink);
  transition:
    background-color 700ms,
    color 700ms;
}
.portfolio.has-project-preview .site-nav {
  background: color-mix(in srgb, var(--paper) 94%, transparent);
}
.portfolio[data-motion="off"] {
  transition: none;
}
.work-status-line {
  display: flex;
  align-items: center;
  gap: 20px;
}
.preview-trigger {
  display: none;
  font: 9px var(--mono);
  color: var(--muted);
  padding: 8px 0;
  white-space: nowrap;
}
.preview-trigger span {
  margin-left: 5px;
}
.preview-trigger:hover {
  color: var(--accent);
}
@media (hover: hover) and (pointer: fine) {
  .preview-trigger {
    display: inline-block;
  }
}
.preview-atmosphere {
  position: fixed;
  inset: 0;
  z-index: 60;
  pointer-events: none;
  backdrop-filter: blur(3px) saturate(0.8);
  -webkit-backdrop-filter: blur(3px) saturate(0.8);
  background: rgb(36 38 32 / 0.07);
  transition: background 800ms;
  animation: preview-atmosphere-in 350ms both;
}
.preview-atmosphere.is-ready {
  background: color-mix(in srgb, var(--preview-accent) 14%, transparent);
}
.project-preview {
  position: fixed;
  z-index: 70;
  padding: 0 10px;
  border: 1px solid rgb(255 255 255 / 0.65);
  border-radius: 18px;
  color: var(--preview-ink);
  background: color-mix(in srgb, var(--preview-paper) 68%, transparent);
  backdrop-filter: blur(26px) saturate(1.3);
  -webkit-backdrop-filter: blur(26px) saturate(1.3);
  box-shadow:
    0 30px 90px -22px color-mix(in srgb, var(--preview-ink) 40%, transparent),
    inset 0 1px rgb(255 255 255 / 0.8);
  transform: scale(0.97) rotate(-0.8deg);
  transition:
    transform 550ms var(--ease),
    box-shadow 550ms var(--ease),
    background 550ms;
  animation: preview-window-in 400ms var(--ease) both;
  transform-origin: center;
  isolation: isolate;
}
.project-preview[hidden] {
  display: none !important;
  backdrop-filter: none;
  -webkit-backdrop-filter: none;
  box-shadow: none;
  animation: none;
  transition: none;
}
.project-preview.is-engaged {
  transform: scale(1.025) rotate(0deg);
  background: color-mix(in srgb, var(--preview-paper) 90%, transparent);
  box-shadow:
    0 38px 110px -24px color-mix(in srgb, var(--preview-ink) 48%, transparent),
    inset 0 1px rgb(255 255 255 / 0.9);
}
.project-preview:focus {
  outline: none;
}
.preview-chrome {
  height: 42px;
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 0 4px;
}
.preview-lights {
  display: flex;
  gap: 5px;
}
.preview-lights i {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--preview-accent);
  opacity: 0.6;
}
.preview-lights i:nth-child(2) {
  opacity: 0.3;
}
.preview-lights i:nth-child(3) {
  opacity: 0.15;
}
.preview-domain {
  font: 9px var(--mono);
  opacity: 0.65;
  flex: 1;
}
.preview-close {
  width: 30px;
  height: 30px;
  font-size: 22px;
  opacity: 0.65;
  border-radius: 50%;
}
.preview-close:hover {
  background: rgb(255 255 255 / 0.6);
  opacity: 1;
}
.preview-visit {
  display: block;
  border-radius: 10px;
  cursor: pointer;
}
.preview-stage {
  position: relative;
  overflow: hidden;
  border-radius: 10px;
  isolation: isolate;
  background: var(--preview-paper);
}
.preview-stage > .project-art {
  position: absolute;
  inset: 0;
  height: 100%;
  aspect-ratio: auto;
}
.preview-frame {
  position: absolute;
  top: 0;
  left: 0;
  max-width: none;
  border: 0;
  transform-origin: top left;
  pointer-events: none;
  opacity: 0;
  transition: opacity 500ms;
  background: var(--preview-paper);
}
.preview-frame.is-loaded {
  opacity: 1;
}
.preview-frost {
  position: absolute;
  inset: 0;
  background: rgb(255 255 255 / 0.09);
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
  transition:
    backdrop-filter 600ms,
    background 600ms;
  pointer-events: none;
}
.project-preview.is-engaged .preview-frost {
  backdrop-filter: blur(0px);
  -webkit-backdrop-filter: blur(0px);
  background: transparent;
}
.preview-loading {
  position: absolute;
  inset: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  color: var(--preview-ink);
  font-size: 12px;
  background: color-mix(in srgb, var(--preview-paper) 48%, transparent);
}
.preview-loading small {
  display: block;
  font: 9px var(--mono);
  margin-top: 8px;
  opacity: 0.65;
}
.preview-spinner {
  width: 18px;
  height: 18px;
  border: 1px solid color-mix(in srgb, var(--preview-accent) 25%, transparent);
  border-top-color: var(--preview-accent);
  border-radius: 50%;
  animation: preview-spin 900ms linear infinite;
}
.preview-invitation {
  position: absolute;
  left: 50%;
  bottom: 18px;
  transform: translateX(-50%);
  display: grid;
  white-space: nowrap;
  text-align: center;
  font-size: 11px;
  padding: 10px 18px;
  background: color-mix(in srgb, var(--preview-paper) 82%, transparent);
  color: var(--preview-ink);
  border: 1px solid rgb(255 255 255 / 0.7);
  border-radius: 50px;
  backdrop-filter: blur(12px);
}
.preview-invitation span {
  transition: opacity 300ms;
}
.preview-invitation b {
  grid-area: 1/1;
  font-weight: 500;
  opacity: 0;
  transition: opacity 300ms;
}
.preview-invitation span {
  grid-area: 1/1;
}
.project-preview.is-engaged .preview-invitation span {
  opacity: 0;
}
.project-preview.is-engaged .preview-invitation b {
  opacity: 1;
}
.preview-caption {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 42px;
  gap: 12px;
  padding: 8px 4px;
  font-size: 9px;
}
.preview-state {
  display: flex;
  align-items: center;
  gap: 7px;
  line-height: 1.5;
}
.preview-dot {
  width: 5px;
  height: 5px;
  flex: 0 0 auto;
  border-radius: 50%;
  background: var(--preview-accent);
}
.preview-dot.is-loading {
  opacity: 0.4;
}
.preview-options {
  display: flex;
  gap: 14px;
  flex-shrink: 0;
}
.preview-options button {
  font-size: 9px;
  padding: 5px 0;
}
.preview-options button:hover {
  text-decoration: underline;
  text-underline-offset: 4px;
}
.project-preview :focus-visible {
  outline: 2px solid var(--preview-accent);
  outline-offset: 3px;
}
@keyframes preview-spin {
  to {
    transform: rotate(360deg);
  }
}
@keyframes preview-window-in {
  from {
    opacity: 0;
    translate: 0 12px;
  }
  to {
    opacity: 1;
    translate: 0 0;
  }
}
@keyframes preview-atmosphere-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
.project-preview[data-motion="off"],
.preview-atmosphere[data-motion="off"] {
  animation: none;
  transition: none;
}
.project-preview[data-motion="off"] {
  transform: none;
}
@media (prefers-reduced-motion: reduce) {
  .project-preview {
    transform: none !important;
  }
}
</style>
