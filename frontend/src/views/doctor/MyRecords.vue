<template>
  <div class="records-page">
    <div class="page-head">
      <div>
        <h1>我的病例</h1>
        <div class="page-subtitle">查看本人经手病例、病程时间轴与影像变化</div>
      </div>
    </div>

    <section class="records-grid">
      <div class="panel-card">
        <div class="panel-head">
          <span>病例列表</span>
          <span class="panel-link">本人经手</span>
        </div>

        <div class="record-list">
          <div
              v-for="item in records"
              :key="item.id"
              :class="['record-item', { active: item.id === activeRecordId }]"
          >
            <div class="record-top">
              <div class="record-id">{{ item.id }}</div>
              <div :class="['record-tag', item.tagClass]">{{ item.tag }}</div>
            </div>
            <div class="record-name">{{ item.title }}</div>
            <div class="record-meta">{{ item.meta }}</div>
          </div>
        </div>
      </div>

      <div class="panel-card">
        <div class="panel-head">
          <span>病例时间轴</span>
          <span class="panel-link">P-2026-8831</span>
        </div>

        <div class="patient-summary">
          <div class="summary-item">
            <label>基础病情</label>
            <span>左前臂色素斑，近两月边缘扩大</span>
          </div>
          <div class="summary-item">
            <label>影像资料</label>
            <span>普通照片 2 份 / 皮肤镜 1 份</span>
          </div>
          <div class="summary-item">
            <label>当前状态</label>
            <span>高危待转诊</span>
          </div>
        </div>

        <div class="timeline-list">
          <div v-for="node in timeline" :key="node.date" class="timeline-item">
            <div class="timeline-date">{{ node.date }}</div>
            <div class="timeline-body">
              <div class="timeline-title">{{ node.title }}</div>
              <div class="timeline-desc">{{ node.desc }}</div>
            </div>
          </div>
        </div>
      </div>

      <div class="panel-card">
        <div class="panel-head">
          <span>影像对比</span>
          <span class="panel-link">病程变化</span>
        </div>

        <div class="compare-grid">
          <div class="compare-card">
            <div class="compare-label">历史影像</div>
            <div class="compare-image before"></div>
          </div>
          <div class="compare-card">
            <div class="compare-label">本次影像</div>
            <div class="compare-image after"></div>
          </div>
        </div>

        <div class="compare-note">
          近两月病灶边缘进一步扩展，AI 风险上升，已进入医生复核与分级诊疗通道。
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
const activeRecordId = 'MR-1021'

const records = [
  {
    id: 'MR-1021',
    title: '左前臂色素病灶',
    meta: 'P-2026-8831 · 最近更新 2026-04-07',
    tag: '已转诊',
    tagClass: 'danger'
  },
  {
    id: 'MR-1014',
    title: '面部不规则色素沉着',
    meta: 'P-2026-8744 · 最近更新 2026-04-06',
    tag: '待复核',
    tagClass: 'warning'
  },
  {
    id: 'MR-1008',
    title: '皮肤瘙痒类随访异常',
    meta: 'P-2026-8610 · 最近更新 2026-04-05',
    tag: '异常提醒',
    tagClass: 'info'
  }
]

const timeline = [
  {
    date: '2026-02-22',
    title: '首次建档',
    desc: '门诊采集普通照片并同步至系统，建议观察随访。'
  },
  {
    date: '2026-03-18',
    title: '随访复查',
    desc: '皮损边缘较前扩大，系统升级为医生复核。'
  },
  {
    date: '2026-04-07',
    title: '高危转诊',
    desc: '皮肤镜评估恶性概率 81%，已生成转诊单并待上级医院接收。'
  }
]
</script>

<style scoped>
.records-page {
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
.record-meta,
.timeline-desc,
.compare-note {
  font-size: 12px;
  color: #7892b0;
  line-height: 1.8;
}

.page-subtitle {
  margin-top: 6px;
}

.records-grid {
  display: grid;
  grid-template-columns: 0.82fr 1fr 1fr;
  gap: 18px;
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
  justify-content: space-between;
  align-items: center;
  padding-bottom: 12px;
  margin-bottom: 12px;
  border-bottom: 1px solid #e6eef7;
  color: #17385f;
  font-size: 15px;
  font-weight: 800;
}

.panel-link {
  font-size: 12px;
  color: #7892b0;
}

.record-list,
.timeline-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.record-item {
  padding: 14px;
  border-radius: 16px;
  background: #f9fcff;
  border: 1px solid #e3edf7;
}

.record-item.active {
  background: linear-gradient(180deg, #f4f9ff 0%, #edf5ff 100%);
  border-color: #b9d7fb;
}

.record-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.record-id,
.timeline-date {
  font-size: 12px;
  color: #7c95b1;
}

.record-tag {
  padding: 5px 10px;
  border-radius: 999px;
  font-size: 12px;
}

.record-tag.danger {
  background: #feecec;
  color: #d83b3b;
}

.record-tag.warning {
  background: #fff5df;
  color: #c98912;
}

.record-tag.info {
  background: #edf6ff;
  color: #2a70b8;
}

.record-name,
.timeline-title,
.compare-label {
  margin-top: 8px;
  font-size: 14px;
  font-weight: 700;
  color: #1d466f;
}

.patient-summary {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 16px;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 14px;
  border-radius: 16px;
  background: #f9fcff;
  border: 1px solid #e3edf7;
}

.summary-item label {
  font-size: 12px;
  color: #7c95b1;
}

.summary-item span {
  flex: 1;
  text-align: right;
  font-size: 13px;
  color: #1d466f;
}

.timeline-item {
  display: grid;
  grid-template-columns: 96px 1fr;
  gap: 14px;
  padding: 14px;
  border-radius: 16px;
  background: #f9fcff;
  border: 1px solid #e3edf7;
}

.compare-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}

.compare-card {
  padding: 14px;
  border-radius: 18px;
  background: #f9fcff;
  border: 1px solid #e3edf7;
}

.compare-image {
  height: 260px;
  border-radius: 16px;
  margin-top: 12px;
}

.compare-image.before {
  background:
      radial-gradient(circle at 42% 36%, rgba(255, 165, 140, 0.52), rgba(122, 76, 63, 0.22) 18%, transparent 26%),
      linear-gradient(135deg, rgba(148, 101, 86, 0.5), rgba(57, 41, 39, 0.58));
}

.compare-image.after {
  background:
      radial-gradient(circle at 50% 42%, rgba(255, 138, 110, 0.72), rgba(141, 72, 61, 0.26) 19%, transparent 26%),
      linear-gradient(135deg, rgba(170, 112, 95, 0.54), rgba(55, 35, 35, 0.64));
}

.compare-note {
  margin-top: 14px;
  padding: 14px;
  border-radius: 16px;
  background: #f8fbff;
  border: 1px solid #e3edf7;
}

@media (max-width: 1320px) {
  .records-grid {
    grid-template-columns: 1fr;
  }
}
</style>
