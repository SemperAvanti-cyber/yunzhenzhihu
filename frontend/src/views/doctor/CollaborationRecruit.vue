<template>
  <div class="tasks-page">
    <div class="page-head">
      <div>
        <h1>协作任务</h1>
        <div class="page-subtitle">面向已进入项目空间的成员进行任务分配与协作，不是公开招募正式成员</div>
      </div>
    </div>

    <section class="summary-grid">
      <div class="summary-card">
        <div class="summary-title">待接受任务</div>
        <div class="summary-value">2</div>
        <div class="summary-note">需尽快确认</div>
      </div>
      <div class="summary-card">
        <div class="summary-title">进行中任务</div>
        <div class="summary-value">3</div>
        <div class="summary-note">标注 / 复核 / 分析</div>
      </div>
      <div class="summary-card">
        <div class="summary-title">本周新增</div>
        <div class="summary-value">4</div>
        <div class="summary-note">来自 3 个项目空间</div>
      </div>
    </section>

    <section class="task-list">
      <div v-for="item in tasks" :key="item.title" class="task-card">
        <div class="task-top">
          <div>
            <div class="task-title">{{ item.title }}</div>
            <div class="task-desc">{{ item.desc }}</div>
          </div>
          <div :class="['task-status', item.statusType]">{{ item.status }}</div>
        </div>

        <div class="task-meta">
          <span>项目：{{ item.project }}</span>
          <span>类型：{{ item.type }}</span>
          <span>截止：{{ item.deadline }}</span>
        </div>

        <div class="task-footer">
          <div class="task-note">{{ item.note }}</div>
          <button class="primary-btn">{{ item.action }}</button>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
const tasks = [
  {
    title: '银屑病异常样本标注',
    desc: '补充异常边缘样本框选与标签修正。',
    project: '银屑病多模态影像研究',
    type: '标注协作',
    deadline: '2026-04-12',
    status: '待接受',
    statusType: 'warning',
    note: '负责人已分配给当前账号，确认后进入任务队列。',
    action: '接受任务'
  },
  {
    title: '湿疹随访样本复核',
    desc: '复核 18 例争议样本并确认标签一致性。',
    project: '湿疹长期随访分析',
    type: '质控复核',
    deadline: '2026-04-14',
    status: '进行中',
    statusType: 'processing',
    note: '当前已完成 9 / 18 例。',
    action: '继续处理'
  },
  {
    title: '黑色素瘤边界样本整理',
    desc: '整理新增病例并补齐病例摘要字段。',
    project: '黑色素瘤病例对照研究',
    type: '数据整理',
    deadline: '2026-04-10',
    status: '优先处理',
    statusType: 'danger',
    note: '距版本冻结较近，建议优先完成。',
    action: '立即处理'
  }
]
</script>

<style scoped>
.tasks-page {
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
.task-desc,
.task-note {
  font-size: 12px;
  line-height: 1.8;
  color: #7892b0;
}

.page-subtitle {
  margin-top: 6px;
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
}

.summary-card,
.task-card {
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

.task-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.task-card {
  padding: 18px;
}

.task-top,
.task-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
}

.task-title {
  font-size: 16px;
  font-weight: 800;
  color: #1d466f;
}

.task-desc {
  margin-top: 8px;
}

.task-status {
  padding: 6px 10px;
  border-radius: 999px;
  font-size: 12px;
  white-space: nowrap;
}

.task-status.warning {
  background: #fff5df;
  color: #c98912;
}

.task-status.processing {
  background: #edf6ff;
  color: #2a70b8;
}

.task-status.danger {
  background: #feecec;
  color: #d83b3b;
}

.task-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-top: 12px;
  font-size: 12px;
  color: #5f88b0;
}

.task-footer {
  margin-top: 16px;
}

.task-note {
  flex: 1;
}

.primary-btn {
  height: 40px;
  padding: 0 16px;
  border: none;
  border-radius: 12px;
  background: linear-gradient(135deg, #2563eb, #0ea5e9);
  color: #fff;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  white-space: nowrap;
}

@media (max-width: 1280px) {
  .summary-grid {
    grid-template-columns: 1fr;
  }

  .task-top,
  .task-footer {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
