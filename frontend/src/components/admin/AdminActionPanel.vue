<template>
  <div class="admin-action-panel">
    <slot />
  </div>
</template>

<script setup>
defineOptions({ name: 'AdminActionPanel' })
</script>

<style scoped>
.admin-action-panel {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}
</style>
