<template>
  <section class="blog-cta" ref="sectionRef">
    <a href="/main.html" class="cta-inner" data-cursor>
      <div class="cta-bg" aria-hidden="true"></div>
      <div class="container cta-content">
        <div class="cta-left">
          <span class="cta-label">文章 · 开源实践 · 技术分享</span>
          <h2 class="cta-heading" ref="headingRef">
            Read My<br /><em>Writing</em>
          </h2>
        </div>
        <div class="cta-right" ref="arrowRef">
          <div class="cta-arrow-wrap">
            <svg class="cta-arrow" viewBox="0 0 80 80" fill="none">
              <circle cx="40" cy="40" r="39" stroke="currentColor" stroke-width="1"/>
              <path d="M26 40h28M40 28l14 12-14 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <span class="cta-count">{{ articleCount }}+ articles</span>
        </div>
      </div>
    </a>

    <!-- Footer -->
    <footer class="site-footer container">
      <span class="footer-copy">© {{ year }} Vesper. Built with VitePress + Vue.</span>
      <div class="footer-links">
        <a href="https://github.com/newObjectccc/newObjectccc.github.io" target="_blank" rel="noopener">Source</a>
        <a href="/main.html">Blog</a>
      </div>
    </footer>
  </section>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { gsap } from 'gsap'

const sectionRef = ref(null)
const headingRef = ref(null)
const arrowRef = ref(null)

const year = computed(() => new Date().getFullYear())
const articleCount = 20

onMounted(() => {
  const section = sectionRef.value

  gsap.from(headingRef.value, {
    y: 50,
    opacity: 0,
    duration: 1.0,
    ease: 'power3.out',
    scrollTrigger: { trigger: section, start: 'top 75%' },
  })

  gsap.from(arrowRef.value, {
    x: 40,
    opacity: 0,
    duration: 0.9,
    ease: 'power3.out',
    scrollTrigger: { trigger: section, start: 'top 70%' },
  })

  // Arrow rotation on hover
  const cta = section.querySelector('.cta-inner')
  const arrow = section.querySelector('.cta-arrow')

  cta.addEventListener('mouseenter', () => {
    gsap.to(arrow, { rotate: 45, duration: 0.5, ease: 'power3.out' })
  })
  cta.addEventListener('mouseleave', () => {
    gsap.to(arrow, { rotate: 0, duration: 0.6, ease: 'elastic.out(1, 0.5)' })
  })
})
</script>

<style scoped>
.blog-cta {
  overflow: hidden;
}

.cta-inner {
  display: block;
  position: relative;
  padding: clamp(80px, 12vh, 140px) 0;
  border-top: 1px solid var(--border);
  overflow: hidden;
  transition: background 0.5s;
}

.cta-bg {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, var(--surface) 0%, transparent 60%);
  opacity: 0;
  transition: opacity 0.5s var(--ease-expo);
}

.cta-inner:hover .cta-bg {
  opacity: 1;
}

.cta-content {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 3rem;
}

.cta-left {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.cta-label {
  font-size: 0.68rem;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--accent);
  opacity: 0.8;
}

.cta-heading {
  font-family: var(--font-display);
  font-size: clamp(3.5rem, 8vw, 10rem);
  font-weight: 300;
  color: var(--text);
  line-height: 0.95;
  letter-spacing: -0.03em;
}

.cta-heading em {
  font-style: italic;
  color: var(--accent);
}

/* Arrow */
.cta-right {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  flex-shrink: 0;
}

.cta-arrow-wrap {
  width: clamp(70px, 10vw, 100px);
  height: clamp(70px, 10vw, 100px);
  color: var(--text-mid);
  transition: color 0.4s;
}

.cta-inner:hover .cta-arrow-wrap {
  color: var(--accent);
}

.cta-arrow {
  width: 100%;
  height: 100%;
}

.cta-count {
  font-size: 0.68rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--text-muted);
}

/* Footer */
.site-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 2rem;
  padding-bottom: 3rem;
  border-top: 1px solid var(--border);
  gap: 1rem;
  flex-wrap: wrap;
}

.footer-copy {
  font-size: 0.72rem;
  color: var(--text-muted);
  letter-spacing: 0.06em;
}

.footer-links {
  display: flex;
  gap: 2rem;
}

.footer-links a {
  font-size: 0.72rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--text-muted);
  transition: color 0.3s;
}

.footer-links a:hover {
  color: var(--text);
}

/* Mobile */
@media (max-width: 640px) {
  .cta-content { flex-direction: column; align-items: flex-start; }
}
</style>
