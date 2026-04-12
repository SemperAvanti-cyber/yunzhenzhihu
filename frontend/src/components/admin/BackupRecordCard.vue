<template>
  <div class="backup-record-card">
    <slot />
  </div>
</template>

<script setup>
defineOptions({ name: 'BackupRecordCard' })
</script>

<style scoped>
.backup-record-card {
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  padding: 16px;
  background: #fff;
}
</style>
