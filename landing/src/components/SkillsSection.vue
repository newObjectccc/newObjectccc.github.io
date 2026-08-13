<template>
  <section class="skills" id="skills" ref="sectionRef">
    <div class="container">
      <div class="section-label" ref="labelRef">03 · Tech Stack</div>
      <h2 class="skills-heading" ref="headingRef">
        Tools I<br /><em>master.</em>
      </h2>
    </div>

    <div class="marquee-wrapper" ref="marqueeRef">
      <!-- Row 1: left direction -->
      <div class="marquee-row">
        <div class="marquee-track">
          <span class="skill-item" v-for="(s, i) in [...row1, ...row1]" :key="`r1-${i}`">
            <span class="skill-bullet">◆</span>
            <span class="skill-name">{{ s }}</span>
          </span>
        </div>
      </div>

      <!-- Row 2: right direction -->
      <div class="marquee-row">
        <div class="marquee-track track-reverse">
          <span class="skill-item" v-for="(s, i) in [...row2, ...row2]" :key="`r2-${i}`">
            <span class="skill-bullet">◆</span>
            <span class="skill-name">{{ s }}</span>
          </span>
        </div>
      </div>

      <!-- Row 3: left direction slower -->
      <div class="marquee-row">
        <div class="marquee-track track-slow">
          <span class="skill-item" v-for="(s, i) in [...row3, ...row3]" :key="`r3-${i}`">
            <span class="skill-bullet">◆</span>
            <span class="skill-name">{{ s }}</span>
          </span>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { gsap } from 'gsap'

const sectionRef = ref(null)
const labelRef = ref(null)
const headingRef = ref(null)
const marqueeRef = ref(null)

const row1 = ['React', 'Vue 3', 'TypeScript', 'Next.js', 'Vite', 'GSAP', 'CSS3', 'Webpack']
const row2 = ['Node.js', 'Nestjs', 'PostgreSQL', 'Redis', 'Docker', 'Nginx', 'Caddy', 'Linux']
const row3 = ['Git', 'Rust', 'Tailwind', 'Rollup', 'Sass', 'Vitest', 'Electron', 'Pnpm']

onMounted(() => {
  const section = sectionRef.value

  gsap.from(labelRef.value, {
    y: 14, opacity: 0, duration: 0.7, ease: 'power3.out',
    scrollTrigger: { trigger: section, start: 'top 75%' },
  })

  gsap.from(headingRef.value, {
    y: 40, opacity: 0, duration: 0.9, ease: 'power3.out',
    scrollTrigger: { trigger: section, start: 'top 68%' },
  })

  gsap.from(marqueeRef.value, {
    opacity: 0, duration: 1.0, ease: 'power2.out',
    scrollTrigger: { trigger: section, start: 'top 60%' },
  })
})
</script>

<style scoped>
.skills {
  padding: clamp(100px, 16vh, 180px) 0;
  overflow: hidden;
}

.skills-heading {
  font-family: var(--font-display);
  font-size: clamp(2.5rem, 5vw, 5rem);
  font-weight: 300;
  color: var(--text);
  line-height: 1.1;
  margin-bottom: clamp(3rem, 6vw, 5rem);
}

.skills-heading em {
  font-style: italic;
  color: var(--accent);
}

/* Marquee */
.marquee-wrapper {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 0;
  overflow: hidden;
}

.marquee-wrapper::before,
.marquee-wrapper::after {
  content: '';
  position: absolute;
  top: 0;
  bottom: 0;
  width: 200px;
  z-index: 2;
  pointer-events: none;
}

.marquee-wrapper::before {
  left: 0;
  background: linear-gradient(to right, var(--bg), transparent);
}

.marquee-wrapper::after {
  right: 0;
  background: linear-gradient(to left, var(--bg), transparent);
}

.marquee-row {
  border-top: 1px solid var(--border);
  padding: 1.5rem 0;
  overflow: hidden;
}

.marquee-row:last-child {
  border-bottom: 1px solid var(--border);
}

.marquee-track {
  display: flex;
  width: max-content;
  animation: scrollLeft 28s linear infinite;
}

.marquee-track.track-reverse {
  animation: scrollRight 22s linear infinite;
}

.marquee-track.track-slow {
  animation: scrollLeft 36s linear infinite;
}

@keyframes scrollLeft {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}

@keyframes scrollRight {
  from { transform: translateX(-50%); }
  to { transform: translateX(0); }
}

.skill-item {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 0 2.5rem;
  font-size: clamp(0.85rem, 1.5vw, 1rem);
  font-weight: 300;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--text-mid);
  white-space: nowrap;
  transition: color 0.3s;
}

.skill-item:hover {
  color: var(--text);
}

.skill-bullet {
  font-size: 0.35rem;
  color: var(--accent);
  opacity: 0.6;
}

/* Pause on hover */
.marquee-row:hover .marquee-track {
  animation-play-state: paused;
}
</style>
