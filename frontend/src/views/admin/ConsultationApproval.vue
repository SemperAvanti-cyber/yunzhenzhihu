<template>
  <div class="consult-page">
    <div class="page-head">
      <div>
        <h1>跨院会诊审批</h1>
        <div class="page-subtitle">
          处理跨院远程会诊的行政流转、目标医院分配与审批留痕
        </div>
      </div>

      <div class="head-actions">
        <button class="ghost-btn" @click="resetBoard">恢复默认数据</button>
        <button class="primary-btn" :disabled="!selectedItem" @click="exportCurrentSheet">
          导出审批单
        </button>
      </div>
    </div>

    <section class="metric-grid">
      <div class="metric-card">
        <span>待审批申请</span>
        <strong>{{ metrics.pending }}</strong>
        <p>等待医院管理员处理</p>
      </div>
      <div class="metric-card">
        <span>今日通过</span>
        <strong>{{ metrics.approvedToday }}</strong>
        <p>已完成行政流转</p>
      </div>
      <div class="metric-card">
        <span>已退回</span>
        <strong>{{ metrics.returned }}</strong>
        <p>待补充材料或信息</p>
      </div>
      <div class="metric-card">
        <span>超时待处理</span>
        <strong>{{ metrics.overdue }}</strong>
        <p>超过预设时限仍未审批</p>
      </div>
    </section>

    <section class="panel-card">
      <div class="panel-head">
        <span>筛选条件</span>
        <span class="panel-link">医院管理员视角</span>
      </div>

      <div class="filter-grid">
        <div class="filter-item filter-item-wide">
          <label>搜索</label>
          <input
              v-model="filters.keyword"
              type="text"
              placeholder="搜索申请单号 / 病例编号 / 患者姓名 / 申请医院"
          />
        </div>

        <div class="filter-item">
          <label>状态</label>
          <select v-model="filters.status">
            <option value="ALL">全部状态</option>
            <option value="PENDING">待审批</option>
            <option value="APPROVED">已通过</option>
            <option value="RETURNED">已退回</option>
            <option value="REJECTED">已驳回</option>
            <option value="IN_PROGRESS">流转中</option>
          </select>
        </div>

        <div class="filter-item">
          <label>类型</label>
          <select v-model="filters.type">
            <option value="ALL">全部类型</option>
            <option value="REFERRAL">上转</option>
            <option value="REMOTE_CONSULTATION">远程会诊</option>
            <option value="INTERNAL_CONSULTATION">院内会诊</option>
          </select>
        </div>
      </div>
    </section>

    <section class="content-grid">
      <!-- 左：审批队列 -->
      <div class="panel-card">
        <div class="panel-head">
          <span>审批队列</span>
          <span class="panel-link">{{ filteredList.length }} 条记录</span>
        </div>

        <div v-if="filteredList.length" class="queue-list">
          <div
              v-for="item in filteredList"
              :key="item.id"
              class="queue-item"
              :class="{ active: item.id === activeId }"
              @click="handleSelect(item.id)"
          >
            <div class="queue-top">
              <div class="queue-id">{{ item.referralCode }}</div>
              <div :class="['queue-badge', statusClassMap[item.status]]">
                {{ statusLabelMap[item.status] }}
              </div>
            </div>

            <div class="queue-title">{{ item.patientName }}</div>
            <div class="queue-desc">
              {{ item.caseCode }} · {{ typeLabelMap[item.type] }} · {{ item.fromDoctorName }}
            </div>
            <div class="queue-meta">
              {{ item.fromHospitalName }} → {{ item.toHospitalName || '待分配' }}
            </div>
          </div>
        </div>

        <div v-else class="empty-text">当前筛选下暂无会诊审批记录</div>
      </div>

      <!-- 中：详情 -->
      <div class="panel-card">
        <div class="panel-head">
          <span>当前申请详情</span>
          <span class="panel-link">{{ selectedItem?.referralCode || '--' }}</span>
        </div>

        <template v-if="selectedItem">
          <div class="preview-box">
            <div class="preview-image">
              <div class="preview-spot preview-spot-a"></div>
              <div class="preview-spot preview-spot-b"></div>
              <div class="preview-tag">病例缩略影像</div>
            </div>
          </div>

          <div class="detail-list">
            <div class="detail-item">
              <label>病例编号</label>
              <div>{{ selectedItem.caseCode }}</div>
            </div>
            <div class="detail-item">
              <label>患者姓名</label>
              <div>{{ selectedItem.patientName }}</div>
            </div>
            <div class="detail-item">
              <label>患者性别 / 年龄</label>
              <div>{{ selectedItem.gender }} / {{ selectedItem.age }} 岁</div>
            </div>
            <div class="detail-item">
              <label>申请医生</label>
              <div>{{ selectedItem.fromDoctorName }}</div>
            </div>
            <div class="detail-item">
              <label>申请类型</label>
              <div>{{ typeLabelMap[selectedItem.type] }}</div>
            </div>
            <div class="detail-item">
              <label>当前状态</label>
              <div>{{ statusLabelMap[selectedItem.status] }}</div>
            </div>
            <div class="detail-item">
              <label>申请医院</label>
              <div>{{ selectedItem.fromHospitalName }}</div>
            </div>
            <div class="detail-item">
              <label>目标医院</label>
              <div>{{ selectedItem.toHospitalName || '待分配' }}</div>
            </div>
            <div class="detail-item detail-item-full">
              <label>申请原因</label>
              <div>{{ selectedItem.reason }}</div>
            </div>
            <div class="detail-item detail-item-full">
              <label>病情摘要</label>
              <div>{{ selectedItem.summary }}</div>
            </div>
          </div>

          <div class="history-box">
            <div class="history-title">流转记录</div>
            <div v-if="selectedItem.logs.length" class="history-list">
              <div v-for="log in selectedItem.logs" :key="log.id" class="history-item">
                <div class="history-time">{{ log.time }}</div>
                <div class="history-content">{{ log.content }}</div>
              </div>
            </div>
            <div v-else class="empty-text">暂无流转记录</div>
          </div>
        </template>

        <div v-else class="empty-text">请选择左侧审批记录查看详情</div>
      </div>

      <!-- 右：操作区 -->
      <div class="panel-card">
        <div class="panel-head">
          <span>审批操作区</span>
          <span class="panel-link">行政流转处理</span>
        </div>

        <template v-if="selectedItem">
          <div class="form-item">
            <label>目标医院</label>
            <select v-model="actionForm.toHospitalName">
              <option value="">请选择目标医院</option>
              <option v-for="item in hospitalOptions" :key="item" :value="item">
                {{ item }}
              </option>
            </select>
          </div>

          <div class="form-item">
            <label>审批意见</label>
            <textarea
                v-model="actionForm.adminComment"
                rows="7"
                placeholder="请输入审批说明、退回原因或补充要求"
            ></textarea>
          </div>

          <div class="tip-box">
            <div class="tip-title">操作提示</div>
            <div class="tip-content">
              审批通过后将进入“流转中”；退回会保留记录并要求补充材料；驳回会终止本次行政审批流程。
            </div>
          </div>

          <div class="action-box">
            <button class="primary-btn" @click="handleAction('APPROVED')">
              审批通过并流转
            </button>
            <button class="warning-btn" @click="handleAction('RETURNED')">
              退回补充材料
            </button>
            <button class="danger-btn" @click="handleAction('REJECTED')">
              驳回申请
            </button>
          </div>
        </template>

        <div v-else class="empty-text">请选择申请后再操作</div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed, reactive, ref, watch } from 'vue'

const STORAGE_KEY = 'yf_admin_consultation_board_v1'

const statusLabelMap = {
  PENDING: '待审批',
  APPROVED: '已通过',
  RETURNED: '已退回',
  REJECTED: '已驳回',
  IN_PROGRESS: '流转中'
}

const statusClassMap = {
  PENDING: 'warning',
  APPROVED: 'success',
  RETURNED: 'warning',
  REJECTED: 'danger',
  IN_PROGRESS: 'blue'
}

const typeLabelMap = {
  REFERRAL: '上转',
  REMOTE_CONSULTATION: '远程会诊',
  INTERNAL_CONSULTATION: '院内会诊'
}

const hospitalOptions = [
  '自治区皮肤病区域协同中心',
  '乌鲁木齐市第二人民医院',
  '自治区人民医院皮肤科',
  '医科大学附属第一医院',
  '上级医院会诊中心'
]

function createSeedData() {
  return [
    {
      id: 1,
      referralCode: 'RC-2026-041',
      caseCode: 'CASE-2026-0001',
      patientName: '马某某',
      gender: '男',
      age: 41,
      fromDoctorName: '张医生',
      fromHospitalName: '基层协作门诊',
      toHospitalName: '',
      type: 'REMOTE_CONSULTATION',
      status: 'PENDING',
      reason: '疑似黑色素瘤病例，申请上级医院远程会诊支持。',
      summary: '病灶位于左前臂，近两月边缘扩大，AI 高危提示明显，需尽快完成行政流转。',
      createdAt: '2026-04-10 09:20',
      updatedAt: '2026-04-10 09:20',
      logs: [
        { id: 1, time: '2026-04-10 09:20', content: '基层医院提交跨院远程会诊申请。' }
      ]
    },
    {
      id: 2,
      referralCode: 'RC-2026-038',
      caseCode: 'CASE-2026-0006',
      patientName: '李某某',
      gender: '女',
      age: 34,
      fromDoctorName: '周医生',
      fromHospitalName: '乌鲁木齐市第二人民医院',
      toHospitalName: '自治区皮肤病区域协同中心',
      type: 'REFERRAL',
      status: 'IN_PROGRESS',
      reason: '基层无法明确判断，需要上级医院进一步诊疗。',
      summary: '患者近三周复诊两次，病灶颜色不均，已进入流转准备状态。',
      createdAt: '2026-04-09 14:12',
      updatedAt: '2026-04-10 10:40',
      logs: [
        { id: 1, time: '2026-04-09 14:12', content: '基层医院发起上转申请。' },
        { id: 2, time: '2026-04-10 10:40', content: '管理员已确认目标医院，当前流转中。' }
      ]
    },
    {
      id: 3,
      referralCode: 'RC-2026-031',
      caseCode: 'CASE-2026-0010',
      patientName: '王某某',
      gender: '男',
      age: 52,
      fromDoctorName: '刘医生',
      fromHospitalName: '基层协作门诊',
      toHospitalName: '',
      type: 'REMOTE_CONSULTATION',
      status: 'RETURNED',
      reason: '申请远程会诊，但病例摘要与图片说明不完整。',
      summary: '上传资料缺少补充病史和完整说明。',
      createdAt: '2026-04-08 16:30',
      updatedAt: '2026-04-10 08:15',
      logs: [
        { id: 1, time: '2026-04-08 16:30', content: '发起远程会诊申请。' },
        { id: 2, time: '2026-04-10 08:15', content: '管理员退回，要求补充病史与影像说明。' }
      ]
    },
    {
      id: 4,
      referralCode: 'RC-2026-027',
      caseCode: 'CASE-2026-0013',
      patientName: '赵某某',
      gender: '女',
      age: 29,
      fromDoctorName: '李医生',
      fromHospitalName: '地区门诊分中心',
      toHospitalName: '自治区人民医院皮肤科',
      type: 'INTERNAL_CONSULTATION',
      status: 'APPROVED',
      reason: '申请院内专家进一步复核治疗方案。',
      summary: '病例已完成初步诊疗，需要行政确认后流入会诊排班。',
      createdAt: '2026-04-10 08:00',
      updatedAt: '2026-04-10 11:30',
      logs: [
        { id: 1, time: '2026-04-10 08:00', content: '发起院内会诊审批。' },
        { id: 2, time: '2026-04-10 11:30', content: '管理员审批通过并完成目标科室指派。' }
      ]
    }
  ]
}

function loadBoard() {
  const raw = window.localStorage.getItem(STORAGE_KEY)
  if (raw) return JSON.parse(raw)
  const seed = createSeedData()
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(seed))
  return seed
}

function saveBoard(data) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

function nowTimeText() {
  const now = new Date()
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, '0')
  const d = String(now.getDate()).padStart(2, '0')
  const hh = String(now.getHours()).padStart(2, '0')
  const mm = String(now.getMinutes()).padStart(2, '0')
  return `${y}-${m}-${d} ${hh}:${mm}`
}

const allList = ref(loadBoard())
const activeId = ref(allList.value[0]?.id || null)

const filters = reactive({
  keyword: '',
  status: 'ALL',
  type: 'ALL'
})

const actionForm = reactive({
  toHospitalName: '',
  adminComment: ''
})

const filteredList = computed(() => {
  return allList.value.filter((item) => {
    const hitKeyword =
        !filters.keyword ||
        item.referralCode.includes(filters.keyword) ||
        item.caseCode.includes(filters.keyword) ||
        item.patientName.includes(filters.keyword) ||
        item.fromHospitalName.includes(filters.keyword)

    const hitStatus = filters.status === 'ALL' || item.status === filters.status
    const hitType = filters.type === 'ALL' || item.type === filters.type

    return hitKeyword && hitStatus && hitType
  })
})

const selectedItem = computed(() => {
  return allList.value.find((item) => item.id === activeId.value) || null
})

const metrics = computed(() => {
  const today = new Date().toISOString().slice(0, 10)

  return {
    pending: allList.value.filter((item) => item.status === 'PENDING').length,
    approvedToday: allList.value.filter(
        (item) => item.status === 'APPROVED' && String(item.updatedAt).startsWith(today)
    ).length,
    returned: allList.value.filter((item) => item.status === 'RETURNED').length,
    overdue: allList.value.filter((item) => item.status === 'PENDING').length
  }
})

watch(selectedItem, (val) => {
  if (!val) {
    actionForm.toHospitalName = ''
    actionForm.adminComment = ''
    return
  }
  actionForm.toHospitalName = val.toHospitalName || ''
  actionForm.adminComment = ''
}, { immediate: true })

function handleSelect(id) {
  activeId.value = id
}

function updateBoard(nextList) {
  allList.value = nextList
  saveBoard(nextList)
}

function handleAction(nextStatus) {
  if (!selectedItem.value) return

  if (nextStatus === 'APPROVED' && !actionForm.toHospitalName) {
    window.alert('审批通过前请先选择目标医院')
    return
  }

  const commentText = actionForm.adminComment.trim()
  if (!commentText) {
    window.alert('请填写审批意见')
    return
  }

  const logTextMap = {
    APPROVED: `管理员审批通过，分配目标医院为“${actionForm.toHospitalName}”。`,
    RETURNED: `管理员退回申请：${commentText}`,
    REJECTED: `管理员驳回申请：${commentText}`
  }

  const nextList = allList.value.map((item) => {
    if (item.id !== selectedItem.value.id) return item

    return {
      ...item,
      status: nextStatus,
      toHospitalName: nextStatus === 'APPROVED' ? actionForm.toHospitalName : item.toHospitalName,
      updatedAt: nowTimeText(),
      logs: [
        {
          id: Date.now(),
          time: nowTimeText(),
          content: logTextMap[nextStatus]
        },
        ...item.logs
      ]
    }
  })

  updateBoard(nextList)
  window.alert('审批结果已更新')
}

function resetBoard() {
  const seed = createSeedData()
  updateBoard(seed)
  activeId.value = seed[0]?.id || null
}

function exportCurrentSheet() {
  if (!selectedItem.value) return

  const item = selectedItem.value
  const content = `
跨院会诊审批单
========================
申请单号：${item.referralCode}
病例编号：${item.caseCode}
患者姓名：${item.patientName}
患者性别/年龄：${item.gender} / ${item.age} 岁
申请医生：${item.fromDoctorName}
申请医院：${item.fromHospitalName}
目标医院：${item.toHospitalName || '待分配'}
申请类型：${typeLabelMap[item.type]}
当前状态：${statusLabelMap[item.status]}
申请原因：${item.reason}
病情摘要：${item.summary}
导出时间：${nowTimeText()}
`.trim()

  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${item.referralCode}-审批单.txt`
  a.click()
  URL.revokeObjectURL(url)
}
</script>

<style scoped>
.consult-page {
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
.queue-desc,
.queue-meta,
.panel-link,
.empty-text,
.history-time,
.history-content,
.tip-content {
  font-size: 12px;
  line-height: 1.8;
  color: #7892b0;
}

.page-subtitle {
  margin-top: 6px;
}

.head-actions,
.action-box {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.primary-btn,
.ghost-btn,
.warning-btn,
.danger-btn {
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

.warning-btn {
  border: none;
  color: #fff;
  background: linear-gradient(135deg, #f59e0b, #fbbf24);
}

.danger-btn {
  border: none;
  color: #fff;
  background: linear-gradient(135deg, #dc2626, #f97316);
}

.metric-grid,
.filter-grid,
.content-grid {
  display: grid;
  gap: 14px;
}

.metric-grid {
  grid-template-columns: repeat(4, minmax(0, 1fr));
}

.filter-grid {
  grid-template-columns: 1.2fr 1fr 1fr;
}

.content-grid {
  grid-template-columns: 0.92fr 1.02fr 0.86fr;
}

.metric-card,
.panel-card,
.queue-item,
.detail-item,
.history-box,
.tip-box {
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

.panel-head,
.queue-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
}

.panel-head {
  padding-bottom: 12px;
  margin-bottom: 12px;
  border-bottom: 1px solid #e6eef7;
  font-size: 15px;
  font-weight: 800;
  color: #17385f;
}

.filter-item label,
.form-item label,
.detail-item label {
  display: block;
  font-size: 12px;
  color: #7a93af;
  margin-bottom: 8px;
}

.filter-item input,
.filter-item select,
.form-item select,
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

.filter-item-wide {
  grid-column: 1 / 2;
}

.queue-list,
.detail-list,
.history-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.queue-item {
  padding: 16px;
  background: #f9fcff;
  border: 1px solid #e3edf7;
  box-shadow: none;
  cursor: pointer;
  transition: all 0.2s ease;
}

.queue-item.active {
  background: #edf6ff;
  border-color: #bfd8f8;
}

.queue-id {
  font-size: 12px;
  color: #7a93af;
}

.queue-badge {
  padding: 6px 10px;
  border-radius: 999px;
  font-size: 12px;
}

.queue-badge.warning {
  background: #fff5df;
  color: #c98912;
}

.queue-badge.blue {
  background: #edf6ff;
  color: #2a70b8;
}

.queue-badge.success {
  background: #ecfbf5;
  color: #14906a;
}

.queue-badge.danger {
  background: #feecec;
  color: #d83b3b;
}

.queue-title {
  margin-top: 10px;
  font-size: 15px;
  font-weight: 800;
  color: #1d466f;
}

.preview-box {
  width: 100%;
  margin-bottom: 14px;
}

.preview-image {
  position: relative;
  width: 100%;
  aspect-ratio: 4 / 3;
  border-radius: 22px;
  overflow: hidden;
  background: linear-gradient(135deg, #b6907f, #7c5a52 58%, #58423f);
  border: 1px solid #dce8f4;
}

.preview-spot {
  position: absolute;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255, 178, 144, 0.95), rgba(141, 79, 69, 0.35));
  filter: blur(1px);
}

.preview-spot-a {
  width: 110px;
  height: 110px;
  left: 25%;
  top: 24%;
}

.preview-spot-b {
  width: 90px;
  height: 90px;
  right: 22%;
  bottom: 24%;
}

.preview-tag {
  position: absolute;
  right: 14px;
  top: 14px;
  height: 30px;
  padding: 0 12px;
  border-radius: 999px;
  background: rgba(255,255,255,0.88);
  color: #315373;
  display: inline-flex;
  align-items: center;
  font-size: 12px;
  font-weight: 700;
}

.detail-item {
  padding: 14px;
  background: #f9fcff;
  border: 1px solid #e3edf7;
  box-shadow: none;
}

.detail-item-full {
  grid-column: 1 / -1;
}

.detail-item div {
  font-size: 14px;
  line-height: 1.8;
  color: #1d466f;
}

.history-box,
.tip-box {
  margin-top: 16px;
  padding: 14px;
  background: #f9fcff;
  border: 1px solid #e3edf7;
  box-shadow: none;
}

.history-title,
.tip-title {
  font-size: 14px;
  font-weight: 800;
  color: #1d466f;
  margin-bottom: 8px;
}

.history-item + .history-item {
  padding-top: 10px;
  border-top: 1px solid #e8eef6;
}

.form-item + .form-item {
  margin-top: 14px;
}

.tip-box {
  margin-top: 14px;
}

.action-box {
  margin-top: 16px;
}

@media (max-width: 1280px) {
  .page-head {
    flex-direction: column;
    align-items: flex-start;
  }

  .metric-grid,
  .filter-grid,
  .content-grid {
    grid-template-columns: 1fr;
  }
}
</style>
