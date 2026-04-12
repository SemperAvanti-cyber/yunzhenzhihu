<template>
  <div class="page-shell">
    <div class="page-header">
      <div>
        <div class="page-title">影像诊断</div>
        <div class="page-subtitle">
          调阅影像、查看辅助分析、完成医生复核与判断修正。
        </div>
      </div>
      <div class="header-actions">
        <button class="ghost-btn">导出辅助报告</button>
        <button class="primary-btn">提交复核意见</button>
      </div>
    </div>

    <section class="diagnosis-grid">
      <div class="panel-card">
        <div class="panel-head">
          <span>影像调阅</span>
          <span class="panel-link">院内同步</span>
        </div>

        <div class="source-box">
          <div class="source-item">
            <label>影像来源</label>
            <div class="source-value">PACS 自动同步</div>
          </div>
          <div class="source-item">
            <label>病例编号</label>
            <div class="source-value">Patient_ID: P-2026-8831</div>
          </div>
          <div class="source-item">
            <label>模态识别</label>
            <div class="source-value">皮肤镜图像</div>
          </div>
          <div class="source-item">
            <label>历史对比</label>
            <div class="source-value">2026-03-18 / 2026-02-22</div>
          </div>
        </div>

        <div class="timeline-strip">
          <div class="timeline-chip active">本次影像</div>
          <div class="timeline-chip">03-18 随访</div>
          <div class="timeline-chip">02-22 首次建档</div>
        </div>
      </div>

      <div class="panel-card">
        <div class="panel-head">
          <span>辅助分析区</span>
          <span class="panel-link">热力图 / 病灶框</span>
        </div>

        <div class="viewer-box">
          <div class="scan-surface">
            <div class="scan-image"></div>
            <div class="heat heat-a"></div>
            <div class="heat heat-b"></div>
            <div class="lesion-box box-a"><span>病灶A：边缘不规则</span></div>
            <div class="lesion-box box-b"><span>病灶B：色素不均</span></div>
          </div>

          <div class="viewer-tools">
            <span>透明度 68%</span>
            <span>直径测量 6.8mm</span>
            <span>历史变化：加重</span>
            <span>模型：CR-Conformer v1.2</span>
          </div>
        </div>
      </div>

      <div class="panel-card">
        <div class="panel-head">
          <span>辅助报告</span>
          <span class="panel-link">需医生复核</span>
        </div>

        <div class="risk-box">
          <div class="risk-label">恶性概率</div>
          <div class="risk-value">67%</div>
          <div class="risk-note">30%～70% 进入医生复核</div>
        </div>

        <div class="top3-box">
          <div class="top3-row"><span>疑似黑色素瘤</span><span>67%</span></div>
          <div class="progress"><div class="fill fill-red" style="width: 67%"></div></div>

          <div class="top3-row"><span>色素痣异变</span><span>19%</span></div>
          <div class="progress"><div class="fill fill-gold" style="width: 19%"></div></div>

          <div class="top3-row"><span>炎症性色素沉着</span><span>14%</span></div>
          <div class="progress"><div class="fill fill-blue" style="width: 14%"></div></div>
        </div>

        <div class="compare-box">
          <div class="compare-title">医生修正后</div>
          <div class="compare-row">
            <span>当前判断</span>
            <strong>高度怀疑黑色素瘤</strong>
          </div>
          <div class="compare-row">
            <span>处理建议</span>
            <strong>建议上转进一步评估</strong>
          </div>
        </div>

        <div class="explain-box">
          检测到病灶边缘不规则、色素分布不均，建议结合既往影像变化与临床病史进一步复核。
        </div>

        <div class="action-stack">
          <button class="primary-btn block-btn">确认辅助结论</button>
          <button class="secondary-btn block-btn">修正判断</button>
          <button class="warning-btn block-btn">发起上转 / 会诊</button>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
</script>

<style scoped>
.page-shell {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.page-title {
  font-size: 28px;
  font-weight: 800;
  color: #17385f;
}

.page-subtitle {
  margin-top: 7px;
  font-size: 13px;
  color: #748ead;
  line-height: 1.7;
}

.header-actions {
  display: flex;
  gap: 12px;
}

.primary-btn,
.ghost-btn,
.secondary-btn,
.warning-btn {
  height: 44px;
  padding: 0 18px;
  border-radius: 14px;
  font-size: 14px;
  font-weight: 700;
  white-space: nowrap;
  cursor: pointer;
}

.primary-btn {
  border: none;
  color: #fff;
  background: linear-gradient(135deg, #2563eb, #0ea5e9);
  box-shadow: 0 10px 24px rgba(37, 99, 235, 0.18);
}

.ghost-btn {
  border: 1px solid #d8e5f2;
  color: #365a7f;
  background: #ffffff;
}

.secondary-btn {
  border: 1px solid #bfd6f7;
  color: #1d5ea9;
  background: #ffffff;
}

.warning-btn {
  border: none;
  color: #fff;
  background: linear-gradient(135deg, #f59e0b, #fbbf24);
  box-shadow: 0 10px 24px rgba(245, 158, 11, 0.18);
}

.diagnosis-grid {
  display: grid;
  grid-template-columns: 0.95fr 1.3fr 0.85fr;
  gap: 18px;
}

.panel-card {
  background: rgba(255, 255, 255, 0.82);
  border: 1px solid #dce8f4;
  border-radius: 22px;
  box-shadow: 0 10px 30px rgba(17, 56, 102, 0.05);
  padding: 20px;
}

.panel-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 14px;
  margin-bottom: 14px;
  border-bottom: 1px solid #e6eef7;
  color: #17385f;
  font-size: 15px;
  font-weight: 700;
}

.panel-link,
.risk-note,
.explain-box,
.source-value {
  font-size: 12px;
  color: #7892b0;
  line-height: 1.7;
}

.source-box {
  display: grid;
  gap: 12px;
}

.source-item {
  padding: 14px;
  border-radius: 16px;
  background: #f9fcff;
  border: 1px solid #e3edf7;
}

.source-item label,
.risk-label {
  display: block;
  font-size: 12px;
  color: #7a93af;
  margin-bottom: 8px;
}

.timeline-strip {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-top: 16px;
}

.timeline-chip {
  padding: 8px 12px;
  border-radius: 999px;
  background: #f3f8fd;
  border: 1px solid #dce8f4;
  color: #4d6d93;
  font-size: 12px;
}

.timeline-chip.active {
  background: #eaf3ff;
  color: #1e5ba6;
  border-color: #b9d7fb;
}

.viewer-box {
  border-radius: 18px;
  background: #f8fbff;
  border: 1px solid #e3edf7;
  padding: 16px;
}

.scan-surface {
  position: relative;
  min-height: 470px;
  border-radius: 18px;
  overflow: hidden;
  background: linear-gradient(135deg, #e2b79d, #8a5d54 42%, #4e3c3d 100%);
}

.scan-image {
  position: absolute;
  inset: 0;
  background:
      radial-gradient(circle at 40% 36%, rgba(255, 175, 150, 0.72), rgba(144, 95, 78, 0.28) 18%, transparent 26%),
      radial-gradient(circle at 62% 58%, rgba(255, 212, 187, 0.4), rgba(118, 78, 67, 0.2) 22%, transparent 30%),
      linear-gradient(135deg, rgba(181, 125, 101, 0.55), rgba(95, 61, 53, 0.36), rgba(38, 28, 30, 0.58));
}

.heat {
  position: absolute;
  border-radius: 50%;
  filter: blur(18px);
  opacity: 0.75;
}

.heat-a {
  width: 120px;
  height: 120px;
  left: 39%;
  top: 31%;
  background: radial-gradient(circle, rgba(255, 59, 48, 0.78), rgba(255, 153, 0, 0.34), transparent 72%);
}

.heat-b {
  width: 90px;
  height: 90px;
  left: 56%;
  top: 52%;
  background: radial-gradient(circle, rgba(250, 82, 82, 0.7), rgba(255, 179, 71, 0.28), transparent 72%);
}

.lesion-box {
  position: absolute;
  border: 2px solid #facc15;
  box-shadow: 0 0 0 2px rgba(250, 204, 21, 0.14);
}

.lesion-box span {
  position: absolute;
  top: -30px;
  left: 0;
  padding: 6px 10px;
  border-radius: 10px;
  font-size: 12px;
  color: #101828;
  background: #facc15;
  white-space: nowrap;
  font-weight: 700;
}

.box-a {
  width: 112px;
  height: 118px;
  left: 36%;
  top: 29%;
}

.box-b {
  width: 88px;
  height: 84px;
  left: 55%;
  top: 51%;
}

.viewer-tools {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-top: 14px;
}

.viewer-tools span {
  padding: 8px 12px;
  border-radius: 999px;
  font-size: 12px;
  color: #4d6d93;
  background: #f3f8fd;
  border: 1px solid #dce8f4;
}

.risk-box {
  padding: 16px;
  border-radius: 18px;
  background: #f8fbff;
  border: 1px solid #e3edf7;
  text-align: center;
}

.risk-value {
  margin-top: 8px;
  font-size: 58px;
  line-height: 1;
  font-weight: 800;
  color: #d83b3b;
}

.top3-box {
  margin-top: 16px;
}

.top3-row {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  color: #21466f;
}

.progress {
  height: 8px;
  border-radius: 999px;
  background: #eaf1f8;
  overflow: hidden;
  margin: 6px 0 12px;
}

.fill {
  height: 100%;
  border-radius: inherit;
}

.fill-red {
  background: linear-gradient(90deg, #ef4444, #fb7185);
}

.fill-gold {
  background: linear-gradient(90deg, #f59e0b, #fbbf24);
}

.fill-blue {
  background: linear-gradient(90deg, #2563eb, #60a5fa);
}

.compare-box,
.explain-box {
  margin-top: 16px;
  padding: 16px;
  border-radius: 16px;
  background: #f8fbff;
  border: 1px solid #e3edf7;
}

.compare-title {
  font-size: 14px;
  font-weight: 700;
  color: #17385f;
  margin-bottom: 10px;
}

.compare-row {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  font-size: 12px;
  color: #6f89a8;
}

.compare-row strong {
  color: #1d466f;
  font-size: 13px;
}

.compare-row + .compare-row {
  margin-top: 10px;
}

.action-stack {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 16px;
}

.block-btn {
  width: 100%;
}

@media (max-width: 1320px) {
  .diagnosis-grid {
    grid-template-columns: 1fr;
  }

  .page-header {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
