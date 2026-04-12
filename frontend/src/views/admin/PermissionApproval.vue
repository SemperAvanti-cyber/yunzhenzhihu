<template>
  <div class="approval-page">
    <div class="page-head">
      <div>
        <h1>项目合规治理</h1>
        <div class="page-subtitle">审核项目登记、伦理材料、数据导出与匿名化边界</div>
      </div>
    </div>

    <section class="metric-grid">
      <div class="metric-card">
        <span>待审核项目</span>
        <strong>04</strong>
        <p>含伦理批件与项目说明</p>
      </div>
      <div class="metric-card">
        <span>待审批导出</span>
        <strong>03</strong>
        <p>全部默认写入水印</p>
      </div>
      <div class="metric-card">
        <span>待抽检样本</span>
        <strong>14</strong>
        <p>检查脱敏质量与边界</p>
      </div>
    </section>

    <section class="content-grid">
      <div class="panel-card">
        <div class="panel-head">
          <span>治理队列</span>
          <span class="panel-link">项目合规视角</span>
        </div>

        <div class="queue-list">
          <div v-for="item in approvalQueue" :key="item.id" class="queue-item">
            <div class="queue-top">
              <div class="queue-id">{{ item.id }}</div>
              <div :class="['queue-badge', item.typeClass]">{{ item.type }}</div>
            </div>
            <div class="queue-title">{{ item.title }}</div>
            <div class="queue-desc">{{ item.desc }}</div>
            <div class="queue-meta">
              <span>申请人：{{ item.owner }}</span>
              <span>状态：{{ item.status }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="panel-card">
        <div class="panel-head">
          <span>当前审批详情</span>
          <span class="panel-link">只审合规边界</span>
        </div>

        <div class="detail-list">
          <div class="detail-item">
            <label>任务类型</label>
            <div>项目登记审核</div>
          </div>
          <div class="detail-item">
            <label>项目名称</label>
            <div>银屑病多模态影像研究</div>
          </div>
          <div class="detail-item">
            <label>伦理状态</label>
            <div>批件有效，剩余 168 天</div>
          </div>
          <div class="detail-item">
            <label>数据范围</label>
            <div>银屑病匿名样本 428 例，限定项目空间内使用</div>
          </div>
          <div class="detail-item">
            <label>导出限制</label>
            <div>需负责人发起、管理员审批、导出自动带水印</div>
          </div>
        </div>

        <div class="action-box">
          <button class="primary-btn">审核通过</button>
          <button class="warning-btn">退回补充材料</button>
          <button class="danger-btn">驳回申请</button>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
const approvalQueue = [
  {
    id: 'PRJ-2026-011',
    type: '项目登记',
    typeClass: 'blue',
    title: '银屑病多模态影像研究',
    desc: '申请创建项目空间并确认数据使用范围。',
    owner: '张医生',
    status: '待审核'
  },
  {
    id: 'EXP-2041',
    type: '导出审批',
    typeClass: 'gold',
    title: '匿名数据导出申请',
    desc: '申请用途：黑色素瘤多模态统计分析与方法验证。',
    owner: '李医生',
    status: '审核中'
  },
  {
    id: 'QC-1188',
    type: '脱敏抽检',
    typeClass: 'red',
    title: '匿名样本质检抽查',
    desc: '抽检脱敏质量与标签完整性，复核是否存在越界字段。',
    owner: '系统任务',
    status: '待处理'
  }
]
</script>

<style scoped>
.approval-page {
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
.queue-desc,
.queue-meta,
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
.queue-item,
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

.queue-list,
.detail-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.queue-item {
  padding: 16px;
  background: #f9fcff;
  border: 1px solid #e3edf7;
  box-shadow: none;
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

.queue-badge.blue {
  background: #edf6ff;
  color: #2a70b8;
}

.queue-badge.gold {
  background: #fff5df;
  color: #c98912;
}

.queue-badge.red {
  background: #feecec;
  color: #d83b3b;
}

.queue-title {
  margin-top: 10px;
  font-size: 15px;
  font-weight: 800;
  color: #1d466f;
}

.queue-meta {
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
