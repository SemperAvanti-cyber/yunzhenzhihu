<template>
  <div class="section-title">
    <div v-if="kicker" class="section-title__kicker">{{ kicker }}</div>
    <h2 class="section-title__heading">
      <slot>{{ title }}</slot>
    </h2>
    <p v-if="subtitle" class="section-title__sub">{{ subtitle }}</p>
  </div>
</template>

<script setup>
defineOptions({ name: 'SectionTitle' })

defineProps({
  kicker: { type: String, default: '' },
  title: { type: String, default: '' },
  subtitle: { type: String, default: '' },
})
</script>

<style scoped>
.section-title__kicker {
  font-size: 11px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #64748b;
  margin-bottom: 6px;
}
.section-title__heading {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: #0f172a;
}
.section-title__sub {
  margin: 8px 0 0;
  font-size: 14px;
  color: #64748b;
}
</style>
