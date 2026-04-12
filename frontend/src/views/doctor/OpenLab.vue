<template>
  <div class="lab-page">
    <div class="page-head">
      <div>
        <h1>开放实验平台</h1>
        <div class="page-subtitle">项目执行工作台，用于数据整理、标注、分析、实验与成果沉淀</div>
      </div>

      <div class="head-tags">
        <span class="tag-chip success">项目已获批</span>
        <span class="tag-chip success">伦理有效</span>
        <span class="tag-chip info">匿名副本已生成</span>
      </div>
    </div>

    <section class="summary-grid">
      <div class="summary-card">
        <div class="summary-title">项目样本数</div>
        <div class="summary-value">428</div>
        <div class="summary-note">已完成匿名化入池</div>
      </div>
      <div class="summary-card">
        <div class="summary-title">待标注样本</div>
        <div class="summary-value">96</div>
        <div class="summary-note">等待继续框选与复核</div>
      </div>
      <div class="summary-card">
        <div class="summary-title">实验任务数</div>
        <div class="summary-value">14</div>
        <div class="summary-note">训练 / 验证 / 统计分析</div>
      </div>
      <div class="summary-card">
        <div class="summary-title">算力状态</div>
        <div class="summary-value">正常</div>
        <div class="summary-note">GPU 队列 2 个任务</div>
      </div>
    </section>

    <section class="panel-card">
      <div class="panel-head">
        <span>科研流程位置</span>
        <span class="panel-link">当前处于研究执行阶段</span>
      </div>

      <div class="flow-strip">
        <div class="flow-item done">项目登记</div>
        <div class="flow-arrow">→</div>
        <div class="flow-item done">伦理核验</div>
        <div class="flow-arrow">→</div>
        <div class="flow-item done">数据审批</div>
        <div class="flow-arrow">→</div>
        <div class="flow-item active">执行研究</div>
        <div class="flow-arrow">→</div>
        <div class="flow-item">成果归档</div>
      </div>
    </section>

    <section class="module-grid">
      <div class="module-card">
        <div class="module-title">数据中心</div>
        <div class="module-desc">数据集申请、版本冻结、样本数量统计、数据质量检查。</div>
        <div class="module-state">当前版本：2026Q2</div>
      </div>

      <div class="module-card">
        <div class="module-title">在线标注与质控</div>
        <div class="module-desc">框选病灶、修正标签、多人复核、争议样本回退、一致性检查。</div>
        <div class="module-state">待处理：96 例</div>
      </div>

      <div class="module-card">
        <div class="module-title">统计分析</div>
        <div class="module-desc">病种分布、样本构成、异常样本回顾与研究统计图表。</div>
        <div class="module-state">最近更新：今日 11:03</div>
      </div>

      <div class="module-card">
        <div class="module-title">训练实验</div>
        <div class="module-desc">选择数据集、提交实验、查看日志、对比版本、保存最优模型。</div>
        <div class="module-state">运行中：2 个任务</div>
      </div>

      <div class="module-card">
        <div class="module-title">结果与成果</div>
        <div class="module-desc">实验报告归档、论文图表导出、成果关联与结题材料沉淀。</div>
        <div class="module-state">最近导出：2026-04-06</div>
      </div>

      <div class="module-card">
        <div class="module-title">算力与资源</div>
        <div class="module-desc">查看项目可用资源、排队状态、最近训练任务与资源告警。</div>
        <div class="module-state">资源告警：无</div>
      </div>
    </section>
  </div>
</template>

<script setup>
</script>

<style scoped>
.lab-page {
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
.module-desc,
.panel-link,
.module-state {
  font-size: 12px;
  line-height: 1.8;
  color: #7892b0;
}

.page-subtitle {
  margin-top: 6px;
}

.head-tags {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.tag-chip {
  padding: 6px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 700;
  white-space: nowrap;
}

.tag-chip.success {
  background: #ecfbf5;
  color: #14906a;
}

.tag-chip.info {
  background: #edf6ff;
  color: #2a70b8;
}

.summary-grid,
.module-grid {
  display: grid;
  gap: 14px;
}

.summary-grid {
  grid-template-columns: repeat(4, minmax(0, 1fr));
}

.module-grid {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.summary-card,
.panel-card,
.module-card {
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

.flow-strip {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.flow-item {
  padding: 10px 14px;
  border-radius: 14px;
  background: #f6f9fd;
  border: 1px solid #e3edf7;
  font-size: 13px;
  font-weight: 700;
  color: #5c7698;
}

.flow-item.done {
  background: #ecfbf5;
  border-color: #d6f3e5;
  color: #14906a;
}

.flow-item.active {
  background: #edf6ff;
  border-color: #cfe0f5;
  color: #2a70b8;
}

.flow-arrow {
  color: #8ca4bf;
  font-size: 18px;
}

.module-card {
  padding: 18px;
}

.module-title {
  font-size: 15px;
  font-weight: 800;
  color: #1d466f;
}

.module-desc {
  margin-top: 8px;
}

.module-state {
  margin-top: 12px;
  color: #5f88b0;
}

@media (max-width: 1280px) {
  .page-head,
  .summary-grid,
  .module-grid {
    grid-template-columns: 1fr;
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
