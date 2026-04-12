<template>
  <div class="audit-page">
    <div class="page-head">
      <div>
        <h1>审计日志</h1>
        <div class="page-subtitle">检索敏感行为、追踪导出链路、查看高危操作详情</div>
      </div>
    </div>

    <div v-if="loading" class="page-tip">正在加载审计日志...</div>
    <div v-else-if="error" class="page-tip error">{{ error }}</div>

    <template v-else>
      <section class="summary-grid">
        <div class="summary-card">
          <div class="summary-title">今日审计记录</div>
          <div class="summary-value">{{ board.summary.todayCount }}</div>
          <div class="summary-note">平台关键行为留痕</div>
        </div>
        <div class="summary-card">
          <div class="summary-title">高危操作</div>
          <div class="summary-value">{{ board.summary.highRiskCount }}</div>
          <div class="summary-note">建议优先复核</div>
        </div>
        <div class="summary-card">
          <div class="summary-title">导出追溯</div>
          <div class="summary-value">{{ board.summary.exportTraceCount }}</div>
          <div class="summary-note">可追踪导出链路</div>
        </div>
        <div class="summary-card">
          <div class="summary-title">今日操作人</div>
          <div class="summary-value">{{ board.summary.uniqueActorCount }}</div>
          <div class="summary-note">唯一操作主体数量</div>
        </div>
      </section>

      <section class="panel-card">
        <div class="panel-head">
          <span>筛选条件</span>
          <span class="panel-link">安全审计管理员视角</span>
        </div>

        <div class="filter-grid">
          <div class="filter-item full">
            <label>关键词</label>
            <input
                v-model="filters.keyword"
                placeholder="搜索操作人 / 动作 / 目标 / 详情"
                @keyup.enter="applyFilters"
            />
          </div>

          <div class="filter-item">
            <label>动作类型</label>
            <select v-model="filters.actionType" @change="applyFilters">
              <option
                  v-for="item in board.filters.actionTypeOptions"
                  :key="item.value"
                  :value="item.value"
              >
                {{ item.label }}
              </option>
            </select>
          </div>

          <div class="filter-item">
            <label>风险等级</label>
            <select v-model="filters.riskLevel" @change="applyFilters">
              <option
                  v-for="item in board.filters.riskOptions"
                  :key="item.value"
                  :value="item.value"
              >
                {{ item.label }}
              </option>
            </select>
          </div>

          <div class="filter-action">
            <button class="primary-btn" @click="applyFilters">应用筛选</button>
          </div>
        </div>
      </section>

      <section class="content-grid">
        <div class="panel-card">
          <div class="panel-head">
            <span>日志列表</span>
            <span class="panel-link">{{ board.list.length }} 条</span>
          </div>

          <div class="table-wrap">
            <div class="table-head">
              <span>操作人</span>
              <span>动作</span>
              <span>目标类型</span>
              <span>目标标识</span>
              <span>风险</span>
              <span>日期</span>
            </div>

            <div
                v-for="item in board.list"
                :key="item.id"
                class="table-row"
                :class="{ active: selected?.id === item.id }"
                @click="selectLog(item.id)"
            >
              <span>{{ item.actorName }}</span>
              <span>{{ item.actionType }}</span>
              <span>{{ item.targetType }}</span>
              <span>{{ item.targetId }}</span>
              <span>
                <em :class="['risk-chip', item.riskClass]">{{ item.riskLevel }}</em>
              </span>
              <span>{{ item.createdAt }}</span>
            </div>
          </div>
        </div>

        <div class="panel-card">
          <div class="panel-head">
            <span>日志详情</span>
            <span class="panel-link">{{ selected?.actionType || '未选择' }}</span>
          </div>

          <template v-if="selected">
            <div class="detail-list">
              <div class="detail-item">
                <label>操作人</label>
                <div>{{ selected.actorName }}</div>
              </div>
              <div class="detail-item">
                <label>角色</label>
                <div>{{ selected.actorRole }}</div>
              </div>
              <div class="detail-item">
                <label>动作类型</label>
                <div>{{ selected.actionType }}</div>
              </div>
              <div class="detail-item">
                <label>风险等级</label>
                <div>{{ selected.riskLevel }}</div>
              </div>
              <div class="detail-item">
                <label>目标类型</label>
                <div>{{ selected.targetType }}</div>
              </div>
              <div class="detail-item">
                <label>目标标识</label>
                <div>{{ selected.targetId }}</div>
              </div>
              <div class="detail-item">
                <label>IP 地址</label>
                <div>{{ selected.ipAddress }}</div>
              </div>
              <div class="detail-item">
                <label>日期</label>
                <div>{{ selected.createdAt }}</div>
              </div>
              <div class="detail-item full">
                <label>操作详情</label>
                <div>{{ selected.detail }}</div>
              </div>
            </div>

            <div class="history-box">
              <div class="history-title">同一操作人最近行为</div>
              <div v-if="selected.relatedLogs.length" class="history-list">
                <div
                    v-for="item in selected.relatedLogs"
                    :key="item.id"
                    class="history-item"
                >
                  <div class="history-action">{{ item.actionType }}</div>
                  <div class="history-desc">{{ item.detail }}</div>
                  <div class="history-time">{{ item.createdAt }}</div>
                </div>
              </div>
              <div v-else class="empty-text">暂无相关历史行为</div>
            </div>
          </template>

          <div v-else class="empty-text">请选择左侧日志查看详情</div>
        </div>
      </section>
    </template>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getAuditLogBoardApi } from '../../api/admin'

const route = useRoute()
const router = useRouter()

const loading = ref(false)
const error = ref('')

const board = ref({
  summary: {
    todayCount: 0,
    highRiskCount: 0,
    exportTraceCount: 0,
    uniqueActorCount: 0
  },
  filters: {
    keyword: '',
    currentActionType: 'ALL',
    currentRiskLevel: 'ALL',
    actionTypeOptions: [],
    riskOptions: []
  },
  list: [],
  selected: null
})

const selected = ref(null)

const filters = ref({
  keyword: '',
  actionType: 'ALL',
  riskLevel: 'ALL'
})

async function fetchBoard() {
  try {
    loading.value = true
    error.value = ''

    const data = await getAuditLogBoardApi({
      logId: route.query.logId || '',
      keyword: filters.value.keyword,
      actionType: filters.value.actionType,
      riskLevel: filters.value.riskLevel
    })

    board.value = data
    selected.value = data.selected || null
  } catch (err) {
    error.value = err.message || '审计日志页加载失败'
  } finally {
    loading.value = false
  }
}

async function applyFilters() {
  await router.replace({
    path: '/admin/audit',
    query: {
      scope: 'security',
      logId: route.query.logId || '',
      keyword: filters.value.keyword || '',
      actionType: filters.value.actionType,
      riskLevel: filters.value.riskLevel
    }
  })
  await fetchBoard()
}

async function selectLog(id) {
  await router.replace({
    path: '/admin/audit',
    query: {
      scope: 'security',
      logId: id,
      keyword: filters.value.keyword || '',
      actionType: filters.value.actionType,
      riskLevel: filters.value.riskLevel
    }
  })
  await fetchBoard()
}

onMounted(() => {
  filters.value.keyword = String(route.query.keyword || '')
  filters.value.actionType = String(route.query.actionType || 'ALL')
  filters.value.riskLevel = String(route.query.riskLevel || 'ALL')
  fetchBoard()
})
</script>

<style scoped>
.audit-page {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.page-head h1 {
  margin: 0;
  font-size: 28px;
  font-weight: 800;
  color: #17385f;
}

.page-subtitle,
.summary-note,
.panel-link,
.page-tip,
.empty-text,
.history-desc,
.history-time {
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

.summary-grid,
.filter-grid,
.content-grid {
  display: grid;
  gap: 14px;
}

.summary-grid {
  grid-template-columns: repeat(4, minmax(0, 1fr));
}

.filter-grid {
  grid-template-columns: 1.2fr 1fr 1fr auto;
  align-items: end;
}

.content-grid {
  grid-template-columns: 1.18fr 0.82fr;
}

.summary-card,
.panel-card,
.detail-item,
.history-item {
  background: rgba(255, 255, 255, 0.82);
  border: 1px solid #dce8f4;
  border-radius: 22px;
  box-shadow: 0 10px 30px rgba(17, 56, 102, 0.05);
}

.summary-card {
  padding: 18px;
}

.summary-title {
  font-size: 13px;
  color: #7590b0;
}

.summary-value {
  margin-top: 10px;
  font-size: 24px;
  font-weight: 800;
  color: #17385f;
}

.summary-note {
  margin-top: 8px;
}

.panel-card {
  padding: 18px;
}

.panel-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 12px;
  margin-bottom: 12px;
  border-bottom: 1px solid #e6eef7;
  font-size: 15px;
  font-weight: 800;
  color: #17385f;
}

.filter-item label,
.detail-item label {
  display: block;
  font-size: 12px;
  color: #7a93af;
  margin-bottom: 8px;
}

.filter-item input,
.filter-item select {
  width: 100%;
  border: 1px solid #d8e5f2;
  border-radius: 14px;
  background: #fff;
  padding: 12px 14px;
  font-size: 14px;
  color: #1d466f;
  outline: none;
}

.filter-action {
  display: flex;
}

.primary-btn {
  height: 42px;
  padding: 0 16px;
  border: none;
  border-radius: 12px;
  color: #fff;
  background: linear-gradient(135deg, #2563eb, #0ea5e9);
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
}

.table-wrap {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.table-head,
.table-row {
  display: grid;
  grid-template-columns: 0.9fr 1.1fr 0.9fr 1fr 0.8fr 0.8fr;
  gap: 12px;
  padding: 14px 16px;
  border-radius: 16px;
  align-items: center;
}

.table-head {
  background: #f5f9fd;
  color: #7a93af;
  font-size: 12px;
  font-weight: 700;
}

.table-row {
  background: #f9fcff;
  border: 1px solid #e3edf7;
  font-size: 13px;
  color: #365a7f;
  cursor: pointer;
}

.table-row.active {
  background: #edf6ff;
  border-color: #bfd8f8;
}

.risk-chip {
  display: inline-flex;
  padding: 4px 10px;
  border-radius: 999px;
  font-style: normal;
  font-size: 12px;
  white-space: nowrap;
}

.risk-chip.info {
  background: #edf6ff;
  color: #2a70b8;
}

.risk-chip.warning {
  background: #fff5df;
  color: #c98912;
}

.risk-chip.danger {
  background: #feecec;
  color: #d83b3b;
}

.detail-list,
.history-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.detail-item,
.history-item {
  padding: 14px;
  background: #f9fcff;
  border: 1px solid #e3edf7;
  box-shadow: none;
}

.detail-item.full {
  grid-column: 1 / -1;
}

.detail-item div {
  font-size: 14px;
  line-height: 1.8;
  color: #1d466f;
}

.history-box {
  margin-top: 16px;
}

.history-title,
.history-action {
  font-size: 14px;
  font-weight: 800;
  color: #1d466f;
}

@media (max-width: 1280px) {
  .summary-grid,
  .filter-grid,
  .content-grid,
  .table-head,
  .table-row {
    grid-template-columns: 1fr;
  }

  .filter-action {
    width: 100%;
  }
}
</style>
