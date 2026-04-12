<template>
  <div class="cloud-page">
    <div class="page-head">
      <div>
        <h1>影像云平台</h1>
        <div class="page-subtitle">研究副本浏览、历史对比、热力图查看与质控确认</div>
      </div>

      <div class="head-actions">
        <button
            v-if="board.contextBanner.hasTaskContext"
            class="ghost-btn"
            @click="goBackToTask"
        >
          返回协作任务
        </button>
        <button class="ghost-btn" @click="goToReferral" :disabled="!selectedImage">
          发起会诊
        </button>
        <button class="primary-btn" @click="goToDiagnosis" :disabled="!selectedImage">
          进入影像诊断
        </button>
      </div>
    </div>

    <div v-if="loading" class="page-tip">正在加载影像云平台数据...</div>
    <div v-else-if="error" class="page-tip error">{{ error }}</div>

    <template v-else>
      <section class="context-banner" v-if="board.contextBanner.projectName || board.contextBanner.taskTitle">
        <div class="context-item" v-if="board.contextBanner.projectName">
          <label>当前项目</label>
          <span>{{ board.contextBanner.projectName }}</span>
        </div>
        <div class="context-item" v-if="board.contextBanner.taskTitle">
          <label>关联任务</label>
          <span>{{ board.contextBanner.taskTitle }}</span>
        </div>
      </section>

      <section class="metric-grid">
        <div class="metric-card">
          <div class="metric-label">影像总量</div>
          <div class="metric-value">{{ board.summary.totalImages }}</div>
          <div class="metric-note">当前可访问影像</div>
        </div>

        <div class="metric-card">
          <div class="metric-label">待质控</div>
          <div class="metric-value">{{ board.summary.pendingQc }}</div>
          <div class="metric-note">建议优先复核</div>
        </div>

        <div class="metric-card">
          <div class="metric-label">共享 / 副本</div>
          <div class="metric-value">{{ board.summary.sharedCopies }}</div>
          <div class="metric-note">会诊 / 科研副本</div>
        </div>

        <div class="metric-card">
          <div class="metric-label">活跃协同</div>
          <div class="metric-value">{{ board.summary.activeConsultations }}</div>
          <div class="metric-note">关联会诊 / 转诊</div>
        </div>
      </section>

      <section class="content-grid">
        <!-- 左侧：影像列表 -->
        <div class="panel-card">
          <div class="panel-head">
            <span>影像列表</span>
            <span class="panel-link">可访问影像</span>
          </div>

          <div class="filter-row">
            <button
                v-for="item in board.filters.modalityOptions"
                :key="item.value"
                class="filter-chip"
                :class="{ active: currentModality === item.value }"
                @click="handleModalityChange(item.value)"
            >
              {{ item.label }}
            </button>
          </div>

          <div v-if="board.imageList.length" class="image-list">
            <div
                v-for="item in board.imageList"
                :key="item.imageId"
                class="image-item"
                :class="{ active: selectedImage?.imageId === item.imageId }"
                @click="handleSelectImage(item)"
            >
              <div class="image-title">{{ item.title }}</div>
              <div class="image-meta">{{ item.meta }}</div>
            </div>
          </div>

          <div v-else class="empty-text">当前条件下暂无影像</div>
        </div>

        <!-- 中间：影像查看 -->
        <div class="panel-card">
          <div class="panel-head">
            <span>影像查看</span>
            <span class="panel-link">{{ selectedImage?.imageCode || '--' }}</span>
          </div>

          <template v-if="selectedImage">
            <div class="viewer-box">
              <img
                  class="base-image"
                  :src="getBackendFileUrl(selectedImage.imageUrl)"
                  alt="当前影像"
              />

              <img
                  v-if="showHeatmap"
                  class="heatmap-image"
                  :src="getBackendFileUrl(selectedImage.heatmapUrl)"
                  alt="热力图"
              />

              <div v-if="showBoxes">
                <div
                    v-for="box in selectedImage.ai.lesionBoxes"
                    :key="box.label"
                    class="lesion-box"
                    :style="getBoxStyle(box)"
                >
                  <span class="box-label">{{ box.label }}</span>
                </div>
              </div>
            </div>

            <div class="viewer-tool-row">
              <button
                  class="tool-chip"
                  :class="{ active: showHeatmap }"
                  @click="showHeatmap = !showHeatmap"
              >
                热力图
              </button>
              <button
                  class="tool-chip"
                  :class="{ active: showBoxes }"
                  @click="showBoxes = !showBoxes"
              >
                病灶框
              </button>
              <button class="tool-chip passive">{{ selectedImage.modalityLabel }}</button>
              <button class="tool-chip passive">{{ selectedImage.accessLevelLabel }}</button>
            </div>

            <div class="compare-grid">
              <div class="compare-card">
                <div class="compare-title">{{ selectedImage.compare.historyLabel }}</div>
                <div class="compare-image-wrap">
                  <img
                      :src="getBackendFileUrl(selectedImage.compare.historyImageUrl)"
                      alt="历史影像"
                  />
                </div>
              </div>

              <div class="compare-card">
                <div class="compare-title">{{ selectedImage.compare.currentLabel }}</div>
                <div class="compare-image-wrap">
                  <img
                      :src="getBackendFileUrl(selectedImage.compare.currentImageUrl)"
                      alt="当前影像"
                  />
                </div>
              </div>
            </div>
          </template>

          <div v-else class="empty-text">请选择左侧影像查看详情</div>
        </div>

        <!-- 右侧：详情 / 质控 / AI -->
        <div class="right-stack">
          <div class="panel-card">
            <div class="panel-head">
              <span>影像详情</span>
              <span class="panel-link">基础信息</span>
            </div>

            <template v-if="selectedImage">
              <div class="detail-grid">
                <div class="detail-item">
                  <label>病例编号</label>
                  <div>{{ selectedImage.caseCode }}</div>
                </div>
                <div class="detail-item">
                  <label>患者编号</label>
                  <div>{{ selectedImage.patientCode }}</div>
                </div>
                <div class="detail-item">
                  <label>患者姓名</label>
                  <div>{{ selectedImage.patientName }}</div>
                </div>
                <div class="detail-item">
                  <label>采集日期</label>
                  <div>{{ selectedImage.capturedAt }}</div>
                </div>
                <div class="detail-item">
                  <label>病灶部位</label>
                  <div>{{ selectedImage.bodyPart }}</div>
                </div>
                <div class="detail-item">
                  <label>采集设备</label>
                  <div>{{ selectedImage.deviceName }}</div>
                </div>
              </div>
            </template>

            <div v-else class="empty-text">暂无影像详情</div>
          </div>

          <div class="panel-card">
            <div class="panel-head">
              <span>质控结果</span>
              <span class="panel-link">{{ selectedImage?.qc.label || '--' }}</span>
            </div>

            <template v-if="selectedImage">
              <div class="qc-list">
                <div
                    v-for="item in selectedImage.qc.items"
                    :key="item.label"
                    class="qc-item"
                >
                  <label>{{ item.label }}</label>
                  <div :class="['qc-value', item.status]">{{ item.value }}</div>
                </div>
              </div>

              <div class="panel-actions">
                <button class="primary-btn" @click="handleConfirmQc" :disabled="selectedImage.qc.passed">
                  {{ selectedImage.qc.passed ? '已质控通过' : '标记质控通过' }}
                </button>
                <button class="ghost-btn" @click="goToRecords">查看病例</button>
              </div>
            </template>

            <div v-else class="empty-text">暂无质控信息</div>
          </div>

          <div class="panel-card">
            <div class="panel-head">
              <span>AI 辅助摘要</span>
              <span class="panel-link">{{ selectedImage?.ai.modelVersion || '--' }}</span>
            </div>

            <template v-if="selectedImage">
              <div class="risk-box">
                <div class="risk-label">风险参考</div>
                <div class="risk-value">{{ selectedImage.ai.riskText }}</div>
              </div>

              <div class="top3-list">
                <div v-for="item in selectedImage.ai.top3" :key="item.name" class="top3-item">
                  <div class="top3-head">
                    <span>{{ item.name }}</span>
                    <span>{{ Math.round(item.prob * 100) }}%</span>
                  </div>
                  <div class="top3-bar">
                    <i :class="['bar-inner', item.color]" :style="{ width: `${Math.round(item.prob * 100)}%` }"></i>
                  </div>
                </div>
              </div>

              <div class="summary-box">
                {{ selectedImage.ai.summary }}
              </div>
            </template>

            <div v-else class="empty-text">暂无 AI 分析摘要</div>
          </div>
        </div>
      </section>
    </template>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  confirmImageQcApi,
  getBackendFileUrl,
  getImagingCloudBoardApi
} from '../../api/imaging'

const route = useRoute()
const router = useRouter()

const loading = ref(false)
const error = ref('')
const showHeatmap = ref(true)
const showBoxes = ref(true)

const board = ref({
  contextBanner: {
    projectName: '',
    taskTitle: '',
    hasTaskContext: false
  },
  summary: {
    totalImages: 0,
    pendingQc: 0,
    sharedCopies: 0,
    activeConsultations: 0
  },
  filters: {
    currentModality: 'ALL',
    modalityOptions: []
  },
  imageList: [],
  selectedImage: null
})

const selectedImage = ref(null)
const currentModality = ref('ALL')

function getQueryParams(modality = currentModality.value) {
  return {
    projectId: route.query.projectId || '',
    taskId: route.query.taskId || '',
    caseId: route.query.caseId || '',
    imageId: route.query.imageId || '',
    modality
  }
}

async function fetchBoard(modality = currentModality.value) {
  try {
    loading.value = true
    error.value = ''

    const data = await getImagingCloudBoardApi(getQueryParams(modality))
    board.value = data
    selectedImage.value = data.selectedImage || null
    currentModality.value = data.filters?.currentModality || modality
  } catch (err) {
    error.value = err.message || '影像云数据加载失败'
  } finally {
    loading.value = false
  }
}

async function handleSelectImage(item) {
  await router.replace({
    path: '/doctor/imaging-cloud',
    query: {
      ...route.query,
      caseId: item.caseId,
      imageId: item.imageId,
      modality: currentModality.value
    }
  })

  await fetchBoard(currentModality.value)
}

async function handleModalityChange(modality) {
  currentModality.value = modality

  await router.replace({
    path: '/doctor/imaging-cloud',
    query: {
      ...route.query,
      modality
    }
  })

  await fetchBoard(modality)
}

async function handleConfirmQc() {
  if (!selectedImage.value) return

  try {
    await confirmImageQcApi(selectedImage.value.imageId)
    window.alert('影像质控已确认通过')
    await fetchBoard(currentModality.value)
  } catch (err) {
    window.alert(err.message || '操作失败')
  }
}

function getBoxStyle(box) {
  return {
    left: `${box.x}%`,
    top: `${box.y}%`,
    width: `${box.w}%`,
    height: `${box.h}%`
  }
}

function goToDiagnosis() {
  if (!selectedImage.value) return

  router.push({
    path: '/doctor/diagnosis',
    query: {
      caseId: selectedImage.value.caseId,
      imageId: selectedImage.value.imageId
    }
  })
}

function goToRecords() {
  if (!selectedImage.value) return

  router.push({
    path: '/doctor/records',
    query: {
      caseId: selectedImage.value.caseId
    }
  })
}

function goToReferral() {
  if (!selectedImage.value) return

  router.push({
    path: '/doctor/referral',
    query: {
      caseId: selectedImage.value.caseId
    }
  })
}

function goBackToTask() {
  router.push('/doctor/research/recruit')
}

onMounted(() => {
  fetchBoard(route.query.modality || 'ALL')
})
</script>

<style scoped>
.cloud-page {
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
.panel-link,
.page-tip,
.empty-text,
.context-item label,
.detail-item label,
.qc-item label,
.risk-label,
.summary-box {
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

.head-actions,
.panel-actions {
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
  white-space: nowrap;
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

.context-banner {
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
}

.context-item {
  padding: 12px 14px;
  border-radius: 16px;
  background: #f9fcff;
  border: 1px solid #e3edf7;
}

.context-item span {
  display: block;
  font-size: 14px;
  font-weight: 700;
  color: #1d466f;
}

.metric-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 14px;
}

.metric-card,
.panel-card,
.image-item,
.compare-card,
.detail-item,
.qc-item,
.summary-box {
  background: rgba(255, 255, 255, 0.82);
  border: 1px solid #dce8f4;
  border-radius: 22px;
  box-shadow: 0 10px 30px rgba(17, 56, 102, 0.05);
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
  font-size: 34px;
  font-weight: 800;
  color: #17385f;
}

.metric-note {
  margin-top: 8px;
}

.content-grid {
  display: grid;
  grid-template-columns: 0.78fr 1.08fr 0.82fr;
  gap: 16px;
}

.right-stack {
  display: flex;
  flex-direction: column;
  gap: 16px;
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

.filter-row {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 14px;
}

.filter-chip,
.tool-chip {
  height: 34px;
  padding: 0 14px;
  border-radius: 999px;
  border: 1px solid #d8e5f2;
  background: #f7fbff;
  color: #5f7c98;
  font-size: 12px;
  cursor: pointer;
}

.filter-chip.active,
.tool-chip.active {
  background: #edf6ff;
  color: #2a70b8;
  border-color: #bfd8f8;
}

.tool-chip.passive {
  cursor: default;
}

.image-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.image-item {
  padding: 14px;
  background: #f9fcff;
  border: 1px solid #e3edf7;
  box-shadow: none;
  cursor: pointer;
}

.image-item.active {
  background: #edf6ff;
  border-color: #bfd8f8;
}

.image-title,
.compare-title {
  font-size: 14px;
  font-weight: 800;
  color: #1d466f;
}

.image-meta {
  margin-top: 8px;
  font-size: 12px;
  line-height: 1.8;
  color: #7892b0;
}

.viewer-box {
  position: relative;
  width: 100%;
  aspect-ratio: 3 / 4;
  border-radius: 22px;
  overflow: hidden;
  background: #eef4fa;
  border: 1px solid #dce8f4;
}

.base-image,
.heatmap-image {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.heatmap-image {
  opacity: 0.68;
  pointer-events: none;
}

.lesion-box {
  position: absolute;
  border: 2px solid #ffd84a;
  box-sizing: border-box;
}

.box-label {
  position: absolute;
  left: 0;
  top: -30px;
  white-space: nowrap;
  padding: 4px 8px;
  border-radius: 10px;
  background: #ffd326;
  color: #403300;
  font-size: 12px;
  font-weight: 700;
}

.viewer-tool-row {
  margin-top: 14px;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.compare-grid {
  margin-top: 16px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}

.compare-card {
  padding: 14px;
  background: #f9fcff;
  border: 1px solid #e3edf7;
  box-shadow: none;
}

.compare-image-wrap {
  margin-top: 12px;
  height: 220px;
  border-radius: 18px;
  overflow: hidden;
  background: #eef4fa;
  border: 1px solid #dfe8f2;
}

.compare-image-wrap img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.detail-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.detail-item,
.qc-item {
  padding: 14px;
  background: #f9fcff;
  border: 1px solid #e3edf7;
  box-shadow: none;
}

.detail-item div,
.qc-value {
  font-size: 14px;
  color: #1d466f;
  line-height: 1.7;
}

.qc-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.qc-value.good {
  color: #14906a;
}

.qc-value.warn {
  color: #c98912;
}

.risk-box {
  padding: 14px;
  border-radius: 16px;
  background: #f9fcff;
  border: 1px solid #e3edf7;
  text-align: center;
}

.risk-value {
  margin-top: 6px;
  font-size: 46px;
  font-weight: 900;
  color: #df4545;
}

.top3-list {
  margin-top: 14px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.top3-item {
  padding: 4px 0;
}

.top3-head {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  color: #1d466f;
  font-weight: 700;
  margin-bottom: 8px;
}

.top3-bar {
  width: 100%;
  height: 8px;
  border-radius: 999px;
  background: #e8eef6;
  overflow: hidden;
}

.bar-inner {
  display: block;
  height: 100%;
  border-radius: inherit;
}

.bar-inner.red {
  background: #ef5a5a;
}

.bar-inner.gold {
  background: #f5b722;
}

.bar-inner.blue {
  background: #4d89e6;
}

.summary-box {
  margin-top: 14px;
  padding: 14px;
  background: #f9fcff;
  border: 1px solid #e3edf7;
  box-shadow: none;
}

.empty-text {
  padding: 12px 0;
}

@media (max-width: 1360px) {
  .page-head {
    flex-direction: column;
    align-items: flex-start;
  }

  .metric-grid,
  .content-grid,
  .detail-grid,
  .compare-grid {
    grid-template-columns: 1fr;
  }
}
</style>
