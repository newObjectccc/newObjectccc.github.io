<template>
  <section class="about" id="about" ref="sectionRef">
    <div class="container">
      <div class="section-label" ref="labelRef">01 · About Me</div>

      <div class="about-grid">
        <!-- Text side -->
        <div class="about-text">
          <h2 class="about-heading" ref="headingRef">
            I build things<br />
            <em>for the web.</em>
          </h2>

          <p class="about-bio" ref="bioRef">
            全栈开发者，热衷于开源与独立产品开发。<br />
            我相信好的产品源于对细节的执着与对用户的理解。<br />
            从前端交互到后端架构，享受把想法变成现实的全过程。
          </p>

          <div class="about-stats" ref="statsRef">
            <div class="stat" v-for="s in stats" :key="s.label">
              <span class="stat-value">{{ s.value }}</span>
              <span class="stat-label">{{ s.label }}</span>
            </div>
          </div>
        </div>

        <!-- Visual side -->
        <div class="about-visual" ref="visualRef" aria-hidden="true">
          <div class="visual-number">01</div>
          <div class="visual-frame">
            <div class="frame-dot top-left"></div>
            <div class="frame-dot top-right"></div>
            <div class="frame-dot bottom-left"></div>
            <div class="frame-dot bottom-right"></div>
            <div class="frame-lines">
              <div class="fline" v-for="i in 5" :key="i"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const sectionRef = ref(null)
const labelRef = ref(null)
const headingRef = ref(null)
const bioRef = ref(null)
const statsRef = ref(null)
const visualRef = ref(null)

const stats = [
  { value: '8+', label: 'Years Experience' },
  { value: '10+', label: 'Projects Shipped' },
  { value: '∞', label: 'Cups of Coffee' },
]

onMounted(() => {
  const section = sectionRef.value

  const st = { trigger: section, start: 'top 72%' }

  gsap.from(labelRef.value, { y: 14, opacity: 0, duration: 0.7, ease: 'power3.out', scrollTrigger: st })
  gsap.from(headingRef.value, { y: 50, opacity: 0, duration: 1.0, ease: 'power3.out', scrollTrigger: { ...st, start: 'top 68%' } })
  gsap.from(bioRef.value, { y: 30, opacity: 0, duration: 0.8, ease: 'power3.out', scrollTrigger: { ...st, start: 'top 62%' } })
  gsap.from(statsRef.value.querySelectorAll('.stat'), {
    y: 20, opacity: 0, stagger: 0.12, duration: 0.6, ease: 'power3.out',
    scrollTrigger: { ...st, start: 'top 55%' },
  })

  // Parallax on visual element
  gsap.to(visualRef.value, {
    y: -70,
    ease: 'none',
    scrollTrigger: {
      trigger: section,
      start: 'top bottom',
      end: 'bottom top',
      scrub: 1.2,
    },
  })
})
</script>

<style scoped>
.about {
  padding: clamp(100px, 16vh, 180px) 0;
  overflow: hidden;
}

.about-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: clamp(60px, 8vw, 140px);
  align-items: start;
}

.about-heading {
  font-family: var(--font-display);
  font-size: clamp(2.8rem, 5.5vw, 5.5rem);
  font-weight: 300;
  line-height: 1.08;
  color: var(--text);
  margin-bottom: 2rem;
}

.about-heading em {
  font-style: italic;
  color: var(--accent);
}

.about-bio {
  font-size: clamp(0.95rem, 1.5vw, 1.05rem);
  line-height: 1.9;
  color: var(--text-mid);
  margin-bottom: 3.5rem;
}

.about-stats {
  display: flex;
  gap: clamp(2rem, 5vw, 4rem);
}

.stat {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.stat-value {
  font-family: var(--font-display);
  font-size: clamp(2rem, 4vw, 3.5rem);
  font-weight: 300;
  color: var(--accent);
  line-height: 1;
}

.stat-label {
  font-size: 0.65rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--text-muted);
}

/* Visual */
.about-visual {
  position: relative;
  height: 480px;
}

.visual-number {
  font-family: var(--font-display);
  font-size: clamp(10rem, 22vw, 22rem);
  font-weight: 300;
  color: var(--surface-2);
  position: absolute;
  right: -20px;
  bottom: -20px;
  line-height: 1;
  user-select: none;
  pointer-events: none;
  letter-spacing: -0.05em;
}

.visual-frame {
  position: absolute;
  inset: 20px;
  border: 1px solid var(--border);
}

.frame-dot {
  position: absolute;
  width: 6px;
  height: 6px;
  background: var(--accent);
  border-radius: 50%;
}
.frame-dot.top-left { top: -3px; left: -3px; }
.frame-dot.top-right { top: -3px; right: -3px; }
.frame-dot.bottom-left { bottom: -3px; left: -3px; }
.frame-dot.bottom-right { bottom: -3px; right: -3px; }

.frame-lines {
  position: absolute;
  inset: 30px;
  display: flex;
  gap: 16px;
  align-items: stretch;
  opacity: 0.12;
}

.fline {
  flex: 1;
  background: linear-gradient(to bottom, transparent, var(--accent), transparent);
  animation: shimmer calc(2.5s + var(--i, 0) * 0.4s) ease-in-out infinite;
  animation-delay: calc(var(--i, 0) * 0.25s);
}

.fline:nth-child(1) { --i: 0; }
.fline:nth-child(2) { --i: 1; }
.fline:nth-child(3) { --i: 2; }
.fline:nth-child(4) { --i: 3; }
.fline:nth-child(5) { --i: 4; }

@keyframes shimmer {
  0%, 100% { opacity: 0.25; }
  50% { opacity: 1; }
}

/* Mobile */
@media (max-width: 768px) {
  .about-grid { grid-template-columns: 1fr; }
  .about-visual { display: none; }
  .about-stats { gap: 2rem; flex-wrap: wrap; }
}
</style>
