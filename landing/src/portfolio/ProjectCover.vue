<template>
  <div
    class="project-art"
    :class="`project-art--${project.kind}`"
    aria-hidden="true"
  >
    <template v-if="project.kind === 'travel'">
      <div class="travel-poster">
        <div class="poster-top">
          <span><b>↗</b> wander china</span><span>慢慢来，风景一直在。</span>
        </div>
        <div class="travel-type">
          Find your<br />own kind<br />of <i>China.</i
          ><span class="travel-star">✳</span>
        </div>
        <svg class="travel-map" viewBox="0 0 480 380" fill="none">
          <defs>
            <linearGradient :id="mapShade" x2="0" y2="1">
              <stop stop-color="#a9b79c" />
              <stop offset="1" stop-color="#d5d9c0" />
            </linearGradient>
          </defs>
          <path
            d="m46 163 48-46 32 8 27-43 42 18 29-37 40 19 20-23 29 46 40-4 22 40 55 31-21 33-48 18-15 35-49-7-33 29-34-23-52 10-18-30-46 1-15-22-39-14Z"
            fill="#536b55"
            transform="translate(0 13)"
          />
          <path
            d="m46 163 48-46 32 8 27-43 42 18 29-37 40 19 20-23 29 46 40-4 22 40 55 31-21 33-48 18-15 35-49-7-33 29-34-23-52 10-18-30-46 1-15-22-39-14Z"
            :fill="`url(#${mapShade})`"
          />
          <path
            d="m95 160 64 23 39-27 33 15 34-38 48 47 68-5M123 206l45-13 65 12 51-31 54 30"
            stroke="#f0eedc"
            stroke-width="2"
          />
          <path
            d="m202 209 39-43 46 25"
            stroke="#bf6340"
            stroke-width="2"
            stroke-dasharray="4 5"
            class="route-line"
          />
          <g fill="#536b55">
            <path
              d="m126 150 12-31 12 31h-24Zm13 8 12-31 12 31h-24Zm175-11 12-31 12 31h-24Zm13 8 12-31 12 31h-24Z"
            />
          </g>
          <g fill="#eeeadd">
            <path d="m169 126 18-34 18 34Z" />
            <path d="m181 137 21-40 21 40Z" />
          </g>
          <circle cx="202" cy="209" r="9" fill="#bf6340" class="map-beacon" />
          <circle cx="202" cy="209" r="3" fill="#fff9e8" />
          <rect x="166" y="235" width="76" height="24" rx="12" fill="#f6f2e5" />
          <text
            x="204"
            y="251"
            text-anchor="middle"
            fill="#4b6050"
            font-size="10"
            font-family="sans-serif"
          >
            CHENGDU ↗
          </text>
          <g transform="translate(282 72)">
            <ellipse cy="-20" rx="15" ry="19" fill="#c7a169" />
            <path d="m-9-6 4 12h10l4-12" stroke="#8b7354" />
            <path d="M-5 6H5v7H-5Z" fill="#ad8654" />
          </g>
          <ellipse
            cx="247"
            cy="312"
            rx="125"
            ry="12"
            fill="#a3b499"
            opacity=".13"
          />
        </svg>
        <div class="travel-bao">
          <span>✳</span>
          <div>
            A little help from Bao<small>Your China travel companion</small>
          </div>
          <b>↗</b>
        </div>
        <div class="poster-bottom">
          <span>3D EXPLORER</span><span>YOUR NEXT LITTLE ADVENTURE / 01</span>
        </div>
      </div>
    </template>
    <template v-else-if="project.kind === 'media'">
      <div class="media-art">
        <span class="art-eyebrow">爱剪 / CONVERSATION TO CREATION</span>
        <div class="media-title">An idea.<br /><i>In motion.</i></div>
        <div class="media-viewfinder">
          <span class="media-take">AI CUT / TAKE 01</span>
          <svg viewBox="0 0 240 180" fill="none" class="media-aperture">
            <circle
              cx="120"
              cy="90"
              r="63"
              stroke="currentColor"
              opacity=".22"
            />
            <circle
              cx="120"
              cy="90"
              r="46"
              stroke="currentColor"
              opacity=".32"
            />
            <path
              d="M104 68 143 90 104 112Z"
              stroke="currentColor"
              stroke-width="1.5"
            />
            <path
              class="media-aperture-ink"
              d="M120 27a63 63 0 1 1-63 63"
              stroke="currentColor"
              stroke-width="2"
              pathLength="1"
            />
            <path
              d="M18 38V18h20M202 18h20v20M222 142v20h-20M38 162H18v-20"
              stroke="currentColor"
              opacity=".5"
            />
          </svg>
          <div class="media-timeline">
            <span>01</span><i></i><i></i><i></i><span>03</span>
          </div>
          <span class="media-take media-take-bottom"
            >SCRIPT · SCENE · FILM</span
          >
        </div>
        <div class="media-flow">
          <span>说出想法</span><b>→</b><span>Agent 制作</span><b>→</b
          ><span>继续创作</span>
        </div>
      </div>
    </template>
    <template v-else-if="project.kind === 'research'">
      <div class="research-art">
        <span class="art-eyebrow">牛市通 / RESEARCH WORKSPACE</span>
        <div class="research-title">Signal.<br /><i>To insight.</i></div>
        <svg viewBox="0 0 520 170" class="research-chart">
          <path
            d="M0 150H520M0 100H520M0 50H520"
            stroke="#c4cbc0"
            stroke-width=".6"
          />
          <path
            d="m0 137 30-8 20 10 24-42 21 12 30-26 28 7 25-21 20 17 32-42 21 12 32-13 21 25 20-5 35-37 20 6 40-25 21 6 15-8"
            fill="none"
            stroke="#345e44"
            stroke-width="2.5"
            class="chart-path"
          />
          <circle cx="500" cy="10" r="5" fill="#d6492c" />
        </svg>
        <div class="research-flow">
          <span>发现线索</span><b>→</b><span>AI 研究</span><b>→</b
          ><span>形成判断</span>
        </div>
      </div>
    </template>
    <template v-else-if="project.kind === 'education'">
      <div class="education-art">
        <span class="art-eyebrow">爱伴学 / LEARNING, CONNECTED.</span>
        <div class="learning-orbit orbit-one"></div>
        <div class="learning-orbit orbit-two"></div>
        <div class="learning-shape"><span>学</span><i>＋</i></div>
        <span class="learning-label label-teacher">教师 · 备课与课堂</span
        ><span class="learning-label label-parent">家长 · 陪伴与成长</span>
        <div class="education-devices">
          <span>WEB / PWA</span><span>APP</span><span>微信小程序</span>
        </div>
      </div>
    </template>
    <template v-else-if="project.kind === 'community'">
      <div class="phone-composition">
        <span class="art-eyebrow">成师 TTT / EVERY LITTLE PRACTICE.</span>
        <div class="phone-frame">
          <img
            src="/chengshi.png"
            alt=""
            loading="lazy"
            width="390"
            height="780"
          />
        </div>
        <span class="phone-caption">Every day,<br /><i>a little more.</i></span
        ><span class="phone-badge">PWA<br />移动端优先</span>
      </div>
    </template>
    <template v-else>
      <div class="growth-composition">
        <span class="art-eyebrow">择野少年 / ROOM TO GROW.</span>
        <div class="growth-shot">
          <img
            src="/qyqm.png"
            alt=""
            loading="lazy"
            width="1280"
            height="800"
          />
        </div>
        <span class="growth-stamp">STAY<br />CURIOUS ↗</span>
      </div>
    </template>
  </div>
</template>

<script setup>
import { useId } from "vue";
const mapShade = useId();
defineProps({ project: { type: Object, required: true } });
</script>

<style scoped>
.media-art {
  position: absolute;
  inset: 0;
  background: #e9e2d4;
  color: #352c22;
  container-type: inline-size;
}
.media-title {
  position: absolute;
  left: 8%;
  top: 25%;
  z-index: 1;
  font-size: 11cqw;
  font-weight: 500;
  line-height: 1.05;
  letter-spacing: -0.055em;
}
.media-art > .art-eyebrow {
  position: absolute;
  left: 8%;
  top: 14%;
  color: #78634b;
}
.media-title i {
  font-family: var(--serif);
  font-weight: 400;
  color: #916334;
}
.media-viewfinder {
  position: absolute;
  width: 47%;
  height: 64%;
  top: 18%;
  right: 6%;
  transform: rotate(6deg);
  border: 1px solid #57412b;
  border-radius: 8px;
  background: radial-gradient(ellipse at 65% 40%, #46311e, #17110c 75%);
  color: #f1bd70;
  box-shadow: 0 20px 35px #352c2220;
}
.media-take {
  position: absolute;
  top: 7%;
  left: 9%;
  font: 1.3cqw var(--mono);
  letter-spacing: 0.08em;
}
.media-take-bottom {
  top: auto;
  bottom: 7%;
}
.media-aperture {
  position: absolute;
  inset: 14% 8% auto;
  width: 84%;
  height: 65%;
}
.media-aperture-ink {
  stroke-dasharray: 1;
  stroke-dashoffset: 0.6;
  transition: stroke-dashoffset 1s var(--ease);
}
.cover-button:is(:hover, :focus-visible) .media-aperture-ink {
  stroke-dashoffset: 0;
}
.media-timeline {
  position: absolute;
  left: 9%;
  right: 9%;
  bottom: 17%;
  display: flex;
  align-items: center;
  gap: 4%;
}
.media-timeline span {
  font: 1.3cqw var(--mono);
}
.media-timeline i {
  height: 3cqw;
  flex: 1;
  border: 1px solid #f1bd7040;
  background: #f1bd7018;
}
.media-timeline i:nth-of-type(2) {
  background: #f1bd7050;
}
.media-flow {
  position: absolute;
  left: 8%;
  right: 8%;
  bottom: 7%;
  display: flex;
  align-items: center;
  gap: 5%;
  font-size: 1.8cqw;
}
.media-flow b {
  font-weight: 400;
  color: #916334;
}
</style>
