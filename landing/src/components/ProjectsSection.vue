<template>
  <section class="projects" id="projects" ref="sectionRef">
    <div class="container">
      <div class="section-label" ref="labelRef">02 · Selected Work</div>

      <div class="projects-header" ref="headerRef">
        <h2 class="projects-heading">Things I've<br /><em>built.</em></h2>
        <p class="projects-sub">从想法到上线，独立构建的数字产品。<br /><span class="projects-note">均为个人独立开发，不含职业工作项目。</span></p>
      </div>

      <div class="projects-grid" ref="gridRef">
        <div
          v-for="(project, i) in projects"
          :key="project.id"
          class="project-card"
          :ref="el => { if (el) cardRefs[i] = el }"
          @click="openProject(project)"
          @mousemove="(e) => tiltCard(e, i)"
          @mouseleave="resetCard(i)"
          tabindex="0"
          @keydown.enter="openProject(project)"
          role="button"
        >
          <div class="card-number">{{ project.id }}</div>
          <div class="card-body">
            <div class="card-name-en">{{ project.nameEn }}</div>
            <h3 class="card-name">{{ project.name }}</h3>
            <p class="card-desc">{{ project.desc }}</p>
          </div>
          <div class="card-footer">
            <div class="card-tags">
              <span class="tag" v-for="tag in project.tags.slice(0, 3)" :key="tag">{{ tag }}</span>
            </div>
            <span class="card-arrow">→</span>
          </div>
          <div class="card-glow" aria-hidden="true"></div>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <Teleport to="body">
      <ProjectModal
        v-if="activeProject"
        :project="activeProject"
        @close="activeProject = null"
      />
    </Teleport>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import ProjectModal from './ProjectModal.vue'

const sectionRef = ref(null)
const labelRef = ref(null)
const headerRef = ref(null)
const gridRef = ref(null)
const cardRefs = ref([])
const activeProject = ref(null)

const projects = [
  {
    id: '01', name: '择野少年', nameEn: 'QYQM',
    desc: 'AI 驱动的青少年教育 SaaS 平台',
    fullDesc: '涵盖 AI 工具矩阵、研学活动、测评体系，帮助青少年探索自然与自我。',
    tags: ['全栈', 'Next.js 15', 'TypeScript', 'PostgreSQL', 'AI'],
    features: ['AI 工具矩阵', '研学活动管理', '测评档案系统', '会员权益体系', '知识胶囊', 'Admin 后台', '微信生态集成', 'PWA 支持'],
    links: [
      { label: 'H5 在线体验', url: 'https://qyqmedu.com', primary: true },
      { label: 'Admin 后台', url: 'https://admin.qyqmedu.com' },
    ],
    images: ['/qyqm.png', '/qyqm-events.png', '/qyqm-tools.png', '/qyqm-assessments.png', '/qyqm-ai-solver.png', '/qyqm-english.png', '/qyqm-quiz.png', '/qyqm-capsules.png'],
    color: '#2a4a3e',
  },
  {
    id: '02', name: '成师', nameEn: 'CHENGSHI',
    desc: 'TTT 学员打卡分享社区 PWA',
    fullDesc: '类 Twitter 移动端社交应用，支持话题打卡、信息流浏览、社交互动与排行榜。',
    tags: ['全栈', 'Next.js 15', 'TypeScript', 'Tailwind CSS v4'],
    features: ['信息流', '话题打卡', '社交互动', '排行榜', 'PWA 离线', 'shadcn/ui'],
    links: [
      { label: '在线体验', url: 'https://chengshi.qyqmedu.com', primary: true },
    ],
    images: ['/chengshi.png', '/chengshi-leaderboard.png'],
    color: '#3a2a1e',
  },
  {
    id: '03', name: 'BeautyCode', nameEn: 'BEAUTYCODE',
    desc: 'VS Code 代码截图美化插件',
    fullDesc: '在 VS Code 中一键生成精美代码截图，支持多主题、多语言语法高亮，完全免费。',
    tags: ['开源', 'VS Code', 'TypeScript'],
    features: ['多种精美主题', '多语言高亮', '自定义背景', '零配置使用', '完全免费'],
    links: [
      { label: 'VS Marketplace', url: 'https://marketplace.visualstudio.com/items?itemName=Vesper.beautycode', primary: true },
      { label: 'GitHub', url: 'https://github.com/newObjectccc/beautyCode' },
    ],
    images: ['/beautycode.png'],
    color: '#1e2a3a',
  },
  {
    id: '04', name: 'Aix Extools', nameEn: 'AIX',
    desc: '简单优雅的 AI 浏览器扩展工具集',
    fullDesc: '不止是翻译软件，是一个 AI 工具集！集成翻译、摘要、场景化 AI 能力，运行在浏览器扩展上。',
    tags: ['开源', 'Chrome Extension', 'AI'],
    features: ['完全免费', '快速响应', '基于场景', 'AI 工具集', '翻译摘要'],
    links: [
      { label: 'Chrome 商店下载', url: 'https://chromewebstore.google.com/detail/aix-extools/folndjfdlidgbjgmlainjmoodlfggoog', primary: true },
    ],
    images: ['/aix.png'],
    color: '#2a1e3a',
  },
  {
    id: '05', name: 'Vtabs', nameEn: 'VTABS',
    desc: '垂直标签页 Chrome 扩展',
    fullDesc: '以垂直侧边栏方式管理 Chrome 浏览器标签页，支持拖拽排序、平滑动画，提升多标签效率。',
    tags: ['开源', 'Chrome Extension', 'Vue'],
    features: ['可拖拽排序', '平滑动画', '清晰界面', 'SidePanel', '完全免费'],
    links: [
      { label: 'Chrome 商店下载', url: 'https://chromewebstore.google.com/detail/vtabs/ldjlkpemhoddnoedhbebgdncegooejim', primary: true },
      { label: 'GitHub', url: 'https://github.com/newObjectccc/vtabs' },
    ],
    images: ['/vtabs.png'],
    color: '#1e3a2a',
  },
  {
    id: '06', name: 'Buildp', nameEn: 'BUILDP',
    desc: '一键前端项目工程化配置工具',
    fullDesc: '命令行工具，自动化初始化 Eslint、Commitlint、Prettier、Changelog 等前端工程化规范，一命令搞定。',
    tags: ['开源', 'CLI', 'Node.js'],
    features: ['Eslint 预设', 'Commitlint 预设', 'Prettier 预设', 'Changelog 集成', 'Lint-staged', '一键执行'],
    links: [
      { label: 'npm 安装', url: 'https://www.npmjs.com/package/buildp', primary: true },
      { label: 'GitHub', url: 'https://github.com/newObjectccc/bup' },
    ],
    images: ['/buildp.png'],
    color: '#3a3a1e',
  },
  {
    id: '07', name: 'Video2Gif', nameEn: 'V2G',
    desc: '浏览器端视频转 GIF 工具',
    fullDesc: '纯浏览器运行，无需上传服务器，支持自定义尺寸、帧率与帧间隔，完全免费。',
    tags: ['开源', 'Web App', 'WASM'],
    features: ['纯浏览器运行', '自定义尺寸', '自定义帧率', '自定义帧间隔', '完全免费'],
    links: [
      { label: 'App 页面', url: 'https://vtog.vesper.host', primary: true },
      { label: 'GitHub', url: 'https://github.com/newObjectccc/video_to_gif' },
    ],
    images: ['/vtog.gif'],
    color: '#1e2e3a',
  },
]

const openProject = (project) => {
  activeProject.value = project
}

const tiltCard = (e, idx) => {
  if (window.innerWidth <= 768) return
  const card = cardRefs.value[idx]
  if (!card) return
  const rect = card.getBoundingClientRect()
  const x = (e.clientX - rect.left) / rect.width - 0.5
  const y = (e.clientY - rect.top) / rect.height - 0.5
  gsap.to(card, { rotateX: -y * 6, rotateY: x * 6, transformPerspective: 800, duration: 0.5, ease: 'power2.out', overwrite: 'auto' })
  const glow = card.querySelector('.card-glow')
  if (glow) { glow.style.left = `${(x + 0.5) * 100}%`; glow.style.top = `${(y + 0.5) * 100}%` }
}

const resetCard = (idx) => {
  const card = cardRefs.value[idx]
  if (!card) return
  gsap.to(card, { rotateX: 0, rotateY: 0, duration: 0.9, ease: 'elastic.out(1, 0.45)', overwrite: 'auto' })
}

onMounted(() => {
  const section = sectionRef.value
  gsap.from(labelRef.value, { y: 14, opacity: 0, duration: 0.7, ease: 'power3.out', scrollTrigger: { trigger: section, start: 'top 75%' } })
  gsap.from(headerRef.value, { y: 40, opacity: 0, duration: 0.9, ease: 'power3.out', scrollTrigger: { trigger: section, start: 'top 70%' } })
  gsap.from(gridRef.value.querySelectorAll('.project-card'), {
    y: 60, opacity: 0, stagger: 0.08, duration: 0.8, ease: 'power3.out',
    scrollTrigger: { trigger: gridRef.value, start: 'top 80%' },
  })
})
</script>

<style scoped>
.projects {
  padding: clamp(100px, 16vh, 180px) 0;
  overflow: hidden;
}

.projects-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin-bottom: clamp(3rem, 6vw, 5rem);
  gap: 2rem;
  flex-wrap: wrap;
}

.projects-heading {
  font-family: var(--font-display);
  font-size: clamp(2.5rem, 5vw, 5rem);
  font-weight: 300;
  line-height: 1.1;
  color: var(--text);
}

.projects-heading em { font-style: italic; color: var(--accent); }
.projects-sub { font-size: 0.9rem; color: var(--text-muted); max-width: 240px; text-align: right; letter-spacing: 0.04em; }
.projects-note { font-size: 0.75rem; opacity: 0.6; }

/* Grid */
.projects-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5px;
}

/* Card */
.project-card {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  padding: clamp(1.25rem, 2.5vw, 2rem);
  background: var(--surface);
  border: 1px solid var(--border);
  transform-style: preserve-3d;
  transition: border-color 0.4s, background 0.4s;
  overflow: hidden;
  cursor: pointer;
}

.project-card:hover {
  background: var(--surface-2);
  border-color: var(--border-accent);
}

.card-glow {
  position: absolute;
  width: 180px; height: 180px;
  background: radial-gradient(circle, var(--accent-glow) 0%, transparent 70%);
  transform: translate(-50%, -50%);
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.3s;
  border-radius: 50%;
}
.project-card:hover .card-glow { opacity: 1; }

.card-number {
  font-family: var(--font-display);
  font-size: clamp(2.5rem, 4vw, 4rem);
  font-weight: 300;
  color: var(--surface-2);
  line-height: 1;
  transition: color 0.4s;
}
.project-card:hover .card-number { color: var(--accent-dim); }

.card-name-en {
  font-size: 0.58rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--accent);
  margin-bottom: 0.3rem;
  opacity: 0.7;
}

.card-name {
  font-family: var(--font-display);
  font-size: clamp(1.2rem, 2vw, 1.7rem);
  font-weight: 400;
  color: var(--text);
  line-height: 1.1;
  margin-bottom: 0.6rem;
}

.card-desc {
  font-size: 0.82rem;
  line-height: 1.65;
  color: var(--text-mid);
}

.card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: auto;
  padding-top: 1rem;
  border-top: 1px solid var(--border);
}

.card-tags { display: flex; gap: 0.4rem; flex-wrap: wrap; }

.tag {
  font-size: 0.58rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--text-muted);
  border: 1px solid var(--border);
  padding: 3px 7px;
  border-radius: 1px;
  transition: border-color 0.3s, color 0.3s;
}
.project-card:hover .tag { border-color: var(--border-accent); color: var(--text-mid); }

.card-arrow {
  font-size: 1rem;
  color: var(--text-muted);
  transition: color 0.3s, transform 0.4s var(--ease-expo);
  flex-shrink: 0;
}
.project-card:hover .card-arrow { color: var(--accent); transform: translateX(4px); }

/* Responsive */
@media (max-width: 1200px) { .projects-grid { grid-template-columns: repeat(3, 1fr); } }
@media (max-width: 900px) { .projects-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 540px) {
  .projects-grid { grid-template-columns: 1fr; }
  .projects-sub { text-align: left; }
  .projects-header { flex-direction: column; align-items: flex-start; }
}
</style>
