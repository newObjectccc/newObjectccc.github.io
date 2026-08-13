<template>
  <div class="app">
    <!-- Custom cursor -->
    <div class="cursor-ring" ref="cursorRingRef" :class="{ 'is-hover': cursorHover }"></div>
    <div class="cursor-dot" ref="cursorDotRef"></div>

    <NavBar />
    <HeroSection />
    <AboutSection />
    <ProjectsSection />
    <SkillsSection />
    <ContactSection />
    <BlogCta />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import NavBar from './components/NavBar.vue'
import HeroSection from './components/HeroSection.vue'
import AboutSection from './components/AboutSection.vue'
import ProjectsSection from './components/ProjectsSection.vue'
import SkillsSection from './components/SkillsSection.vue'
import ContactSection from './components/ContactSection.vue'
import BlogCta from './components/BlogCta.vue'

const cursorDotRef = ref(null)
const cursorRingRef = ref(null)
const cursorHover = ref(false)
let lenis = null
let rafId = null

onMounted(() => {
  // Lenis smooth scroll (desktop only)
  if (window.innerWidth > 768) {
    lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    })
    lenis.on('scroll', ScrollTrigger.update)
    gsap.ticker.add((time) => lenis.raf(time * 1000))
    gsap.ticker.lagSmoothing(0)
  }

  // Custom cursor (desktop only)
  if (window.matchMedia('(pointer: fine)').matches) {
    const dot = cursorDotRef.value
    const ring = cursorRingRef.value
    let mx = -100, my = -100

    const onMove = (e) => {
      mx = e.clientX
      my = e.clientY
      gsap.to(dot, { x: mx, y: my, duration: 0.05, overwrite: 'auto' })
      gsap.to(ring, { x: mx, y: my, duration: 0.18, overwrite: 'auto' })
    }

    const onEnter = () => { cursorHover.value = true }
    const onLeave = () => { cursorHover.value = false }

    window.addEventListener('mousemove', onMove)
    document.querySelectorAll('a, button, [data-cursor]').forEach((el) => {
      el.addEventListener('mouseenter', onEnter)
      el.addEventListener('mouseleave', onLeave)
    })
  }
})

onUnmounted(() => {
  if (lenis) lenis.destroy()
  if (rafId) cancelAnimationFrame(rafId)
})
</script>

<style scoped>
.app {
  min-height: 100vh;
  overflow-x: hidden;
}
</style>
