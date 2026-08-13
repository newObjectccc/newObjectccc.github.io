<template>
  <Transition name="modal">
    <div class="modal-overlay" @click.self="$emit('close')" ref="overlayRef">
      <div class="modal-panel" ref="panelRef">

        <!-- Close -->
        <button class="modal-close" @click="$emit('close')" aria-label="关闭">
          <span></span><span></span>
        </button>

        <!-- Left: Info -->
        <div class="modal-left" ref="leftRef">
          <div class="modal-number">{{ project.id }}</div>

          <div class="modal-meta">
            <div class="modal-name-en">{{ project.nameEn }}</div>
            <h2 class="modal-name">{{ project.name }}</h2>
          </div>

          <p class="modal-desc">{{ project.fullDesc }}</p>

          <!-- Features -->
          <div class="modal-features">
            <div class="features-label">Features</div>
            <ul class="features-list">
              <li v-for="f in project.features" :key="f">{{ f }}</li>
            </ul>
          </div>

          <!-- Tags -->
          <div class="modal-tags">
            <span class="tag" v-for="tag in project.tags" :key="tag">{{ tag }}</span>
          </div>

          <!-- Links -->
          <div class="modal-links">
            <a
              v-for="link in project.links"
              :key="link.label"
              :href="link.url"
              target="_blank"
              rel="noopener"
              :class="['modal-link', { primary: link.primary }]"
            >
              <span>{{ link.label }}</span>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M2 12L12 2M12 2H5M12 2V9" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>
              </svg>
            </a>
          </div>
        </div>

        <!-- Right: Images -->
        <div class="modal-right" ref="rightRef">
          <div class="gallery" v-if="project.images && project.images.length">
            <div class="gallery-main" @click="cycleImage">
              <img
                :key="currentImage"
                :src="project.images[currentIndex]"
                :alt="project.name"
                class="gallery-img"
                @error="handleImgError"
              />
              <div class="gallery-hint" v-if="project.images.length > 1">
                点击切换 · {{ currentIndex + 1 }} / {{ project.images.length }}
              </div>
            </div>

            <!-- Thumbnails -->
            <div class="gallery-thumbs" v-if="project.images.length > 1">
              <button
                v-for="(img, i) in project.images"
                :key="i"
                class="thumb"
                :class="{ active: i === currentIndex }"
                @click="currentIndex = i"
              >
                <img :src="img" :alt="`${project.name} screenshot ${i + 1}`" @error="handleImgError" />
              </button>
            </div>

            <!-- No image fallback -->
            <div v-if="!project.images.length" class="gallery-empty">
              <span>{{ project.nameEn }}</span>
            </div>
          </div>

          <!-- Color block if no valid image -->
          <div
            class="gallery-placeholder"
            v-else
            :style="{ background: `linear-gradient(135deg, ${project.color || '#1a1a2a'} 0%, #0e0e14 100%)` }"
          >
            <span class="placeholder-text">{{ project.nameEn }}</span>
          </div>
        </div>

      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { gsap } from 'gsap'

const props = defineProps({
  project: { type: Object, required: true },
})
const emit = defineEmits(['close'])

const overlayRef = ref(null)
const panelRef = ref(null)
const leftRef = ref(null)
const rightRef = ref(null)
const currentIndex = ref(0)

const currentImage = computed(() => props.project.images?.[currentIndex.value])

const cycleImage = () => {
  if (!props.project.images?.length) return
  currentIndex.value = (currentIndex.value + 1) % props.project.images.length
}

const handleImgError = (e) => {
  e.target.style.display = 'none'
}

const onKeyDown = (e) => {
  if (e.key === 'Escape') emit('close')
  if (e.key === 'ArrowRight') cycleImage()
  if (e.key === 'ArrowLeft') {
    currentIndex.value = (currentIndex.value - 1 + props.project.images.length) % props.project.images.length
  }
}

onMounted(() => {
  document.body.style.overflow = 'hidden'
  window.addEventListener('keydown', onKeyDown)

  // GSAP entry animation
  const tl = gsap.timeline()
  tl.from(panelRef.value, { y: 40, opacity: 0, scale: 0.97, duration: 0.5, ease: 'power4.out' })
    .from(leftRef.value.children, { y: 20, opacity: 0, stagger: 0.06, duration: 0.5, ease: 'power3.out' }, '-=0.3')
    .from(rightRef.value, { x: 30, opacity: 0, duration: 0.5, ease: 'power3.out' }, '-=0.4')
})

onUnmounted(() => {
  document.body.style.overflow = ''
  window.removeEventListener('keydown', onKeyDown)
})
</script>

<style scoped>
/* Overlay */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(4, 4, 8, 0.92);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  z-index: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: clamp(16px, 3vw, 40px);
}

/* Panel */
.modal-panel {
  position: relative;
  width: 100%;
  max-width: 1100px;
  max-height: 88vh;
  background: var(--surface);
  border: 1px solid var(--border-accent);
  display: grid;
  grid-template-columns: 2fr 3fr;
  overflow: hidden;
  box-shadow: 0 40px 120px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(184, 148, 74, 0.06);
}

/* Close button */
.modal-close {
  position: absolute;
  top: 20px;
  right: 20px;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  border: 1px solid var(--border);
  background: transparent;
  cursor: pointer;
  transition: border-color 0.3s, background 0.3s;
}
.modal-close:hover { border-color: var(--accent); background: var(--accent-dim); }

.modal-close span {
  position: absolute;
  width: 16px;
  height: 1px;
  background: var(--text-mid);
  transition: background 0.3s;
}
.modal-close span:first-child { transform: rotate(45deg); }
.modal-close span:last-child { transform: rotate(-45deg); }
.modal-close:hover span { background: var(--accent); }

/* Left side */
.modal-left {
  padding: clamp(2rem, 4vw, 3.5rem);
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  border-right: 1px solid var(--border);
}

.modal-number {
  font-family: var(--font-display);
  font-size: clamp(3rem, 6vw, 5rem);
  font-weight: 300;
  color: var(--surface-2);
  line-height: 1;
}

.modal-meta { display: flex; flex-direction: column; gap: 4px; }

.modal-name-en {
  font-size: 0.62rem;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--accent);
  opacity: 0.8;
}

.modal-name {
  font-family: var(--font-display);
  font-size: clamp(1.8rem, 3.5vw, 3rem);
  font-weight: 300;
  color: var(--text);
  line-height: 1.1;
}

.modal-desc {
  font-size: 0.9rem;
  line-height: 1.8;
  color: var(--text-mid);
}

/* Features */
.modal-features { display: flex; flex-direction: column; gap: 10px; }

.features-label {
  font-size: 0.62rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--text-muted);
}

.features-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.features-list li {
  font-size: 0.85rem;
  color: var(--text-mid);
  padding-left: 16px;
  position: relative;
}
.features-list li::before {
  content: '·';
  position: absolute;
  left: 0;
  color: var(--accent);
}

/* Tags */
.modal-tags { display: flex; gap: 0.5rem; flex-wrap: wrap; }

.tag {
  font-size: 0.6rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--text-muted);
  border: 1px solid var(--border);
  padding: 4px 10px;
}

/* Links */
.modal-links {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-top: auto;
  padding-top: 1.5rem;
  border-top: 1px solid var(--border);
}

.modal-link {
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 12px 20px;
  font-size: 0.82rem;
  font-weight: 400;
  letter-spacing: 0.06em;
  border: 1px solid var(--border);
  color: var(--text-mid);
  transition: all 0.3s var(--ease-expo);
}

.modal-link:hover {
  border-color: var(--border-accent);
  color: var(--text);
  transform: translateX(4px);
}

.modal-link.primary {
  background: var(--accent);
  border-color: var(--accent);
  color: var(--bg);
}

.modal-link.primary:hover {
  filter: brightness(1.1);
  transform: translateX(4px);
}

/* Right side - Gallery */
.modal-right {
  display: flex;
  flex-direction: column;
  background: var(--bg);
  overflow: hidden;
}

.gallery {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}

.gallery-main {
  flex: 1;
  position: relative;
  overflow: hidden;
  cursor: pointer;
  min-height: 0;
}

.gallery-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: top;
  display: block;
  transition: transform 0.6s var(--ease-expo);
}
.gallery-main:hover .gallery-img { transform: scale(1.02); }

.gallery-hint {
  position: absolute;
  bottom: 12px;
  right: 16px;
  font-size: 0.62rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--text-mid);
  background: rgba(8, 8, 12, 0.7);
  padding: 4px 10px;
  backdrop-filter: blur(4px);
}

/* Thumbnails */
.gallery-thumbs {
  display: flex;
  gap: 2px;
  padding: 8px;
  background: var(--surface);
  overflow-x: auto;
  flex-shrink: 0;
}

.thumb {
  width: 56px;
  height: 40px;
  flex-shrink: 0;
  overflow: hidden;
  border: 1.5px solid transparent;
  cursor: pointer;
  opacity: 0.5;
  transition: all 0.25s;
  background: none;
  padding: 0;
}

.thumb.active, .thumb:hover { opacity: 1; border-color: var(--accent); }

.thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

/* Placeholder */
.gallery-placeholder {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.placeholder-text {
  font-family: var(--font-display);
  font-size: clamp(3rem, 8vw, 8rem);
  font-weight: 300;
  color: rgba(255,255,255,0.05);
  letter-spacing: -0.03em;
  user-select: none;
}

/* Transition */
.modal-enter-active { transition: opacity 0.3s ease; }
.modal-leave-active { transition: opacity 0.25s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; }

/* Mobile */
@media (max-width: 768px) {
  .modal-panel {
    grid-template-columns: 1fr;
    grid-template-rows: auto 1fr;
    max-height: 92vh;
  }
  .modal-left { border-right: none; border-bottom: 1px solid var(--border); overflow-y: visible; }
  .modal-right { min-height: 260px; }
}
</style>
