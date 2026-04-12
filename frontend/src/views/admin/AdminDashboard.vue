<template>
  <div class="dashboard-page">
    <div class="page-head">
      <div>
        <h1>后台总览</h1>
        <div class="page-subtitle">{{ overview.scopeDesc }}</div>
      </div>

      <div class="scope-switch">
        <button
            class="scope-chip"
            :class="{ active: currentScope === 'hospital' }"
            @click="switchScope('hospital')"
        >
          医院管理员
        </button>
        <button
            class="scope-chip"
            :class="{ active: currentScope === 'research' }"
            @click="switchScope('research')"
        >
          科研合规管理员
        </button>
        <button
            class="scope-chip"
            :class="{ active: currentScope === 'security' }"
            @click="switchScope('security')"
        >
          安全审计管理员
        </button>
      </div>
    </div>

    <div v-if="loading" class="page-tip">正在加载后台总览...</div>
    <div v-else-if="error" class="page-tip error">{{ error }}</div>

    <template v-else>
      <section class="metric-grid">
        <div v-for="item in overview.metrics" :key="item.label" class="metric-card">
          <div class="metric-top">
            <span class="metric-label">{{ item.label }}</span>
            <span :class="['metric-trend', item.type]">{{ item.trend }}</span>
          </div>
          <div class="metric-value">{{ item.value }}</div>
          <div class="metric-note">{{ item.note }}</div>
        </div>
      </section>

      <section class="content-grid">
        <div class="panel-card">
          <div class="panel-head">
            <span>核心待办</span>
            <span class="panel-link">{{ overview.scopeLabel }}</span>
          </div>

          <div class="todo-list">
            <div
                v-for="item in overview.todos"
                :key="item.title"
                class="todo-item"
                @click="go(item.path)"
            >
              <div>
                <div class="todo-title">{{ item.title }}</div>
                <div class="todo-desc">{{ item.desc }}</div>
              </div>
              <div :class="['todo-badge', item.badgeType]">{{ item.badge }}</div>
            </div>
          </div>
        </div>

        <div class="panel-card">
          <div class="panel-head">
            <span>职责边界</span>
            <span class="panel-link">角色划分</span>
          </div>

          <div class="scope-list">
            <div v-for="item in overview.boundaries" :key="item.title" class="scope-item">
              <div class="scope-title">{{ item.title }}</div>
              <div class="scope-desc">{{ item.desc }}</div>
            </div>
          </div>
        </div>
      </section>

      <section class="panel-card">
        <div class="panel-head">
          <span>快捷入口</span>
          <span class="panel-link">当前角色推荐</span>
        </div>

        <div class="quick-grid">
          <div
              v-for="item in overview.quickEntries"
              :key="item.title"
              class="quick-card"
              @click="go(item.path)"
          >
            <div class="quick-title">{{ item.title }}</div>
            <div class="quick-desc">{{ item.desc }}</div>
          </div>
        </div>
      </section>
    </template>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getAdminOverviewApi } from '../../api/admin'

const route = useRoute()
const router = useRouter()

const loading = ref(false)
const error = ref('')
const overview = ref({
  scope: 'hospital',
  scopeLabel: '',
  scopeDesc: '',
  metrics: [],
  todos: [],
  boundaries: [],
  quickEntries: []
})

const currentScope = computed(() => {
  const scope = route.query.scope
  if (scope === 'research' || scope === 'security' || scope === 'hospital') {
    return scope
  }
  return 'hospital'
})

async function fetchOverview() {
  try {
    loading.value = true
    error.value = ''

    const data = await getAdminOverviewApi({
      scope: currentScope.value
    })

    overview.value = data
  } catch (err) {
    error.value = err.message || '后台总览加载失败'
  } finally {
    loading.value = false
  }
}

function switchScope(scope) {
  router.replace({
    path: '/admin/dashboard',
    query: { scope }
  })
}

function go(path) {
  router.push({
    path,
    query: { scope: currentScope.value }
  })
}

watch(() => route.query.scope, fetchOverview)

onMounted(fetchOverview)
</script>

<style scoped>
.dashboard-page {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.page-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}

.page-head h1 {
  margin: 0;
  font-size: 28px;
  font-weight: 800;
  color: #17385f;
}

.page-subtitle,
.metric-note,
.todo-desc,
.scope-desc,
.panel-link,
.page-tip,
.quick-desc {
  font-size: 12px;
  line-height: 1.8;
  color: #7892b0;
}

.page-subtitle {
  margin-top: 6px;
}

.page-tip.error {
  color: #d83b3b;
}

.scope-switch {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.scope-chip {
  height: 38px;
  padding: 0 14px;
  border-radius: 999px;
  border: 1px solid #d8e5f2;
  background: #fff;
  color: #5f7c98;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
}

.scope-chip.active {
  background: #edf6ff;
  color: #2a70b8;
  border-color: #bfd8f8;
}

.metric-grid,
.content-grid,
.quick-grid {
  display: grid;
  gap: 14px;
}

.metric-grid {
  grid-template-columns: repeat(4, minmax(0, 1fr));
}

.content-grid {
  grid-template-columns: 1.04fr 0.96fr;
}

.quick-grid {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.metric-card,
.panel-card,
.todo-item,
.scope-item,
.quick-card {
  background: rgba(255, 255, 255, 0.82);
  border: 1px solid #dce8f4;
  border-radius: 22px;
  box-shadow: 0 10px 30px rgba(17, 56, 102, 0.05);
}

.metric-card {
  padding: 18px;
}

.metric-top,
.panel-head,
.todo-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
}

.metric-label {
  font-size: 13px;
  color: #7590b0;
}

.metric-trend {
  padding: 5px 10px;
  border-radius: 999px;
  font-size: 12px;
}

.metric-trend.up {
  background: #ecfbf5;
  color: #14906a;
}

.metric-trend.warning {
  background: #fff5df;
  color: #c98912;
}

.metric-trend.danger {
  background: #feecec;
  color: #d83b3b;
}

.metric-value {
  margin-top: 12px;
  font-size: 32px;
  font-weight: 800;
  color: #17385f;
}

.panel-card {
  padding: 18px;
}

.panel-head {
  padding-bottom: 12px;
  margin-bottom: 12px;
  border-bottom: 1px solid #e6eef7;
  font-size: 15px;
  font-weight: 800;
  color: #17385f;
}

.todo-list,
.scope-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.todo-item,
.scope-item,
.quick-card {
  padding: 16px;
  background: #f9fcff;
  border: 1px solid #e3edf7;
  box-shadow: none;
}

.todo-item,
.quick-card {
  cursor: pointer;
}

.todo-title,
.scope-title,
.quick-title {
  font-size: 15px;
  font-weight: 800;
  color: #1d466f;
}

.todo-badge {
  padding: 6px 10px;
  border-radius: 999px;
  font-size: 12px;
  white-space: nowrap;
}

.todo-badge.warning {
  background: #fff5df;
  color: #c98912;
}

.todo-badge.info {
  background: #edf6ff;
  color: #2a70b8;
}

.todo-badge.danger {
  background: #feecec;
  color: #d83b3b;
}

@media (max-width: 1280px) {
  .page-head {
    flex-direction: column;
    align-items: flex-start;
  }

  .metric-grid,
  .content-grid,
  .quick-grid {
    grid-template-columns: 1fr;
  }
}
</style>
