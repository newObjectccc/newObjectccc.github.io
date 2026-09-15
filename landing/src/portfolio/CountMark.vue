<template>
  <sup class="count-mark">
    <span>{{ value }}</span>
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path class="count-corner-start" d="M9 2H2v7" pathLength="1" />
      <path class="count-corner-end" d="M15 22h7v-7" pathLength="1" />
    </svg>
  </sup>
</template>

<script setup>
defineProps({ value: { type: [String, Number], required: true } });
</script>
