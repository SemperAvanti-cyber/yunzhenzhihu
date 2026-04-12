<template>
  <div class="referral-page">
    <div class="page-head">
      <div>
        <h1>分级诊疗</h1>
        <div class="page-subtitle">发起上转或会诊，查看申请状态与回传意见</div>
      </div>

      <div class="head-actions">
        <button class="ghost-btn" @click="goToRecords" :disabled="!selected">
          查看病例
        </button>
        <button class="primary-btn" @click="handleCreate" :disabled="submitting">
          {{ submitting ? '提交中...' : '提交申请' }}
        </button>
      </div>
    </div>

    <div v-if="loading" class="page-tip">正在加载分级诊疗数据...</div>
    <div v-else-if="error" class="page-tip error">{{ error }}</div>

    <template v-else>
      <section class="metric-grid">
        <div class="metric-card">
          <div class="metric-label">待审批</div>
          <div class="metric-value">{{ board.summary.pendingCount }}</div>
        </div>
        <div class="metric-card">
          <div class="metric-label">处理中</div>
          <div class="metric-value">{{ board.summary.progressCount }}</div>
        </div>
        <div class="metric-card">
          <div class="metric-label">已完成</div>
          <div class="metric-value">{{ board.summary.completedCount }}</div>
        </div>
      </section>

      <section class="content-grid">
        <!-- 左 -->
        <div class="panel-card">
          <div class="panel-head">
            <span>申请队列</span>
            <span class="panel-link">我的申请</span>
          </div>

          <div class="filter-row">
            <button
                v-for="item in board.filters.statusOptions"
                :key="item.value"
                class="filter-chip"
                :class="{ active: currentStatus === item.value }"
                @click="handleStatusChange(item.value)"
            >
              {{ item.label }}
            </button>
          </div>

          <div v-if="board.queue.length" class="queue-list">
            <div
                v-for="item in board.queue"
                :key="item.referralId"
                class="queue-item"
                :class="{ active: selected?.referralId === item.referralId }"
                @click="handleSelect(item.referralId, item.caseId)"
            >
              <div class="queue-top">
                <span class="queue-code">{{ item.referralCode }}</span>
                <span :class="['queue-status', item.statusClass]">{{ item.status }}</span>
              </div>
              <div class="queue-title">{{ item.patientName }}</div>
              <div class="queue-desc">{{ item.caseCode }} · {{ item.typeLabel }}</div>
              <div class="queue-meta">{{ item.updatedAt }}</div>
            </div>
          </div>

          <div v-else class="empty-text">当前筛选下暂无申请</div>
        </div>

        <!-- 中 -->
        <div class="panel-card">
          <div class="panel-head">
            <span>申请详情</span>
            <span class="panel-link">{{ selected?.referralCode || '--' }}</span>
          </div>

          <template v-if="selected">
            <div class="preview-box" v-if="selected.previewUrl">
              <img :src="getBackendFileUrl(selected.previewUrl)" alt="" />
            </div>

            <div class="detail-grid">
              <div class="info-item">
                <label>病例编号</label>
                <div>{{ selected.caseCode }}</div>
              </div>
              <div class="info-item">
                <label>患者姓名</label>
                <div>{{ selected.patientName }}</div>
              </div>
              <div class="info-item">
                <label>患者编号</label>
                <div>{{ selected.patientCode }}</div>
              </div>
              <div class="info-item">
                <label>协同类型</label>
                <div>{{ selected.typeLabel }}</div>
              </div>
              <div class="info-item">
                <label>转出医院</label>
                <div>{{ selected.fromHospital }}</div>
              </div>
              <div class="info-item">
                <label>目标医院</label>
                <div>{{ selected.toHospital }}</div>
              </div>
              <div class="info-item full">
                <label>申请说明</label>
                <div>{{ selected.note }}</div>
              </div>
            </div>

            <div v-if="selected.callbackOpinion" class="callback-box">
              <div class="callback-title">回传意见</div>
              <div class="callback-content">{{ selected.callbackOpinion }}</div>
              <button class="ghost-btn" @click="handleAcknowledge">
                已阅回传意见
              </button>
            </div>
          </template>

          <div v-else class="empty-text">请选择左侧申请查看详情</div>
        </div>

        <!-- 右 -->
        <div class="panel-card">
          <div class="panel-head">
            <span>发起申请</span>
            <span class="panel-link">简洁操作区</span>
          </div>

          <div class="form-item">
            <label>选择病例</label>
            <select v-model="form.caseId">
              <option :value="null">请选择病例</option>
              <option v-for="item in board.formOptions.caseOptions" :key="item.value" :value="item.value">
                {{ item.label }}
              </option>
            </select>
          </div>

          <div class="form-item">
            <label>申请类型</label>
            <select v-model="form.type">
              <option v-for="item in board.formOptions.typeOptions" :key="item.value" :value="item.value">
                {{ item.label }}
              </option>
            </select>
          </div>

          <div class="form-item">
            <label>目标医院</label>
            <select v-model="form.toHospitalId">
              <option :value="null">请选择医院</option>
              <option v-for="item in board.formOptions.hospitalOptions" :key="item.value" :value="item.value">
                {{ item.label }}
              </option>
            </select>
          </div>

          <div class="form-item">
            <label>申请备注</label>
            <textarea v-model="form.note" rows="4" placeholder="请输入申请原因或补充说明"></textarea>
          </div>

          <div class="action-stack">
            <button class="primary-btn full" @click="handleCreate" :disabled="submitting">
              {{ submitting ? '提交中...' : '提交申请' }}
            </button>
            <button class="ghost-btn full" @click="goToDiagnosis" :disabled="!form.caseId && !selected">
              进入影像诊断
            </button>
          </div>
        </div>
      </section>
    </template>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  acknowledgeReferralApi,
  createReferralApi,
  getBackendFileUrl,
  getReferralBoardApi
} from '../../api/referrals'

const route = useRoute()
const router = useRouter()

const loading = ref(false)
const error = ref('')
const submitting = ref(false)
const selected = ref(null)
const currentStatus = ref('ALL')

const board = ref({
  summary: {
    pendingCount: 0,
    progressCount: 0,
    completedCount: 0
  },
  filters: {
    currentStatus: 'ALL',
    statusOptions: []
  },
  queue: [],
  selected: null,
  formOptions: {
    caseOptions: [],
    hospitalOptions: [],
    typeOptions: []
  }
})

const form = reactive({
  caseId: null,
  type: 'REFERRAL',
  toHospitalId: null,
  note: ''
})

async function fetchBoard(status = currentStatus.value) {
  try {
    loading.value = true
    error.value = ''

    const data = await getReferralBoardApi({
      referralId: route.query.referralId || '',
      caseId: route.query.caseId || '',
      status
    })

    board.value = data
    selected.value = data.selected || null
    currentStatus.value = data.filters?.currentStatus || status

    if (!form.caseId && data.formOptions.caseOptions.length) {
      form.caseId = Number(route.query.caseId) || data.formOptions.caseOptions[0].value
    }
  } catch (err) {
    error.value = err.message || '分级诊疗页加载失败'
  } finally {
    loading.value = false
  }
}

async function handleStatusChange(status) {
  currentStatus.value = status
  await router.replace({
    path: '/doctor/referral',
    query: {
      ...route.query,
      status
    }
  })
  await fetchBoard(status)
}

async function handleSelect(referralId, caseId) {
  await router.replace({
    path: '/doctor/referral',
    query: {
      referralId,
      caseId,
      status: currentStatus.value
    }
  })
  await fetchBoard(currentStatus.value)
}

async function handleCreate() {
  try {
    submitting.value = true
    const data = await createReferralApi({
      caseId: form.caseId,
      type: form.type,
      toHospitalId: form.toHospitalId,
      note: form.note
    })

    window.alert(`申请已提交：${data.referralCode}`)
    form.note = ''

    await router.replace({
      path: '/doctor/referral',
      query: {
        referralId: data.referralId,
        caseId: form.caseId,
        status: 'ALL'
      }
    })

    await fetchBoard('ALL')
  } catch (err) {
    window.alert(err.message || '提交失败')
  } finally {
    submitting.value = false
  }
}

async function handleAcknowledge() {
  if (!selected.value) return
  try {
    await acknowledgeReferralApi(selected.value.referralId)
    window.alert('已确认查看回传意见')
  } catch (err) {
    window.alert(err.message || '操作失败')
  }
}

function goToRecords() {
  if (!selected.value) return
  router.push({
    path: '/doctor/records',
    query: {
      caseId: selected.value.caseId
    }
  })
}

function goToDiagnosis() {
  const targetCaseId = form.caseId || selected.value?.caseId
  if (!targetCaseId) return

  router.push({
    path: '/doctor/diagnosis',
    query: {
      caseId: targetCaseId
    }
  })
}

onMounted(() => {
  fetchBoard(route.query.status || 'ALL')
})
</script>

<style scoped>
.referral-page {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.page-head {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  align-items: flex-start;
}

.page-head h1 {
  margin: 0;
  font-size: 28px;
  font-weight: 800;
  color: #17385f;
}

.page-subtitle,
.panel-link,
.page-tip,
.queue-desc,
.queue-meta,
.modal-subtitle,
.callback-content {
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

.head-actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.primary-btn,
.ghost-btn {
  height: 42px;
  padding: 0 16px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
}

.primary-btn {
  border: none;
  color: #fff;
  background: linear-gradient(135deg, #2563eb, #0ea5e9);
}

.ghost-btn {
  border: 1px solid #d8e5f2;
  background: #fff;
  color: #365a7f;
}

.full {
  width: 100%;
}

.metric-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;
}

.metric-card,
.panel-card,
.queue-item,
.info-item,
.callback-box {
  background: rgba(255,255,255,.82);
  border: 1px solid #dce8f4;
  border-radius: 22px;
  box-shadow: 0 10px 30px rgba(17,56,102,.05);
}

.metric-card {
  padding: 18px;
}

.metric-label {
  font-size: 13px;
  color: #7590b0;
}

.metric-value {
  margin-top: 10px;
  font-size: 32px;
  font-weight: 800;
  color: #17385f;
}

.content-grid {
  display: grid;
  grid-template-columns: 0.84fr 1.02fr 0.86fr;
  gap: 16px;
}

.panel-card {
  padding: 18px;
}

.panel-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 12px;
  margin-bottom: 12px;
  border-bottom: 1px solid #e6eef7;
  font-size: 15px;
  font-weight: 800;
  color: #17385f;
}

.filter-row {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 14px;
}

.filter-chip {
  height: 34px;
  padding: 0 14px;
  border-radius: 999px;
  border: 1px solid #d8e5f2;
  background: #f7fbff;
  color: #5f7c98;
  font-size: 12px;
  cursor: pointer;
}

.filter-chip.active {
  background: #edf6ff;
  color: #2a70b8;
  border-color: #bfd8f8;
}

.queue-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.queue-item {
  padding: 14px;
  cursor: pointer;
}

.queue-item.active {
  background: #edf6ff;
  border-color: #bfd8f8;
}

.queue-top {
  display: flex;
  justify-content: space-between;
  gap: 12px;
}

.queue-code {
  font-size: 12px;
  color: #7a93af;
  font-weight: 700;
}

.queue-status {
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 12px;
}

.queue-status.warning {
  background: #fff5df;
  color: #c98912;
}

.queue-status.blue {
  background: #edf6ff;
  color: #2a70b8;
}

.queue-status.success {
  background: #ecfbf5;
  color: #14906a;
}

.queue-status.danger {
  background: #feecec;
  color: #d83b3b;
}

.queue-title {
  margin-top: 8px;
  font-size: 15px;
  font-weight: 800;
  color: #1d466f;
}

.preview-box {
  width: 100%;
  aspect-ratio: 4 / 3;
  border-radius: 22px;
  overflow: hidden;
  background: #eef4fa;
  border: 1px solid #dce8f4;
  margin-bottom: 16px;
}

.preview-box img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.detail-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.info-item {
  padding: 14px;
}

.info-item.full {
  grid-column: 1 / -1;
}

.info-item label {
  display: block;
  font-size: 12px;
  color: #7a93af;
  margin-bottom: 8px;
}

.info-item div {
  font-size: 14px;
  color: #1d466f;
  line-height: 1.7;
}

.callback-box {
  margin-top: 16px;
  padding: 14px;
}

.callback-title {
  font-size: 14px;
  font-weight: 800;
  color: #1d466f;
}

.form-item {
  margin-top: 14px;
}

.form-item label {
  display: block;
  font-size: 12px;
  color: #7a93af;
  margin-bottom: 8px;
}

.form-item select,
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

.action-stack {
  margin-top: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.empty-text {
  padding: 12px 0;
  color: #7892b0;
}

@media (max-width: 1360px) {
  .page-head {
    flex-direction: column;
    align-items: flex-start;
  }

  .metric-grid,
  .content-grid,
  .detail-grid {
    grid-template-columns: 1fr;
  }
}
</style>
