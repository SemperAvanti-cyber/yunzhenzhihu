<template>
  <div class="account-page">
    <div class="page-head">
      <div>
        <h1>账号管理</h1>
        <div class="page-subtitle">管理本院医生账号、科室归属、启停状态与基础权限</div>
      </div>

      <div class="head-actions">
        <button class="ghost-btn">批量导出</button>
        <button class="primary-btn">新增账号</button>
      </div>
    </div>

    <section class="summary-grid">
      <div class="summary-card">
        <div class="summary-title">启用账号</div>
        <div class="summary-value">86</div>
        <div class="summary-note">当前正常使用</div>
      </div>
      <div class="summary-card">
        <div class="summary-title">待审核账号</div>
        <div class="summary-value">4</div>
        <div class="summary-note">待完成开通确认</div>
      </div>
      <div class="summary-card">
        <div class="summary-title">停用账号</div>
        <div class="summary-value">7</div>
        <div class="summary-note">历史留档保留</div>
      </div>
      <div class="summary-card">
        <div class="summary-title">最近变更</div>
        <div class="summary-value">今日 3 次</div>
        <div class="summary-note">账号权限调整</div>
      </div>
    </section>

    <section class="panel-card">
      <div class="panel-head">
        <span>筛选条件</span>
        <span class="panel-link">本院范围</span>
      </div>

      <div class="filter-grid">
        <div class="filter-item">
          <label>科室</label>
          <div>皮肤科 / 病理科 / 教学中心</div>
        </div>
        <div class="filter-item">
          <label>角色</label>
          <div>普通医生 / 科主任 / 管理员</div>
        </div>
        <div class="filter-item">
          <label>状态</label>
          <div>启用 / 停用 / 待审核</div>
        </div>
      </div>
    </section>

    <section class="panel-card">
      <div class="panel-head">
        <span>账号列表</span>
        <span class="panel-link">增删改查</span>
      </div>

      <div class="table-wrap">
        <div class="table-head">
          <span>姓名</span>
          <span>科室</span>
          <span>角色</span>
          <span>基础权限</span>
          <span>状态</span>
          <span>操作</span>
        </div>

        <div v-for="item in accounts" :key="item.name" class="table-row">
          <span>{{ item.name }}</span>
          <span>{{ item.department }}</span>
          <span>{{ item.role }}</span>
          <span>{{ item.permission }}</span>
          <span>
            <em :class="['status-chip', item.statusClass]">{{ item.status }}</em>
          </span>
          <span class="action-text">{{ item.action }}</span>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
const accounts = [
  {
    name: '张医生',
    department: '皮肤科',
    role: '普通医生',
    permission: '临床中心',
    status: '启用',
    statusClass: 'success',
    action: '编辑 / 停用 / 重置密码'
  },
  {
    name: '李医生',
    department: '皮肤科',
    role: '科主任',
    permission: '临床中心 + 科研中心',
    status: '启用',
    statusClass: 'success',
    action: '编辑 / 调整权限 / 重置密码'
  },
  {
    name: '王医生',
    department: '病理科',
    role: '普通医生',
    permission: '临床中心',
    status: '待审核',
    statusClass: 'warning',
    action: '审核 / 退回 / 编辑'
  },
  {
    name: '周医生',
    department: '教学中心',
    role: '管理员',
    permission: '跨院协同管理',
    status: '停用',
    statusClass: 'danger',
    action: '查看记录 / 重新启用'
  }
]
</script>

<style scoped>
.account-page {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.page-head {
  display: flex;
  align-items: center;
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
.panel-link {
  font-size: 12px;
  line-height: 1.8;
  color: #7892b0;
}

.page-subtitle {
  margin-top: 6px;
}

.head-actions {
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
.filter-grid {
  display: grid;
  gap: 14px;
}

.summary-grid {
  grid-template-columns: repeat(4, minmax(0, 1fr));
}

.filter-grid {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.summary-card,
.panel-card,
.filter-item {
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

.filter-item {
  padding: 16px;
  background: #f9fcff;
  border: 1px solid #e3edf7;
  box-shadow: none;
}

.filter-item label {
  display: block;
  font-size: 12px;
  color: #7a93af;
  margin-bottom: 8px;
}

.filter-item div {
  font-size: 14px;
  color: #1d466f;
  line-height: 1.7;
}

.table-wrap {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.table-head,
.table-row {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1.3fr 0.9fr 1.4fr;
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

.action-text {
  color: #1d4f91;
  font-weight: 700;
}

@media (max-width: 1280px) {
  .page-head {
    flex-direction: column;
    align-items: flex-start;
  }

  .summary-grid,
  .filter-grid,
  .table-head,
  .table-row {
    grid-template-columns: 1fr;
  }
}
</style>
