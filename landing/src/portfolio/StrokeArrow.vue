<template>
  <svg
    class="stroke-arrow"
    viewBox="0 0 24 24"
    aria-hidden="true"
    focusable="false"
  >
    <path
      class="arrow-shaft"
      :d="down ? 'M12 4V20' : up ? 'M12 20V4' : 'M6 18 18 6'"
      pathLength="1"
    />
    <path
      class="arrow-tip"
      :d="down ? 'm5 13 7 7 7-7' : up ? 'm5 11 7-7 7 7' : 'M6 6h12v12'"
      pathLength="1"
    />
  </svg>
</template>

<script setup>
defineProps({ down: Boolean, up: Boolean });
</script>
