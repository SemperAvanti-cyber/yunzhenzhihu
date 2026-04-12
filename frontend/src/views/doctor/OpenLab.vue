<template>
  <div class="lab-page">
    <div class="page-head">
      <div>
        <h1>开放实验平台</h1>
        <div class="page-subtitle">数据整理、标注协作、实验记录与结果沉淀</div>
      </div>

      <div class="head-actions">
        <button class="primary-btn" @click="showCreateModal = true">
          新建实验记录
        </button>
      </div>
    </div>

    <div v-if="loading" class="page-tip">正在加载开放实验平台数据...</div>
    <div v-else-if="error" class="page-tip error">{{ error }}</div>

    <template v-else>
      <section
          class="context-banner"
          v-if="board.contextBanner.projectName || board.contextBanner.taskTitle"
      >
        <div class="context-item" v-if="board.contextBanner.projectName">
          <label>当前项目</label>
          <span>{{ board.contextBanner.projectName }}</span>
        </div>
        <div class="context-item" v-if="board.contextBanner.projectCode">
          <label>项目编号</label>
          <span>{{ board.contextBanner.projectCode }}</span>
        </div>
        <div class="context-item" v-if="board.contextBanner.taskTitle">
          <label>关联任务</label>
          <span>{{ board.contextBanner.taskTitle }}</span>
        </div>
      </section>

      <section class="metric-grid">
        <div class="metric-card">
          <div class="metric-label">可用样本</div>
          <div class="metric-value">{{ board.summary.totalSamples }}</div>
          <div class="metric-note">当前可访问样本总量</div>
        </div>

        <div class="metric-card">
          <div class="metric-label">待标注 / 复核</div>
          <div class="metric-value">{{ board.summary.pendingAnnotation }}</div>
          <div class="metric-note">建议优先处理</div>
        </div>

        <div class="metric-card">
          <div class="metric-label">运行中实验</div>
          <div class="metric-value">{{ board.summary.runningExperiments }}</div>
          <div class="metric-note">正在记录过程</div>
        </div>

        <div class="metric-card">
          <div class="metric-label">已完成实验</div>
          <div class="metric-value">{{ board.summary.completedExperiments }}</div>
          <div class="metric-note">可查看结果沉淀</div>
        </div>
      </section>

      <section class="quick-grid">
        <div
            v-for="item in board.moduleEntries"
            :key="item.key"
            class="quick-card"
            @click="handleModuleClick(item.key)"
        >
          <div class="quick-title">{{ item.title }}</div>
          <div class="quick-desc">{{ item.desc }}</div>
          <div class="quick-value">{{ item.value }}</div>
        </div>
      </section>

      <section class="content-grid">
        <!-- 左：实验列表 -->
        <div class="panel-card">
          <div class="panel-head">
            <span>实验记录</span>
            <span class="panel-link">当前项目</span>
          </div>

          <div v-if="board.experimentList.length" class="experiment-list">
            <div
                v-for="item in board.experimentList"
                :key="item.id"
                class="experiment-item"
                :class="{ active: selectedExperiment?.id === item.id }"
                @click="handleSelectExperiment(item.id)"
            >
              <div class="experiment-top">
                <div class="experiment-name">{{ item.name }}</div>
                <span :class="['experiment-tag', item.statusClass]">{{ item.status }}</span>
              </div>

              <div class="experiment-meta">
                {{ item.modelName }} · {{ item.datasetName }}
              </div>

              <div class="experiment-submeta">
                创建人：{{ item.createdBy }} · 更新于 {{ item.updatedAt }}
              </div>
            </div>
          </div>

          <div v-else class="empty-text">当前项目暂无实验记录，请先新建实验记录</div>
        </div>

        <!-- 中：实验详情 -->
        <div class="panel-card">
          <div class="panel-head">
            <span>实验详情</span>
            <span class="panel-link">{{ selectedExperiment?.name || '--' }}</span>
          </div>

          <template v-if="selectedExperiment">
            <div class="detail-grid">
              <div class="detail-item">
                <label>实验名称</label>
                <div>{{ selectedExperiment.name }}</div>
              </div>
              <div class="detail-item">
                <label>实验状态</label>
                <div>{{ selectedExperiment.status }}</div>
              </div>
              <div class="detail-item">
                <label>模型名称</label>
                <div>{{ selectedExperiment.modelName }}</div>
              </div>
              <div class="detail-item">
                <label>数据集</label>
                <div>{{ selectedExperiment.datasetName }}</div>
              </div>
              <div class="detail-item">
                <label>创建人</label>
                <div>{{ selectedExperiment.createdBy }}</div>
              </div>
              <div class="detail-item">
                <label>最近更新</label>
                <div>{{ selectedExperiment.updatedAt }}</div>
              </div>
            </div>

            <div class="result-grid">
              <div class="result-card">
                <span>Accuracy</span>
                <strong>{{ formatMetric(selectedExperiment.accuracy) }}</strong>
              </div>
              <div class="result-card">
                <span>Recall</span>
                <strong>{{ formatMetric(selectedExperiment.recall) }}</strong>
              </div>
              <div class="result-card">
                <span>F1</span>
                <strong>{{ formatMetric(selectedExperiment.f1Score) }}</strong>
              </div>
            </div>

            <div class="note-box">
              <div class="note-title">实验备注</div>
              <div class="note-content">
                {{ selectedExperiment.note || '暂无实验备注' }}
              </div>
            </div>

            <div class="panel-actions">
              <button class="ghost-btn" @click="openUpdateModal">更新实验结果</button>
              <button class="primary-btn" @click="handleMarkRunning">标记运行中</button>
            </div>
          </template>

          <div v-else class="empty-text">请选择左侧实验记录查看详情</div>
        </div>

        <!-- 右：任务与入口 -->
        <div class="right-stack">
          <div class="panel-card">
            <div class="panel-head">
              <span>项目任务</span>
              <span class="panel-link">最近任务</span>
            </div>

            <div v-if="board.taskList.length" class="task-list">
              <div v-for="item in board.taskList" :key="item.id" class="task-item">
                <div class="task-title">{{ item.title }}</div>
                <div class="task-meta">
                  {{ item.typeLabel }} · {{ item.assigneeName }} · {{ item.dueAt }}
                </div>
              </div>
            </div>

            <div v-else class="empty-text">当前项目暂无任务</div>
          </div>

          <div class="panel-card">
            <div class="panel-head">
              <span>快捷入口</span>
              <span class="panel-link">项目执行</span>
            </div>

            <div class="entry-list">
              <button class="entry-btn" @click="goToRecruit">去协作任务</button>
              <button class="entry-btn" @click="goToCloud">去影像云</button>
              <button class="entry-btn" @click="goToProjects">返回项目台账</button>
            </div>
          </div>
        </div>
      </section>
    </template>

    <!-- 新建实验 -->
    <transition name="modal-fade">
      <div v-if="showCreateModal" class="modal-overlay" @click.self="showCreateModal = false">
        <div class="modal-card">
          <div class="modal-head">
            <div>
              <div class="modal-title">新建实验记录</div>
              <div class="modal-subtitle">为当前项目建立实验沉淀记录</div>
            </div>
            <button class="close-btn" @click="showCreateModal = false">×</button>
          </div>

          <div class="form-grid">
            <div class="form-item full">
              <label>所属项目</label>
              <select v-model="createForm.projectId">
                <option :value="null">请选择项目</option>
                <option
                    v-for="item in board.projectOptions"
                    :key="item.value"
                    :value="item.value"
                >
                  {{ item.label }}
                </option>
              </select>
            </div>

            <div class="form-item full">
              <label>实验名称</label>
              <input v-model="createForm.name" placeholder="请输入实验名称" />
            </div>

            <div class="form-item">
              <label>模型名称</label>
              <input v-model="createForm.modelName" placeholder="如 CR-Conformer v2" />
            </div>

            <div class="form-item">
              <label>数据集名称</label>
              <input v-model="createForm.datasetName" placeholder="如 MEL-TRAIN-V1" />
            </div>

            <div class="form-item full">
              <label>备注</label>
              <textarea v-model="createForm.note" rows="4" placeholder="请输入实验目标、参数说明或阶段备注"></textarea>
            </div>
          </div>

          <div class="modal-actions">
            <button class="ghost-btn" @click="showCreateModal = false">取消</button>
            <button class="primary-btn" @click="handleCreateExperiment" :disabled="submitting">
              {{ submitting ? '提交中...' : '创建实验记录' }}
            </button>
          </div>
        </div>
      </div>
    </transition>

    <!-- 更新实验 -->
    <transition name="modal-fade">
      <div v-if="showUpdateModal" class="modal-overlay" @click.self="showUpdateModal = false">
        <div class="modal-card">
          <div class="modal-head">
            <div>
              <div class="modal-title">更新实验结果</div>
              <div class="modal-subtitle">{{ selectedExperiment?.name || '' }}</div>
            </div>
            <button class="close-btn" @click="showUpdateModal = false">×</button>
          </div>

          <div class="form-grid">
            <div class="form-item">
              <label>Accuracy</label>
              <input v-model="updateForm.accuracy" type="number" step="0.001" placeholder="如 0.923" />
            </div>

            <div class="form-item">
              <label>Recall</label>
              <input v-model="updateForm.recall" type="number" step="0.001" placeholder="如 0.901" />
            </div>

            <div class="form-item">
              <label>F1</label>
              <input v-model="updateForm.f1Score" type="number" step="0.001" placeholder="如 0.912" />
            </div>

            <div class="form-item">
              <label>状态</label>
              <select v-model="updateForm.status">
                <option value="DRAFT">草稿</option>
                <option value="RUNNING">运行中</option>
                <option value="COMPLETED">已完成</option>
                <option value="FAILED">失败</option>
              </select>
            </div>

            <div class="form-item full">
              <label>实验备注</label>
              <textarea v-model="updateForm.note" rows="4" placeholder="请输入实验结果分析、问题说明或结论"></textarea>
            </div>
          </div>

          <div class="modal-actions">
            <button class="ghost-btn" @click="showUpdateModal = false">取消</button>
            <button class="primary-btn" @click="handleUpdateExperiment" :disabled="submitting">
              {{ submitting ? '保存中...' : '保存实验结果' }}
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  createExperimentRunApi,
  getOpenLabBoardApi,
  updateExperimentRunApi
} from '../../api/lab'

const route = useRoute()
const router = useRouter()

const loading = ref(false)
const error = ref('')
const submitting = ref(false)
const showCreateModal = ref(false)
const showUpdateModal = ref(false)

const board = ref({
  contextBanner: {
    projectName: '',
    projectCode: '',
    taskTitle: '',
    hasTaskContext: false
  },
  summary: {
    totalSamples: 0,
    pendingAnnotation: 0,
    runningExperiments: 0,
    completedExperiments: 0
  },
  quickCards: [],
  moduleEntries: [],
  experimentList: [],
  selectedExperiment: null,
  projectOptions: [],
  taskList: []
})

const selectedExperiment = ref(null)

const createForm = reactive({
  projectId: null,
  name: '',
  modelName: '',
  datasetName: '',
  note: ''
})

const updateForm = reactive({
  accuracy: '',
  recall: '',
  f1Score: '',
  status: 'DRAFT',
  note: ''
})

function getQueryParams(experimentId = route.query.experimentId || '') {
  return {
    projectId: route.query.projectId || '',
    taskId: route.query.taskId || '',
    experimentId
  }
}

async function fetchBoard(experimentId = route.query.experimentId || '') {
  try {
    loading.value = true
    error.value = ''

    const data = await getOpenLabBoardApi(getQueryParams(experimentId))
    board.value = data
    selectedExperiment.value = data.selectedExperiment || null

    if (!createForm.projectId && data.projectOptions?.length) {
      createForm.projectId = Number(route.query.projectId) || data.projectOptions[0].value
    }
  } catch (err) {
    error.value = err.message || '开放实验平台加载失败'
  } finally {
    loading.value = false
  }
}

async function handleSelectExperiment(experimentId) {
  await router.replace({
    path: '/doctor/open-lab',
    query: {
      ...route.query,
      experimentId
    }
  })

  await fetchBoard(experimentId)
}

function formatMetric(value) {
  if (value === null || value === undefined) return '--'
  return Number(value).toFixed(3)
}

function handleModuleClick(key) {
  if (key === 'annotation' || key === 'task') {
    goToRecruit()
    return
  }

  if (key === 'dataset') {
    goToCloud()
    return
  }

  if (key === 'experiment') {
    showCreateModal.value = true
  }
}

function goToProjects() {
  router.push({
    path: '/doctor/research/projects',
    query: route.query.projectId ? { projectId: route.query.projectId } : {}
  })
}

function goToCloud() {
  router.push({
    path: '/doctor/imaging-cloud',
    query: {
      projectId: route.query.projectId || ''
    }
  })
}

function goToRecruit() {
  router.push({
    path: '/doctor/research/recruit',
    query: {
      projectId: route.query.projectId || '',
      taskId: route.query.taskId || ''
    }
  })
}

async function handleCreateExperiment() {
  try {
    submitting.value = true
    const data = await createExperimentRunApi({
      projectId: createForm.projectId,
      name: createForm.name,
      modelName: createForm.modelName,
      datasetName: createForm.datasetName,
      note: createForm.note
    })

    window.alert('实验记录已创建')
    showCreateModal.value = false

    createForm.name = ''
    createForm.modelName = ''
    createForm.datasetName = ''
    createForm.note = ''

    await router.replace({
      path: '/doctor/open-lab',
      query: {
        ...route.query,
        projectId: createForm.projectId,
        experimentId: data.experimentId
      }
    })

    await fetchBoard(data.experimentId)
  } catch (err) {
    window.alert(err.message || '创建失败')
  } finally {
    submitting.value = false
  }
}

function openUpdateModal() {
  if (!selectedExperiment.value) return

  updateForm.accuracy =
      selectedExperiment.value.accuracy ?? ''
  updateForm.recall =
      selectedExperiment.value.recall ?? ''
  updateForm.f1Score =
      selectedExperiment.value.f1Score ?? ''
  updateForm.status =
      selectedExperiment.value.statusRaw || 'DRAFT'
  updateForm.note =
      selectedExperiment.value.note || ''

  showUpdateModal.value = true
}

async function handleUpdateExperiment() {
  if (!selectedExperiment.value) return

  try {
    submitting.value = true
    await updateExperimentRunApi(selectedExperiment.value.id, {
      accuracy: updateForm.accuracy,
      recall: updateForm.recall,
      f1Score: updateForm.f1Score,
      status: updateForm.status,
      note: updateForm.note
    })

    window.alert('实验记录已更新')
    showUpdateModal.value = false
    await fetchBoard(selectedExperiment.value.id)
  } catch (err) {
    window.alert(err.message || '更新失败')
  } finally {
    submitting.value = false
  }
}

async function handleMarkRunning() {
  if (!selectedExperiment.value) return

  try {
    await updateExperimentRunApi(selectedExperiment.value.id, {
      accuracy: selectedExperiment.value.accuracy,
      recall: selectedExperiment.value.recall,
      f1Score: selectedExperiment.value.f1Score,
      status: 'RUNNING',
      note: selectedExperiment.value.note || ''
    })
    window.alert('实验已标记为运行中')
    await fetchBoard(selectedExperiment.value.id)
  } catch (err) {
    window.alert(err.message || '操作失败')
  }
}

onMounted(() => {
  fetchBoard()
})
</script>

<style scoped>
.lab-page {
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
.quick-desc,
.quick-value,
.experiment-meta,
.experiment-submeta,
.detail-item label,
.task-meta,
.context-item label,
.empty-text,
.modal-subtitle,
.note-content {
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
.panel-actions,
.modal-actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.primary-btn,
.ghost-btn,
.entry-btn {
  height: 42px;
  padding: 0 16px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 700;
  white-space: nowrap;
  cursor: pointer;
}

.primary-btn,
.entry-btn {
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
  color: #1d466f;
  font-weight: 700;
}

.metric-grid,
.quick-grid {
  display: grid;
  gap: 14px;
}

.metric-grid {
  grid-template-columns: repeat(4, minmax(0, 1fr));
}

.quick-grid {
  grid-template-columns: repeat(4, minmax(0, 1fr));
}

.metric-card,
.quick-card,
.panel-card,
.experiment-item,
.detail-item,
.result-card,
.task-item,
.modal-card {
  background: rgba(255, 255, 255, 0.82);
  border: 1px solid #dce8f4;
  border-radius: 22px;
  box-shadow: 0 10px 30px rgba(17, 56, 102, 0.05);
}

.metric-card,
.quick-card {
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

.quick-card {
  cursor: pointer;
}

.quick-title,
.experiment-name,
.task-title,
.modal-title,
.note-title {
  font-size: 15px;
  font-weight: 800;
  color: #1d466f;
}

.quick-desc {
  margin-top: 8px;
}

.quick-value {
  margin-top: 10px;
  color: #2a70b8;
  font-weight: 700;
}

.content-grid {
  display: grid;
  grid-template-columns: 0.86fr 1.02fr 0.92fr;
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

.experiment-list,
.task-list,
.entry-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.experiment-item,
.task-item {
  padding: 14px;
  background: #f9fcff;
  border: 1px solid #e3edf7;
  box-shadow: none;
  cursor: pointer;
}

.experiment-item.active {
  background: #edf6ff;
  border-color: #bfd8f8;
}

.experiment-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.experiment-tag {
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 12px;
  white-space: nowrap;
}

.experiment-tag.blue {
  background: #edf6ff;
  color: #2a70b8;
}

.experiment-tag.success {
  background: #ecfbf5;
  color: #14906a;
}

.experiment-tag.danger {
  background: #feecec;
  color: #d83b3b;
}

.experiment-tag.neutral {
  background: #eef3f9;
  color: #6a819b;
}

.detail-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.detail-item {
  padding: 14px;
  background: #f9fcff;
  border: 1px solid #e3edf7;
  box-shadow: none;
}

.detail-item div {
  font-size: 14px;
  color: #1d466f;
  line-height: 1.7;
}

.result-grid {
  margin-top: 16px;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
}

.result-card {
  padding: 16px;
  text-align: center;
  background: #f9fcff;
  border: 1px solid #e3edf7;
  box-shadow: none;
}

.result-card span {
  display: block;
  font-size: 12px;
  color: #7a93af;
}

.result-card strong {
  display: block;
  margin-top: 8px;
  font-size: 26px;
  color: #17385f;
}

.note-box {
  margin-top: 16px;
  padding: 16px;
  border-radius: 18px;
  background: #f9fcff;
  border: 1px solid #e3edf7;
}

.note-content {
  margin-top: 8px;
}

.entry-list {
  gap: 10px;
}

.entry-btn {
  text-align: left;
}

/* modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 100;
  background: rgba(30, 58, 95, 0.18);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}

.modal-card {
  width: min(760px, 100%);
  background: #fff;
  padding: 20px;
}

.modal-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 16px;
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

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}

.form-item.full {
  grid-column: 1 / -1;
}

.form-item label {
  display: block;
  font-size: 12px;
  color: #7a93af;
  margin-bottom: 8px;
}

.form-item input,
.form-item textarea,
.form-item select {
  width: 100%;
  border: 1px solid #d8e5f2;
  border-radius: 14px;
  background: #fff;
  padding: 12px 14px;
  font-size: 14px;
  color: #1d466f;
  outline: none;
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.2s ease;
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
  .quick-grid,
  .content-grid,
  .detail-grid,
  .result-grid,
  .form-grid {
    grid-template-columns: 1fr;
  }
}
</style>
