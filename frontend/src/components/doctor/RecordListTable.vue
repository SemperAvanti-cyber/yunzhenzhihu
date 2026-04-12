<template>
  <div class="record-list-table">
    <slot />
  </div>
</template>

<script setup>
defineOptions({ name: 'RecordListTable' })
</script>

<style scoped>
.record-list-table {
  width: 100%;
  overflow-x: auto;
}
</style>
