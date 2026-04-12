<template>
  <div class="projects-page">
    <div class="page-head">
      <div>
        <h1>我的项目</h1>
        <div class="page-subtitle">查看我负责或参与的项目空间、进度与当前任务</div>
      </div>
    </div>

    <section class="summary-grid">
      <div class="summary-card">
        <div class="summary-title">在研项目</div>
        <div class="summary-value">3</div>
        <div class="summary-note">负责人 1 / 成员 2</div>
      </div>
      <div class="summary-card">
        <div class="summary-title">待处理任务</div>
        <div class="summary-value">5</div>
        <div class="summary-note">标注 3 / 复核 2</div>
      </div>
      <div class="summary-card">
        <div class="summary-title">伦理状态</div>
        <div class="summary-value">全部有效</div>
        <div class="summary-note">最近到期：58天后</div>
      </div>
      <div class="summary-card">
        <div class="summary-title">最近导出</div>
        <div class="summary-value">2026-04-06</div>
        <div class="summary-note">审批通过并带水印</div>
      </div>
    </section>

    <section class="project-list">
      <div v-for="item in projects" :key="item.name" class="project-card">
        <div class="project-top">
          <div>
            <div class="project-title">{{ item.name }}</div>
            <div class="project-desc">{{ item.desc }}</div>
          </div>

          <div class="project-badges">
            <span :class="['badge', item.roleType]">{{ item.role }}</span>
            <span :class="['badge', item.ethicsType]">{{ item.ethics }}</span>
          </div>
        </div>

        <div class="project-meta">
          <span>负责人：{{ item.owner }}</span>
          <span>阶段：{{ item.stage }}</span>
          <span>样本：{{ item.sampleProgress }}</span>
        </div>

        <div class="progress-row">
          <div class="progress-label">
            <span>项目进度</span>
            <strong>{{ item.progress }}%</strong>
          </div>
          <div class="progress-bar">
            <div class="progress-fill" :style="{ width: `${item.progress}%` }"></div>
          </div>
        </div>

        <div class="project-footer">
          <div class="project-note">{{ item.note }}</div>
          <button class="primary-btn" @click="go(item.entryPath)">{{ item.action }}</button>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

function go(path) {
  router.push(path)
}

const projects = [
  {
    name: '银屑病多模态影像研究',
    desc: '已完成项目登记与合规审核，当前进入研究副本整理与历史影像对比阶段。',
    owner: '张医生',
    stage: '影像整理',
    sampleProgress: '已标注 156 / 428 例',
    role: '项目负责人',
    roleType: 'owner',
    ethics: '伦理有效',
    ethicsType: 'success',
    progress: 65,
    note: '当前重点：补齐历史影像对照与病例标签。',
    entryPath: '/doctor/imaging-cloud',
    action: '进入影像云平台'
  },
  {
    name: '湿疹长期随访分析',
    desc: '当前进行异常随访样本回顾、标签质检与统计分析。',
    owner: '王医生',
    stage: '标注分析',
    sampleProgress: '已标注 98 / 212 例',
    role: '项目成员',
    roleType: 'member',
    ethics: '伦理有效',
    ethicsType: 'success',
    progress: 48,
    note: '当前重点：完成争议样本复核。',
    entryPath: '/doctor/open-lab',
    action: '进入开放实验平台'
  },
  {
    name: '黑色素瘤病例对照研究',
    desc: '处于模型验证与结果复核阶段，需补充部分边界样本。',
    owner: '李医生',
    stage: '实验验证',
    sampleProgress: '已标注 141 / 163 例',
    role: '项目成员',
    roleType: 'member',
    ethics: '临近到期',
    ethicsType: 'warning',
    progress: 86,
    note: '当前重点：补录边界样本并完成版本冻结。',
    entryPath: '/doctor/open-lab',
    action: '进入开放实验平台'
  }
]
</script>

<style scoped>
.projects-page {
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
.project-desc,
.project-note {
  font-size: 12px;
  line-height: 1.8;
  color: #7892b0;
}

.page-subtitle {
  margin-top: 6px;
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 14px;
}

.summary-card,
.project-card {
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

.project-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.project-card {
  padding: 18px;
}

.project-top,
.project-footer,
.progress-label {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
}

.project-title {
  font-size: 16px;
  font-weight: 800;
  color: #1d466f;
}

.project-desc {
  margin-top: 8px;
}

.project-badges {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.badge {
  padding: 6px 10px;
  border-radius: 999px;
  font-size: 12px;
  white-space: nowrap;
}

.badge.owner {
  background: #ecfbf5;
  color: #14906a;
}

.badge.member {
  background: #edf6ff;
  color: #2a70b8;
}

.badge.success {
  background: #ecfbf5;
  color: #14906a;
}

.badge.warning {
  background: #fff5df;
  color: #c98912;
}

.project-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-top: 12px;
  font-size: 12px;
  color: #5f88b0;
}

.progress-row {
  margin-top: 14px;
}

.progress-label {
  font-size: 12px;
  color: #6f89a8;
}

.progress-label strong {
  color: #1d466f;
  font-size: 13px;
}

.progress-bar {
  height: 8px;
  border-radius: 999px;
  background: #eaf1f8;
  overflow: hidden;
  margin-top: 8px;
}

.progress-fill {
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, #2563eb, #60a5fa);
}

.project-footer {
  margin-top: 16px;
}

.project-note {
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

  .project-top,
  .project-footer {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
