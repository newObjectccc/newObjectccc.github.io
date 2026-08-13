<template>
  <section class="contact" id="contact" ref="sectionRef">
    <div class="container">
      <div class="section-label" ref="labelRef">04 · Get In Touch</div>

      <div class="contact-heading" ref="headingRef">
        <h2>
          <span class="line-wrap"><span class="line">Let's build</span></span>
          <span class="line-wrap"><span class="line">something</span></span>
          <span class="line-wrap accent"><span class="line">great.</span></span>
        </h2>
      </div>

      <p class="contact-sub" ref="subRef">
        有想法？合作项目？或者只是聊聊技术 — 都欢迎联系我。
      </p>

      <div class="contact-links" ref="linksRef">
        <a
          v-for="s in socials"
          :key="s.name"
          :href="s.url"
          :target="s.external ? '_blank' : undefined"
          :rel="s.external ? 'noopener' : undefined"
          class="social-link"
          :ref="el => { if (el) socialRefs.push(el) }"
          data-cursor
        >
          <span class="social-icon" v-html="s.icon"></span>
          <span class="social-name">{{ s.name }}</span>
          <span class="social-arrow">↗</span>
        </a>
      </div>

      <div class="contact-cta" ref="ctaRef">
        <a href="mailto:newobjectccc@gmail.com" class="email-btn">
          <span>newobjectccc@gmail.com</span>
          <span class="btn-underline"></span>
        </a>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { gsap } from 'gsap'

const sectionRef = ref(null)
const labelRef = ref(null)
const headingRef = ref(null)
const subRef = ref(null)
const linksRef = ref(null)
const ctaRef = ref(null)
const socialRefs = ref([])

const socials = [
  {
    name: 'GitHub',
    url: 'https://github.com/newObjectccc',
    external: true,
    icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg>',
  },
  {
    name: 'Twitter / X',
    url: 'https://twitter.com/cccxy10086',
    external: true,
    icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>',
  },
  {
    name: 'Blog & Writing',
    url: '/main.html',
    external: false,
    icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M4 4h16v16H4zM8 8h8M8 12h8M8 16h5" stroke-linecap="round"/></svg>',
  },
]

onMounted(() => {
  const section = sectionRef.value

  const tl = gsap.timeline({
    scrollTrigger: { trigger: section, start: 'top 68%' },
  })

  tl.from(labelRef.value, { y: 14, opacity: 0, duration: 0.7, ease: 'power3.out' })
    .from(headingRef.value.querySelectorAll('.line'), {
      y: '105%',
      stagger: 0.12,
      duration: 1.0,
      ease: 'power4.out',
    }, '-=0.3')
    .from(subRef.value, { y: 20, opacity: 0, duration: 0.7, ease: 'power3.out' }, '-=0.5')
    .from(linksRef.value.querySelectorAll('.social-link'), {
      y: 24, opacity: 0, stagger: 0.1, duration: 0.7, ease: 'power3.out',
    }, '-=0.4')
    .from(ctaRef.value, { y: 20, opacity: 0, duration: 0.7, ease: 'power3.out' }, '-=0.3')

  // Magnetic effect on social links (desktop only)
  if (window.innerWidth > 768) {
    const onMouseMove = (e) => {
      socialRefs.value.forEach((link) => {
        if (!link) return
        const rect = link.getBoundingClientRect()
        const cx = rect.left + rect.width / 2
        const cy = rect.top + rect.height / 2
        const dx = e.clientX - cx
        const dy = e.clientY - cy
        const dist = Math.sqrt(dx * dx + dy * dy)
        const maxDist = 90

        if (dist < maxDist) {
          const factor = (1 - dist / maxDist) * 0.45
          gsap.to(link, { x: dx * factor, y: dy * factor, duration: 0.3, ease: 'power2.out' })
        } else {
          gsap.to(link, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.4)' })
        }
      })
    }

    window.addEventListener('mousemove', onMouseMove)
    onUnmounted(() => window.removeEventListener('mousemove', onMouseMove))
  }
})
</script>

<style scoped>
.contact {
  padding: clamp(100px, 16vh, 180px) 0;
  overflow: hidden;
}

.contact-heading {
  margin-bottom: 2rem;
}

.contact-heading h2 {
  font-family: var(--font-display);
  font-size: clamp(3.5rem, 8vw, 9rem);
  font-weight: 300;
  line-height: 1.0;
  color: var(--text);
}

.line-wrap {
  display: block;
  overflow: hidden;
  line-height: 1.1;
  padding-bottom: 0.05em;
}

.line-wrap.accent .line {
  color: var(--accent);
  font-style: italic;
}

.line {
  display: block;
}

.contact-sub {
  font-size: 1rem;
  color: var(--text-mid);
  line-height: 1.7;
  margin-bottom: 4rem;
  max-width: 480px;
}

/* Social links */
.contact-links {
  display: flex;
  gap: 1.5rem;
  margin-bottom: 4rem;
  flex-wrap: wrap;
}

.social-link {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  padding: 16px 28px;
  background: var(--surface);
  border: 1px solid var(--border);
  color: var(--text-mid);
  transition: all 0.35s var(--ease-expo);
  will-change: transform;
}

.social-link:hover {
  background: var(--surface-2);
  border-color: var(--border-accent);
  color: var(--text);
}

.social-icon {
  display: flex;
  opacity: 0.7;
  transition: opacity 0.3s;
}

.social-link:hover .social-icon {
  opacity: 1;
}

.social-name {
  font-size: 0.82rem;
  font-weight: 400;
  letter-spacing: 0.06em;
}

.social-arrow {
  font-size: 0.9rem;
  color: var(--text-muted);
  transition: color 0.3s, transform 0.4s var(--ease-expo);
  margin-left: 4px;
}

.social-link:hover .social-arrow {
  color: var(--accent);
  transform: translate(2px, -2px);
}

/* Email CTA */
.email-btn {
  position: relative;
  display: inline-block;
  font-family: var(--font-display);
  font-size: clamp(1.5rem, 3.5vw, 3rem);
  font-weight: 300;
  color: var(--text);
  letter-spacing: -0.01em;
  padding-bottom: 4px;
  transition: color 0.3s;
}

.email-btn:hover {
  color: var(--accent);
}

.btn-underline {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: var(--accent);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.4s var(--ease-expo);
}

.email-btn:hover .btn-underline {
  transform: scaleX(1);
}

/* Mobile */
@media (max-width: 640px) {
  .contact-links { flex-direction: column; }
  .social-link { justify-content: space-between; }
}
</style>
