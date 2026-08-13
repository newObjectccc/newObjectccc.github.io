<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";

/**
 * 生成式生长动画：暗夜土壤里的发光枝蔓。
 * 底部枝条向上生长，顶部枝条向下垂生（逆向生长）；
 * 绿 → 金的色相流动，末梢偶有暖色花苞；
 * 老枝缓缓消隐，新枝不断补种——生长与凋零循环。
 */

interface Branch {
  x: number;
  y: number;
  angle: number;
  speed: number;
  width: number;
  life: number;
  age: number;
  sway: number;
  depth: number;
}

interface Bloom {
  x: number;
  y: number;
  r: number;
  maxR: number;
  hue: number;
  alpha: number;
}

// 与 secret.css 中 --vp-c-bg 保持一致
const BG = "11, 15, 12";

const canvas = ref<HTMLCanvasElement>();
let ctx: CanvasRenderingContext2D | null = null;
let raf = 0;
let running = false;
let branches: Branch[] = [];
let blooms: Bloom[] = [];
let W = 0;
let H = 0;
let reducedMotion = false;

function rnd(min: number, max: number) {
  return min + Math.random() * (max - min);
}

/** 补种几株新枝（不清空现有生长） */
function plant() {
  const up = Math.max(3, Math.floor(W / 300));
  for (let i = 0; i < up; i++) {
    branches.push({
      x: rnd(W * 0.06, W * 0.94),
      y: H + 8,
      angle: -Math.PI / 2 + rnd(-0.35, 0.35),
      speed: rnd(0.9, 1.6),
      width: rnd(1.6, 2.4),
      life: rnd(320, 560),
      age: 0,
      sway: rnd(0.02, 0.06),
      depth: 0,
    });
  }
  // 逆向生长：自顶向下垂生
  const down = Math.max(2, Math.floor(W / 480));
  for (let i = 0; i < down; i++) {
    branches.push({
      x: rnd(W * 0.1, W * 0.9),
      y: -8,
      angle: Math.PI / 2 + rnd(-0.3, 0.3),
      speed: rnd(0.7, 1.1),
      width: rnd(1.2, 1.8),
      life: rnd(240, 420),
      age: 0,
      sway: rnd(0.02, 0.05),
      depth: 0,
    });
  }
}

function stepBranch(b: Branch) {
  if (!ctx) return;
  b.age++;
  b.life--;
  b.angle += rnd(-b.sway, b.sway);
  const nx = b.x + Math.cos(b.angle) * b.speed;
  const ny = b.y + Math.sin(b.angle) * b.speed;
  // 随年龄由磷绿流向暖金
  const t = Math.min(1, b.age / 480);
  const hue = 145 - t * 100;
  ctx.strokeStyle = `hsla(${hue}, 75%, ${Math.max(30, 58 - b.depth * 6)}%, 0.7)`;
  ctx.lineWidth = Math.max(0.4, b.width * Math.min(1, b.life / 200));
  ctx.shadowBlur = 8;
  ctx.shadowColor = `hsla(${hue}, 80%, 60%, 0.55)`;
  ctx.beginPath();
  ctx.moveTo(b.x, b.y);
  ctx.lineTo(nx, ny);
  ctx.stroke();
  b.x = nx;
  b.y = ny;
  // 分枝
  if (b.depth < 3 && b.life > 120 && Math.random() < 0.018) {
    branches.push({
      x: b.x,
      y: b.y,
      angle: b.angle + rnd(0.4, 0.9) * (Math.random() < 0.5 ? -1 : 1),
      speed: b.speed * 0.9,
      width: b.width * 0.7,
      life: b.life * rnd(0.4, 0.6),
      age: b.age,
      sway: b.sway,
      depth: b.depth + 1,
    });
  }
  // 花苞（爱/慈悲的暖色）
  if (Math.random() < 0.004) {
    blooms.push({
      x: b.x,
      y: b.y,
      r: 0,
      maxR: rnd(2.5, 5),
      hue: Math.random() < 0.5 ? 350 : 45,
      alpha: 0.9,
    });
  }
}

function stepBloom(bl: Bloom) {
  if (!ctx) return false;
  bl.r = Math.min(bl.maxR, bl.r + 0.08);
  bl.alpha -= 0.004;
  if (bl.alpha <= 0) return false;
  ctx.fillStyle = `hsla(${bl.hue}, 85%, 70%, ${bl.alpha})`;
  ctx.shadowBlur = 12;
  ctx.shadowColor = `hsla(${bl.hue}, 85%, 70%, 0.8)`;
  ctx.beginPath();
  ctx.arc(bl.x, bl.y, bl.r, 0, Math.PI * 2);
  ctx.fill();
  return true;
}

/** 推进一帧生长；fade 为 true 时先叠一层极淡底色让旧枝隐入土壤 */
function tick(fade: boolean) {
  if (!ctx) return;
  if (fade) {
    ctx.shadowBlur = 0;
    ctx.fillStyle = `rgba(${BG}, 0.012)`;
    ctx.fillRect(0, 0, W, H);
  }
  for (let i = branches.length - 1; i >= 0; i--) {
    const b = branches[i];
    stepBranch(b);
    if (b.life <= 0 || b.x < -40 || b.x > W + 40 || b.y < -40 || b.y > H + 40) {
      branches.splice(i, 1);
    }
  }
  blooms = blooms.filter(stepBloom);
  // 生生不息：枝条过少时补种
  if (branches.length < 6) plant();
}

/** 同步快进若干帧：进门那一刻枝蔓已是野蛮生长的状态 */
function fastForward(frames: number) {
  for (let i = 0; i < frames; i++) tick(false);
}

function frame() {
  if (!running || !ctx) return;
  tick(true);
  raf = requestAnimationFrame(frame);
}

let lastW = 0;

function resize() {
  if (!canvas.value) return;
  const w = window.innerWidth;
  // 移动端滚动时地址栏伸缩只改高度：一律忽略，避免画布反复重建导致背景"跳"
  if (lastW && w === lastW) return;
  lastW = w;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  W = w;
  H = window.innerHeight;
  canvas.value.width = W * dpr;
  canvas.value.height = H * dpr;
  ctx = canvas.value.getContext("2d");
  if (ctx) {
    ctx.scale(dpr, dpr);
    ctx.lineCap = "round";
  }
  branches = [];
  blooms = [];
  plant();
  fastForward(reducedMotion ? 500 : 380);
}

function onVisibility() {
  if (document.hidden) {
    running = false;
    cancelAnimationFrame(raf);
  } else if (!reducedMotion) {
    running = true;
    raf = requestAnimationFrame(frame);
  }
}

onMounted(() => {
  reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  resize();
  window.addEventListener("resize", resize);
  if (!reducedMotion) {
    running = true;
    raf = requestAnimationFrame(frame);
    document.addEventListener("visibilitychange", onVisibility);
  }
});

onUnmounted(() => {
  running = false;
  cancelAnimationFrame(raf);
  window.removeEventListener("resize", resize);
  document.removeEventListener("visibilitychange", onVisibility);
});
</script>

<template>
  <canvas ref="canvas" class="growth-canvas" aria-hidden="true" />
</template>

<style scoped>
.growth-canvas {
  position: fixed;
  inset: 0;
  width: 100vw;
  height: 100vh;
  z-index: -1;
  pointer-events: none;
}
</style>
