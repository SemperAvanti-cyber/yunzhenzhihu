<template>
  <div class="security-page">
    <div class="page-head">
      <div>
        <h1>系统安全</h1>
        <div class="page-subtitle">
          管理导出策略、登录保护、访问控制、备份与恢复
        </div>
      </div>

      <div class="head-actions">
        <button class="ghost-btn" @click="resetBoard">恢复默认配置</button>
        <button class="primary-btn" @click="exportSecurityReport">导出安全报告</button>
      </div>
    </div>

    <section class="metric-grid">
      <div class="metric-card">
        <span>高危事件</span>
        <strong>{{ metrics.highRisk }}</strong>
        <p>需优先关注的安全风险</p>
      </div>
      <div class="metric-card">
        <span>今日导出行为</span>
        <strong>{{ metrics.exportCount }}</strong>
        <p>导出链路重点留痕</p>
      </div>
      <div class="metric-card">
        <span>备份记录</span>
        <strong>{{ state.backups.length }}</strong>
        <p>手动与自动备份都记录</p>
      </div>
      <div class="metric-card">
        <span>已保存策略</span>
        <strong>4</strong>
        <p>导出 / 登录 / 访问 / 备份</p>
      </div>
    </section>

    <section class="content-grid">
      <!-- 左：配置中心 -->
      <div class="panel-card">
        <div class="panel-head">
          <span>安全策略配置</span>
          <span class="panel-link">保存后立即生效</span>
        </div>

        <div class="config-section">
          <div class="config-title">导出策略</div>
          <div class="config-row vertical">
            <label><input type="checkbox" v-model="state.exportPolicy.allowResearchExport" /> 允许科研导出</label>
            <label><input type="checkbox" v-model="state.exportPolicy.forceApproval" /> 导出必须审批</label>
            <label><input type="checkbox" v-model="state.exportPolicy.requireWatermark" /> 导出自动带水印</label>
          </div>
          <button class="primary-btn" @click="savePolicy('EXPORT_POLICY')">保存导出策略</button>
        </div>

        <div class="config-section">
          <div class="config-title">登录安全</div>
          <div class="config-grid">
            <div class="config-input">
              <label>允许失败次数</label>
              <input type="number" v-model.number="state.loginPolicy.maxRetry" />
            </div>
            <div class="config-input">
              <label>锁定分钟数</label>
              <input type="number" v-model.number="state.loginPolicy.lockMinutes" />
            </div>
          </div>
          <div class="config-row vertical">
            <label><input type="checkbox" v-model="state.loginPolicy.requireStrongPassword" /> 强密码策略</label>
          </div>
          <button class="primary-btn" @click="savePolicy('LOGIN_POLICY')">保存登录策略</button>
        </div>

        <div class="config-section">
          <div class="config-title">访问控制</div>
          <div class="config-row vertical">
            <label><input type="checkbox" v-model="state.accessPolicy.enableSensitiveAccessAlert" /> 启用敏感访问预警</label>
            <label><input type="checkbox" v-model="state.accessPolicy.requireCrossHospitalApproval" /> 跨院访问需审批</label>
            <label><input type="checkbox" v-model="state.accessPolicy.allowRawImageDownload" /> 允许下载临床原始影像</label>
          </div>
          <button class="primary-btn" @click="savePolicy('ACCESS_POLICY')">保存访问控制</button>
        </div>

        <div class="config-section">
          <div class="config-title">备份策略</div>
          <div class="config-grid">
            <div class="config-input">
              <label>备份周期</label>
              <select v-model="state.backupPolicy.cycle">
                <option value="DAILY">每日</option>
                <option value="WEEKLY">每周</option>
                <option value="MONTHLY">每月</option>
              </select>
            </div>
            <div class="config-input">
              <label>保留天数</label>
              <input type="number" v-model.number="state.backupPolicy.retentionDays" />
            </div>
          </div>
          <div class="config-row vertical">
            <label><input type="checkbox" v-model="state.backupPolicy.autoBackup" /> 启用自动备份</label>
          </div>
          <button class="primary-btn" @click="savePolicy('BACKUP_POLICY')">保存备份策略</button>
        </div>
      </div>

      <!-- 右：备份中心 -->
      <div class="panel-card">
        <div class="panel-head">
          <span>备份中心</span>
          <span class="panel-link">操作会进入记录</span>
        </div>

        <div class="form-item">
          <label>手动备份备注</label>
          <input v-model="backupNote" placeholder="例如：发布前手动备份" />
        </div>

        <div class="backup-action">
          <button class="primary-btn" @click="createBackup">创建手动备份</button>
        </div>

        <div class="backup-list">
          <div v-for="item in state.backups" :key="item.id" class="backup-item">
            <div class="backup-top">
              <div class="backup-code">{{ item.code }}</div>
              <div :class="['backup-status', item.statusClass]">{{ item.statusLabel }}</div>
            </div>
            <div class="backup-meta">{{ item.typeLabel }} · {{ item.time }}</div>
            <div class="backup-path">{{ item.path }}</div>
            <div class="backup-note">{{ item.note }}</div>
            <button class="ghost-btn ghost-btn-small" @click="restoreBackup(item.id)">
              标记恢复
            </button>
          </div>
        </div>
      </div>
    </section>

    <section class="bottom-grid">
      <div class="panel-card">
        <div class="panel-head">
          <span>高危事件</span>
          <span class="panel-link">重点关注</span>
        </div>

        <div v-if="state.highRiskEvents.length" class="event-list">
          <div v-for="item in state.highRiskEvents" :key="item.id" class="event-item">
            <div class="event-top">
              <div class="event-title">{{ item.title }}</div>
              <div :class="['risk-chip', item.levelClass]">{{ item.levelLabel }}</div>
            </div>
            <div class="event-desc">{{ item.desc }}</div>
            <div class="event-time">{{ item.time }}</div>
          </div>
        </div>

        <div v-else class="empty-text">暂无高危事件</div>
      </div>

      <div class="panel-card">
        <div class="panel-head">
          <span>最近安全操作</span>
          <span class="panel-link">配置与备份变更</span>
        </div>

        <div v-if="state.recentOps.length" class="ops-list">
          <div v-for="item in state.recentOps" :key="item.id" class="ops-item">
            <div class="ops-title">{{ item.title }}</div>
            <div class="ops-desc">{{ item.desc }}</div>
            <div class="ops-time">{{ item.time }}</div>
          </div>
        </div>

        <div v-else class="empty-text">暂无操作记录</div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed, reactive, ref } from 'vue'

const STORAGE_KEY = 'yf_admin_security_center_v1'

function nowTimeText() {
  const now = new Date()
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, '0')
  const d = String(now.getDate()).padStart(2, '0')
  const hh = String(now.getHours()).padStart(2, '0')
  const mm = String(now.getMinutes()).padStart(2, '0')
  return `${y}-${m}-${d} ${hh}:${mm}`
}

function buildSeedState() {
  return {
    exportPolicy: {
      allowResearchExport: true,
      forceApproval: true,
      requireWatermark: true
    },
    loginPolicy: {
      maxRetry: 5,
      lockMinutes: 10,
      requireStrongPassword: true
    },
    accessPolicy: {
      enableSensitiveAccessAlert: true,
      requireCrossHospitalApproval: true,
      allowRawImageDownload: false
    },
    backupPolicy: {
      autoBackup: true,
      cycle: 'DAILY',
      retentionDays: 30
    },
    backups: [
      {
        id: 1,
        code: 'BK-20260410-001',
        typeLabel: '自动备份',
        statusLabel: '成功',
        statusClass: 'success',
        path: '/secure-backups/BK-20260410-001.zip',
        note: '凌晨自动备份',
        time: '2026-04-10 03:00'
      },
      {
        id: 2,
        code: 'BK-20260409-201',
        typeLabel: '手动备份',
        statusLabel: '成功',
        statusClass: 'success',
        path: '/secure-backups/BK-20260409-201.zip',
        note: '发布前手动备份',
        time: '2026-04-09 18:20'
      }
    ],
    highRiskEvents: [
      {
        id: 1,
        title: '导出策略被修改',
        desc: '管理员更新了导出审批规则，请关注后续导出行为。',
        levelLabel: '高危',
        levelClass: 'danger',
        time: '2026-04-10 09:12'
      },
      {
        id: 2,
        title: '跨院原始影像访问尝试',
        desc: '检测到一次跨院原始影像访问请求，已进入预警视图。',
        levelLabel: '警告',
        levelClass: 'warning',
        time: '2026-04-10 10:26'
      }
    ],
    recentOps: [
      {
        id: 1,
        title: '更新导出策略',
        desc: '保存了“导出必须审批”的策略设置。',
        time: '2026-04-10 09:12'
      },
      {
        id: 2,
        title: '创建手动备份',
        desc: '发布前执行了一次手动备份。',
        time: '2026-04-09 18:20'
      }
    ]
  }
}

function loadState() {
  const raw = window.localStorage.getItem(STORAGE_KEY)
  if (raw) return JSON.parse(raw)
  const seed = buildSeedState()
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(seed))
  return seed
}

function saveState(data) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

const state = reactive(loadState())
const backupNote = ref('')

const metrics = computed(() => {
  return {
    highRisk: state.highRiskEvents.length,
    exportCount: state.recentOps.filter((item) => item.title.includes('导出')).length
  }
})

function pushOp(title, desc) {
  state.recentOps.unshift({
    id: Date.now(),
    title,
    desc,
    time: nowTimeText()
  })
}

function pushRisk(title, desc, levelClass = 'warning', levelLabel = '警告') {
  state.highRiskEvents.unshift({
    id: Date.now(),
    title,
    desc,
    levelClass,
    levelLabel,
    time: nowTimeText()
  })
}

function persist() {
  saveState(JSON.parse(JSON.stringify(state)))
}

function savePolicy(type) {
  if (type === 'EXPORT_POLICY') {
    pushOp('更新导出策略', '保存了导出权限、审批和水印配置。')
    if (!state.exportPolicy.requireWatermark) {
      pushRisk('导出水印被关闭', '建议确认当前导出场景是否允许无水印导出。', 'danger', '高危')
    }
  }

  if (type === 'LOGIN_POLICY') {
    pushOp('更新登录安全', '保存了登录失败次数和锁定策略。')
    if (state.loginPolicy.maxRetry > 8) {
      pushRisk('登录失败次数阈值偏高', '当前最大失败次数设置较高，建议复核。', 'warning', '警告')
    }
  }

  if (type === 'ACCESS_POLICY') {
    pushOp('更新访问控制', '保存了敏感访问、跨院审批与原始影像下载策略。')
    if (state.accessPolicy.allowRawImageDownload) {
      pushRisk('原始影像下载已开启', '临床原始影像下载权限开启，建议加强审计。', 'danger', '高危')
    }
  }

  if (type === 'BACKUP_POLICY') {
    pushOp('更新备份策略', '保存了自动备份、周期与保留天数配置。')
  }

  persist()
  window.alert('配置已保存')
}

function createBackup() {
  const note = backupNote.value.trim() || '管理员手动创建备份'
  state.backups.unshift({
    id: Date.now(),
    code: `BK-${String(Date.now()).slice(-9)}`,
    typeLabel: '手动备份',
    statusLabel: '成功',
    statusClass: 'success',
    path: `/secure-backups/BK-${String(Date.now()).slice(-9)}.zip`,
    note,
    time: nowTimeText()
  })

  pushOp('创建手动备份', note)
  backupNote.value = ''
  persist()
  window.alert('已创建手动备份')
}

function restoreBackup(id) {
  const item = state.backups.find((it) => it.id === id)
  if (!item) return

  item.statusLabel = '已恢复'
  item.statusClass = 'warning'

  pushOp('执行备份恢复', `从备份 ${item.code} 发起恢复操作记录。`)
  pushRisk('执行恢复操作', `备份 ${item.code} 已被标记为恢复操作。`, 'warning', '警告')
  persist()
  window.alert('已记录恢复操作')
}

function exportSecurityReport() {
  const content = `
系统安全报告
========================
导出策略：
${JSON.stringify(state.exportPolicy, null, 2)}

登录安全：
${JSON.stringify(state.loginPolicy, null, 2)}

访问控制：
${JSON.stringify(state.accessPolicy, null, 2)}

备份策略：
${JSON.stringify(state.backupPolicy, null, 2)}

备份记录数：${state.backups.length}
高危事件数：${state.highRiskEvents.length}
导出时间：${nowTimeText()}
`.trim()

  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = '系统安全报告.txt'
  a.click()
  URL.revokeObjectURL(url)

  pushOp('导出安全报告', '管理员导出了当前系统安全策略报告。')
  persist()
}

function resetBoard() {
  const seed = buildSeedState()
  Object.assign(state, seed)
  persist()
}
</script>

<style scoped>
.security-page {
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
.empty-text,
.event-desc,
.event-time,
.ops-desc,
.ops-time,
.backup-meta,
.backup-path,
.backup-note {
  font-size: 12px;
  line-height: 1.8;
  color: #7892b0;
}

.page-subtitle {
  margin-top: 6px;
}

.head-actions,
.backup-action {
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

.ghost-btn-small {
  height: 34px;
  padding: 0 12px;
  margin-top: 10px;
}

.metric-grid,
.content-grid,
.bottom-grid,
.config-grid {
  display: grid;
  gap: 14px;
}

.metric-grid {
  grid-template-columns: repeat(4, minmax(0, 1fr));
}

.content-grid,
.bottom-grid {
  grid-template-columns: 1.04fr 0.96fr;
}

.config-grid {
  grid-template-columns: 1fr 1fr;
}

.metric-card,
.panel-card,
.config-section,
.backup-item,
.event-item,
.ops-item {
  background: rgba(255, 255, 255, 0.82);
  border: 1px solid #dce8f4;
  border-radius: 22px;
  box-shadow: 0 10px 30px rgba(17, 56, 102, 0.05);
}

.metric-card {
  padding: 18px;
}

.metric-card span {
  display: block;
  font-size: 13px;
  color: #7590b0;
}

.metric-card strong {
  display: block;
  margin-top: 10px;
  font-size: 32px;
  color: #17385f;
}

.metric-card p {
  margin: 8px 0 0;
  font-size: 12px;
  line-height: 1.8;
  color: #7892b0;
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

.config-section {
  padding: 16px;
  background: #f9fcff;
  border: 1px solid #e3edf7;
  box-shadow: none;
}

.config-section + .config-section {
  margin-top: 14px;
}

.config-title,
.event-title,
.ops-title {
  font-size: 15px;
  font-weight: 800;
  color: #1d466f;
  margin-bottom: 12px;
}

.config-row {
  display: flex;
  gap: 14px;
  flex-wrap: wrap;
  margin-bottom: 14px;
}

.config-row.vertical {
  flex-direction: column;
  align-items: flex-start;
}

.config-row label,
.config-input label,
.form-item label {
  font-size: 13px;
  color: #365a7f;
}

.config-input input,
.config-input select,
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

.form-item {
  margin-bottom: 12px;
}

.backup-list,
.event-list,
.ops-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.backup-item,
.event-item,
.ops-item {
  padding: 14px;
  background: #f9fcff;
  border: 1px solid #e3edf7;
  box-shadow: none;
}

.backup-top,
.event-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.backup-code {
  font-size: 13px;
  font-weight: 800;
  color: #1d466f;
}

.backup-status,
.risk-chip {
  display: inline-flex;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 12px;
}

.backup-status.success {
  background: #ecfbf5;
  color: #14906a;
}

.backup-status.warning,
.risk-chip.warning {
  background: #fff5df;
  color: #c98912;
}

.risk-chip.danger {
  background: #feecec;
  color: #d83b3b;
}

@media (max-width: 1280px) {
  .page-head {
    flex-direction: column;
    align-items: flex-start;
  }

  .metric-grid,
  .content-grid,
  .bottom-grid,
  .config-grid {
    grid-template-columns: 1fr;
  }
}
</style>
