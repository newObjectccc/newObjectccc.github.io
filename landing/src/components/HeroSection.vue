<template>
  <section class="hero" ref="sectionRef">
    <!-- Background -->
    <div class="hero-bg" aria-hidden="true">
      <div class="hero-orb orb-1"></div>
      <div class="hero-orb orb-2"></div>
      <div class="hero-orb orb-3"></div>
      <div class="hero-grid"></div>
    </div>

    <!-- Main content -->
    <div class="hero-content container">
      <div class="hero-label" ref="labelRef">
        <img src="/favicon.ico" alt="avatar" class="hero-avatar" />
        独立开发者 &nbsp;·&nbsp; Indie Hacker
      </div>

      <h1 class="hero-title" aria-label="VESPER">
        <span
          v-for="(char, i) in titleChars"
          :key="i"
          class="char-wrap"
        >
          <span class="char">{{ char }}</span>
        </span>
      </h1>

      <div class="hero-rule" ref="ruleRef"></div>

      <p class="hero-tagline" ref="taglineRef">
        Building digital products that matter.
      </p>

      <div class="hero-actions" ref="actionsRef">
        <a href="#projects" class="btn btn-primary" @click.prevent="scrollTo('#projects')">
          <span>Explore Work</span>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M7 2v10M7 12L12 7M7 12L2 7" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </a>
        <a href="https://github.com/newObjectccc" target="_blank" rel="noopener" class="btn btn-ghost">
          GitHub →
        </a>
      </div>
    </div>

    <!-- Stats bar -->
    <div class="hero-stats container" ref="statsRef">
      <div class="stat-item" v-for="s in stats" :key="s.value">
        <span class="stat-value">{{ s.value }}</span>
        <span class="stat-label">{{ s.label }}</span>
      </div>
    </div>

    <!-- Scroll hint -->
    <div class="hero-scroll-hint" aria-hidden="true" ref="scrollHintRef">
      <div class="scroll-line"></div>
      <span>Scroll</span>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { gsap } from 'gsap'

const sectionRef = ref(null)
const labelRef = ref(null)
const ruleRef = ref(null)
const taglineRef = ref(null)
const actionsRef = ref(null)
const statsRef = ref(null)
const scrollHintRef = ref(null)

const titleChars = computed(() => 'VESPER'.split(''))

const stats = [
  { value: '8+', label: 'Years Coding' },
  { value: '10+', label: 'Projects Shipped' },
  { value: '∞', label: 'Cups of Coffee' },
]

const scrollTo = (selector) => {
  document.querySelector(selector)?.scrollIntoView({ behavior: 'smooth' })
}

onMounted(() => {
  const section = sectionRef.value
  const chars = section.querySelectorAll('.char')

  const tl = gsap.timeline({ delay: 0.15 })

  tl.from(section.querySelectorAll('.hero-orb'), {
    opacity: 0,
    scale: 0.6,
    duration: 2.5,
    stagger: 0.3,
    ease: 'power2.out',
  })
    .from(labelRef.value, { y: 16, opacity: 0, duration: 0.7, ease: 'power3.out' }, 0.3)
    .from(chars, { y: '120%', stagger: 0.065, duration: 1.0, ease: 'power4.out' }, 0.4)
    .from(ruleRef.value, { scaleX: 0, transformOrigin: 'left', duration: 0.8, ease: 'power3.out' }, '-=0.3')
    .from(taglineRef.value, { y: 22, opacity: 0, duration: 0.7, ease: 'power3.out' }, '-=0.5')
    .from(actionsRef.value, { y: 22, opacity: 0, duration: 0.7, ease: 'power3.out' }, '-=0.55')
    .from(statsRef.value.querySelectorAll('.stat-item'), {
      y: 16, opacity: 0, stagger: 0.1, duration: 0.6, ease: 'power3.out',
    }, '-=0.4')
    .from(scrollHintRef.value, { opacity: 0, duration: 0.5 }, '-=0.3')
})
</script>

<style scoped>
.hero {
  position: relative;
  min-height: 100svh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  overflow: hidden;
  padding-top: 80px;
}

/* Background */
.hero-bg {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
}

.hero-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(110px);
  will-change: transform;
}

.orb-1 {
  width: min(70vw, 820px);
  height: min(70vw, 820px);
  background: radial-gradient(circle, rgba(184, 148, 74, 0.14) 0%, transparent 70%);
  top: -25%;
  right: -15%;
  animation: orbFloat1 14s ease-in-out infinite;
}

.orb-2 {
  width: min(50vw, 600px);
  height: min(50vw, 600px);
  background: radial-gradient(circle, rgba(184, 148, 74, 0.07) 0%, transparent 70%);
  bottom: -10%;
  left: 5%;
  animation: orbFloat2 18s ease-in-out infinite;
}

.orb-3 {
  width: min(30vw, 400px);
  height: min(30vw, 400px);
  background: radial-gradient(circle, rgba(140, 100, 60, 0.06) 0%, transparent 70%);
  top: 40%;
  left: 45%;
  animation: orbFloat3 11s ease-in-out infinite;
}

@keyframes orbFloat1 {
  0%, 100% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(-2%, 5%) scale(1.04); }
  66% { transform: translate(3%, -3%) scale(0.96); }
}
@keyframes orbFloat2 {
  0%, 100% { transform: translate(0, 0); }
  50% { transform: translate(-3%, -8%); }
}
@keyframes orbFloat3 {
  0%, 100% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(4%, 3%) scale(1.08); }
}

.hero-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(255,255,255,0.018) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,0.018) 1px, transparent 1px);
  background-size: 80px 80px;
  mask-image: radial-gradient(ellipse at 50% 40%, transparent 20%, black 75%);
  -webkit-mask-image: radial-gradient(ellipse at 50% 40%, transparent 20%, black 75%);
}

/* Content */
.hero-content {
  position: relative;
  z-index: 1;
  padding-bottom: 2rem;
}

.hero-label {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-size: 0.7rem;
  font-weight: 400;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--accent);
  margin-bottom: 2rem;
}

.hero-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 1px solid var(--border-accent);
  object-fit: cover;
  flex-shrink: 0;
}

@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.4; transform: scale(0.65); }
}

.hero-title {
  font-family: var(--font-display);
  font-weight: 300;
  font-size: clamp(5.5rem, 17vw, 21rem);
  line-height: 0.88;
  letter-spacing: -0.03em;
  color: var(--text);
  margin-bottom: 2rem;
}

.char-wrap {
  display: inline-block;
  overflow: hidden;
  line-height: 0.92;
  padding-bottom: 0.08em;
}

.char {
  display: inline-block;
}

.hero-rule {
  width: 100%;
  height: 1px;
  background: linear-gradient(90deg, rgba(184,148,74,0.5) 0%, rgba(184,148,74,0.1) 40%, transparent 70%);
  margin-bottom: 2rem;
}

.hero-tagline {
  font-size: clamp(1rem, 2vw, 1.2rem);
  font-weight: 300;
  color: var(--text-mid);
  margin-bottom: 3rem;
  max-width: 460px;
  letter-spacing: 0.01em;
}

.hero-actions {
  display: flex;
  gap: 1.25rem;
  flex-wrap: wrap;
  align-items: center;
}

/* Stats bar */
.hero-stats {
  position: relative;
  z-index: 1;
  display: flex;
  gap: 3rem;
  padding-top: 4rem;
  padding-bottom: 3rem;
  border-top: 1px solid var(--border);
  margin-top: auto;
}

.stat-item {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.stat-value {
  font-family: var(--font-display);
  font-size: clamp(1.6rem, 3.5vw, 2.8rem);
  font-weight: 300;
  color: var(--accent);
  line-height: 1;
}

.stat-label {
  font-size: 0.67rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--text-muted);
}

/* Scroll hint */
.hero-scroll-hint {
  position: absolute;
  bottom: 36px;
  right: var(--gutter);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  font-size: 0.62rem;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--text-muted);
  z-index: 1;
}

.scroll-line {
  width: 1px;
  height: 44px;
  background: linear-gradient(to bottom, var(--accent), transparent);
  animation: scrollAnim 1.8s ease-in-out infinite;
  transform-origin: top;
}

@keyframes scrollAnim {
  0% { transform: scaleY(0); opacity: 1; transform-origin: top; }
  50% { transform: scaleY(1); opacity: 1; }
  100% { transform: scaleY(1); opacity: 0; transform-origin: bottom; }
}

/* Mobile */
@media (max-width: 768px) {
  .hero-scroll-hint { display: none; }
  .hero-stats { gap: 2rem; flex-wrap: wrap; }
  .hero-title { font-size: clamp(4.5rem, 22vw, 9rem); }
}
</style>
