<template>
  <span class="curiosity-mark" aria-hidden="true">
    <svg viewBox="0 0 32 32" focusable="false">
      <circle class="mark-center" cx="16" cy="16" r="1.7" />
      <g
        v-for="index in 8"
        :key="index"
        :transform="`rotate(${(index - 1) * 45} 16 16)`"
        :style="{ '--ray-delay': `${(index - 1) * 22}ms` }"
      >
        <path class="mark-ray" d="M16 10V4" pathLength="1" />
      </g>
    </svg>
  </span>
</template>
