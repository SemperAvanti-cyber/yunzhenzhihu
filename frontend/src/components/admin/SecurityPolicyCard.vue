<template>
  <div class="security-policy-card">
    <slot />
  </div>
</template>

<script setup>
defineOptions({ name: 'SecurityPolicyCard' })
</script>

<style scoped>
.security-policy-card {
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  padding: 16px;
  background: #fff;
}
</style>
