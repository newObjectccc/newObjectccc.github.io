<template>
  <nav class="nav" :class="{ scrolled: isScrolled }" ref="navRef">
    <div class="nav-inner container">
      <a href="/" class="nav-logo">V.</a>
      <div class="nav-links">
        <a href="#about" @click.prevent="scrollTo('#about')">About</a>
        <a href="#projects" @click.prevent="scrollTo('#projects')">Work</a>
        <a href="#skills" @click.prevent="scrollTo('#skills')">Stack</a>
        <a href="#contact" @click.prevent="scrollTo('#contact')">Contact</a>
        <a href="/main.html" class="nav-blog">
          <span>Blog</span>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M2 10L10 2M10 2H4M10 2V8" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>
          </svg>
        </a>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const isScrolled = ref(false)
const navRef = ref(null)

const scrollTo = (selector) => {
  const el = document.querySelector(selector)
  if (el) el.scrollIntoView({ behavior: 'smooth' })
}

const onScroll = () => {
  isScrolled.value = window.scrollY > 40
}

onMounted(() => window.addEventListener('scroll', onScroll, { passive: true }))
onUnmounted(() => window.removeEventListener('scroll', onScroll))
</script>

<style scoped>
.nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  padding: 24px 0;
  transition: padding 0.4s var(--ease-expo), background 0.4s, backdrop-filter 0.4s;
}

.nav.scrolled {
  padding: 16px 0;
  background: rgba(8, 8, 12, 0.8);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--border);
}

.nav-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.nav-logo {
  font-family: var(--font-display);
  font-size: 1.8rem;
  font-weight: 400;
  color: var(--text);
  letter-spacing: -0.02em;
  line-height: 1;
  transition: color 0.3s;
}

.nav-logo:hover { color: var(--accent); }

.nav-links {
  display: flex;
  align-items: center;
  gap: 2.5rem;
}

.nav-links a {
  font-size: 0.78rem;
  font-weight: 400;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--text-mid);
  transition: color 0.3s;
}

.nav-links a:hover { color: var(--text); }

.nav-blog {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: var(--accent) !important;
  border: 1px solid var(--border-accent);
  padding: 8px 16px;
  border-radius: 2px;
  transition: all 0.3s var(--ease-expo) !important;
}

.nav-blog:hover {
  background: var(--accent-dim) !important;
  color: var(--accent) !important;
  transform: translateY(-1px);
}

@media (max-width: 768px) {
  .nav-links {
    gap: 1.5rem;
  }
  .nav-links a:not(.nav-blog):not(:last-child):not(:nth-last-child(2)) {
    display: none;
  }
}

@media (max-width: 480px) {
  .nav-links a:not(.nav-blog) {
    display: none;
  }
}
</style>
