<template>
  <div class="research-project-card">
    <slot />
  </div>
</template>

<script setup>
defineOptions({ name: 'ResearchProjectCard' })
</script>

<style scoped>
.research-project-card {
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  padding: 16px;
  background: #fff;
}
</style>
