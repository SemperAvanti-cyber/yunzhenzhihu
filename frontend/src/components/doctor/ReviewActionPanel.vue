<template>
  <div class="review-action-panel">
    <slot />
  </div>
</template>

<script setup>
defineOptions({ name: 'ReviewActionPanel' })
</script>

<style scoped>
.review-action-panel {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}
</style>
