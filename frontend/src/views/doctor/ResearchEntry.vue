<template>
  <div class="research-page">
    <div class="page-head">
      <div>
        <h1>科研中心</h1>
        <div class="page-subtitle">项目登记、协作、数据与进度统一管理</div>
      </div>

      <div class="head-actions">
        <button class="ghost-btn">查看项目台账</button>
        <button class="primary-btn">登记已获批项目</button>
      </div>
    </div>

    <section class="hero-card">
      <div class="hero-left">
        <div class="hero-badge">获批后项目管理</div>
        <div class="hero-title">科研中心负责项目登记与协作，不负责正式申报</div>
        <div class="hero-desc">
          项目在外部官方系统或院内科研管理体系获批后，再进入平台完成登记、伦理材料核验、数据范围确认、项目空间创建、协作成员管理与研究进度沉淀。
        </div>
      </div>

      <div class="hero-stats">
        <div class="hero-stat">
          <span>我的项目空间</span>
          <strong>3</strong>
        </div>
        <div class="hero-stat">
          <span>待我处理协作任务</span>
          <strong>5</strong>
        </div>
        <div class="hero-stat">
          <span>可参与任务招募</span>
          <strong>7</strong>
        </div>
      </div>
    </section>

    <section class="panel-card">
      <div class="panel-head">
        <span>科研平台入口</span>
        <span class="panel-link">当前已开放</span>
      </div>

      <div class="platform-grid">
        <div class="platform-card">
          <div>
            <div class="platform-title">影像云平台</div>
            <div class="platform-desc">项目授权范围内浏览研究副本、历史对比、共享调用与质控查看。</div>
          </div>
          <button class="small-btn" @click="go('/doctor/imaging-cloud')">立即进入</button>
        </div>

        <div class="platform-card">
          <div>
            <div class="platform-title">开放实验平台</div>
            <div class="platform-desc">继续完成数据整理、在线标注、统计分析、实验验证与成果沉淀。</div>
          </div>
          <button class="small-btn" @click="go('/doctor/open-lab')">立即进入</button>
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
</script>

<style scoped>
.research-page {
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
.hero-desc,
.platform-desc,
.panel-link,
.hero-stat span {
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
}

.primary-btn,
.ghost-btn,
.small-btn {
  height: 42px;
  padding: 0 18px;
  border-radius: 14px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  white-space: nowrap;
}

.primary-btn,
.small-btn {
  border: none;
  color: #fff;
  background: linear-gradient(135deg, #2563eb, #0ea5e9);
}

.ghost-btn {
  border: 1px solid #d8e5f2;
  background: #fff;
  color: #365a7f;
}

.hero-card,
.panel-card,
.hero-stat,
.platform-card {
  background: rgba(255, 255, 255, 0.82);
  border: 1px solid #dce8f4;
  border-radius: 22px;
  box-shadow: 0 10px 30px rgba(17, 56, 102, 0.05);
}

.hero-card {
  padding: 22px;
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  gap: 18px;
}

.hero-badge {
  display: inline-flex;
  padding: 6px 10px;
  border-radius: 999px;
  background: #edf6ff;
  color: #1f5da8;
  font-size: 12px;
  margin-bottom: 14px;
}

.hero-title {
  font-size: 30px;
  line-height: 1.25;
  font-weight: 800;
  color: #17385f;
}

.hero-desc {
  margin-top: 14px;
}

.hero-stats {
  display: grid;
  gap: 12px;
}

.hero-stat {
  padding: 16px;
}

.hero-stat strong {
  display: block;
  margin-top: 8px;
  font-size: 22px;
  color: #17385f;
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

.platform-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}

.platform-card {
  padding: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.platform-title {
  font-size: 15px;
  font-weight: 700;
  color: #1d466f;
}

.platform-desc {
  margin-top: 8px;
}

@media (max-width: 1280px) {
  .page-head,
  .hero-card,
  .platform-grid {
    grid-template-columns: 1fr;
    flex-direction: column;
    align-items: flex-start;
  }

  .head-actions {
    flex-wrap: wrap;
  }

  .platform-card {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
