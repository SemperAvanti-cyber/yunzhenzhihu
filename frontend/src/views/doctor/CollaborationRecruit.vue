<template>
  <div class="collab-page">
    <div class="page-head">
      <div>
        <h1>协作任务</h1>
        <div class="page-subtitle">面向已进入项目空间的成员进行任务分配与协作，不是公开招募正式成员</div>
      </div>
    </div>

    <div v-if="loading" class="page-tip">正在加载协作任务...</div>
    <div v-else-if="error" class="page-tip error">{{ error }}</div>

    <template v-else>
      <section class="metric-grid">
        <div class="metric-card">
          <div class="metric-label">待接受任务</div>
          <div class="metric-value">{{ summary.pendingCount }}</div>
          <div class="metric-note">需尽快确认</div>
        </div>

        <div class="metric-card">
          <div class="metric-label">进行中任务</div>
          <div class="metric-value">{{ summary.progressCount }}</div>
          <div class="metric-note">标注 / 复核 / 分析</div>
        </div>

        <div class="metric-card">
          <div class="metric-label">本周新增</div>
          <div class="metric-value">{{ summary.weeklyNewCount }}</div>
          <div class="metric-note">来自项目空间</div>
        </div>
      </section>

      <div class="filter-row">
        <button
            v-for="item in statusOptions"
            :key="item.value"
            class="filter-chip"
            :class="{ active: currentStatus === item.value }"
            @click="handleStatusChange(item.value)"
        >
          {{ item.label }}
        </button>
      </div>

      <section class="task-list">
        <div
            v-for="item in tasks"
            :key="item.id"
            class="task-card"
            @click="openTaskModal(item)"
        >
          <div class="task-main">
            <div class="task-title-row">
              <div class="task-title">{{ item.title }}</div>
              <div :class="['task-status', item.statusClass]">{{ item.status }}</div>
            </div>

            <div class="task-desc">{{ item.desc }}</div>

            <div class="task-meta">
              <span>项目：{{ item.projectName }}</span>
              <span>类型：{{ item.typeLabel }}</span>
              <span>截止：{{ item.dueAt }}</span>
            </div>

            <div class="progress-section">
              <div class="progress-track">
                <i class="progress-inner" :style="{ width: `${item.progress}%` }"></i>
              </div>
              <span class="progress-text">{{ item.progress }}%</span>
            </div>

            <div class="task-note" v-if="item.note">
              当前备注：{{ item.note }}
            </div>
          </div>

          <div class="task-side">
            <button
                class="primary-btn"
                :disabled="item.statusRaw === 'DONE'"
                @click.stop="handlePrimaryAction(item)"
            >
              {{ item.actionText }}
            </button>
          </div>
        </div>

        <div v-if="!tasks.length" class="empty-box">
          当前筛选条件下暂无协作任务
        </div>
      </section>
    </template>

    <transition name="modal-fade">
      <div v-if="showTaskModal" class="modal-overlay" @click.self="closeTaskModal">
        <div class="modal-card">
          <div class="modal-head">
            <div>
              <div class="modal-title">{{ activeTask?.title || '任务详情' }}</div>
              <div class="modal-subtitle">
                {{ activeTask?.projectName || '--' }} · {{ activeTask?.typeLabel || '--' }}
              </div>
            </div>
            <button class="close-btn" @click="closeTaskModal">×</button>
          </div>

          <div v-if="activeTask" class="modal-content">
            <div class="detail-grid">
              <div class="detail-item">
                <label>任务状态</label>
                <div>{{ activeTask.status }}</div>
              </div>
              <div class="detail-item">
                <label>截止时间</label>
                <div>{{ activeTask.dueAt }}</div>
              </div>
              <div class="detail-item full">
                <label>任务说明</label>
                <div>{{ activeTask.desc }}</div>
              </div>
            </div>

            <div class="form-item">
              <label>当前进度（0 - 100）</label>
              <input
                  v-model.number="taskForm.progress"
                  type="number"
                  min="0"
                  max="100"
              />
            </div>

            <div class="form-item">
              <label>处理备注</label>
              <textarea
                  v-model="taskForm.note"
                  rows="4"
                  placeholder="请输入当前处理说明、问题记录或阶段结果"
              ></textarea>
            </div>

            <div class="entry-row">
              <button class="ghost-btn" @click="goToProject(activeTask)">查看项目</button>
              <button class="ghost-btn" @click="goToTaskEntry(activeTask)">
                {{ activeTask.entryTarget === 'cloud' ? '去影像云处理' : activeTask.entryTarget === 'lab' ? '去实验平台处理' : '进入项目空间' }}
              </button>
            </div>

            <div class="modal-actions">
              <button class="ghost-btn" @click="handleSaveProgress">保存进度</button>
              <button class="primary-btn" @click="handleMarkDone">标记完成</button>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import {
  acceptTaskApi,
  getCollaborationBoardApi,
  updateTaskProgressApi
} from '../../api/tasks'

const router = useRouter()

const loading = ref(false)
const error = ref('')
const summary = ref({
  pendingCount: 0,
  progressCount: 0,
  weeklyNewCount: 0
})
const statusOptions = ref([])
const currentStatus = ref('ALL')
const tasks = ref([])

const showTaskModal = ref(false)
const activeTask = ref(null)

const taskForm = reactive({
  progress: 0,
  note: ''
})

async function fetchTasks(status = currentStatus.value) {
  try {
    loading.value = true
    error.value = ''

    const data = await getCollaborationBoardApi({ status })
    summary.value = data.summary || summary.value
    statusOptions.value = data.statusOptions || []
    currentStatus.value = data.currentStatus || status
    tasks.value = data.tasks || []
  } catch (err) {
    error.value = err.message || '协作任务加载失败'
  } finally {
    loading.value = false
  }
}

function handleStatusChange(status) {
  fetchTasks(status)
}

function openTaskModal(task) {
  activeTask.value = task
  taskForm.progress = task.progress ?? 0
  taskForm.note = task.note || ''
  showTaskModal.value = true
}

function closeTaskModal() {
  showTaskModal.value = false
  activeTask.value = null
  taskForm.progress = 0
  taskForm.note = ''
}

async function handlePrimaryAction(task) {
  if (task.statusRaw === 'PENDING') {
    try {
      await acceptTaskApi(task.id)
      window.alert('任务已接受')
      await fetchTasks()
    } catch (err) {
      window.alert(err.message || '操作失败')
    }
    return
  }

  if (task.statusRaw === 'IN_PROGRESS') {
    openTaskModal(task)
  }
}

async function handleSaveProgress() {
  if (!activeTask.value) return

  try {
    await updateTaskProgressApi(activeTask.value.id, {
      progress: taskForm.progress,
      note: taskForm.note,
      done: false
    })
    window.alert('进度已保存')
    closeTaskModal()
    await fetchTasks()
  } catch (err) {
    window.alert(err.message || '保存失败')
  }
}

async function handleMarkDone() {
  if (!activeTask.value) return

  try {
    await updateTaskProgressApi(activeTask.value.id, {
      progress: 100,
      note: taskForm.note,
      done: true
    })
    window.alert('任务已标记完成')
    closeTaskModal()
    await fetchTasks()
  } catch (err) {
    window.alert(err.message || '提交失败')
  }
}

function goToProject(task) {
  router.push({
    path: '/doctor/research/projects',
    query: {
      projectId: task.projectId
    }
  })
}

function goToTaskEntry(task) {
  if (task.entryTarget === 'cloud') {
    router.push({
      path: '/doctor/imaging-cloud',
      query: {
        projectId: task.projectId,
        taskId: task.id
      }
    })
    return
  }

  if (task.entryTarget === 'lab') {
    router.push({
      path: '/doctor/open-lab',
      query: {
        projectId: task.projectId,
        taskId: task.id
      }
    })
    return
  }

  router.push({
    path: '/doctor/research/projects',
    query: {
      projectId: task.projectId
    }
  })
}

onMounted(() => {
  fetchTasks('ALL')
})
</script>

<style scoped>
.collab-page {
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
.metric-note,
.task-desc,
.task-meta,
.task-note,
.page-tip,
.modal-subtitle,
.empty-box {
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

.metric-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
}

.metric-card,
.task-card,
.modal-card,
.detail-item {
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
  font-size: 36px;
  font-weight: 800;
  color: #17385f;
}

.filter-row {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
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

.task-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.task-card {
  padding: 16px;
  display: flex;
  align-items: stretch;
  justify-content: space-between;
  gap: 18px;
  cursor: pointer;
}

.task-main {
  flex: 1;
  min-width: 0;
}

.task-title-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.task-title,
.modal-title {
  font-size: 16px;
  font-weight: 800;
  color: #1d466f;
}

.task-status {
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 12px;
  white-space: nowrap;
}

.task-status.warning {
  background: #fff5df;
  color: #c98912;
}

.task-status.blue {
  background: #edf6ff;
  color: #2a70b8;
}

.task-status.success {
  background: #ecfbf5;
  color: #14906a;
}

.task-status.neutral {
  background: #eef3f9;
  color: #6a819b;
}

.task-desc {
  margin-top: 8px;
}

.task-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-top: 10px;
}

.progress-section {
  margin-top: 12px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.progress-track {
  flex: 1;
  height: 8px;
  border-radius: 999px;
  background: #e8eef6;
  overflow: hidden;
}

.progress-inner {
  display: block;
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, #2563eb, #0ea5e9);
}

.progress-text {
  font-size: 12px;
  color: #1d466f;
  font-weight: 700;
}

.task-note {
  margin-top: 10px;
}

.task-side {
  display: flex;
  align-items: center;
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

.primary-btn:disabled {
  background: #d8e5f2;
  color: #7f98b4;
  cursor: not-allowed;
}

.ghost-btn {
  border: 1px solid #d8e5f2;
  background: #fff;
  color: #365a7f;
}

.empty-box {
  padding: 18px;
  border-radius: 18px;
  background: #f9fcff;
  border: 1px solid #e3edf7;
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

.detail-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.detail-item {
  padding: 14px;
  box-shadow: none;
  background: #f9fcff;
}

.detail-item.full {
  grid-column: 1 / -1;
}

.detail-item label,
.form-item label {
  display: block;
  font-size: 12px;
  color: #7a93af;
  margin-bottom: 8px;
}

.detail-item div,
.form-item input,
.form-item textarea {
  font-size: 14px;
  color: #1d466f;
  line-height: 1.7;
}

.form-item {
  margin-top: 14px;
}

.form-item input,
.form-item textarea {
  width: 100%;
  border: 1px solid #d8e5f2;
  border-radius: 14px;
  background: #fff;
  padding: 12px 14px;
  outline: none;
}

.entry-row,
.modal-actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  margin-top: 18px;
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.2s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

@media (max-width: 1280px) {
  .metric-grid {
    grid-template-columns: 1fr;
  }

  .task-card,
  .detail-grid {
    grid-template-columns: 1fr;
    flex-direction: column;
    align-items: flex-start;
  }

  .task-side {
    width: 100%;
  }
}
</style>
