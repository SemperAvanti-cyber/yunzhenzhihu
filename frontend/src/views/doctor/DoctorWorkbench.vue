<template>
  <div class="clinical-page">
    <section class="hero-card">
      <div class="hero-kicker">临床总览</div>
      <h1>今日工作概览</h1>
      <div class="hero-meta">门诊诊疗 · 影像复核 · 转诊协同</div>
    </section>

    <section class="metric-grid">
      <div v-for="metric in metrics" :key="metric.label" class="metric-card">
        <div class="metric-head">
          <span class="metric-label">{{ metric.label }}</span>
          <span :class="['metric-trend', metric.type]">{{ metric.trend }}</span>
        </div>
        <div class="metric-value">{{ metric.value }}</div>
        <div class="metric-note">{{ metric.note }}</div>
      </div>
    </section>

    <section class="content-grid">
      <div class="panel-card">
        <div class="panel-head">
          <span>待处理队列</span>
          <span class="panel-link">按优先级</span>
        </div>

        <div class="queue-list">
          <div v-for="item in queueList" :key="item.title" class="queue-item">
            <div class="queue-main">
              <div :class="['risk-tag', item.riskClass]">{{ item.risk }}</div>
              <div>
                <div class="queue-title">{{ item.title }}</div>
                <div class="queue-meta">{{ item.meta }}</div>
              </div>
            </div>

            <div class="queue-side">
              <div class="queue-prob">{{ item.rightTop }}</div>
              <div class="queue-deadline">{{ item.rightBottom }}</div>
            </div>
          </div>
        </div>
      </div>

      <div class="panel-card">
        <div class="panel-head">
          <span>最近动态</span>
          <span class="panel-link">临床相关</span>
        </div>

        <div class="update-list">
          <div v-for="item in updates" :key="item.title" class="update-item">
            <div class="update-top">
              <span :class="['update-tag', item.tagClass]">{{ item.tag }}</span>
              <span class="update-time">{{ item.time }}</span>
            </div>
            <div class="update-title">{{ item.title }}</div>
            <div class="update-meta">{{ item.meta }}</div>
          </div>
        </div>
      </div>
    </section>

    <section class="panel-card">
      <div class="panel-head">
        <span>重点关注</span>
        <span class="panel-link">当前状态</span>
      </div>

      <div class="focus-grid">
        <div class="focus-card">
          <div class="focus-title">高危病例待接收</div>
          <div class="focus-value">1 例</div>
        </div>
        <div class="focus-card">
          <div class="focus-title">异常随访提醒</div>
          <div class="focus-value">2 例</div>
        </div>
        <div class="focus-card">
          <div class="focus-title">待回传复核结果</div>
          <div class="focus-value">4 例</div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
const metrics = [
  {
    label: '今日复核',
    value: '26',
    trend: '+4',
    type: 'up',
    note: '待医生确认'
  },
  {
    label: '已完成转诊',
    value: '08',
    trend: '+2',
    type: 'up',
    note: '高危优先处理'
  },
  {
    label: 'AI-医生一致率',
    value: '91.8%',
    trend: '+1.6%',
    type: 'up',
    note: '较上周提升'
  },
  {
    label: '高危响应率',
    value: '96.2%',
    trend: '+3.1%',
    type: 'up',
    note: '15分钟内处理'
  }
]

const queueList = [
  {
    risk: '待复核',
    riskClass: 'warning',
    title: '左前臂色素病灶复核',
    meta: '基层医院转入 · 皮肤镜 + 普通照片 · P-2026-8831',
    rightTop: '恶性概率 44%',
    rightBottom: '待医生复核'
  },
  {
    risk: '待转诊',
    riskClass: 'danger',
    title: '疑似黑色素瘤高危病例',
    meta: '上级医院待接收 · 已生成转诊单 · P-2026-9014',
    rightTop: '恶性概率 81%',
    rightBottom: '距自动升级 09:41'
  },
  {
    risk: '异常随访',
    riskClass: 'neutral',
    title: 'AI 标记异常随访结果',
    meta: '患者 App 随访异常 · 系统自动推入队列',
    rightTop: '异常分值 72',
    rightBottom: '建议查看病历时间轴'
  }
]

const updates = [
  {
    tag: '病例',
    tagClass: 'blue',
    title: '病例库新增 2 例回传结果',
    meta: '上级医院已完成复核并回传意见',
    time: '09:12'
  },
  {
    tag: '转诊',
    tagClass: 'orange',
    title: '1 例高危病例已进入上转流程',
    meta: '等待上级医院接收',
    time: '10:26'
  },
  {
    tag: '会诊',
    tagClass: 'green',
    title: '远程会诊意见已返回',
    meta: '专家中心完成复核建议，可查看回传结果',
    time: '11:03'
  }
]
</script>

<style scoped>
.clinical-page {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.hero-card,
.metric-card,
.panel-card,
.focus-card {
  background: rgba(255, 255, 255, 0.82);
  border: 1px solid #dce8f4;
  border-radius: 22px;
  box-shadow: 0 10px 30px rgba(17, 56, 102, 0.05);
}

.hero-card {
  padding: 24px 26px;
  background:
      radial-gradient(circle at top right, rgba(37, 99, 235, 0.06), transparent 30%),
      linear-gradient(180deg, #ffffff 0%, #f8fbff 100%);
}

.hero-kicker {
  font-size: 12px;
  color: #7c95b1;
  letter-spacing: 0.08em;
}

.hero-card h1 {
  margin: 10px 0 0;
  font-size: 34px;
  color: #17385f;
}

.hero-meta,
.metric-note,
.queue-meta,
.queue-deadline,
.panel-link,
.update-meta,
.update-time {
  font-size: 12px;
  color: #7892b0;
  line-height: 1.7;
}

.hero-meta {
  margin-top: 10px;
}

.metric-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 18px;
}

.metric-card {
  padding: 18px;
}

.metric-head,
.panel-head,
.queue-item,
.update-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.metric-label {
  font-size: 13px;
  color: #7590b0;
}

.metric-trend {
  padding: 5px 10px;
  border-radius: 999px;
  font-size: 12px;
}

.metric-trend.up {
  background: #ecfbf5;
  color: #14906a;
}

.metric-value {
  margin-top: 12px;
  font-size: 32px;
  font-weight: 800;
  color: #17385f;
}

.content-grid {
  display: grid;
  grid-template-columns: 1.18fr 0.82fr;
  gap: 18px;
}

.panel-card {
  padding: 18px;
}

.panel-head {
  padding-bottom: 12px;
  margin-bottom: 12px;
  border-bottom: 1px solid #e6eef7;
  color: #17385f;
  font-size: 15px;
  font-weight: 700;
}

.queue-list,
.update-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.queue-item,
.update-item {
  padding: 14px;
  border-radius: 16px;
  background: #f9fcff;
  border: 1px solid #e3edf7;
}

.queue-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.queue-main {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
}

.queue-side {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  flex-shrink: 0;
}

.queue-title,
.update-title,
.focus-title {
  font-size: 14px;
  font-weight: 700;
  color: #1d466f;
}

.queue-prob,
.focus-value {
  font-size: 13px;
  font-weight: 700;
  color: #1d466f;
}

.risk-tag {
  min-width: 76px;
  padding: 6px 10px;
  border-radius: 999px;
  font-size: 12px;
  text-align: center;
  flex-shrink: 0;
}

.risk-tag.danger {
  background: #feecec;
  color: #d83b3b;
}

.risk-tag.warning {
  background: #fff5df;
  color: #c98912;
}

.risk-tag.neutral {
  background: #edf6ff;
  color: #2a70b8;
}

.update-tag {
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 12px;
}

.update-tag.blue {
  background: #edf6ff;
  color: #2a70b8;
}

.update-tag.orange {
  background: #fff5df;
  color: #c98912;
}

.update-tag.green {
  background: #ecfbf5;
  color: #14906a;
}

.focus-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
}

.focus-card {
  padding: 18px;
  background: #f9fcff;
  border: 1px solid #e3edf7;
}

.focus-value {
  margin-top: 12px;
  font-size: 24px;
  color: #17385f;
}

@media (max-width: 1360px) {
  .metric-grid,
  .content-grid,
  .focus-grid {
    grid-template-columns: 1fr;
  }
}
</style>
