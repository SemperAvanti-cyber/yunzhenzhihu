<template>
  <div class="clinical-page">
    <section class="hero-card">
      <div class="hero-top">
        <div>
          <div class="hero-kicker">临床总览</div>
          <h1>工作概览</h1>
          <div class="hero-meta">门诊诊疗 · 影像复核 · 转诊协同</div>
        </div>

      </div>

      <div v-if="loading" class="page-tip">正在加载工作台数据...</div>
      <div v-else-if="error" class="page-tip error">{{ error }}</div>
    </section>

    <section class="metric-grid">
      <div v-for="metric in metrics" :key="metric.label" class="metric-card">
        <div class="metric-head">
          <span class="metric-label">{{ metric.label }}</span>
          <span :class="['metric-trend', metric.type]">{{ metric.trend }}</span>
        </div>
        <div class="metric-value">{{ metric.value }}</div>
        <div class="metric-note">{{ metric.note }}</div>
      </div>
    </section>

    <section class="content-grid">
      <div class="panel-card">
        <div class="panel-head">
          <span>待处理队列</span>
          <button class="panel-link-btn" @click="sortQueueByPriority">按优先级</button>
        </div>

        <div v-if="queueList.length" class="queue-list">
          <div
              v-for="item in queueList"
              :key="item.id"
              class="queue-item interactive-card"
              @click="handleQueueClick(item)"
          >
            <div class="queue-main">
              <div :class="['risk-tag', item.riskClass]">{{ item.risk }}</div>
              <div>
                <div class="queue-title">{{ item.title }}</div>
                <div class="queue-meta">{{ item.meta }}</div>
              </div>
            </div>

            <div class="queue-side">
              <div class="queue-prob">{{ item.rightTop }}</div>
              <div class="queue-deadline">{{ item.rightBottom }}</div>
            </div>
          </div>
        </div>
        <div v-else class="empty-text">当前暂无待处理任务</div>
      </div>

      <div class="panel-card">
        <div class="panel-head">
          <span>最近动态</span>
          <button class="panel-link-btn" @click="goToRecords">临床相关</button>
        </div>

        <div v-if="updates.length" class="update-list">
          <div
              v-for="item in updates"
              :key="item.id"
              class="update-item interactive-card"
              @click="handleUpdateClick(item)"
          >
            <div class="update-top">
              <span :class="['update-tag', item.tagClass]">{{ item.tag }}</span>
              <span class="update-time">{{ item.time }}</span>
            </div>
            <div class="update-title">{{ item.title }}</div>
            <div class="update-meta">{{ item.meta }}</div>
          </div>
        </div>
        <div v-else class="empty-text">暂无最近动态</div>
      </div>
    </section>

    <section class="panel-card">
      <div class="panel-head">
        <span>重点关注</span>
        <button class="panel-link-btn" @click="goToReferral">当前状态</button>
      </div>

      <div class="focus-grid">
        <div class="focus-card interactive-card" @click="goToReferral('high-risk')">
          <div class="focus-title">高危病例待接收</div>
          <div class="focus-value">{{ focusStats.highRiskPending }}</div>
        </div>
        <div class="focus-card interactive-card" @click="goToRecords('follow-up')">
          <div class="focus-title">异常随访提醒</div>
          <div class="focus-value">{{ focusStats.followUpReminders }}</div>
        </div>
        <div class="focus-card interactive-card" @click="goToReferral('callback')">
          <div class="focus-title">待回传复核结果</div>
          <div class="focus-value">{{ focusStats.pendingCallbacks }}</div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { getWorkbenchApi } from '../../api/clinical'

const router = useRouter()

const loading = ref(false)
const error = ref('')
const metrics = ref([])
const queueList = ref([])
const updates = ref([])
const focusStats = ref({
  highRiskPending: '0 例',
  followUpReminders: '0 例',
  pendingCallbacks: '0 例'
})

async function fetchWorkbench() {
  try {
    loading.value = true
    error.value = ''

    const data = await getWorkbenchApi()
    metrics.value = data.metrics || []
    queueList.value = data.queueList || []
    updates.value = data.updates || []
    focusStats.value = data.focusStats || {
      highRiskPending: '0 例',
      followUpReminders: '0 例',
      pendingCallbacks: '0 例'
    }
  } catch (err) {
    error.value = err.message || '工作台数据加载失败'
  } finally {
    loading.value = false
  }
}

function goToDiagnosis(caseId) {
  router.push({
    path: '/doctor/diagnosis',
    query: caseId ? { caseId } : {}
  })
}

function goToRecords(tab) {
  router.push({
    path: '/doctor/records',
    query: tab ? { tab } : {}
  })
}

function goToReferral(tab) {
  router.push({
    path: '/doctor/referral',
    query: tab ? { tab } : {}
  })
}

function handleQueueClick(item) {
  if (item.target === 'diagnosis') {
    goToDiagnosis(item.caseId)
    return
  }

  if (item.target === 'referral') {
    router.push({
      path: '/doctor/referral',
      query: {
        caseId: item.caseId,
        referralCode: item.referralCode || '',
        tab: 'queue'
      }
    })
    return
  }

  goToRecords('follow-up')
}

function handleUpdateClick(item) {
  if (item.target === 'referral') {
    router.push({
      path: '/doctor/referral',
      query: {
        referralCode: item.referralCode || '',
        tab: 'updates'
      }
    })
    return
  }

  if (item.target === 'diagnosis') {
    goToDiagnosis(item.caseId)
    return
  }

  goToRecords()
}

function sortQueueByPriority() {
  queueList.value = [...queueList.value].sort((a, b) => (b.priority || 0) - (a.priority || 0))
}

onMounted(fetchWorkbench)
</script>

<style scoped>
.clinical-page {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.hero-card,
.metric-card,
.panel-card,
.focus-card {
  background: rgba(255, 255, 255, 0.82);
  border: 1px solid #dce8f4;
  border-radius: 22px;
  box-shadow: 0 10px 30px rgba(17, 56, 102, 0.05);
}

.hero-card {
  padding: 24px 26px;
  background:
      radial-gradient(circle at top right, rgba(37, 99, 235, 0.06), transparent 30%),
      linear-gradient(180deg, #ffffff 0%, #f8fbff 100%);
}

.hero-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}

.hero-kicker {
  font-size: 12px;
  color: #7c95b1;
  letter-spacing: 0.08em;
}

.hero-card h1 {
  margin: 10px 0 0;
  font-size: 34px;
  color: #17385f;
}

.hero-meta,
.metric-note,
.queue-meta,
.queue-deadline,
.panel-link,
.update-meta,
.update-time,
.page-tip,
.empty-text {
  font-size: 12px;
  color: #7892b0;
  line-height: 1.7;
}

.hero-meta {
  margin-top: 10px;
}

.hero-actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.hero-action-btn {
  height: 40px;
  padding: 0 16px;
  border-radius: 12px;
  border: 1px solid #d8e5f2;
  background: #ffffff;
  color: #365a7f;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
}

.hero-action-btn.primary {
  border: none;
  color: #fff;
  background: linear-gradient(135deg, #2563eb, #0ea5e9);
}

.page-tip {
  margin-top: 12px;
}

.page-tip.error {
  color: #d83b3b;
}

.metric-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 18px;
}

.metric-card {
  padding: 18px;
}

.metric-head,
.panel-head,
.queue-item,
.update-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
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

.metric-value {
  margin-top: 12px;
  font-size: 32px;
  font-weight: 800;
  color: #17385f;
}

.content-grid {
  display: grid;
  grid-template-columns: 1.18fr 0.82fr;
  gap: 18px;
}

.panel-card {
  padding: 18px;
}

.panel-head {
  padding-bottom: 12px;
  margin-bottom: 12px;
  border-bottom: 1px solid #e6eef7;
  color: #17385f;
  font-size: 15px;
  font-weight: 700;
}

.panel-link-btn {
  border: none;
  background: transparent;
  color: #7892b0;
  font-size: 12px;
  cursor: pointer;
}

.queue-list,
.update-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.queue-item,
.update-item {
  padding: 14px;
  border-radius: 16px;
  background: #f9fcff;
  border: 1px solid #e3edf7;
}

.interactive-card {
  cursor: pointer;
  transition: transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease;
}

.interactive-card:hover {
  transform: translateY(-2px);
  border-color: #bfd8f8;
  box-shadow: 0 10px 22px rgba(37, 99, 235, 0.08);
}

.queue-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.queue-main {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
}

.queue-side {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  flex-shrink: 0;
}

.queue-title,
.update-title,
.focus-title {
  font-size: 14px;
  font-weight: 700;
  color: #1d466f;
}

.queue-prob,
.focus-value {
  font-size: 13px;
  font-weight: 700;
  color: #1d466f;
}

.risk-tag {
  min-width: 76px;
  padding: 6px 10px;
  border-radius: 999px;
  font-size: 12px;
  text-align: center;
  flex-shrink: 0;
}

.risk-tag.danger {
  background: #feecec;
  color: #d83b3b;
}

.risk-tag.warning {
  background: #fff5df;
  color: #c98912;
}

.risk-tag.neutral {
  background: #edf6ff;
  color: #2a70b8;
}

.update-tag {
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 12px;
}

.update-tag.blue {
  background: #edf6ff;
  color: #2a70b8;
}

.update-tag.orange {
  background: #fff5df;
  color: #c98912;
}

.update-tag.green {
  background: #ecfbf5;
  color: #14906a;
}

.focus-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
}

.focus-card {
  padding: 18px;
  background: #f9fcff;
  border: 1px solid #e3edf7;
}

.focus-value {
  margin-top: 12px;
  font-size: 24px;
  color: #17385f;
}

.empty-text {
  padding: 16px 4px 8px;
}

@media (max-width: 1360px) {
  .hero-top,
  .metric-grid,
  .content-grid,
  .focus-grid {
    grid-template-columns: 1fr;
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
