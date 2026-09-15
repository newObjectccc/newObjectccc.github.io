<template>
  <details
    ref="disclosure"
    class="animated-disclosure"
    :open="renderOpen"
    :data-expanded="expanded"
    :data-animating="animating"
  >
    <summary
      ref="summary"
      :aria-expanded="expanded"
      :aria-controls="contentId"
      @click.prevent="toggle"
    >
      <svg
        class="disclosure-rule"
        viewBox="0 0 1000 4"
        preserveAspectRatio="none"
        aria-hidden="true"
        focusable="false"
      >
        <path class="disclosure-rule-path" d="M0 2H1000" pathLength="100" />
        <path class="disclosure-rule-runner" d="M0 2H1000" pathLength="100" />
      </svg>
      <slot name="summary" />
    </summary>
    <div
      :id="contentId"
      ref="body"
      class="disclosure-body"
      :aria-hidden="!expanded"
      :inert="!expanded"
    >
      <div ref="inner" class="disclosure-inner"><slot /></div>
    </div>
  </details>
</template>

<script setup>
import { nextTick, onBeforeUnmount, onMounted, ref, useId, watch } from "vue";
import { gsap } from "gsap";

const props = defineProps({ initialOpen: Boolean, paused: Boolean });
const disclosure = ref(null),
  summary = ref(null),
  body = ref(null),
  inner = ref(null);
const expanded = ref(props.initialOpen),
  renderOpen = ref(props.initialOpen),
  animating = ref(false);
const contentId = `disclosure-${useId()}`;
let heightTween,
  contentTween,
  observer,
  revision = 0,
  targetHeight = 0;

const fragments = () => body.value.querySelectorAll("[data-disclosure-reveal]");
function naturalHeight() {
  const style = getComputedStyle(disclosure.value);
  return (
    summary.value.getBoundingClientRect().height +
    (expanded.value ? body.value.getBoundingClientRect().height : 0) +
    parseFloat(style.borderTopWidth) +
    parseFloat(style.borderBottomWidth)
  );
}
async function finish() {
  const currentRevision = revision;
  heightTween?.kill();
  renderOpen.value = expanded.value;
  // Commit the native closed state before revealing/resetting its contents.
  // Otherwise a forced layout can see a fully open details for one frame.
  await nextTick();
  if (currentRevision !== revision || !disclosure.value) return;
  animating.value = false;
  gsap.set(disclosure.value, { clearProps: "height" });
  if (!expanded.value || props.paused) {
    contentTween?.kill();
    gsap.set(fragments(), { clearProps: "opacity,transform" });
  }
}
function animateHeight(duration, currentRevision) {
  targetHeight = naturalHeight();
  heightTween = gsap.to(disclosure.value, {
    height: targetHeight,
    duration,
    ease: expanded.value ? "power3.inOut" : "power2.inOut",
    onComplete: () => {
      if (revision === currentRevision) finish();
    },
  });
}
async function toggle() {
  const currentRevision = ++revision;
  const fromHeight = disclosure.value.getBoundingClientRect().height;
  const wasRendered = renderOpen.value;
  heightTween?.kill();
  contentTween?.kill();
  expanded.value = !expanded.value;
  if (props.paused) {
    finish();
    return;
  }

  // Keep the native details open until the closing animation finishes. A new
  // click begins from the current rendered height, even halfway through a tween.
  gsap.set(disclosure.value, { height: fromHeight });
  animating.value = true;
  renderOpen.value = true;
  await nextTick();
  if (revision !== currentRevision) return;

  const items = fragments();
  if (expanded.value && !wasRendered) gsap.set(items, { opacity: 0, y: 10 });
  contentTween = gsap.to(
    items,
    expanded.value
      ? {
          opacity: 1,
          y: 0,
          duration: 0.4,
          delay: wasRendered ? 0 : 0.06,
          stagger: 0.045,
          ease: "power2.out",
          clearProps: "opacity,transform",
        }
      : {
          opacity: 0,
          y: -5,
          duration: 0.18,
          stagger: { each: 0.018, from: "end" },
          ease: "power1.in",
        },
  );
  animateHeight(expanded.value ? 0.62 : 0.38, currentRevision);
}

watch(
  () => props.paused,
  (paused) => {
    if (paused) {
      revision++;
      finish();
    }
  },
);
onMounted(() => {
  observer = new ResizeObserver(() => {
    if (!animating.value || !expanded.value || props.paused) return;
    if (Math.abs(naturalHeight() - targetHeight) < 1) return;
    // Retarget without snapping if an image or responsive text changes height.
    heightTween?.kill();
    animateHeight(0.26, revision);
  });
  observer.observe(inner.value);
  observer.observe(summary.value);
});
onBeforeUnmount(() => {
  revision++;
  heightTween?.kill();
  contentTween?.kill();
  observer?.disconnect();
});
</script>
