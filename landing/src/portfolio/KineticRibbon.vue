<template>
  <div ref="stage" class="kinetic-stage" aria-hidden="true">
    <span class="art-cross art-cross--a">+</span
    ><span class="art-cross art-cross--b">+</span>
    <svg class="art-orbit" viewBox="0 0 600 600">
      <circle cx="300" cy="300" r="242" />
      <path d="M38 300h20m484 0h20M300 38v20m0 484v20" />
    </svg>
    <canvas ref="canvas" />
    <div class="art-caption">
      <span>FIG. 01 / CONTINUOUS CURIOSITY</span
      ><span>{{
        paused ? "STILL, CURIOUS." : "MOVE A LITTLE. DISCOVER MORE."
      }}</span>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from "vue";
const props = defineProps({ paused: Boolean });
const canvas = ref(null);
const stage = ref(null);
let ctx,
  width = 600,
  height = 600,
  frame = 0,
  time = 0,
  last = 0;
let visible = true,
  observer,
  resizeObserver;
const pointer = { x: 0, y: 0, targetX: 0, targetY: 0 };
const follow = (event) => {
  if (props.paused || event.pointerType === "touch") return;
  // The hero owns pointer events, including its copy and links. Normalize to
  // that shared area so crossing between columns keeps the movement continuous.
  const rect = event.currentTarget.getBoundingClientRect();
  if (!rect.width || !rect.height) return;
  pointer.targetX = Math.max(
    -0.5,
    Math.min(0.5, (event.clientX - rect.left) / rect.width - 0.5),
  );
  pointer.targetY = Math.max(
    -0.5,
    Math.min(0.5, (event.clientY - rect.top) / rect.height - 0.5),
  );
};
const release = () => {
  pointer.targetX = pointer.targetY = 0;
};
defineExpose({ follow, release });
function point(u, v) {
  // A half-twisted ribbon: an actual projected surface, not a video asset.
  const radial = 1.48 + v * Math.cos(u / 2);
  let x = radial * Math.cos(u),
    y = radial * Math.sin(u),
    z = v * Math.sin(u / 2);
  const ry = 0.48 + Math.sin(time * 0.22) * 0.2 + pointer.x * 0.6;
  const rx = 0.72 + Math.cos(time * 0.18) * 0.12 + pointer.y * 0.45;
  const rz = -0.34 + time * 0.055;
  const xx = x * Math.cos(ry) + z * Math.sin(ry);
  z = -x * Math.sin(ry) + z * Math.cos(ry);
  x = xx;
  const yy = y * Math.cos(rx) - z * Math.sin(rx);
  z = y * Math.sin(rx) + z * Math.cos(rx);
  y = yy;
  const xxx = x * Math.cos(rz) - y * Math.sin(rz);
  y = x * Math.sin(rz) + y * Math.cos(rz);
  x = xxx;
  const perspective = 5.5 / (5.5 + z);
  const scale = Math.min(width, height) * 0.204;
  return {
    x: width / 2 + x * scale * perspective,
    y: height / 2 + y * scale * perspective - 10,
    z,
  };
}
function draw() {
  if (!ctx) return;
  ctx.clearRect(0, 0, width, height);
  const faces = [];
  const segments = 136,
    lanes = 14;
  for (let i = 0; i < segments; i++) {
    const u = (i / segments) * Math.PI * 2,
      next = ((i + 1) / segments) * Math.PI * 2;
    for (let j = 0; j < lanes; j++) {
      const v = -0.53 + (j / lanes) * 1.06,
        v2 = -0.53 + ((j + 1) / lanes) * 1.06;
      const p = [point(u, v), point(next, v), point(next, v2), point(u, v2)];
      faces.push({
        p,
        z: p.reduce((sum, a) => sum + a.z, 0) / 4,
        accent: j === 6 || j === 7,
        edge: j === 0 || j === lanes - 1,
      });
    }
  }
  faces.sort((a, b) => b.z - a.z);
  for (const face of faces) {
    const shade = Math.max(0, Math.min(1, (face.z + 1.8) / 3.6));
    const gray = Math.round(223 + shade * 23);
    ctx.fillStyle = face.accent
      ? `rgb(${208 + shade * 26},${66 + shade * 17},${42 + shade * 12})`
      : `rgb(${gray},${gray - 2},${gray - 7})`;
    ctx.beginPath();
    face.p.forEach((p, i) => (i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y)));
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = face.accent
      ? "rgba(146,42,25,.25)"
      : `rgba(41,42,39,${face.edge ? 0.48 : 0.22})`;
    ctx.lineWidth = 0.65;
    ctx.beginPath();
    ctx.moveTo(face.p[0].x, face.p[0].y);
    ctx.lineTo(face.p[1].x, face.p[1].y);
    ctx.stroke();
  }
}
function tick(timestamp) {
  frame = 0;
  if (props.paused || !visible || document.hidden) return;
  const delta = last ? Math.min((timestamp - last) / 1000, 0.05) : 0;
  last = timestamp;
  time += delta;
  pointer.x += (pointer.targetX - pointer.x) * 0.04;
  pointer.y += (pointer.targetY - pointer.y) * 0.04;
  draw();
  frame = requestAnimationFrame(tick);
}
function sync() {
  cancelAnimationFrame(frame);
  frame = 0;
  last = 0;
  if (!props.paused && visible && !document.hidden)
    frame = requestAnimationFrame(tick);
  else draw();
}
onMounted(() => {
  ctx = canvas.value.getContext("2d");
  if (!ctx) return;
  resizeObserver = new ResizeObserver(([entry]) => {
    width = entry.contentRect.width;
    height = entry.contentRect.height;
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.value.width = Math.round(width * ratio);
    canvas.value.height = Math.round(height * ratio);
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    draw();
  });
  resizeObserver.observe(stage.value);
  observer = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    sync();
  });
  observer.observe(stage.value);
  document.addEventListener("visibilitychange", sync);
  sync();
});
watch(() => props.paused, sync);
onBeforeUnmount(() => {
  cancelAnimationFrame(frame);
  observer?.disconnect();
  resizeObserver?.disconnect();
  document.removeEventListener("visibilitychange", sync);
});
</script>
