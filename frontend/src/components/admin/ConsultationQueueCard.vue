<template>
  <div class="consultation-queue-card">
    <slot />
  </div>
</template>

<script setup>
defineOptions({ name: 'ConsultationQueueCard' })
</script>

<style scoped>
.consultation-queue-card {
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  padding: 16px;
  background: #fff;
}
</style>
