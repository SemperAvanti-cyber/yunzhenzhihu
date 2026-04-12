<template>
  <div class="approval-page">
    <div class="page-head">
      <div>
        <h1>项目合规治理</h1>
        <div class="page-subtitle">审核项目登记、伦理材料、数据导出与匿名化边界</div>
      </div>
    </div>

    <div v-if="loading" class="page-tip">正在加载项目合规治理数据...</div>
    <div v-else-if="error" class="page-tip error">{{ error }}</div>

    <template v-else>
      <section class="metric-grid">
        <div class="metric-card">
          <span>待审核项目</span>
          <strong>{{ board.summary.pendingProjectCount }}</strong>
          <p>含材料摘要与项目说明</p>
        </div>
        <div class="metric-card">
          <span>待审批导出</span>
          <strong>{{ board.summary.pendingExportCount }}</strong>
          <p>导出默认进入审批流</p>
        </div>
        <div class="metric-card">
          <span>待抽检样本</span>
          <strong>{{ board.summary.pendingQcCount }}</strong>
          <p>检查脱敏质量与边界</p>
        </div>
      </section>

      <section class="panel-card">
        <div class="panel-head">
          <span>筛选条件</span>
          <span class="panel-link">科研合规管理员视角</span>
        </div>

        <div class="filter-grid">
          <div class="filter-item">
            <label>类型</label>
            <select v-model="filters.type" @change="applyFilters">
              <option
                  v-for="item in board.filters.typeOptions"
                  :key="item.value"
                  :value="item.value"
              >
                {{ item.label }}
              </option>
            </select>
          </div>

          <div class="filter-item">
            <label>状态</label>
            <select v-model="filters.status" @change="applyFilters">
              <option
                  v-for="item in board.filters.statusOptions"
                  :key="item.value"
                  :value="item.value"
              >
                {{ item.label }}
              </option>
            </select>
          </div>
        </div>
      </section>

      <section class="content-grid">
        <div class="panel-card">
          <div class="panel-head">
            <span>治理队列</span>
            <span class="panel-link">按更新时间</span>
          </div>

          <div v-if="board.queue.length" class="queue-list">
            <div
                v-for="item in board.queue"
                :key="item.id"
                class="queue-item"
                :class="{ active: selected?.id === item.id }"
                @click="selectApproval(item.id)"
            >
              <div class="queue-top">
                <div class="queue-id">{{ item.approvalCode }}</div>
                <div :class="['queue-badge', item.statusClass]">{{ item.status }}</div>
              </div>
              <div class="queue-title">{{ item.title }}</div>
              <div class="queue-desc">
                {{ item.typeLabel }} · {{ item.applicantName }} · {{ item.projectName }}
              </div>
              <div class="queue-meta">{{ item.updatedAt }}</div>
            </div>
          </div>

          <div v-else class="empty-text">当前筛选条件下暂无治理记录</div>
        </div>

        <div class="panel-card">
          <div class="panel-head">
            <span>当前审批详情</span>
            <span class="panel-link">{{ selected?.approvalCode || '--' }}</span>
          </div>

          <template v-if="selected">
            <div class="detail-list">
              <div class="detail-item">
                <label>任务类型</label>
                <div>{{ selected.typeLabel }}</div>
              </div>
              <div class="detail-item">
                <label>当前状态</label>
                <div>{{ selected.status }}</div>
              </div>
              <div class="detail-item">
                <label>申请人</label>
                <div>{{ selected.applicantName }}</div>
              </div>
              <div class="detail-item">
                <label>项目名称</label>
                <div>{{ selected.projectName }}</div>
              </div>
              <div class="detail-item">
                <label>项目编号</label>
                <div>{{ selected.projectCode }}</div>
              </div>
              <div class="detail-item full">
                <label>材料摘要</label>
                <div>{{ selected.materialSummary }}</div>
              </div>
              <div class="detail-item full">
                <label>数据范围</label>
                <div>{{ selected.dataScope }}</div>
              </div>
            </div>
          </template>

          <div v-else class="empty-text">请选择左侧治理记录查看详情</div>
        </div>

        <div class="panel-card">
          <div class="panel-head">
            <span>审批操作区</span>
            <span class="panel-link">只审合规边界</span>
          </div>

          <template v-if="selected">
            <div class="form-item">
              <label>审核备注</label>
              <textarea
                  v-model="reviewerComment"
                  rows="6"
                  placeholder="请输入审核意见、补充说明或退回原因"
              ></textarea>
            </div>

            <div class="action-box">
              <button
                  class="primary-btn"
                  @click="handleReview('APPROVED')"
                  :disabled="submitting"
              >
                审核通过
              </button>
              <button
                  class="warning-btn"
                  @click="handleReview('RETURNED')"
                  :disabled="submitting"
              >
                退回补充材料
              </button>
              <button
                  class="danger-btn"
                  @click="handleReview('REJECTED')"
                  :disabled="submitting"
              >
                驳回申请
              </button>
            </div>

            <div class="history-box">
              <div class="history-title">历史备注</div>
              <div class="history-content">
                {{ selected.reviewerComment || '暂无历史审核备注' }}
              </div>
            </div>
          </template>

          <div v-else class="empty-text">请选择记录后再进行审批</div>
        </div>
      </section>
    </template>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getApprovalBoardApi, reviewApprovalApi } from '../../api/admin'

const route = useRoute()
const router = useRouter()

const loading = ref(false)
const error = ref('')
const submitting = ref(false)
const reviewerComment = ref('')

const board = ref({
  summary: {
    pendingProjectCount: 0,
    pendingExportCount: 0,
    pendingQcCount: 0
  },
  filters: {
    currentType: 'ALL',
    currentStatus: 'ALL',
    typeOptions: [],
    statusOptions: []
  },
  queue: [],
  selected: null
})

const selected = ref(null)
const filters = ref({
  type: 'ALL',
  status: 'ALL'
})

async function fetchBoard() {
  try {
    loading.value = true
    error.value = ''

    const data = await getApprovalBoardApi({
      approvalId: route.query.approvalId || '',
      type: filters.value.type,
      status: filters.value.status
    })

    board.value = data
    selected.value = data.selected || null
    reviewerComment.value = data.selected?.reviewerComment || ''
  } catch (err) {
    error.value = err.message || '项目合规治理页加载失败'
  } finally {
    loading.value = false
  }
}

async function applyFilters() {
  await router.replace({
    path: '/admin/permissions',
    query: {
      scope: 'research',
      approvalId: route.query.approvalId || '',
      type: filters.value.type,
      status: filters.value.status
    }
  })
  await fetchBoard()
}

async function selectApproval(id) {
  await router.replace({
    path: '/admin/permissions',
    query: {
      scope: 'research',
      approvalId: id,
      type: filters.value.type,
      status: filters.value.status
    }
  })
  await fetchBoard()
}

async function handleReview(nextStatus) {
  if (!selected.value) return

  try {
    submitting.value = true
    await reviewApprovalApi(selected.value.id, {
      nextStatus,
      reviewerComment: reviewerComment.value
    })
    window.alert('审批处理成功')
    await fetchBoard()
  } catch (err) {
    window.alert(err.message || '审批失败')
  } finally {
    submitting.value = false
  }
}

onMounted(() => {
  filters.value.type = String(route.query.type || 'ALL')
  filters.value.status = String(route.query.status || 'ALL')
  fetchBoard()
})
</script>

<style scoped>
.approval-page {
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
.queue-desc,
.queue-meta,
.panel-link,
.page-tip,
.empty-text,
.history-content {
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

.metric-grid,
.filter-grid,
.content-grid {
  display: grid;
  gap: 14px;
}

.metric-grid {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.filter-grid {
  grid-template-columns: 1fr 1fr;
}

.content-grid {
  grid-template-columns: 0.92fr 1.02fr 0.86fr;
}

.metric-card,
.panel-card,
.queue-item,
.detail-item,
.history-box {
  background: rgba(255, 255, 255, 0.82);
  border: 1px solid #dce8f4;
  border-radius: 22px;
  box-shadow: 0 10px 30px rgba(17, 56, 102, 0.05);
}

.metric-card {
  padding: 18px;
}

.metric-card span {
  display: block;
  font-size: 13px;
  color: #7590b0;
}

.metric-card strong {
  display: block;
  margin-top: 10px;
  font-size: 32px;
  color: #17385f;
}

.metric-card p {
  margin: 8px 0 0;
  font-size: 12px;
  line-height: 1.8;
  color: #7892b0;
}

.panel-card {
  padding: 18px;
}

.panel-head,
.queue-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
}

.panel-head {
  padding-bottom: 12px;
  margin-bottom: 12px;
  border-bottom: 1px solid #e6eef7;
  font-size: 15px;
  font-weight: 800;
  color: #17385f;
}

.filter-item label,
.detail-item label,
.form-item label {
  display: block;
  font-size: 12px;
  color: #7a93af;
  margin-bottom: 8px;
}

.filter-item select,
.form-item textarea {
  width: 100%;
  border: 1px solid #d8e5f2;
  border-radius: 14px;
  background: #fff;
  padding: 12px 14px;
  font-size: 14px;
  color: #1d466f;
  outline: none;
}

.queue-list,
.detail-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.queue-item {
  padding: 16px;
  background: #f9fcff;
  border: 1px solid #e3edf7;
  box-shadow: none;
  cursor: pointer;
}

.queue-item.active {
  background: #edf6ff;
  border-color: #bfd8f8;
}

.queue-id {
  font-size: 12px;
  color: #7a93af;
}

.queue-badge {
  padding: 6px 10px;
  border-radius: 999px;
  font-size: 12px;
}

.queue-badge.warning {
  background: #fff5df;
  color: #c98912;
}

.queue-badge.blue {
  background: #edf6ff;
  color: #2a70b8;
}

.queue-badge.success {
  background: #ecfbf5;
  color: #14906a;
}

.queue-badge.danger {
  background: #feecec;
  color: #d83b3b;
}

.queue-title {
  margin-top: 10px;
  font-size: 15px;
  font-weight: 800;
  color: #1d466f;
}

.detail-item {
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

.form-item {
  margin-top: 4px;
}

.action-box {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  margin-top: 16px;
}

.primary-btn,
.warning-btn,
.danger-btn {
  height: 42px;
  padding: 0 16px;
  border: none;
  border-radius: 12px;
  color: #fff;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  white-space: nowrap;
}

.primary-btn {
  background: linear-gradient(135deg, #2563eb, #0ea5e9);
}

.warning-btn {
  background: linear-gradient(135deg, #f59e0b, #fbbf24);
}

.danger-btn {
  background: linear-gradient(135deg, #dc2626, #f97316);
}

.history-box {
  margin-top: 16px;
  padding: 14px;
  background: #f9fcff;
  border: 1px solid #e3edf7;
  box-shadow: none;
}

.history-title {
  font-size: 14px;
  font-weight: 800;
  color: #1d466f;
  margin-bottom: 8px;
}

@media (max-width: 1280px) {
  .metric-grid,
  .filter-grid,
  .content-grid {
    grid-template-columns: 1fr;
  }
}
</style>
