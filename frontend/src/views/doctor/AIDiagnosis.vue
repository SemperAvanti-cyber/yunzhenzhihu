<template>
  <div class="diagnosis-page">
    <div class="page-head">
      <div>
        <h1>影像诊断</h1>
        <div class="page-subtitle">调阅影像、查看辅助分析、完成医生复核与判断修正</div>
      </div>

      <div class="head-actions">
        <button class="ghost-btn" @click="handleExport" :disabled="!pageData.caseInfo.caseId">
          导出辅助报告
        </button>
      </div>
    </div>

    <div v-if="loading" class="page-tip">正在加载影像诊断数据...</div>
    <div v-else-if="error" class="page-tip error">{{ error }}</div>

    <section v-else class="content-grid">
      <!-- 左栏 -->
      <div class="panel-card">
        <div class="panel-head">
          <span>影像调阅</span>
          <span class="panel-link">院内同步</span>
        </div>

        <div class="info-list">
          <div class="info-item">
            <label>影像来源</label>
            <div>{{ pageData.caseInfo.sourceLabel }}</div>
          </div>
          <div class="info-item">
            <label>病例编号</label>
            <div>{{ pageData.caseInfo.caseCode }}</div>
          </div>
          <div class="info-item">
            <label>患者编号</label>
            <div>{{ pageData.caseInfo.patientCode }}</div>
          </div>
          <div class="info-item">
            <label>模态识别</label>
            <div>{{ pageData.caseInfo.modalityLabel }}</div>
          </div>
          <div class="info-item">
            <label>病灶部位</label>
            <div>{{ pageData.caseInfo.bodyPart }}</div>
          </div>
          <div class="info-item">
            <label>历史对比</label>
            <div>{{ pageData.caseInfo.historyLabel }}</div>
          </div>
        </div>

        <div class="timeline-title">病例时间轴</div>
        <div class="timeline-list">
          <button
              v-for="item in pageData.timeline"
              :key="item.id"
              class="timeline-chip"
              :class="{ active: item.active }"
              @click="handleSwitchImage(item.id)"
          >
            {{ item.label }}
          </button>
        </div>

        <div class="feature-panel">
          <div class="feature-title">专业特征摘要</div>

          <div class="feature-group">
            <div class="feature-group-title">ABCDE</div>
            <div class="feature-grid">
              <span>对称性：{{ pageData.aiReport.featureJson?.abcde?.asymmetry }}</span>
              <span>边界：{{ pageData.aiReport.featureJson?.abcde?.border }}</span>
              <span>颜色：{{ pageData.aiReport.featureJson?.abcde?.color }}</span>
              <span>直径：{{ pageData.aiReport.featureJson?.abcde?.diameter }}</span>
              <span>演变：{{ pageData.aiReport.featureJson?.abcde?.evolution }}</span>
            </div>
          </div>

          <div class="feature-group">
            <div class="feature-group-title">皮肤镜特征</div>
            <div class="tag-row">
              <span
                  v-for="item in pageData.aiReport.featureJson?.dermoscopy || []"
                  :key="item"
                  class="tag-chip"
              >
                {{ item }}
              </span>
            </div>
          </div>

          <div class="feature-group">
            <div class="feature-group-title">质控结果</div>
            <div class="feature-grid">
              <span>清晰度：{{ pageData.aiReport.featureJson?.quality?.clarity }}</span>
              <span>曝光：{{ pageData.aiReport.featureJson?.quality?.exposure }}</span>
              <span>构图：{{ pageData.aiReport.featureJson?.quality?.framing }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 中栏 -->
      <div class="panel-card">
        <div class="panel-head">
          <span>辅助分析区</span>
          <span class="panel-link">热力图 / 病灶框</span>
        </div>

        <div class="viewer-box">
          <img
              class="base-image"
              :src="getBackendFileUrl(pageData.currentImage.imageUrl)"
              alt="原始影像"
          />

          <img
              v-if="showHeatmap && pageData.currentImage.heatmapUrl"
              class="heatmap-image"
              :src="getBackendFileUrl(pageData.currentImage.heatmapUrl)"
              alt="热力图"
              :style="{ opacity: pageData.currentImage.opacity }"
          />

          <div v-if="showBoxes">
            <div
                v-for="box in pageData.aiReport.lesionBoxes"
                :key="box.label"
                class="lesion-box"
                :style="getBoxStyle(box)"
            >
              <span class="box-label">{{ box.label }}</span>
            </div>
          </div>
        </div>

        <div class="tool-row">
          <button class="tool-chip" :class="{ active: showHeatmap }" @click="showHeatmap = !showHeatmap">
            热力图
          </button>
          <button class="tool-chip" :class="{ active: showBoxes }" @click="showBoxes = !showBoxes">
            病灶框
          </button>
          <button class="tool-chip passive">
            模型：{{ pageData.aiReport.metrics.modelVersion }}
          </button>
          <button class="tool-chip passive">
            直径：{{ pageData.aiReport.metrics.diameter }}
          </button>
          <button class="tool-chip passive">
            演变：{{ pageData.aiReport.metrics.evolution }}
          </button>
        </div>

        <div class="compare-grid">
          <div class="compare-card">
            <div class="compare-title">历史影像</div>
            <div class="compare-image-wrap">
              <img :src="getBackendFileUrl(pageData.compare.historyImageUrl)" alt="历史影像" />
            </div>
          </div>
          <div class="compare-card">
            <div class="compare-title">本次影像</div>
            <div class="compare-image-wrap">
              <img :src="getBackendFileUrl(pageData.compare.currentImageUrl)" alt="本次影像" />
            </div>
          </div>
        </div>
      </div>

      <!-- 右栏 -->
      <div class="panel-card">
        <div class="panel-head">
          <span>辅助报告</span>
          <span class="panel-link">需医生复核</span>
        </div>

        <div class="risk-box">
          <div class="risk-label">恶性概率</div>
          <div class="risk-value">{{ pageData.aiReport.riskText }}</div>
          <div class="risk-note">{{ pageData.aiReport.reviewRuleText }}</div>
        </div>

        <div class="top3-list">
          <div v-for="item in pageData.aiReport.top3" :key="item.name" class="top3-item">
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
          {{ pageData.aiReport.summary }}
        </div>

        <div class="doctor-box">
          <div class="doctor-box-title">医生修正区</div>

          <div class="form-item">
            <label>当前判断</label>
            <textarea v-model="doctorForm.conclusion" rows="3"></textarea>
          </div>

          <div class="form-item">
            <label>处理建议</label>
            <textarea v-model="doctorForm.treatmentPlan" rows="3"></textarea>
          </div>

          <div class="form-item">
            <label>随访 / 护理建议</label>
            <textarea v-model="doctorForm.suggestion" rows="3"></textarea>
          </div>
        </div>

        <div class="action-column">
          <button class="primary-btn full" @click="handleConfirmAi" :disabled="submitting">
            确认辅助结论
          </button>
          <button class="ghost-btn full" @click="handleRevise" :disabled="submitting">
            提交复核意见
          </button>
<!--          <button class="primary-btn" @click="handleSubmitReview" :disabled="submitting || !pageData.caseInfo.caseId">-->
<!--            {{ submitting ? '提交中...' : '提交复核意见' }}-->
<!--          </button>-->
          <button
              class="warn-btn full"
              @click="goToReferral"
              :disabled="!pageData.actions.canRefer"
          >
            发起上转 / 会诊
          </button>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getMyRecordsBoardApi } from '../../api/cases'
import {
  confirmAiDiagnosisApi,
  getBackendFileUrl,
  getDiagnosisExportUrl,
  getDiagnosisWorkspaceApi,
  reviseDiagnosisApi
} from '../../api/diagnosis'

const route = useRoute()
const router = useRouter()

const loading = ref(false)
const submitting = ref(false)
const error = ref('')
const showHeatmap = ref(true)
const showBoxes = ref(true)

const pageData = ref({
  caseInfo: {},
  timeline: [],
  currentImage: {},
  aiReport: {
    top3: [],
    lesionBoxes: [],
    metrics: {},
    featureJson: {}
  },
  doctorReview: {},
  compare: {},
  actions: {}
})

const doctorForm = reactive({
  conclusion: '',
  treatmentPlan: '',
  suggestion: ''
})

function syncDoctorForm() {
  doctorForm.conclusion = pageData.value.doctorReview.conclusion || ''
  doctorForm.treatmentPlan = pageData.value.doctorReview.treatmentPlan || ''
  doctorForm.suggestion = pageData.value.doctorReview.suggestion || ''
}

async function fetchWorkspace() {
  try {
    loading.value = true
    error.value = ''

    let caseId = route.query.caseId
    let imageId = route.query.imageId

    if (!caseId) {
      const board = await getMyRecordsBoardApi({ status: 'ALL' })
      const cid = board?.selectedCase?.caseId
      if (!cid) {
        error.value = '暂无可用病例，请先在「我的病例」创建或选择病例后再进入影像诊断'
        return
      }
      const firstImg = board.selectedCase?.images?.[0]
      caseId = String(cid)
      imageId = imageId || (firstImg?.imageId != null ? String(firstImg.imageId) : undefined)
      await router.replace({
        path: '/doctor/diagnosis',
        query: {
          ...route.query,
          caseId,
          ...(imageId ? { imageId } : {})
        }
      })
    }

    const data = await getDiagnosisWorkspaceApi({
      caseId,
      imageId
    })

    pageData.value = data
    syncDoctorForm()
  } catch (err) {
    error.value = err.message || '影像诊断数据加载失败'
  } finally {
    loading.value = false
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

async function handleSwitchImage(imageId) {
  await router.replace({
    path: '/doctor/diagnosis',
    query: {
      ...route.query,
      imageId
    }
  })

  await fetchWorkspace()
}

async function handleConfirmAi() {
  try {
    submitting.value = true
    await confirmAiDiagnosisApi(pageData.value.caseInfo.caseId, {
      conclusion: doctorForm.conclusion,
      treatmentPlan: doctorForm.treatmentPlan,
      suggestion: doctorForm.suggestion
    })
    window.alert('已确认辅助结论')
    await fetchWorkspace()
  } catch (err) {
    window.alert(err.message || '提交失败')
  } finally {
    submitting.value = false
  }
}

async function handleRevise() {
  try {
    submitting.value = true
    await reviseDiagnosisApi(pageData.value.caseInfo.caseId, {
      conclusion: doctorForm.conclusion,
      treatmentPlan: doctorForm.treatmentPlan,
      suggestion: doctorForm.suggestion
    })
    window.alert('复核意见已提交')
    await fetchWorkspace()
  } catch (err) {
    window.alert(err.message || '提交失败')
  } finally {
    submitting.value = false
  }
}

async function handleSubmitReview() {
  await handleRevise()
}

function handleExport() {
  if (!pageData.value.caseInfo.caseId) return
  window.open(getDiagnosisExportUrl(pageData.value.caseInfo.caseId), '_blank')
}

function goToReferral() {
  router.push({
    path: '/doctor/referral',
    query: {
      caseId: pageData.value.caseInfo.caseId
    }
  })
}

onMounted(fetchWorkspace)
</script>

<style scoped>
.diagnosis-page {
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
.panel-link,
.page-tip,
.risk-note,
.summary-box,
.info-item label,
.form-item label,
.feature-group-title,
.timeline-title,
.compare-title {
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
.tool-row,
.action-column {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.primary-btn,
.ghost-btn,
.warn-btn {
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

.warn-btn {
  border: none;
  color: #fff;
  background: linear-gradient(135deg, #f59e0b, #fbbf24);
}

.full {
  width: 100%;
}

.content-grid {
  display: grid;
  grid-template-columns: 0.8fr 1.05fr 0.82fr;
  gap: 16px;
}

.panel-card {
  background: rgba(255, 255, 255, 0.82);
  border: 1px solid #dce8f4;
  border-radius: 22px;
  box-shadow: 0 10px 30px rgba(17, 56, 102, 0.05);
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

.info-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.info-item,
.compare-card,
.risk-box,
.summary-box,
.feature-panel,
.doctor-box,
.form-item {
  padding: 14px;
  border-radius: 16px;
  background: #f9fcff;
  border: 1px solid #e3edf7;
}

.info-item div,
.feature-grid span,
.summary-box,
.form-item textarea {
  font-size: 14px;
  color: #1d466f;
  line-height: 1.7;
}

.timeline-title {
  margin-top: 16px;
  margin-bottom: 10px;
  font-weight: 700;
}

.timeline-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.timeline-chip,
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

.timeline-chip.active,
.tool-chip.active {
  background: #edf6ff;
  color: #2a70b8;
  border-color: #bfd8f8;
}

.tool-chip.passive {
  cursor: default;
}

.feature-panel {
  margin-top: 16px;
}

.feature-title,
.doctor-box-title {
  font-size: 15px;
  font-weight: 800;
  color: #1d466f;
  margin-bottom: 10px;
}

.feature-group + .feature-group {
  margin-top: 14px;
}

.feature-grid {
  display: grid;
  gap: 8px;
}

.tag-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag-chip {
  padding: 5px 10px;
  border-radius: 999px;
  background: #edf6ff;
  color: #2a70b8;
  font-size: 12px;
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

.tool-row {
  margin-top: 14px;
}

.compare-grid {
  margin-top: 16px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
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

.risk-box {
  text-align: center;
}

.risk-label {
  color: #7a93af;
}

.risk-value {
  margin-top: 8px;
  font-size: 48px;
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
}

.doctor-box {
  margin-top: 14px;
}

.form-item {
  margin-top: 12px;
}

.form-item textarea {
  width: 100%;
  border: 1px solid #d8e5f2;
  border-radius: 12px;
  background: #fff;
  padding: 10px 12px;
  outline: none;
  resize: vertical;
}

.action-column {
  margin-top: 16px;
  flex-direction: column;
}

@media (max-width: 1360px) {
  .page-head {
    flex-direction: column;
    align-items: flex-start;
  }

  .content-grid,
  .compare-grid {
    grid-template-columns: 1fr;
  }
}
</style>
