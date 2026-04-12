<template>
  <div class="case-info-panel">
    <slot />
  </div>
</template>

<script setup>
defineOptions({ name: 'CaseInfoPanel' })
</script>

<style scoped>
.case-info-panel {
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  padding: 16px;
  background: #fff;
}
</style>
