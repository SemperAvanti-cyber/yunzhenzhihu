<template>
  <div class="empty-state">
    <p class="empty-state__title">{{ title }}</p>
    <p v-if="hint" class="empty-state__hint">{{ hint }}</p>
  </div>
</template>

<script setup>
defineOptions({ name: 'EmptyState' })

defineProps({
  title: { type: String, default: '暂无数据' },
  hint: { type: String, default: '' },
})
</script>

<style scoped>
.empty-state {
  padding: 24px;
  text-align: center;
  color: #64748b;
}
.empty-state__title {
  font-size: 15px;
  margin: 0;
}
.empty-state__hint {
  font-size: 13px;
  margin: 8px 0 0;
  opacity: 0.85;
}
</style>
