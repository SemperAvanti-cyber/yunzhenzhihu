<template>
  <div class="records-page">
    <div class="page-head">
      <div>
        <h1>我的病例</h1>
        <div class="page-subtitle">查看病例归档、患者信息、影像随访，并继续进入诊断或分级诊疗</div>
      </div>

      <div class="head-actions">
<!--        <button class="ghost-btn" @click="showUploadModal = true" :disabled="!selectedCase">-->
<!--          补充随访照片-->
<!--        </button>-->
<!--        <button class="primary-btn" @click="goToDiagnosis" :disabled="!selectedCase">-->
<!--          进入影像诊断-->
<!--        </button>-->
      </div>
    </div>

    <div v-if="loading" class="page-tip">正在加载病例数据...</div>
    <div v-else-if="error" class="page-tip error">{{ error }}</div>

    <template v-else>
      <section class="metric-grid">
        <div class="metric-card">
          <div class="metric-label">病例总数</div>
          <div class="metric-value">{{ board.summary.totalCount }}</div>
        </div>
        <div class="metric-card">
          <div class="metric-label">待复核</div>
          <div class="metric-value">{{ board.summary.pendingCount }}</div>
        </div>
        <div class="metric-card">
          <div class="metric-label">有随访图</div>
          <div class="metric-value">{{ board.summary.followUpCount }}</div>
        </div>
        <div class="metric-card">
          <div class="metric-label">已转诊</div>
          <div class="metric-value">{{ board.summary.referredCount }}</div>
        </div>
      </section>

      <section class="content-grid">
        <!-- 左 -->
        <div class="panel-card">
          <div class="panel-head">
            <span>病例列表</span>
            <span class="panel-link">按更新时间</span>
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

          <div v-if="board.list.length" class="record-list">
            <div
                v-for="item in board.list"
                :key="item.caseId"
                class="record-item"
                :class="{ active: selectedCase?.caseId === item.caseId }"
                @click="handleSelectCase(item.caseId)"
            >
              <div class="record-cover">
                <img v-if="item.coverUrl" :src="getBackendFileUrl(item.coverUrl)" alt="" />
                <div v-else class="cover-empty">无图</div>
              </div>
              <div class="record-main">
                <div class="record-top">
                  <span class="record-code">{{ item.caseCode }}</span>
                  <span :class="['record-status', item.statusClass]">{{ item.status }}</span>
                </div>
                <div class="record-title">{{ item.patientName }}</div>
                <div class="record-desc">{{ item.chiefComplaint }}</div>
                <div class="record-meta">{{ item.updatedAt }}</div>
              </div>
            </div>
          </div>

          <div v-else class="empty-text">当前筛选下暂无病例</div>
        </div>

        <!-- 中 -->
        <div class="panel-card">
          <div class="panel-head">
            <span>病例详情</span>
            <span class="panel-link">{{ selectedCase?.caseCode || '--' }}</span>
          </div>

          <template v-if="selectedCase">
            <div class="patient-grid">
              <div class="info-item">
                <label>患者姓名</label>
                <div>{{ selectedCase.patient.name }}</div>
              </div>
              <div class="info-item">
                <label>患者编号</label>
                <div>{{ selectedCase.patient.patientCode }}</div>
              </div>
              <div class="info-item">
                <label>性别</label>
                <div>{{ selectedCase.patient.gender }}</div>
              </div>
              <div class="info-item">
                <label>年龄</label>
                <div>{{ selectedCase.patient.age }}</div>
              </div>
              <div class="info-item">
                <label>身份证号</label>
                <div>{{ selectedCase.patient.idCard }}</div>
              </div>
              <div class="info-item">
                <label>手机号</label>
                <div>{{ selectedCase.patient.phone }}</div>
              </div>
              <div class="info-item">
                <label>主诉</label>
                <div>{{ selectedCase.chiefComplaint }}</div>
              </div>
              <div class="info-item">
                <label>病例状态</label>
                <div>{{ selectedCase.status }}</div>
              </div>
            </div>

            <div class="preview-box">
              <img
                  v-if="activeImage?.imageUrl"
                  :src="getBackendFileUrl(activeImage.imageUrl)"
                  alt="病例图片"
              />
            </div>

            <div class="image-strip">
              <button
                  v-for="img in selectedCase.images"
                  :key="img.imageId"
                  class="image-chip"
                  :class="{ active: activeImage?.imageId === img.imageId }"
                  @click="activeImage = img"
              >
                {{ img.typeLabel }} · {{ img.capturedAt }}
              </button>
            </div>
          </template>

          <div v-else class="empty-text">请选择左侧病例查看详情</div>
        </div>

        <!-- 右 -->
        <div class="panel-card">
          <div class="panel-head">
            <span>操作区</span>
            <span class="panel-link">继续处理</span>
          </div>

          <template v-if="selectedCase">
            <div class="action-stack">
              <button class="primary-btn full" @click="goToDiagnosis">
                进入影像诊断
              </button>
              <button class="ghost-btn full" @click="goToReferral">
                进入分级诊疗
              </button>
              <button class="ghost-btn full" @click="showUploadModal = true">
                补充随访照片
              </button>
            </div>

            <div class="mini-info">
              <div class="mini-title">当前代表图</div>
              <div class="mini-desc">
                {{ activeImage?.typeLabel || '--' }} · {{ activeImage?.bodyPart || '--' }}
              </div>
            </div>
          </template>

          <div v-else class="empty-text">请选择病例后再操作</div>
        </div>
      </section>
    </template>

    <transition name="modal-fade">
      <div v-if="showUploadModal && selectedCase" class="modal-overlay" @click.self="showUploadModal = false">
        <div class="modal-card">
          <div class="modal-head">
            <div>
              <div class="modal-title">补充随访照片</div>
              <div class="modal-subtitle">{{ selectedCase.caseCode }}</div>
            </div>
            <button class="close-btn" @click="showUploadModal = false">×</button>
          </div>

          <div class="form-item">
            <label>选择图片</label>
            <input type="file" accept="image/*" @change="handleFileChange" />
          </div>

          <div class="form-item">
            <label>病灶部位</label>
            <input v-model="uploadForm.bodyPart" placeholder="如 左前臂" />
          </div>

          <div class="form-item">
            <label>设备说明</label>
            <input v-model="uploadForm.deviceName" placeholder="如 门诊随访上传 / 手机拍摄" />
          </div>

          <div class="form-item">
            <label>采集日期</label>
            <input v-model="uploadForm.capturedAt" type="date" />
          </div>

          <div class="modal-actions">
            <button class="ghost-btn" @click="showUploadModal = false">取消</button>
            <button class="primary-btn" @click="handleUpload" :disabled="uploading">
              {{ uploading ? '上传中...' : '上传随访图' }}
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  getBackendFileUrl,
  getMyRecordsBoardApi,
  uploadFollowUpImageApi
} from '../../api/cases'

const route = useRoute()
const router = useRouter()

const loading = ref(false)
const error = ref('')
const uploading = ref(false)
const showUploadModal = ref(false)
const selectedCase = ref(null)
const activeImage = ref(null)
const currentStatus = ref('ALL')
const uploadFile = ref(null)

const board = ref({
  summary: {
    totalCount: 0,
    pendingCount: 0,
    followUpCount: 0,
    referredCount: 0
  },
  filters: {
    currentStatus: 'ALL',
    statusOptions: []
  },
  list: [],
  selectedCase: null
})

const uploadForm = reactive({
  bodyPart: '',
  deviceName: '门诊随访上传',
  capturedAt: ''
})

async function fetchBoard(status = currentStatus.value) {
  try {
    loading.value = true
    error.value = ''

    const data = await getMyRecordsBoardApi({
      caseId: route.query.caseId || '',
      status
    })

    board.value = data
    selectedCase.value = data.selectedCase || null
    currentStatus.value = data.filters?.currentStatus || status
  } catch (err) {
    error.value = err.message || '病例页加载失败'
  } finally {
    loading.value = false
  }
}

watch(selectedCase, (val) => {
  activeImage.value = val?.coverImage || val?.images?.[0] || null
})

async function handleSelectCase(caseId) {
  await router.replace({
    path: '/doctor/records',
    query: {
      caseId,
      status: currentStatus.value
    }
  })
  await fetchBoard(currentStatus.value)
}

async function handleStatusChange(status) {
  currentStatus.value = status
  await router.replace({
    path: '/doctor/records',
    query: {
      ...route.query,
      status
    }
  })
  await fetchBoard(status)
}

function handleFileChange(event) {
  uploadFile.value = event.target.files?.[0] || null
}

async function handleUpload() {
  if (!selectedCase.value) return
  if (!uploadFile.value) {
    window.alert('请先选择图片')
    return
  }

  try {
    uploading.value = true

    const formData = new FormData()
    formData.append('image', uploadFile.value)
    formData.append('bodyPart', uploadForm.bodyPart)
    formData.append('deviceName', uploadForm.deviceName)
    formData.append('capturedAt', uploadForm.capturedAt)

    await uploadFollowUpImageApi(selectedCase.value.caseId, formData)
    window.alert('随访照片上传成功')

    showUploadModal.value = false
    uploadFile.value = null
    uploadForm.bodyPart = ''
    uploadForm.deviceName = '门诊随访上传'
    uploadForm.capturedAt = ''

    await fetchBoard(currentStatus.value)
  } catch (err) {
    window.alert(err.message || '上传失败')
  } finally {
    uploading.value = false
  }
}

function goToDiagnosis() {
  if (!selectedCase.value) return

  router.push({
    path: '/doctor/diagnosis',
    query: {
      caseId: selectedCase.value.caseId,
      imageId: activeImage.value?.imageId || ''
    }
  })
}

function goToReferral() {
  if (!selectedCase.value) return

  router.push({
    path: '/doctor/referral',
    query: {
      caseId: selectedCase.value.caseId
    }
  })
}

onMounted(() => {
  fetchBoard(route.query.status || 'ALL')
})
</script>

<style scoped>
.records-page {
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
.record-meta,
.record-desc,
.mini-desc,
.modal-subtitle {
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
.modal-actions {
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
  grid-template-columns: repeat(4, 1fr);
  gap: 14px;
}

.metric-card,
.panel-card,
.record-item,
.info-item,
.mini-info,
.modal-card {
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
  grid-template-columns: 0.86fr 1.06fr 0.72fr;
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

.record-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.record-item {
  padding: 12px;
  display: flex;
  gap: 12px;
  cursor: pointer;
}

.record-item.active {
  background: #edf6ff;
  border-color: #bfd8f8;
}

.record-cover {
  width: 78px;
  height: 78px;
  border-radius: 16px;
  overflow: hidden;
  background: #eef4fa;
  flex-shrink: 0;
}

.record-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.cover-empty {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #8aa0b8;
  font-size: 12px;
}

.record-main {
  min-width: 0;
  flex: 1;
}

.record-top {
  display: flex;
  justify-content: space-between;
  gap: 12px;
}

.record-code {
  font-size: 12px;
  color: #7a93af;
  font-weight: 700;
}

.record-status {
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 12px;
}

.record-status.warning {
  background: #fff5df;
  color: #c98912;
}

.record-status.blue {
  background: #edf6ff;
  color: #2a70b8;
}

.record-status.danger {
  background: #feecec;
  color: #d83b3b;
}

.record-status.success {
  background: #ecfbf5;
  color: #14906a;
}

.record-title {
  margin-top: 8px;
  font-size: 15px;
  font-weight: 800;
  color: #1d466f;
}

.patient-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.info-item {
  padding: 14px;
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

.preview-box {
  margin-top: 16px;
  width: 100%;
  aspect-ratio: 4 / 3;
  border-radius: 22px;
  overflow: hidden;
  background: #eef4fa;
  border: 1px solid #dce8f4;
}

.preview-box img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-strip {
  margin-top: 14px;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.image-chip {
  height: 34px;
  padding: 0 14px;
  border-radius: 999px;
  border: 1px solid #d8e5f2;
  background: #f7fbff;
  color: #5f7c98;
  font-size: 12px;
  cursor: pointer;
}

.image-chip.active {
  background: #edf6ff;
  color: #2a70b8;
  border-color: #bfd8f8;
}

.action-stack {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.mini-info {
  margin-top: 16px;
  padding: 14px;
}

.mini-title {
  font-size: 14px;
  font-weight: 800;
  color: #1d466f;
}

/* modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 100;
  background: rgba(30,58,95,.18);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}

.modal-card {
  width: min(560px, 100%);
  background: #fff;
  padding: 20px;
}

.modal-head {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 16px;
}

.modal-title {
  font-size: 18px;
  font-weight: 800;
  color: #1d466f;
}

.close-btn {
  width: 36px;
  height: 36px;
  border: none;
  border-radius: 12px;
  background: #f4f8fc;
  color: #5c7698;
  font-size: 20px;
  cursor: pointer;
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

.form-item input {
  width: 100%;
  border: 1px solid #d8e5f2;
  border-radius: 14px;
  background: #fff;
  padding: 12px 14px;
  font-size: 14px;
  color: #1d466f;
  outline: none;
}

.empty-text {
  padding: 12px 0;
  color: #7892b0;
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity .2s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

@media (max-width: 1360px) {
  .page-head {
    flex-direction: column;
    align-items: flex-start;
  }

  .metric-grid,
  .content-grid,
  .patient-grid {
    grid-template-columns: 1fr;
  }
}
</style>
