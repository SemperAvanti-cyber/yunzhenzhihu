<template>
  <div class="referral-flow-card">
    <slot />
  </div>
</template>

<script setup>
defineOptions({ name: 'ReferralFlowCard' })
</script>

<style scoped>
.referral-flow-card {
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  padding: 16px;
  background: #fff;
}
</style>
