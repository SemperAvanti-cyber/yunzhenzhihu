<template>
  <div class="ai-report-card">
    <slot />
  </div>
</template>

<script setup>
defineOptions({ name: 'AIReportCard' })
</script>

<style scoped>
.ai-report-card {
  border-radius: 12px;
  border: 1px solid #dbeafe;
  padding: 16px;
  background: linear-gradient(180deg, #f8fafc 0%, #fff 100%);
}
</style>
