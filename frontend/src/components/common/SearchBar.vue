<template>
  <div class="search-bar">
    <input
      v-model="inner"
      type="search"
      class="search-bar__input"
      :placeholder="placeholder"
      @keyup.enter="$emit('search', inner)"
    />
    <button type="button" class="search-bar__btn" @click="$emit('search', inner)">
      搜索
    </button>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

defineOptions({ name: 'SearchBar' })

const props = defineProps({
  modelValue: { type: String, default: '' },
  placeholder: { type: String, default: '输入关键词…' },
})

const emit = defineEmits(['update:modelValue', 'search'])

const inner = ref(props.modelValue)

watch(
  () => props.modelValue,
  (v) => {
    inner.value = v
  }
)

watch(inner, (v) => emit('update:modelValue', v))
</script>

<style scoped>
.search-bar {
  display: flex;
  gap: 8px;
  align-items: center;
}
.search-bar__input {
  flex: 1;
  min-width: 0;
  padding: 8px 12px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
}
.search-bar__btn {
  padding: 8px 14px;
  border: none;
  border-radius: 8px;
  background: #2563eb;
  color: #fff;
  font-size: 14px;
  cursor: pointer;
}
</style>
