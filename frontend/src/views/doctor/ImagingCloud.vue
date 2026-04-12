<template>
  <div class="cloud-page">
    <div class="page-head">
      <div>
        <h1>影像云平台</h1>
        <div class="page-subtitle">机构级影像底座，负责影像接入、归档、浏览、共享、AI调用与审计留痕</div>
      </div>

      <div class="head-tags">
        <span class="tag-chip info">当前可访问：科研匿名副本</span>
        <span class="tag-chip success">伦理有效</span>
      </div>
    </div>

    <section class="summary-grid">
      <div class="summary-card">
        <div class="summary-title">伦理批件</div>
        <div class="summary-value">ETH-2026-021</div>
        <div class="summary-note">有效期至 2026-12-31</div>
      </div>
      <div class="summary-card">
        <div class="summary-title">数据配额</div>
        <div class="summary-value">已用 428 / 剩余 172</div>
        <div class="summary-note">当前项目授权范围</div>
      </div>
      <div class="summary-card">
        <div class="summary-title">影像状态</div>
        <div class="summary-value">待质控 28</div>
        <div class="summary-note">新增研究副本持续入池</div>
      </div>
      <div class="summary-card">
        <div class="summary-title">最近访问</div>
        <div class="summary-value">2026-04-07 10:42</div>
        <div class="summary-note">最近浏览：S-PSO-0047</div>
      </div>
    </section>

    <section class="panel-card">
      <div class="panel-head">
        <span>影像层级</span>
        <span class="panel-link">当前权限边界</span>
      </div>

      <div class="layer-grid">
        <div class="layer-card">
          <div class="layer-title">临床原始影像</div>
          <div class="layer-desc">普通照片、皮肤镜、病理图及完整临床元数据。</div>
          <div class="layer-tag disabled">当前不可直接查看</div>
        </div>
        <div class="layer-card">
          <div class="layer-title">会诊共享副本</div>
          <div class="layer-desc">面向远程复核、会诊与教学查房的受控共享副本。</div>
          <div class="layer-tag info">按会诊范围调用</div>
        </div>
        <div class="layer-card">
          <div class="layer-title">科研匿名副本</div>
          <div class="layer-desc">经审批后生成的研究副本，用于项目团队标注、分析与实验。</div>
          <div class="layer-tag success">当前可查看</div>
        </div>
      </div>
    </section>

    <section class="content-grid">
      <div class="panel-card">
        <div class="panel-head">
          <span>研究副本样本池</span>
          <span class="panel-link">按状态查看</span>
        </div>

        <div class="sample-list">
          <div v-for="item in samples" :key="item.id" class="sample-item">
            <div class="sample-main">
              <div class="sample-top">
                <span class="sample-id">{{ item.id }}</span>
                <span :class="['sample-status', item.statusType]">{{ item.status }}</span>
              </div>
              <div class="sample-title">{{ item.title }}</div>
              <div class="sample-desc">{{ item.desc }}</div>
              <div class="sample-meta">
                <span>{{ item.modality }}</span>
                <span>{{ item.time }}</span>
                <span>{{ item.source }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="panel-card">
        <div class="panel-head">
          <span>常用能力</span>
          <span class="panel-link">按使用频率</span>
        </div>

        <div class="ability-list">
          <div class="ability-item">
            <div class="ability-title">影像浏览与历史对比</div>
            <div class="ability-desc">单张查看、双图对比、时间轴对比、放大缩小。</div>
          </div>
          <div class="ability-item">
            <div class="ability-title">AI 调用与可解释展示</div>
            <div class="ability-desc">热力图、病灶框、风险结果回挂到同一例影像。</div>
          </div>
          <div class="ability-item">
            <div class="ability-title">影像质控</div>
            <div class="ability-desc">清晰度、曝光、裁切完整度、角度一致性与模态校验。</div>
          </div>
          <div class="ability-item">
            <div class="ability-title">共享与远程协作</div>
            <div class="ability-desc">远程复核、远程会诊、远程查房与教学协同。</div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
const samples = [
  {
    id: 'S-PSO-0021',
    title: '肘部银屑病研究副本',
    desc: '已完成匿名化、基础标签清洗与模态校验。',
    modality: '普通照片 + 皮肤镜',
    time: '2026-03-28',
    source: '门诊原始影像',
    status: '已质检',
    statusType: 'done'
  },
  {
    id: 'S-PSO-0047',
    title: '复发病例研究副本',
    desc: '适合长期随访变化对照与项目内历史影像比较。',
    modality: '普通照片',
    time: '2026-04-01',
    source: '复查影像',
    status: '标注中',
    statusType: 'processing'
  },
  {
    id: 'S-PSO-0082',
    title: '伴甲损害病例副本',
    desc: '可用于多模态表现研究与项目内共享复核。',
    modality: '普通照片 + 病理',
    time: '2026-04-04',
    source: '病理关联病例',
    status: '待标注',
    statusType: 'waiting'
  }
]
</script>

<style scoped>
.cloud-page {
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
.layer-desc,
.ability-desc,
.sample-desc,
.panel-link {
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

.tag-chip.info {
  background: #edf6ff;
  color: #2a70b8;
}

.tag-chip.success {
  background: #ecfbf5;
  color: #14906a;
}

.summary-grid,
.layer-grid,
.content-grid {
  display: grid;
  gap: 14px;
}

.summary-grid {
  grid-template-columns: repeat(4, minmax(0, 1fr));
}

.layer-grid {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.content-grid {
  grid-template-columns: 1.1fr 0.9fr;
}

.summary-card,
.panel-card,
.layer-card,
.sample-item,
.ability-item {
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
  font-size: 22px;
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

.layer-card {
  padding: 18px;
}

.layer-title,
.ability-title,
.sample-title {
  font-size: 15px;
  font-weight: 800;
  color: #1d466f;
}

.layer-tag {
  display: inline-flex;
  margin-top: 12px;
  padding: 6px 10px;
  border-radius: 999px;
  font-size: 12px;
}

.layer-tag.disabled {
  background: #f2f4f7;
  color: #667085;
}

.layer-tag.info {
  background: #edf6ff;
  color: #2a70b8;
}

.layer-tag.success {
  background: #ecfbf5;
  color: #14906a;
}

.sample-list,
.ability-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.sample-item,
.ability-item {
  padding: 16px;
  background: #f9fcff;
  border: 1px solid #e3edf7;
  box-shadow: none;
}

.sample-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.sample-id {
  font-size: 12px;
  color: #7a93af;
}

.sample-status {
  padding: 6px 10px;
  border-radius: 999px;
  font-size: 12px;
  white-space: nowrap;
}

.sample-status.done {
  background: #ecfbf5;
  color: #14906a;
}

.sample-status.processing {
  background: #edf6ff;
  color: #2a70b8;
}

.sample-status.waiting {
  background: #fff5df;
  color: #c98912;
}

.sample-title {
  margin-top: 10px;
}

.sample-desc {
  margin-top: 8px;
}

.sample-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  margin-top: 10px;
  font-size: 12px;
  color: #5f88b0;
}

.ability-desc {
  margin-top: 8px;
}

@media (max-width: 1280px) {
  .page-head,
  .summary-grid,
  .layer-grid,
  .content-grid {
    grid-template-columns: 1fr;
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
