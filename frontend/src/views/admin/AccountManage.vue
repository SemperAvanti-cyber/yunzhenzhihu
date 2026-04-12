<template>
  <div class="account-page">
    <div class="page-head">
      <div>
        <h1>账号管理</h1>
        <div class="page-subtitle">管理本院医生账号、科室归属、启停状态与科研权限</div>
      </div>

      <div class="head-actions">
        <button class="ghost-btn" @click="fetchAccounts">刷新列表</button>
      </div>
    </div>

    <div v-if="loading" class="page-tip">正在加载账号管理数据...</div>
    <div v-else-if="error" class="page-tip error">{{ error }}</div>

    <template v-else>
      <section class="summary-grid">
        <div class="summary-card">
          <div class="summary-title">启用账号</div>
          <div class="summary-value">{{ board.summary.enabledCount }}</div>
          <div class="summary-note">当前正常使用</div>
        </div>
        <div class="summary-card">
          <div class="summary-title">待审核账号</div>
          <div class="summary-value">{{ board.summary.pendingCount }}</div>
          <div class="summary-note">待完成开通确认</div>
        </div>
        <div class="summary-card">
          <div class="summary-title">停用账号</div>
          <div class="summary-value">{{ board.summary.disabledCount }}</div>
          <div class="summary-note">停用后仍保留历史记录</div>
        </div>
        <div class="summary-card">
          <div class="summary-title">今日变更</div>
          <div class="summary-value">{{ board.summary.todayChanges }}</div>
          <div class="summary-note">账号与权限调整留痕</div>
        </div>
      </section>

      <section class="panel-card">
        <div class="panel-head">
          <span>筛选条件</span>
          <span class="panel-link">医院管理员视角</span>
        </div>

        <div class="filter-grid">
          <div class="filter-item full">
            <label>搜索</label>
            <input
                v-model="filters.keyword"
                placeholder="搜索姓名 / 账号 / 邮箱"
                @keyup.enter="applyFilters"
            />
          </div>

          <div class="filter-item">
            <label>科室</label>
            <select v-model="filters.departmentId" @change="applyFilters">
              <option value="">全部科室</option>
              <option
                  v-for="item in board.filters.departmentOptions"
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

          <div class="filter-action">
            <button class="primary-btn" @click="applyFilters">应用筛选</button>
          </div>
        </div>
      </section>

      <section class="content-grid">
        <div class="panel-card">
          <div class="panel-head">
            <span>账号列表</span>
            <span class="panel-link">{{ board.list.length }} 条记录</span>
          </div>

          <div class="table-wrap">
            <div class="table-head">
              <span>姓名</span>
              <span>科室</span>
              <span>职称</span>
              <span>角色</span>
              <span>科研权限</span>
              <span>状态</span>
              <span>最近登录</span>
            </div>

            <div
                v-for="item in board.list"
                :key="item.id"
                class="table-row"
                :class="{ active: selected?.id === item.id }"
                @click="selectUser(item.id)"
            >
              <span>{{ item.realName }}</span>
              <span>{{ item.department }}</span>
              <span>{{ item.title }}</span>
              <span>{{ item.roleLabel }}</span>
              <span>{{ item.hasResearchAccess ? '已开通' : '未开通' }}</span>
              <span>
                <em :class="['status-chip', item.statusClass]">{{ item.status }}</em>
              </span>
              <span>{{ item.lastLoginAt }}</span>
            </div>
          </div>
        </div>

        <div class="panel-card">
          <div class="panel-head">
            <span>账号详情</span>
            <span class="panel-link">{{ selected?.realName || '未选择' }}</span>
          </div>

          <template v-if="selected">
            <div class="detail-list">
              <div class="detail-item">
                <label>姓名</label>
                <div>{{ selected.realName }}</div>
              </div>
              <div class="detail-item">
                <label>账号</label>
                <div>{{ selected.account }}</div>
              </div>
              <div class="detail-item">
                <label>邮箱</label>
                <div>{{ selected.email }}</div>
              </div>
              <div class="detail-item">
                <label>医院</label>
                <div>{{ selected.hospital }}</div>
              </div>
              <div class="detail-item">
                <label>科室</label>
                <div>{{ selected.department }}</div>
              </div>
              <div class="detail-item">
                <label>职称</label>
                <div>{{ selected.title }}</div>
              </div>
              <div class="detail-item">
                <label>账号状态</label>
                <div>{{ selected.status }}</div>
              </div>
              <div class="detail-item">
                <label>科研权限</label>
                <div>{{ selected.hasResearchAccess ? '已开通' : '未开通' }}</div>
              </div>
            </div>

            <div class="action-grid">
              <button
                  class="primary-btn"
                  @click="toggleStatus"
                  :disabled="submitting"
              >
                {{ selected.statusRaw === 'DISABLED' ? '启用账号' : '停用账号' }}
              </button>

              <button
                  class="ghost-btn"
                  @click="toggleResearchAccess"
                  :disabled="submitting"
              >
                {{ selected.hasResearchAccess ? '关闭科研权限' : '开通科研权限' }}
              </button>
            </div>

            <div class="log-section">
              <div class="log-title">最近操作记录</div>
              <div v-if="selected.recentActions.length" class="log-list">
                <div
                    v-for="item in selected.recentActions"
                    :key="item.id"
                    class="log-item"
                >
                  <div class="log-type">{{ item.actionType }}</div>
                  <div class="log-desc">{{ item.detail }}</div>
                  <div class="log-time">{{ item.createdAt }}</div>
                </div>
              </div>
              <div v-else class="empty-text">暂无最近操作记录</div>
            </div>
          </template>

          <div v-else class="empty-text">请选择左侧账号查看详情</div>
        </div>
      </section>
    </template>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  getAdminAccountsApi,
  toggleResearchAccessApi,
  updateAccountStatusApi
} from '../../api/admin'

const route = useRoute()
const router = useRouter()

const loading = ref(false)
const submitting = ref(false)
const error = ref('')
const selected = ref(null)

const board = ref({
  summary: {
    enabledCount: 0,
    pendingCount: 0,
    disabledCount: 0,
    todayChanges: 0
  },
  filters: {
    keyword: '',
    currentDepartmentId: '',
    currentStatus: 'ALL',
    departmentOptions: [],
    statusOptions: []
  },
  list: [],
  selected: null
})

const filters = reactive({
  keyword: '',
  departmentId: '',
  status: 'ALL'
})

async function fetchAccounts() {
  try {
    loading.value = true
    error.value = ''

    const data = await getAdminAccountsApi({
      keyword: filters.keyword,
      departmentId: filters.departmentId,
      status: filters.status,
      userId: route.query.userId || ''
    })

    board.value = data
    selected.value = data.selected || null

    if (!filters.status) {
      filters.status = data.filters.currentStatus || 'ALL'
    }
  } catch (err) {
    error.value = err.message || '账号管理页加载失败'
  } finally {
    loading.value = false
  }
}

async function applyFilters() {
  await router.replace({
    path: '/admin/accounts',
    query: {
      scope: route.query.scope || 'hospital',
      userId: route.query.userId || '',
      keyword: filters.keyword || '',
      departmentId: filters.departmentId || '',
      status: filters.status || 'ALL'
    }
  })

  await fetchAccounts()
}

async function selectUser(userId) {
  await router.replace({
    path: '/admin/accounts',
    query: {
      scope: route.query.scope || 'hospital',
      keyword: filters.keyword || '',
      departmentId: filters.departmentId || '',
      status: filters.status || 'ALL',
      userId
    }
  })

  await fetchAccounts()
}

async function toggleStatus() {
  if (!selected.value) return

  const nextStatus =
      selected.value.statusRaw === 'DISABLED' ? 'ENABLED' : 'DISABLED'

  try {
    submitting.value = true
    await updateAccountStatusApi(selected.value.id, nextStatus)
    await fetchAccounts()
  } catch (err) {
    window.alert(err.message || '更新账号状态失败')
  } finally {
    submitting.value = false
  }
}

async function toggleResearchAccess() {
  if (!selected.value) return

  try {
    submitting.value = true
    await toggleResearchAccessApi(
        selected.value.id,
        !selected.value.hasResearchAccess
    )
    await fetchAccounts()
  } catch (err) {
    window.alert(err.message || '更新科研权限失败')
  } finally {
    submitting.value = false
  }
}

onMounted(() => {
  filters.keyword = String(route.query.keyword || '')
  filters.departmentId = String(route.query.departmentId || '')
  filters.status = String(route.query.status || 'ALL')
  fetchAccounts()
})
</script>

<style scoped>
.account-page {
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
.summary-note,
.panel-link,
.page-tip,
.empty-text,
.log-desc,
.log-time {
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
.action-grid {
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

.summary-grid,
.filter-grid,
.content-grid {
  display: grid;
  gap: 14px;
}

.summary-grid {
  grid-template-columns: repeat(4, minmax(0, 1fr));
}

.filter-grid {
  grid-template-columns: 1.2fr 1fr 1fr auto;
  align-items: end;
}

.content-grid {
  grid-template-columns: 1.18fr 0.82fr;
}

.summary-card,
.panel-card,
.filter-item,
.detail-item,
.log-item {
  background: rgba(255, 255, 255, 0.82);
  border: 1px solid #dce8f4;
  border-radius: 22px;
  box-shadow: 0 10px 30px rgba(17, 56, 102, 0.05);
}

.summary-card {
  padding: 18px;
}

.summary-title {
  font-size: 13px;
  color: #7590b0;
}

.summary-value {
  margin-top: 10px;
  font-size: 24px;
  font-weight: 800;
  color: #17385f;
}

.summary-note {
  margin-top: 8px;
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

.filter-item.full {
  grid-column: auto;
}

.filter-item label,
.detail-item label {
  display: block;
  font-size: 12px;
  color: #7a93af;
  margin-bottom: 8px;
}

.filter-item input,
.filter-item select {
  width: 100%;
  border: 1px solid #d8e5f2;
  border-radius: 14px;
  background: #fff;
  padding: 12px 14px;
  font-size: 14px;
  color: #1d466f;
  outline: none;
}

.filter-action {
  display: flex;
}

.table-wrap {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.table-head,
.table-row {
  display: grid;
  grid-template-columns: 1fr 1fr 0.9fr 0.8fr 0.9fr 0.8fr 0.9fr;
  gap: 12px;
  padding: 14px 16px;
  border-radius: 16px;
  align-items: center;
}

.table-head {
  background: #f5f9fd;
  color: #7a93af;
  font-size: 12px;
  font-weight: 700;
}

.table-row {
  background: #f9fcff;
  border: 1px solid #e3edf7;
  font-size: 13px;
  color: #365a7f;
  cursor: pointer;
}

.table-row.active {
  background: #edf6ff;
  border-color: #bfd8f8;
}

.status-chip {
  display: inline-flex;
  padding: 4px 10px;
  border-radius: 999px;
  font-style: normal;
  font-size: 12px;
  white-space: nowrap;
}

.status-chip.success {
  background: #ecfbf5;
  color: #14906a;
}

.status-chip.warning {
  background: #fff5df;
  color: #c98912;
}

.status-chip.danger {
  background: #feecec;
  color: #d83b3b;
}

.detail-list,
.log-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.detail-item,
.log-item {
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

.log-section {
  margin-top: 18px;
}

.log-title,
.log-type {
  font-size: 14px;
  font-weight: 800;
  color: #1d466f;
}

@media (max-width: 1280px) {
  .page-head {
    flex-direction: column;
    align-items: flex-start;
  }

  .summary-grid,
  .filter-grid,
  .content-grid,
  .table-head,
  .table-row {
    grid-template-columns: 1fr;
  }

  .filter-action {
    width: 100%;
  }
}
</style>
