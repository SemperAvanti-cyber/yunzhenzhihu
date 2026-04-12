<template>
  <div class="consult-page">
    <div class="page-head">
      <div>
        <h1>跨院会诊审批</h1>
        <div class="page-subtitle">处理跨院远程会诊的行政流转、平台接入与外院协同确认</div>
      </div>
    </div>

    <section class="metric-grid">
      <div class="metric-card">
        <span>待审批会诊</span>
        <strong>06</strong>
        <p>等待行政流转确认</p>
      </div>
      <div class="metric-card">
        <span>今日新增</span>
        <strong>03</strong>
        <p>本日新发起跨院申请</p>
      </div>
      <div class="metric-card">
        <span>超时未处理</span>
        <strong>01</strong>
        <p>超过预设时限</p>
      </div>
    </section>

    <section class="content-grid">
      <div class="panel-card">
        <div class="panel-head">
          <span>会诊审批队列</span>
          <span class="panel-link">行政流转</span>
        </div>

        <div class="consult-list">
          <div v-for="item in consultQueue" :key="item.id" class="consult-item">
            <div class="consult-top">
              <div class="consult-id">{{ item.id }}</div>
              <div :class="['consult-badge', item.type]">{{ item.status }}</div>
            </div>

            <div class="consult-title">{{ item.title }}</div>
            <div class="consult-desc">{{ item.desc }}</div>

            <div class="consult-meta">
              <span>申请医院：{{ item.fromHospital }}</span>
              <span>目标医院：{{ item.toHospital }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="panel-card">
        <div class="panel-head">
          <span>当前会诊单详情</span>
          <span class="panel-link">只管流程不管诊断</span>
        </div>

        <div class="detail-list">
          <div class="detail-item">
            <label>会诊单号</label>
            <div>RC-2026-041</div>
          </div>
          <div class="detail-item">
            <label>申请医院</label>
            <div>基层协作门诊</div>
          </div>
          <div class="detail-item">
            <label>目标医院</label>
            <div>自治区皮肤病区域协同中心</div>
          </div>
          <div class="detail-item">
            <label>申请原因</label>
            <div>疑似黑色素瘤病例，需上级医院专家远程会诊支持。</div>
          </div>
          <div class="detail-item">
            <label>平台状态</label>
            <div>接入通道正常，等待管理员确认流转。</div>
          </div>
        </div>

        <div class="action-box">
          <button class="primary-btn">审批通过并流转</button>
          <button class="warning-btn">退回补充材料</button>
          <button class="danger-btn">驳回申请</button>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
const consultQueue = [
  {
    id: 'RC-2026-041',
    title: '疑似黑色素瘤跨院会诊申请',
    desc: '基层医院申请上级医院专家远程会诊支持。',
    fromHospital: '基层协作门诊',
    toHospital: '自治区皮肤病区域协同中心',
    status: '待审批',
    type: 'warning'
  },
  {
    id: 'RC-2026-038',
    title: '疑难皮损远程会诊',
    desc: '申请外院专家协助判断疑难病例图像表现。',
    fromHospital: '乌鲁木齐市第二人民医院',
    toHospital: '自治区皮肤病区域协同中心',
    status: '流转中',
    type: 'info'
  },
  {
    id: 'RC-2026-031',
    title: '会诊单超时预警',
    desc: '已超过预设处理时限，需尽快完成协作确认。',
    fromHospital: '基层协作门诊',
    toHospital: '上级医院会诊中心',
    status: '重点关注',
    type: 'danger'
  }
]
</script>

<style scoped>
.consult-page {
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
.consult-desc,
.consult-meta,
.panel-link {
  font-size: 12px;
  line-height: 1.8;
  color: #7892b0;
}

.page-subtitle {
  margin-top: 6px;
}

.metric-grid,
.content-grid {
  display: grid;
  gap: 14px;
}

.metric-grid {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.content-grid {
  grid-template-columns: 0.92fr 1.08fr;
}

.metric-card,
.panel-card,
.consult-item,
.detail-item {
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
.consult-top {
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

.consult-list,
.detail-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.consult-item {
  padding: 16px;
  background: #f9fcff;
  border: 1px solid #e3edf7;
  box-shadow: none;
}

.consult-id {
  font-size: 12px;
  color: #7a93af;
}

.consult-badge {
  padding: 6px 10px;
  border-radius: 999px;
  font-size: 12px;
}

.consult-badge.warning {
  background: #fff5df;
  color: #c98912;
}

.consult-badge.info {
  background: #edf6ff;
  color: #2a70b8;
}

.consult-badge.danger {
  background: #feecec;
  color: #d83b3b;
}

.consult-title {
  margin-top: 10px;
  font-size: 15px;
  font-weight: 800;
  color: #1d466f;
}

.consult-meta {
  margin-top: 10px;
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
}

.detail-item {
  padding: 14px;
  background: #f9fcff;
  border: 1px solid #e3edf7;
  box-shadow: none;
  display: grid;
  grid-template-columns: 110px 1fr;
  gap: 14px;
}

.detail-item label {
  font-size: 12px;
  color: #7a93af;
}

.detail-item div {
  font-size: 14px;
  line-height: 1.8;
  color: #1d466f;
}

.action-box {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  margin-top: 16px;
}

.primary-btn,
.warning-btn,
.danger-btn {
  height: 42px;
  padding: 0 16px;
  border: none;
  border-radius: 12px;
  color: #fff;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  white-space: nowrap;
}

.primary-btn {
  background: linear-gradient(135deg, #2563eb, #0ea5e9);
}

.warning-btn {
  background: linear-gradient(135deg, #f59e0b, #fbbf24);
}

.danger-btn {
  background: linear-gradient(135deg, #dc2626, #f97316);
}

@media (max-width: 1280px) {
  .metric-grid,
  .content-grid,
  .detail-item {
    grid-template-columns: 1fr;
  }
}
</style>
