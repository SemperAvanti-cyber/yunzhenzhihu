<template>
  <div class="research-page">
    <div class="page-head">
      <div>
        <h1>科研中心</h1>
        <div class="page-subtitle">项目登记、协作、数据与进度统一管理</div>
      </div>

    </div>

    <div v-if="loading" class="page-tip">正在加载科研总览数据...</div>
    <div v-else-if="error" class="page-tip error">{{ error }}</div>

    <template v-else>
      <section class="hero-card">
        <div class="hero-left">
          <div class="hero-badge">获批后项目管理</div>
          <div class="hero-title">科研中心负责项目登记与协作，不负责正式申报</div>
          <div class="hero-desc">
            项目在外部官方系统或院内科研管理体系获批后，再进入平台完成登记、伦理材料核验、
            数据范围确认、项目空间创建、协作成员管理与研究进度沉淀。
          </div>

          <div class="access-card" :class="overview.access.statusClass">
            <div class="access-title">{{ overview.access.statusLabel }}</div>
            <div class="access-desc">{{ overview.access.description }}</div>
          </div>
        </div>

        <div class="hero-right">
          <div class="stat-card">
            <span>我的项目空间</span>
            <strong>{{ overview.heroStats.projectSpaceCount }}</strong>
          </div>
          <div class="stat-card">
            <span>待我处理协作任务</span>
            <strong>{{ overview.heroStats.pendingTaskCount }}</strong>
          </div>
          <div class="stat-card">
            <span>待审批登记 / 申请</span>
            <strong>{{ overview.heroStats.pendingApprovalCount }}</strong>
          </div>
          <div class="stat-card">
            <span>在研伦理有效</span>
            <strong>{{ overview.heroStats.validEthicsCount }}</strong>
          </div>
        </div>
      </section>

      <section class="action-grid">
        <div class="action-card">
          <div>
            <div class="action-title">我的项目</div>
            <div class="action-desc">查看项目台账、成员、里程碑与当前进展。</div>
          </div>
          <button class="small-btn" @click="go('/doctor/research/projects')">立即进入</button>
        </div>

        <div class="action-card">
          <div>
            <div class="action-title">协作招募</div>
            <div class="action-desc">查看协作任务、招募信息与项目协同机会。</div>
          </div>
          <button class="small-btn" @click="go('/doctor/research/recruit')">立即进入</button>
        </div>

        <div class="action-card">
          <div>
            <div class="action-title">登记已获批项目</div>
            <div class="action-desc">提交项目获批信息，等待科研管理员核验与登记。</div>
          </div>
          <button class="small-btn" @click="showRegisterModal = true">立即登记</button>
        </div>
      </section>

      <section class="content-grid">
        <div class="panel-card">
          <div class="panel-head">
            <span>待办与提醒</span>
            <span class="panel-link">当前需要处理</span>
          </div>

          <div v-if="overview.todoList.length" class="todo-list">
            <div
                v-for="item in overview.todoList"
                :key="item.id"
                class="todo-item"
                @click="go(item.path)"
            >
              <div class="todo-main">
                <div class="todo-title">{{ item.title }}</div>
                <div class="todo-desc">{{ item.desc }}</div>
              </div>
              <span :class="['todo-tag', item.tagClass]">{{ item.tag }}</span>
            </div>
          </div>

          <div v-else class="empty-text">当前暂无待办事项</div>
        </div>

        <div class="panel-card">
          <div class="panel-head">
            <span>科研平台入口</span>
            <span class="panel-link">按权限开放</span>
          </div>

          <div class="platform-grid">
            <div
                v-for="item in overview.platformEntries"
                :key="item.key"
                class="platform-card"
                :class="{ disabled: !item.enabled }"
            >
              <div>
                <div class="platform-title">{{ item.title }}</div>
                <div class="platform-desc">{{ item.desc }}</div>
                <div class="platform-note">{{ item.note }}</div>
              </div>
              <button
                  class="small-btn"
                  :class="{ disabled: !item.enabled }"
                  @click="handlePlatformClick(item)"
              >
                {{ item.buttonText }}
              </button>
            </div>
          </div>
        </div>
      </section>
    </template>

    <transition name="modal-fade">
      <div v-if="showRegisterModal" class="modal-overlay" @click.self="showRegisterModal = false">
        <div class="modal-card">
          <div class="modal-head">
            <div>
              <div class="modal-title">登记已获批项目</div>
              <div class="modal-subtitle">提交后将进入科研管理员审核流程</div>
            </div>
            <button class="close-btn" @click="showRegisterModal = false">×</button>
          </div>

          <div class="form-grid">
            <div class="form-item full">
              <label>项目名称</label>
              <input v-model="form.projectName" placeholder="请输入项目名称" />
            </div>

            <div class="form-item">
              <label>项目级别</label>
              <input v-model="form.projectLevel" placeholder="如：院级 / 市级 / 省级" />
            </div>

            <div class="form-item">
              <label>获批编号 / 立项编号</label>
              <input v-model="form.approvalNo" placeholder="请输入获批编号" />
            </div>

            <div class="form-item">
              <label>伦理批件号</label>
              <input v-model="form.ethicsCode" placeholder="请输入伦理批件号" />
            </div>

            <div class="form-item full">
              <label>数据使用范围</label>
              <textarea v-model="form.dataScope" rows="3" placeholder="请输入申请使用的数据范围"></textarea>
            </div>

            <div class="form-item full">
              <label>项目说明</label>
              <textarea v-model="form.summary" rows="4" placeholder="请输入项目背景、研究目标、当前阶段说明"></textarea>
            </div>
          </div>

          <div class="modal-actions">
            <button class="ghost-btn" @click="showRegisterModal = false">取消</button>
            <button class="primary-btn" @click="handleSubmitRegistration" :disabled="submitting">
              {{ submitting ? '提交中...' : '提交登记申请' }}
            </button>
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
  getResearchOverviewApi,
  submitProjectRegistrationApi
} from '../../api/research'

const router = useRouter()

const loading = ref(false)
const submitting = ref(false)
const error = ref('')
const showRegisterModal = ref(false)

const overview = ref({
  access: {
    hasResearchAccess: false,
    statusLabel: '',
    statusClass: '',
    description: ''
  },
  heroStats: {
    projectSpaceCount: 0,
    pendingTaskCount: 0,
    pendingApprovalCount: 0,
    validEthicsCount: 0
  },
  todoList: [],
  platformEntries: []
})

const form = reactive({
  projectName: '',
  projectLevel: '',
  approvalNo: '',
  ethicsCode: '',
  dataScope: '',
  summary: ''
})

function go(path) {
  router.push(path)
}

async function fetchOverview() {
  try {
    loading.value = true
    error.value = ''

    const data = await getResearchOverviewApi()
    overview.value = data
  } catch (err) {
    error.value = err.message || '科研总览加载失败'
  } finally {
    loading.value = false
  }
}

function handlePlatformClick(item) {
  if (!item.enabled) {
    window.alert('当前未开通该平台，请先完成科研权限核验')
    return
  }

  go(item.path)
}

async function handleSubmitRegistration() {
  try {
    submitting.value = true

    const data = await submitProjectRegistrationApi({
      projectName: form.projectName,
      projectLevel: form.projectLevel,
      approvalNo: form.approvalNo,
      ethicsCode: form.ethicsCode,
      dataScope: form.dataScope,
      summary: form.summary
    })

    window.alert(`登记申请已提交，审批单号：${data.approvalCode}`)
    showRegisterModal.value = false

    form.projectName = ''
    form.projectLevel = ''
    form.approvalNo = ''
    form.ethicsCode = ''
    form.dataScope = ''
    form.summary = ''

    await fetchOverview()
  } catch (err) {
    window.alert(err.message || '提交失败')
  } finally {
    submitting.value = false
  }
}

onMounted(fetchOverview)
</script>

<style scoped>
.research-page {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.page-head {
  display: flex;
  align-items: center;
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
.hero-desc,
.platform-desc,
.panel-link,
.page-tip,
.todo-desc,
.platform-note,
.empty-text,
.access-desc,
.modal-subtitle {
  font-size: 12px;
  line-height: 1.8;
  color: #7892b0;
}

.page-subtitle {
  margin-top: 6px;
}

.primary-btn,
.ghost-btn,
.small-btn {
  height: 42px;
  padding: 0 18px;
  border-radius: 14px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  white-space: nowrap;
}

.primary-btn,
.small-btn {
  border: none;
  color: #fff;
  background: linear-gradient(135deg, #2563eb, #0ea5e9);
}

.ghost-btn {
  border: 1px solid #d8e5f2;
  background: #fff;
  color: #365a7f;
}

.page-tip.error {
  color: #d83b3b;
}

.hero-card,
.panel-card,
.action-card,
.stat-card,
.platform-card,
.todo-item,
.access-card {
  background: rgba(255, 255, 255, 0.82);
  border: 1px solid #dce8f4;
  border-radius: 22px;
  box-shadow: 0 10px 30px rgba(17, 56, 102, 0.05);
}

.hero-card {
  padding: 22px;
  display: grid;
  grid-template-columns: 1.08fr 0.92fr;
  gap: 18px;
}

.hero-badge {
  display: inline-flex;
  padding: 6px 10px;
  border-radius: 999px;
  background: #edf6ff;
  color: #1f5da8;
  font-size: 12px;
  margin-bottom: 14px;
}

.hero-title {
  font-size: 30px;
  line-height: 1.25;
  font-weight: 800;
  color: #17385f;
}

.hero-desc {
  margin-top: 14px;
}

.access-card {
  margin-top: 18px;
  padding: 16px;
}

.access-card.success {
  background: #f4fbf8;
  border-color: #d8efe4;
}

.access-card.warning {
  background: #fffaf1;
  border-color: #f3e3b8;
}

.access-title {
  font-size: 15px;
  font-weight: 800;
  color: #17385f;
}

.hero-right {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.stat-card {
  padding: 16px;
}

.stat-card span {
  display: block;
  font-size: 12px;
  color: #7590b0;
}

.stat-card strong {
  display: block;
  margin-top: 8px;
  font-size: 28px;
  color: #17385f;
}

.action-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;
}

.action-card {
  padding: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.action-title,
.platform-title,
.todo-title,
.modal-title {
  font-size: 15px;
  font-weight: 800;
  color: #1d466f;
}

.action-desc {
  margin-top: 8px;
  font-size: 12px;
  line-height: 1.8;
  color: #7892b0;
}

.content-grid {
  display: grid;
  grid-template-columns: 0.92fr 1.08fr;
  gap: 14px;
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

.todo-list,
.platform-grid {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.todo-item {
  padding: 16px;
  background: #f9fcff;
  border: 1px solid #e3edf7;
  box-shadow: none;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 14px;
  cursor: pointer;
}

.todo-tag {
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 12px;
  white-space: nowrap;
}

.todo-tag.warning {
  background: #fff5df;
  color: #c98912;
}

.todo-tag.blue {
  background: #edf6ff;
  color: #2a70b8;
}

.todo-tag.danger {
  background: #feecec;
  color: #d83b3b;
}

.platform-card {
  padding: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.platform-card.disabled {
  opacity: 0.7;
}

.platform-note {
  margin-top: 8px;
}

.small-btn.disabled {
  background: #d8e5f2;
  color: #7f98b4;
}

.empty-text {
  padding: 12px 0;
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
  border-radius: 24px;
  border: 1px solid #dce8f4;
  box-shadow: 0 20px 50px rgba(17, 56, 102, 0.16);
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

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
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
  .page-head,
  .hero-card,
  .content-grid,
  .action-grid,
  .form-grid {
    grid-template-columns: 1fr;
    flex-direction: column;
    align-items: flex-start;
  }

  .hero-right {
    grid-template-columns: 1fr 1fr;
    width: 100%;
  }

  .action-card,
  .platform-card {
    flex-direction: column;
    align-items: flex-start;
  }
}

@media (max-width: 768px) {
  .hero-right {
    grid-template-columns: 1fr;
  }
}
</style>
