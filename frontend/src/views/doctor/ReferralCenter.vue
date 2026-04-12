<template>
  <div class="referral-page">
    <div class="page-head">
      <div>
        <h1>分级诊疗</h1>
        <div class="page-subtitle">院内会诊、上转协同、跨院远程会诊统一处理</div>
      </div>
    </div>

    <section class="summary-grid">
      <div class="summary-card">
        <div class="summary-title">待处理流转</div>
        <div class="summary-value">6</div>
        <div class="summary-note">含会诊与转诊</div>
      </div>
      <div class="summary-card">
        <div class="summary-title">高危优先</div>
        <div class="summary-value">2</div>
        <div class="summary-note">建议优先响应</div>
      </div>
      <div class="summary-card">
        <div class="summary-title">跨院待审核</div>
        <div class="summary-value">1</div>
        <div class="summary-note">进入管理员流程</div>
      </div>
    </section>

    <section class="panel-card">
      <div class="panel-head">
        <span>分流规则</span>
        <span class="panel-link">建议判断路径</span>
      </div>

      <div class="flow-grid">
        <div class="flow-card">
          <div class="flow-title">院内普通会诊</div>
          <div class="flow-desc">用于本院主任 / 上级医生快速协同。</div>
          <div class="flow-tag success">无需管理员审核</div>
        </div>

        <div class="flow-card">
          <div class="flow-title">上转诊疗</div>
          <div class="flow-desc">用于高危或基层难以确认病例的上级医院接收处理。</div>
          <div class="flow-tag warning">由目标医院决定接收</div>
        </div>

        <div class="flow-card">
          <div class="flow-title">跨院远程会诊</div>
          <div class="flow-desc">用于疑难病例的外院专家远程协同复核。</div>
          <div class="flow-tag danger">进入管理员审核流</div>
        </div>
      </div>
    </section>

    <section class="content-grid">
      <div class="panel-card">
        <div class="panel-head">
          <span>当前流转列表</span>
          <span class="panel-link">按优先级</span>
        </div>

        <div class="queue-list">
          <div v-for="item in flows" :key="item.id" class="queue-item">
            <div class="queue-main">
              <div>
                <div class="queue-title">{{ item.id }} · {{ item.title }}</div>
                <div class="queue-meta">{{ item.meta }}</div>
              </div>
            </div>
            <div class="queue-side">
              <div :class="['status-badge', item.class]">{{ item.status }}</div>
              <div class="queue-time">{{ item.time }}</div>
            </div>
          </div>
        </div>
      </div>

      <div class="panel-card">
        <div class="panel-head">
          <span>当前关注</span>
          <span class="panel-link">实时状态</span>
        </div>

        <div class="focus-list">
          <div class="focus-item">
            <div class="focus-title">高危病例待接收</div>
            <div class="focus-value">1 例</div>
          </div>
          <div class="focus-item">
            <div class="focus-title">远程会诊待审核</div>
            <div class="focus-value">1 单</div>
          </div>
          <div class="focus-item">
            <div class="focus-title">会诊意见已回传</div>
            <div class="focus-value">2 单</div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
const flows = [
  {
    id: 'RF-3011',
    title: '疑似黑色素瘤高危转诊',
    meta: '恶性概率 81% · 上级医院待接收',
    status: '待接收',
    class: 'danger',
    time: '09:41'
  },
  {
    id: 'CS-2023',
    title: '院内普通会诊：色素病变鉴别',
    meta: '已提交本院主任 · 等待会诊意见',
    status: '进行中',
    class: 'processing',
    time: '10:08'
  },
  {
    id: 'RC-1188',
    title: '跨院远程会诊申请',
    meta: '等待管理员审核后转外院专家',
    status: '待审核',
    class: 'warning',
    time: '11:26'
  }
]
</script>

<style scoped>
.referral-page {
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
.summary-note,
.flow-desc,
.panel-link,
.queue-meta,
.queue-time {
  font-size: 12px;
  line-height: 1.8;
  color: #7892b0;
}

.page-subtitle {
  margin-top: 6px;
}

.summary-grid,
.flow-grid,
.content-grid {
  display: grid;
  gap: 14px;
}

.summary-grid {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.flow-grid {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.content-grid {
  grid-template-columns: 1.1fr 0.9fr;
}

.summary-card,
.panel-card,
.flow-card,
.focus-item,
.queue-item {
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

.flow-card {
  padding: 18px;
}

.flow-title,
.queue-title,
.focus-title {
  font-size: 15px;
  font-weight: 800;
  color: #1d466f;
}

.flow-desc {
  margin-top: 8px;
}

.flow-tag {
  display: inline-flex;
  margin-top: 12px;
  padding: 6px 10px;
  border-radius: 999px;
  font-size: 12px;
}

.flow-tag.success {
  background: #ecfbf5;
  color: #14906a;
}

.flow-tag.warning {
  background: #fff5df;
  color: #c98912;
}

.flow-tag.danger {
  background: #feecec;
  color: #d83b3b;
}

.queue-list,
.focus-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.queue-item {
  padding: 14px;
  background: #f9fcff;
  border: 1px solid #e3edf7;
  box-shadow: none;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
}

.queue-side {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 6px;
  flex-shrink: 0;
}

.status-badge {
  padding: 6px 10px;
  border-radius: 999px;
  font-size: 12px;
  white-space: nowrap;
}

.status-badge.processing {
  background: #edf6ff;
  color: #2a70b8;
}

.status-badge.warning {
  background: #fff5df;
  color: #c98912;
}

.status-badge.danger {
  background: #feecec;
  color: #d83b3b;
}

.focus-item {
  padding: 18px;
  background: #f9fcff;
  border: 1px solid #e3edf7;
  box-shadow: none;
}

.focus-value {
  margin-top: 12px;
  font-size: 24px;
  font-weight: 800;
  color: #17385f;
}

@media (max-width: 1280px) {
  .summary-grid,
  .flow-grid,
  .content-grid {
    grid-template-columns: 1fr;
  }
}
</style>
