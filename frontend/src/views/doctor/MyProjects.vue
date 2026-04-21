<template>
  <div class="projects-page">
    <div class="page-head">
      <div>
        <h1>我的项目</h1>
        <div class="page-subtitle">查看项目列表、项目进展、角色分工与任务协作</div>
      </div>

    </div>

    <div v-if="loading" class="page-tip">正在加载我的项目数据...</div>
    <div v-else-if="error" class="page-tip error">{{ error }}</div>

    <section v-else class="content-grid">
      <!-- 左：项目列表 -->
      <div class="panel-card">
        <div class="panel-head">
          <span>项目列表</span>
          <span class="panel-link">我参与的项目</span>
        </div>

        <div v-if="projectList.length" class="project-list">
          <div
              v-for="item in projectList"
              :key="item.projectId"
              class="project-item"
              :class="{ active: selectedProject?.projectId === item.projectId }"
              @click="handleSelectProject(item.projectId)"
          >
            <div class="project-top">
              <span class="project-code">{{ item.projectCode }}</span>
              <span :class="['project-tag', item.statusClass]">{{ item.status }}</span>
            </div>

            <div class="project-title">{{ item.name }}</div>
            <div class="project-meta">
              {{ item.role }} · 负责人 {{ item.principalInvestigator }}
            </div>

            <div class="progress-wrap">
              <div class="progress-track">
                <i class="progress-inner" :style="{ width: `${item.progress}%` }"></i>
              </div>
              <span class="progress-text">{{ item.progress }}%</span>
            </div>
          </div>
        </div>

        <div v-else class="empty-text">当前暂无项目，请先在科研总览页登记并加入项目</div>
      </div>

      <!-- 中：项目详情 -->
      <div class="panel-card">
        <div class="panel-head">
          <span>项目详情</span>
          <span class="panel-link">{{ selectedProject?.projectCode || '--' }}</span>
        </div>

        <template v-if="selectedProject">
          <div class="detail-grid">
            <div class="detail-item">
              <label>项目名称</label>
              <div>{{ selectedProject.name }}</div>
            </div>
            <div class="detail-item">
              <label>我的角色</label>
              <div>{{ selectedProject.role }}</div>
            </div>
            <div class="detail-item">
              <label>项目状态</label>
              <div>{{ selectedProject.status }}</div>
            </div>
            <div class="detail-item">
              <label>项目级别</label>
              <div>{{ selectedProject.level }}</div>
            </div>
            <div class="detail-item">
              <label>项目负责人</label>
              <div>{{ selectedProject.principalInvestigator }}</div>
            </div>
            <div class="detail-item">
              <label>当前进度</label>
              <div>{{ selectedProject.progress }}%</div>
            </div>
            <div class="detail-item">
              <label>伦理批件号</label>
              <div>{{ selectedProject.ethicsCode }}</div>
            </div>
            <div class="detail-item">
              <label>伦理有效期</label>
              <div>{{ selectedProject.ethicsExpireAt }}</div>
            </div>
            <div class="detail-item full">
              <label>数据使用范围</label>
              <div>{{ selectedProject.dataScope }}</div>
            </div>
          </div>

          <div class="milestone-title">里程碑</div>
          <div class="milestone-list">
            <div
                v-for="(item, index) in selectedProject.milestones"
                :key="`${item.title}-${index}`"
                class="milestone-item"
            >
              <div :class="['milestone-dot', { done: item.done }]"></div>
              <div class="milestone-content">
                <div class="milestone-item-title">{{ item.title }}</div>
                <div class="milestone-item-desc">{{ item.desc }}</div>
              </div>
            </div>
          </div>

<!--          <div class="project-quick-row">-->
<!--            <button type="button" class="text-link" @click="goToCloud">进入影像云</button>-->
<!--            <span class="quick-sep">·</span>-->
<!--            <button type="button" class="text-link" @click="goToLab">进入项目空间</button>-->
<!--            <span class="quick-sep">·</span>-->
<!--            <button type="button" class="text-link" @click="scrollToTasks">查看任务分配</button>-->
<!--          </div>-->
        </template>

        <div v-else class="empty-text">请选择左侧项目查看详情</div>
      </div>

      <!-- 右：成员与任务 -->
      <div class="right-stack">
        <div class="panel-card">
          <div class="panel-head">
            <span>项目成员</span>
            <span class="panel-link">成员协作</span>
          </div>

          <template v-if="selectedProject">
            <div class="member-list">
              <div
                  v-for="item in selectedProject.members"
                  :key="item.id"
                  class="member-item"
              >
                <div class="member-name">{{ item.realName }}</div>
                <div class="member-meta">{{ item.title }} · {{ item.role }}</div>
              </div>
            </div>
          </template>

          <div v-else class="empty-text">暂无成员信息</div>
        </div>

        <div class="panel-card" ref="taskSectionRef">
          <div class="panel-head">
            <span>任务分配</span>
            <span class="panel-link">
              待处理 {{ selectedProject?.taskSummary.pendingCount || 0 }}
            </span>
          </div>

          <template v-if="selectedProject">
            <div class="task-summary">
              <div class="task-summary-card">
                <span>待处理</span>
                <strong>{{ selectedProject.taskSummary.pendingCount }}</strong>
              </div>
              <div class="task-summary-card">
                <span>已完成</span>
                <strong>{{ selectedProject.taskSummary.doneCount }}</strong>
              </div>
              <div class="task-summary-card">
                <span>即将到期</span>
                <strong>{{ selectedProject.taskSummary.urgentCount }}</strong>
              </div>
            </div>

            <div class="task-list">
              <div
                  v-for="item in selectedProject.tasks"
                  :key="item.id"
                  class="task-item"
              >
                <div class="task-top">
                  <div class="task-title">{{ item.title }}</div>
                  <span :class="['task-tag', item.statusClass]">{{ item.statusLabel }}</span>
                </div>
                <div class="task-meta">负责人：{{ item.assigneeName }}</div>
                <div class="task-meta">截止时间：{{ item.dueAt }}</div>
              </div>
            </div>
          </template>

          <div v-else class="empty-text">暂无任务信息</div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { nextTick, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getMyProjectsApi } from '../../api/projects'

const route = useRoute()
const router = useRouter()

const loading = ref(false)
const error = ref('')
const projectList = ref([])
const selectedProject = ref(null)
const taskSectionRef = ref(null)

function getSelectedProjectIdFromRoute() {
  return route.query.projectId ? Number(route.query.projectId) : null
}

async function fetchProjects(projectId = null) {
  try {
    loading.value = true
    error.value = ''

    const data = await getMyProjectsApi(projectId ? { projectId } : {})
    projectList.value = data.list || []
    selectedProject.value = data.selectedProject || null
  } catch (err) {
    error.value = err.message || '我的项目数据加载失败'
  } finally {
    loading.value = false
  }
}

async function handleSelectProject(projectId) {
  await router.replace({
    path: '/doctor/research/projects',
    query: { projectId }
  })

  await fetchProjects(projectId)
}

function goToCloud() {
  if (!selectedProject.value) return

  router.push({
    path: '/doctor/imaging-cloud',
    query: {
      projectId: selectedProject.value.projectId
    }
  })
}

function goToLab() {
  if (!selectedProject.value) return

  router.push({
    path: '/doctor/open-lab',
    query: {
      projectId: selectedProject.value.projectId
    }
  })
}

async function scrollToTasks() {
  await nextTick()
  taskSectionRef.value?.scrollIntoView({
    behavior: 'smooth',
    block: 'start'
  })
}

onMounted(() => {
  fetchProjects(getSelectedProjectIdFromRoute())
})
</script>

<style scoped>
.projects-page {
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
.project-meta,
.empty-text,
.milestone-item-desc,
.member-meta,
.task-meta {
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
  padding: 0 18px;
  border-radius: 14px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  white-space: nowrap;
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

.content-grid {
  display: grid;
  grid-template-columns: 0.84fr 1.02fr 0.94fr;
  gap: 16px;
}

.right-stack {
  display: flex;
  flex-direction: column;
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

.project-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.project-item {
  padding: 16px;
  border-radius: 18px;
  background: #f9fcff;
  border: 1px solid #e3edf7;
  cursor: pointer;
  transition: all 0.2s ease;
}

.project-item.active {
  background: #edf6ff;
  border-color: #bfd8f8;
}

.project-top,
.task-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.project-code {
  font-size: 12px;
  color: #7a93af;
  font-weight: 700;
}

.project-tag,
.task-tag {
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 12px;
  white-space: nowrap;
}

.project-tag.blue,
.task-tag.blue {
  background: #edf6ff;
  color: #2a70b8;
}

.project-tag.warning,
.task-tag.warning {
  background: #fff5df;
  color: #c98912;
}

.project-tag.success,
.task-tag.success {
  background: #ecfbf5;
  color: #14906a;
}

.project-tag.neutral {
  background: #eef3f9;
  color: #6a819b;
}

.project-title,
.milestone-item-title,
.member-name,
.task-title {
  margin-top: 10px;
  font-size: 15px;
  font-weight: 800;
  color: #1d466f;
}

.progress-wrap {
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

.detail-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.detail-item {
  padding: 14px;
  border-radius: 16px;
  background: #f9fcff;
  border: 1px solid #e3edf7;
}

.detail-item.full {
  grid-column: 1 / -1;
}

.detail-item label {
  display: block;
  font-size: 12px;
  color: #7a93af;
  margin-bottom: 8px;
}

.detail-item div {
  font-size: 14px;
  color: #1d466f;
  line-height: 1.7;
}

.milestone-title {
  margin-top: 18px;
  margin-bottom: 12px;
  font-size: 15px;
  font-weight: 800;
  color: #17385f;
}

.milestone-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.milestone-item {
  display: flex;
  gap: 12px;
  align-items: flex-start;
  padding: 12px 0;
}

.milestone-dot {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: #d8e5f2;
  margin-top: 4px;
  flex-shrink: 0;
}

.milestone-dot.done {
  background: #2563eb;
}

.member-list,
.task-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.member-item,
.task-item,
.task-summary-card {
  padding: 14px;
  border-radius: 16px;
  background: #f9fcff;
  border: 1px solid #e3edf7;
}

.task-summary {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-bottom: 14px;
}

.task-summary-card span {
  display: block;
  font-size: 12px;
  color: #7a93af;
}

.task-summary-card strong {
  display: block;
  margin-top: 8px;
  font-size: 24px;
  color: #17385f;
}

.empty-text {
  padding: 12px 0;
}

@media (max-width: 1360px) {
  .page-head {
    flex-direction: column;
    align-items: flex-start;
  }

  .content-grid,
  .detail-grid,
  .task-summary {
    grid-template-columns: 1fr;
  }
}
</style>
