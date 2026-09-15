<template>
  <div
    class="portfolio"
    :data-motion="motionPaused ? 'off' : 'on'"
    :class="{ 'has-project-preview': previewReady }"
    :style="previewTheme"
  >
    <a class="skip-link" href="#main">跳到主要内容</a>
    <header class="site-nav" :class="{ 'is-scrolled': scrollProgress > 0.01 }">
      <div class="nav-wrap">
        <a class="wordmark" href="#top" aria-label="Vesper 首页"
          >vesper<span class="brand-asterisk">✳</span></a
        >
        <span class="nav-note"
          >INDEPENDENT MIND.<br />HANDS-ON ENGINEERING.</span
        >
        <button
          class="mobile-toggle"
          :aria-expanded="menuOpen"
          aria-controls="main-nav"
          @click="menuOpen = !menuOpen"
        >
          {{ menuOpen ? "关闭" : "菜单" }}
          <span>{{ menuOpen ? "−" : "+" }}</span>
        </button>
        <nav id="main-nav" aria-label="主导航" :class="{ 'is-open': menuOpen }">
          <a href="#projects" @click="menuOpen = false">作品 <sup>01</sup></a>
          <a href="#experience" @click="menuOpen = false">经历 <sup>02</sup></a>
          <a href="#about" @click="menuOpen = false">关于 <sup>03</sup></a>
          <a href="/main.html">文字 <span>↗</span></a>
        </nav>
        <a class="nav-contact" href="#contact">聊聊想法 <span>↗</span></a>
      </div>
      <span
        class="reading-progress"
        :style="{ transform: `scaleX(${scrollProgress})` }"
        aria-hidden="true"
      ></span>
    </header>

    <main id="main">
      <section id="top" class="hero section-shell">
        <div class="hero-meta">
          <span class="eyebrow">CHEN XINSHUO / 陈鑫铄</span
          ><span class="eyebrow">FULL-STACK · AI AGENT · FDE</span>
        </div>
        <div class="hero-grid">
          <div class="hero-copy">
            <h1 aria-label="Curiosity, made real.">
              <span class="title-mask"
                ><span class="title-line">Curiosity,</span></span
              ><span class="title-mask"
                ><span class="title-line"
                  >made <em>real.</em><span class="title-period">↗</span></span
                ></span
              >
            </h1>
            <div class="hero-description">
              <span class="hero-mark" aria-hidden="true">↳</span>
              <div>
                <p>把好奇心，做成真实可用的产品。</p>
                <p class="muted">
                  我是 Vesper。从精巧的界面，到企业现场的复杂系统，<br
                    class="desktop-break"
                  />在设计、代码与真实需求之间，持续探索。
                </p>
              </div>
            </div>
            <a href="#projects" class="hero-link"
              ><span class="link-disc">↓</span
              ><span
                >看看我做的东西 <small>EXPLORE SELECTED WORK</small></span
              ></a
            >
          </div>
          <KineticRibbon :paused="motionPaused || !!previewProject" />
        </div>
        <div class="hero-bottom">
          <span>独立开发者，也是走进现场的工程师。</span>
          <div>
            <span class="status-dot"></span
            ><span>ALWAYS BUILDING. ALWAYS CURIOUS.</span>
          </div>
          <button
            @click="toggleMotion"
            :aria-pressed="!motionPaused"
            class="motion-toggle"
          >
            {{ motionPaused ? "▷" : "Ⅱ" }} 动效 {{ motionPaused ? "关" : "开" }}
          </button>
        </div>
      </section>

      <section id="projects" class="work-section section-shell">
        <div class="section-topline">
          <span class="eyebrow">01 / SELECTED WORK</span
          ><span class="eyebrow">IDEAS THAT MADE IT OUT INTO THE WORLD</span>
        </div>
        <div class="section-heading" data-reveal>
          <h2>做过的，<br /><span class="serif-word">正在发生的。</span></h2>
          <p>
            一些独立产品，一些商业交付。<br />共同点是，都从一个真实的想法开始。
          </p>
        </div>
        <div class="work-filter" aria-label="筛选项目">
          <button
            v-for="filter in filters"
            :key="filter.id"
            :aria-pressed="activeFilter === filter.id"
            :class="{ active: activeFilter === filter.id }"
            @click="activeFilter = filter.id"
          >
            {{ filter.label }}<sup>{{ filter.count }}</sup></button
          ><span class="filter-note"
            >精选项目 /
            {{ String(filteredProjects.length).padStart(2, "0") }}</span
          >
        </div>
        <TransitionGroup name="work" tag="div" class="work-grid">
          <article
            v-for="project in filteredProjects"
            :key="project.id"
            class="work-card"
            :class="{ 'work-card--featured': project.id === 'wander' }"
            @pointerenter="queuePreview(project, $event)"
            @pointermove="queuePreview(project, $event)"
            @pointerleave="leaveProject(project, $event)"
          >
            <button
              class="cover-button"
              @click="showProjectDetails(project)"
              :aria-label="`查看 ${project.name} 项目详情`"
            >
              <ProjectCover :project="project" /><span class="cover-action"
                >打开项目 <span>↗</span></span
              ><span class="cover-index"
                >{{ project.number }} / {{ project.categoryLabel }}</span
              >
            </button>
            <div class="work-info">
              <div>
                <div class="work-status-line">
                  <span class="work-status">{{ project.status }}</span>
                  <button
                    class="preview-trigger"
                    :aria-label="`预览 ${project.name} 网站`"
                    aria-haspopup="dialog"
                    :aria-expanded="previewProject?.id === project.id"
                    @click="openPreview(project, $event)"
                  >
                    悬停预览 <span>↗</span>
                  </button>
                </div>
                <button class="work-title" @click="showProjectDetails(project)">
                  {{ project.name }}<span>↗</span>
                </button>
                <p>{{ project.subtitle }}</p>
              </div>
              <span class="work-stack">{{
                project.tags.slice(0, 3).join(" / ")
              }}</span>
            </div>
          </article>
        </TransitionGroup>
      </section>

      <section class="tool-section section-shell" aria-labelledby="tool-title">
        <div class="section-topline">
          <span class="eyebrow">THE SMALLER THINGS</span
          ><span class="eyebrow">TOOLS / EXTENSIONS / EXPERIMENTS</span>
        </div>
        <div class="tool-intro" data-reveal>
          <h2 id="tool-title">小工具。<br /><i>也是认真作品。</i></h2>
          <p>有时，一个顺手的小工具，<br />就是对日常最好的回应。</p>
        </div>
        <div class="tool-list">
          <AnimatedDisclosure
            v-for="(tool, index) in tools"
            :key="tool.name"
            class="tool-row"
            :paused="motionPaused"
          >
            <template #summary>
              <span class="tool-index">{{
                String(index + 1).padStart(2, "0")
              }}</span
              ><span class="tool-name">{{ tool.name }}</span
              ><span class="tool-type">{{ tool.type }}</span
              ><span class="tool-status">{{ tool.status }}</span
              ><span
                class="tool-plus disclosure-icon"
                aria-hidden="true"
              ></span>
            </template>
            <div class="tool-expanded">
              <div>
                <p data-disclosure-reveal>{{ tool.description }}</p>
                <span class="tool-tags" data-disclosure-reveal>{{
                  tool.tags.join(" / ")
                }}</span>
                <div class="tool-links" data-disclosure-reveal>
                  <a
                    v-if="tool.live"
                    :href="tool.live"
                    target="_blank"
                    rel="noopener noreferrer"
                    >查看作品 ↗</a
                  ><a
                    v-if="tool.url"
                    :href="tool.url"
                    target="_blank"
                    rel="noopener noreferrer"
                    >源代码 ↗</a
                  >
                </div>
              </div>
              <img
                v-if="tool.image && !tool.image.endsWith('.gif')"
                :src="tool.image"
                :alt="`${tool.name} 项目界面`"
                loading="lazy"
                data-disclosure-reveal
              />
            </div>
          </AnimatedDisclosure>
        </div>
      </section>

      <section id="experience" class="experience-section">
        <div class="section-shell">
          <div class="section-topline">
            <span class="eyebrow">02 / IN THE REAL WORLD</span
            ><span class="eyebrow">2017 — NOW</span>
          </div>
          <div class="experience-layout">
            <div class="experience-heading" data-reveal>
              <h2>从代码，<br />到<span>现场。</span></h2>
              <p>
                做出产品，也把它交到用户手里。<br />从连锁餐饮到工业 SaaS，<br />持续处理真实业务中的复杂问题。
              </p>
              <div class="field-note">
                <span>↳</span>
                <p>目前在韬墨智能，<br />探索全栈、AI Agent 与 FDE 的交汇。</p>
              </div>
            </div>
            <div class="experience-list">
              <AnimatedDisclosure
                v-for="(job, index) in experience"
                :key="job.short"
                class="experience-row"
                :initial-open="index === 0"
                :paused="motionPaused"
              >
                <template #summary>
                  <span class="experience-date">{{ job.date }}</span
                  ><span class="experience-company"
                    >{{ job.short }}<small>{{ job.role }}</small></span
                  ><span
                    class="experience-plus disclosure-icon"
                    aria-hidden="true"
                  ></span>
                </template>
                <div class="experience-detail">
                  <p class="experience-full-name" data-disclosure-reveal>
                    {{ job.name }}
                  </p>
                  <h3 data-disclosure-reveal>{{ job.summary }}</h3>
                  <p
                    v-for="detail in job.details"
                    :key="detail"
                    data-disclosure-reveal
                  >
                    {{ detail }}
                  </p>
                  <div class="experience-tags" data-disclosure-reveal>
                    <span v-for="tag in job.tags" :key="tag">{{ tag }}</span>
                  </div>
                </div>
              </AnimatedDisclosure>
            </div>
          </div>
        </div>
      </section>

      <section id="about" class="about-section section-shell">
        <div class="section-topline">
          <span class="eyebrow">03 / A LITTLE ABOUT ME</span
          ><span class="eyebrow">ENGINEER BY PRACTICE. CURIOUS BY NATURE.</span>
        </div>
        <div class="about-statement" data-reveal>
          <span class="about-symbol" aria-hidden="true">✳</span>
          <h2>喜欢漂亮的界面，<br />也在意它背后的<span>每一层。</span></h2>
          <p>
            写前端，也写服务端；做自己的产品，也到客户现场解决问题。<br />我享受从「能不能做」走到「真的有人在用」的过程。
          </p>
        </div>
        <div id="skills" class="capability-grid">
          <article
            v-for="(capability, index) in capabilities"
            :key="capability.title"
            data-reveal
          >
            <span class="eyebrow"
              >0{{ index + 1 }} / {{ capability.title.toUpperCase() }}</span
            >
            <h3>{{ capability.subtitle }}</h3>
            <p>{{ capability.description }}</p>
            <div class="capability-stack">{{ capability.stack }}</div>
          </article>
        </div>
        <a class="writing-link" href="/main.html" data-reveal
          ><div>
            <span class="eyebrow">NOT EVERYTHING LIVES IN A REPOSITORY.</span>
            <h3>写下来，让想法继续生长。</h3>
            <p>源码浅读 · 工程实践 · 开源记录 · 一些思考</p>
          </div>
          <span class="writing-arrow">↗</span></a
        >
      </section>

      <footer id="contact" class="contact-section">
        <div class="section-shell">
          <div class="section-topline">
            <span class="eyebrow">HAVE SOMETHING IN MIND?</span
            ><span class="eyebrow">LET’S MAKE IT HAPPEN.</span>
          </div>
          <div class="contact-main" data-reveal>
            <h2>下一个想法，<br /><em>一起做出来。</em></h2>
            <a
              class="contact-orbit"
              href="mailto:newobjectccc@gmail.com"
              aria-label="发邮件给 Vesper"
              ><span>LET’S TALK</span><b>↗</b></a
            >
          </div>
          <div class="contact-meta">
            <div>
              <a class="contact-email" href="mailto:newobjectccc@gmail.com"
                >newobjectccc@gmail.com</a
              ><button
                class="copy-email"
                @click="copyEmail"
                :aria-label="copied ? '邮箱已复制' : '复制邮箱地址'"
              >
                {{ copied ? "已复制 ✓" : "复制 ↗" }}</button
              ><span class="sr-only" role="status">{{
                copied ? "邮箱地址已复制到剪贴板" : ""
              }}</span>
            </div>
            <p>项目合作、技术交流，<br />或者，一个值得尝试的想法。</p>
          </div>
          <div class="footer-bottom">
            <a href="#top" class="wordmark">vesper<span>✳</span></a
            ><span>© {{ year }} 陈鑫铄 / VESPER</span>
            <div>
              <a
                href="https://github.com/newObjectccc"
                target="_blank"
                rel="noopener noreferrer"
                >GITHUB ↗</a
              ><a
                href="https://twitter.com/cccxy10086"
                target="_blank"
                rel="noopener noreferrer"
                >X ↗</a
              ><a href="/main.html">BLOG ↗</a><a href="#top">回到顶部 ↑</a>
            </div>
          </div>
        </div>
      </footer>
    </main>
    <Teleport to="body">
      <ProjectPreview
        v-if="previewProject"
        :key="previewProject.id"
        :project="previewProject"
        :anchor="previewAnchor"
        :keyboard="previewKeyboard"
        :paused="motionPaused"
        @ready="previewReady = true"
        @enter="keepPreview"
        @leave="leavePreview"
        @close="dismissPreview"
        @details="showProjectDetails(previewProject)"
      />
      <ProjectDetail
        v-if="activeProject"
        :key="activeProject.id"
        :project="activeProject"
        :paused="motionPaused"
        @close="activeProject = null"
      />
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import { gsap } from "gsap";
import KineticRibbon from "./portfolio/KineticRibbon.vue";
import ProjectCover from "./portfolio/ProjectCover.vue";
import ProjectDetail from "./portfolio/ProjectDetail.vue";
import AnimatedDisclosure from "./portfolio/AnimatedDisclosure.vue";
import ProjectPreview from "./portfolio/ProjectPreview.vue";
import { useProjectPreview } from "./portfolio/useProjectPreview.js";
import {
  projects,
  tools,
  experience,
  capabilities,
} from "./portfolio/content.js";

const activeFilter = ref("all"),
  activeProject = ref(null),
  menuOpen = ref(false);
const {
  previewProject,
  previewAnchor,
  previewKeyboard,
  previewReady,
  previewTheme,
  queuePreview,
  openPreview,
  leaveProject,
  keepPreview,
  leavePreview,
  dismissPreview,
} = useProjectPreview();
const showProjectDetails = (project) => {
  dismissPreview();
  activeProject.value = project;
};
const motionPaused = ref(
  typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches,
);
const copied = ref(false),
  scrollProgress = ref(0),
  year = new Date().getFullYear();
const filters = [
  { id: "all", label: "全部作品", count: projects.length },
  {
    id: "personal",
    label: "个人产品",
    count: projects.filter((p) => p.category === "personal").length,
  },
  {
    id: "delivery",
    label: "商业交付",
    count: projects.filter((p) => p.category === "delivery").length,
  },
];
const filteredProjects = computed(() =>
  activeFilter.value === "all"
    ? projects
    : projects.filter((p) => p.category === activeFilter.value),
);
let revealObserver,
  animationContext,
  motionQuery,
  scrollFrame = 0,
  copyTimeout;
const toggleMotion = () => {
  motionPaused.value = !motionPaused.value;
};
const onMotionChange = (event) => {
  motionPaused.value = event.matches;
};
const updateScroll = () => {
  if (scrollFrame) return;
  scrollFrame = requestAnimationFrame(() => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    scrollProgress.value = max > 0 ? Math.min(1, window.scrollY / max) : 0;
    scrollFrame = 0;
  });
};
async function copyEmail() {
  try {
    await navigator.clipboard.writeText("newobjectccc@gmail.com");
    copied.value = true;
    clearTimeout(copyTimeout);
    copyTimeout = setTimeout(() => {
      copied.value = false;
    }, 2400);
  } catch {
    window.location.href = "mailto:newobjectccc@gmail.com";
  }
}
onMounted(() => {
  motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  motionQuery.addEventListener("change", onMotionChange);
  window.addEventListener("scroll", updateScroll, { passive: true });
  updateScroll();
  if (!motionPaused.value) {
    animationContext = gsap.context(() => {
      gsap.from(".title-line", {
        yPercent: 110,
        rotate: 3,
        duration: 1.15,
        stagger: 0.14,
        ease: "power3.out",
        clearProps: "all",
      });
      gsap.from(".hero-description, .hero-link, .hero-meta, .hero-bottom", {
        y: 15,
        opacity: 0,
        duration: 0.8,
        stagger: 0.07,
        delay: 0.25,
        ease: "power2.out",
        clearProps: "all",
      });
    });
  }
  revealObserver = new IntersectionObserver(
    (entries) => {
      for (const entry of entries)
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
    },
    { threshold: 0.1, rootMargin: "0px 0px -30px 0px" },
  );
  document.querySelectorAll("[data-reveal]").forEach((el) => {
    if (el.getBoundingClientRect().top > window.innerHeight)
      el.classList.add("will-reveal");
    revealObserver.observe(el);
  });
});
onBeforeUnmount(() => {
  revealObserver?.disconnect();
  animationContext?.revert();
  motionQuery?.removeEventListener("change", onMotionChange);
  window.removeEventListener("scroll", updateScroll);
  cancelAnimationFrame(scrollFrame);
  clearTimeout(copyTimeout);
});
</script>
