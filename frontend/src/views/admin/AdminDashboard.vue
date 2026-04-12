<template>
  <div class="dashboard-page">
    <div class="page-head">
      <div>
        <h1>后台总览</h1>
        <div class="page-subtitle">按当前管理员角色展示对应治理重点</div>
      </div>
    </div>

    <section class="metric-grid">
      <div v-for="item in dashboardStats" :key="item.label" class="metric-card">
        <div class="metric-top">
          <span class="metric-label">{{ item.label }}</span>
          <span :class="['metric-trend', item.type]">{{ item.trend }}</span>
        </div>
        <div class="metric-value">{{ item.value }}</div>
        <div class="metric-note">{{ item.note }}</div>
      </div>
    </section>

    <section class="content-grid">
      <div class="panel-card">
        <div class="panel-head">
          <span>核心待办</span>
          <span class="panel-link">按当前角色</span>
        </div>

        <div class="todo-list">
          <div v-for="item in dashboardTodos" :key="item.title" class="todo-item">
            <div>
              <div class="todo-title">{{ item.title }}</div>
              <div class="todo-desc">{{ item.desc }}</div>
            </div>
            <div :class="['todo-badge', item.badgeType]">{{ item.badge }}</div>
          </div>
        </div>
      </div>

      <div class="panel-card">
        <div class="panel-head">
          <span>当前职责边界</span>
          <span class="panel-link">角色视角</span>
        </div>

        <div class="scope-list">
          <div class="scope-item">
            <div class="scope-title">医院管理员</div>
            <div class="scope-desc">负责账号、院内业务协同、跨院会诊行政流转。</div>
          </div>
          <div class="scope-item">
            <div class="scope-title">科研合规管理员</div>
            <div class="scope-desc">负责项目合规、伦理核验、导出审批与脱敏抽检。</div>
          </div>
          <div class="scope-item">
            <div class="scope-title">安全审计管理员</div>
            <div class="scope-desc">负责审计日志、安全告警、导出追溯、备份恢复与策略治理。</div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { adminDashboardStats, adminDashboardTodos } from '../../mock/admin'

const dashboardStats = adminDashboardStats
const dashboardTodos = adminDashboardTodos
</script>

<style scoped>
.dashboard-page {
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
.metric-note,
.todo-desc,
.scope-desc,
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
  grid-template-columns: repeat(4, minmax(0, 1fr));
}

.content-grid {
  grid-template-columns: 1.05fr 0.95fr;
}

.metric-card,
.panel-card,
.todo-item,
.scope-item {
  background: rgba(255, 255, 255, 0.82);
  border: 1px solid #dce8f4;
  border-radius: 22px;
  box-shadow: 0 10px 30px rgba(17, 56, 102, 0.05);
}

.metric-card {
  padding: 18px;
}

.metric-top,
.panel-head,
.todo-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
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

.metric-trend.warning {
  background: #fff5df;
  color: #c98912;
}

.metric-trend.danger {
  background: #feecec;
  color: #d83b3b;
}

.metric-value {
  margin-top: 12px;
  font-size: 32px;
  font-weight: 800;
  color: #17385f;
}

.panel-card {
  padding: 18px;
}

.panel-head {
  padding-bottom: 12px;
  margin-bottom: 12px;
  border-bottom: 1px solid #e6eef7;
  font-size: 15px;
  font-weight: 800;
  color: #17385f;
}

.todo-list,
.scope-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.todo-item,
.scope-item {
  padding: 16px;
  background: #f9fcff;
  border: 1px solid #e3edf7;
  box-shadow: none;
}

.todo-title,
.scope-title {
  font-size: 15px;
  font-weight: 800;
  color: #1d466f;
}

.todo-badge {
  padding: 6px 10px;
  border-radius: 999px;
  font-size: 12px;
  white-space: nowrap;
}

.todo-badge.warning {
  background: #fff5df;
  color: #c98912;
}

.todo-badge.info {
  background: #edf6ff;
  color: #2a70b8;
}

.todo-badge.danger {
  background: #feecec;
  color: #d83b3b;
}

@media (max-width: 1280px) {
  .metric-grid,
  .content-grid {
    grid-template-columns: 1fr;
  }
}
</style>
