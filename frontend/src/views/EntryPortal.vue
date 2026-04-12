<template>
  <div class="portal-page">
    <div class="bg-layer bg-1"></div>
    <div class="bg-layer bg-2"></div>
    <div class="bg-layer bg-3"></div>
    <div class="bg-layer bg-grid"></div>

    <!-- 固定 Header（保持上一版样式，不改结构） -->
    <header class="portal-header">
      <div class="brand-group">
        <div class="brand-mark">肤</div>
        <div class="brand-copy">
          <div class="brand-title">一肤当关</div>
          <div class="brand-subtitle">基于 CR-Conformer 的医疗 AI 协同平台</div>
        </div>
      </div>

      <div class="header-right">
        <div class="header-pill">
          <span class="pill-dot"></span>
          内网安全环境
        </div>
        <button class="header-login-btn" @click="openLogin">登录</button>
      </div>
    </header>

    <!-- 可滚动主体 -->
    <main class="portal-main">
      <section class="hero-section">
        <div class="hero-left">
          <div class="hero-badge">系统统一入口</div>

          <h1>
            皮肤科 AI 辅助诊疗与治理
            <span>一体化专业平台</span>
          </h1>

          <p class="hero-desc">
            面向医生与管理员的统一入口，支持 AI 复核、病例流转、分级诊疗、
            影像云协同、审计留痕与平台治理。
          </p>

          <div class="hero-actions">
            <button class="primary-btn" @click="openLogin">
              <span>立即登录</span>
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M5 12h14M13 5l7 7-7 7" />
              </svg>
            </button>

            <button class="secondary-btn">查看平台架构</button>
          </div>

          <div class="hero-stats">
            <div class="stat-card">
              <div class="stat-value">30%</div>
              <div class="stat-label">医生复核阈值</div>
            </div>
            <div class="stat-card">
              <div class="stat-value">70%</div>
              <div class="stat-label">强制转诊阈值</div>
            </div>
            <div class="stat-card">
              <div class="stat-value">100%</div>
              <div class="stat-label">关键操作审计留痕</div>
            </div>
          </div>
        </div>

        <div class="hero-right">
          <div class="visual-panel">
            <div class="visual-card visual-main">
              <div class="card-title">平台协同总览</div>
              <div class="mock-chart">
                <div class="chart-bars">
                  <span style="height: 34%"></span>
                  <span style="height: 58%"></span>
                  <span style="height: 44%"></span>
                  <span style="height: 76%"></span>
                  <span style="height: 62%"></span>
                  <span style="height: 88%"></span>
                </div>
              </div>
            </div>

            <div class="floating-tag tag-1">AI 辅助复核</div>
            <div class="floating-tag tag-2">影像云同步</div>
            <div class="floating-tag tag-3">审计日志追踪</div>

            <div class="mini-card mini-a">
              <div class="mini-title">病例详情</div>
              <div class="mini-lines">
                <span></span><span></span><span></span>
              </div>
            </div>

            <div class="mini-card mini-b">
              <div class="mini-title">高危预警</div>
              <div class="mini-progress">
                <i></i>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="feature-section">
        <div class="section-title-wrap">
          <div class="section-kicker">PLATFORM CAPABILITIES</div>
          <h2>平台核心能力</h2>
        </div>

        <div class="feature-grid">
          <div class="feature-card">
            <div class="feature-icon">诊</div>
            <div class="feature-title">AI 辅助诊疗</div>
            <div class="feature-desc">AI 预诊、恶性概率评估、医生复核</div>
          </div>

          <div class="feature-card">
            <div class="feature-icon">云</div>
            <div class="feature-title">影像云协同</div>
            <div class="feature-desc">历史影像对比、病程追踪、多模态管理</div>
          </div>

          <div class="feature-card">
            <div class="feature-icon">转</div>
            <div class="feature-title">分级诊疗闭环</div>
            <div class="feature-desc">基层上送、上级接收、会诊回传</div>
          </div>

          <div class="feature-card">
            <div class="feature-icon">审</div>
            <div class="feature-title">治理与审计</div>
            <div class="feature-desc">账号权限、审批流、审计日志</div>
          </div>
        </div>
      </section>

      <div class="bottom-note">
        <span class="note-icon">⚠</span>
        本系统基于 CR-Conformer 模型提供辅助建议，AI 输出仅供参考，不构成最终医学诊断，
        最终诊疗方案以专业医生意见和进一步检查结果为准。
      </div>
    </main>

    <!-- 登录弹窗 -->
    <transition name="modal-fade">
      <div v-if="showLoginModal" class="login-overlay" @click.self="closeLogin">
        <div class="login-modal">
          <button class="modal-close" @click="closeLogin" aria-label="关闭">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M6 6l12 12M18 6l-12 12" />
            </svg>
          </button>

          <div class="login-modal-left">
            <div class="modal-brand">
              <div class="modal-brand-mark">肤</div>
              <div>
                <div class="modal-brand-title">一肤当关</div>
                <div class="modal-brand-subtitle">统一登录中心</div>
              </div>
            </div>

            <div class="modal-left-title">医疗 AI 专业平台入口</div>

            <div class="modal-left-list">
              <div class="left-pill">
                <span class="left-pill-icon">诊</span>
                <div class="left-pill-copy">
                  <strong>医生端</strong>
                  <span>AI复核 · 分级诊疗</span>
                </div>
              </div>

              <div class="left-pill">
                <span class="left-pill-icon">管</span>
                <div class="left-pill-copy">
                  <strong>管理员端</strong>
                  <span>权限控制 · 平台治理</span>
                </div>
              </div>

              <div class="left-pill">
                <span class="left-pill-icon">安</span>
                <div class="left-pill-copy">
                  <strong>安全审计</strong>
                  <span>关键操作全程留痕</span>
                </div>
              </div>

              <div class="left-highlight">
                <div class="highlight-title">平台特性</div>
                <div class="highlight-tags">
                  <span>AI 辅助</span>
                  <span>影像云</span>
                  <span>审计追踪</span>
                </div>
              </div>
            </div>

            <div class="modal-left-foot">
              AI 仅辅助建议，不直接作出最终医学诊断
            </div>
          </div>

          <div class="login-modal-right">
            <div class="role-tabs">
              <button
                  class="role-tab"
                  :class="{ active: activeRole === 'doctor' }"
                  @click="activeRole = 'doctor'"
              >
                医生端登录
              </button>
              <button
                  class="role-tab"
                  :class="{ active: activeRole === 'admin' }"
                  @click="activeRole = 'admin'"
              >
                管理员端登录
              </button>
            </div>

            <div class="form-stage">
              <transition name="fade-slide" mode="out-in">
                <form
                    v-if="activeRole === 'doctor'"
                    key="doctor"
                    class="login-form"
                    @submit.prevent="handleLogin"
                >
                  <div class="input-group">
                    <label>账号</label>
                    <div class="input-shell">
                      <svg class="input-icon" viewBox="0 0 24 24" fill="none">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                        <path d="M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" />
                      </svg>
                      <input
                          v-model="doctorForm.username"
                          type="text"
                          placeholder="请输入工号 / 邮箱"
                          required
                      />
                    </div>
                  </div>

                  <div class="input-group">
                    <label>密码</label>
                    <div class="input-shell">
                      <svg class="input-icon" viewBox="0 0 24 24" fill="none">
                        <rect x="3" y="11" width="18" height="10" rx="2" />
                        <path d="M7 11V8a5 5 0 0 1 10 0v3" />
                      </svg>
                      <input
                          v-model="doctorForm.password"
                          :type="showPwd ? 'text' : 'password'"
                          placeholder="请输入密码"
                          required
                      />
                      <button type="button" class="toggle-pwd" @click="showPwd = !showPwd">
                        <svg v-if="showPwd" viewBox="0 0 24 24" fill="none">
                          <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7Z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                        <svg v-else viewBox="0 0 24 24" fill="none">
                          <path d="M3 3l18 18" />
                          <path d="M10.6 10.7A3 3 0 0 0 13.3 13.4" />
                          <path d="M9.9 5.2A11 11 0 0 1 12 5c6.4 0 10 7 10 7a16 16 0 0 1-3.1 4.2" />
                          <path d="M6.1 6.1A16 16 0 0 0 2 12s3.6 7 10 7a11 11 0 0 0 5.1-1.2" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  <div class="fixed-slot">
                    <span>临床工作台</span>
                  </div>

                  <div class="form-options">
                    <label class="checkbox-label">
                      <input type="checkbox" v-model="doctorForm.remember" />
                      <span>记住账号</span>
                    </label>
                    <a href="#" class="link">忘记密码？</a>
                  </div>

                  <button type="submit" class="login-btn doctor-btn">
                    <span>进入医生工作台</span>
                    <svg viewBox="0 0 24 24" fill="none">
                      <path d="M5 12h14M13 5l7 7-7 7" />
                    </svg>
                  </button>
                </form>

                <form
                    v-else
                    key="admin"
                    class="login-form"
                    @submit.prevent="handleLogin"
                >
                  <div class="input-group">
                    <label>管理员账号</label>
                    <div class="input-shell">
                      <svg class="input-icon" viewBox="0 0 24 24" fill="none">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                        <path d="M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" />
                      </svg>
                      <input
                          v-model="adminForm.username"
                          type="text"
                          placeholder="请输入管理员账号"
                          required
                      />
                    </div>
                  </div>

                  <div class="input-group">
                    <label>密码</label>
                    <div class="input-shell">
                      <svg class="input-icon" viewBox="0 0 24 24" fill="none">
                        <rect x="3" y="11" width="18" height="10" rx="2" />
                        <path d="M7 11V8a5 5 0 0 1 10 0v3" />
                      </svg>
                      <input
                          v-model="adminForm.password"
                          :type="showAdminPwd ? 'text' : 'password'"
                          placeholder="请输入密码"
                          required
                      />
                      <button type="button" class="toggle-pwd" @click="showAdminPwd = !showAdminPwd">
                        <svg v-if="showAdminPwd" viewBox="0 0 24 24" fill="none">
                          <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7Z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                        <svg v-else viewBox="0 0 24 24" fill="none">
                          <path d="M3 3l18 18" />
                          <path d="M10.6 10.7A3 3 0 0 0 13.3 13.4" />
                          <path d="M9.9 5.2A11 11 0 0 1 12 5c6.4 0 10 7 10 7a16 16 0 0 1-3.1 4.2" />
                          <path d="M6.1 6.1A16 16 0 0 0 2 12s3.6 7 10 7a11 11 0 0 0 5.1-1.2" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  <div class="input-group">
                    <label>机构安全码</label>
                    <div class="input-shell">
                      <svg class="input-icon" viewBox="0 0 24 24" fill="none">
                        <rect x="3" y="11" width="18" height="10" rx="2" />
                        <path d="M7 11V8a5 5 0 0 1 9-3" />
                        <circle cx="17" cy="7" r="2" />
                      </svg>
                      <input
                          v-model="adminForm.orgToken"
                          type="text"
                          placeholder="请输入机构安全码（可选）"
                      />
                    </div>
                  </div>

                  <div class="form-options">
                    <label class="checkbox-label">
                      <input type="checkbox" v-model="adminForm.remember" />
                      <span>安全设备记住</span>
                    </label>
                    <a href="#" class="link">需要帮助？</a>
                  </div>

                  <button type="submit" class="login-btn admin-btn">
                    <span>进入管理控制台</span>
                    <svg viewBox="0 0 24 24" fill="none">
                      <path d="M5 12h14M13 5l7 7-7 7" />
                    </svg>
                  </button>
                </form>
              </transition>
            </div>

            <div class="login-footer">
              <div class="footer-row">
                <span class="footer-dot"></span>
                连续 5 次输入错误将锁定 10 分钟
              </div>
              <div class="footer-row muted">所有登录及关键操作均记录审计日志</div>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const showLoginModal = ref(false)
const activeRole = ref('doctor')

const showPwd = ref(false)
const showAdminPwd = ref(false)

const doctorForm = reactive({
  username: '',
  password: '',
  remember: false
})

const adminForm = reactive({
  username: '',
  password: '',
  orgToken: '',
  remember: false
})

const openLogin = () => {
  showLoginModal.value = true
}

const closeLogin = () => {
  showLoginModal.value = false
}

const handleLogin = () => {
  if (activeRole.value === 'doctor') {
    console.log('医生登录:', doctorForm)
    router.push('/doctor/workbench')
  } else {
    console.log('管理员登录:', adminForm)
    router.push('/admin/dashboard')
  }
}
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.portal-page {
  min-height: 100vh;
  position: relative;
  overflow-x: hidden;
  background:
      radial-gradient(circle at 10% 14%, rgba(76, 128, 255, 0.10) 0%, transparent 24%),
      radial-gradient(circle at 84% 18%, rgba(0, 198, 208, 0.09) 0%, transparent 22%),
      linear-gradient(180deg, #f7fbff 0%, #eef5fb 52%, #f8fbff 100%);
  font-family: 'Inter', 'PingFang SC', 'Microsoft YaHei', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  color: #16324f;
  isolation: isolate;
}

.portal-page::before {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
  background:
      radial-gradient(circle at 18% 32%, rgba(47,111,237,0.06) 0%, transparent 26%),
      radial-gradient(circle at 78% 62%, rgba(25,198,208,0.06) 0%, transparent 24%);
  z-index: 0;
}

.portal-page::after {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
  background:
      linear-gradient(115deg, transparent 0%, rgba(255,255,255,0.26) 28%, transparent 46%, transparent 100%);
  opacity: 0.9;
  z-index: 0;
}

.bg-layer {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.bg-1 {
  background:
      radial-gradient(circle at 10% 18%, rgba(72, 125, 255, 0.16) 0%, transparent 32%),
      radial-gradient(circle at 88% 16%, rgba(35, 196, 214, 0.14) 0%, transparent 26%);
}

.bg-2 {
  background:
      radial-gradient(circle at 76% 70%, rgba(56, 132, 255, 0.08) 0%, transparent 30%),
      radial-gradient(circle at 20% 82%, rgba(0, 166, 207, 0.08) 0%, transparent 24%);
}

.bg-3 {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.76) 0%, rgba(244, 249, 255, 0.88) 100%);
  opacity: 0.95;
}

.bg-grid {
  background-image:
      linear-gradient(rgba(65, 102, 146, 0.045) 1px, transparent 1px),
      linear-gradient(90deg, rgba(65, 102, 146, 0.045) 1px, transparent 1px);
  background-size: 44px 44px;
  mask-image: linear-gradient(to bottom, rgba(0, 0, 0, 0.52), transparent 92%);
  opacity: 0.75;
}

/* header：保持上一版不改结构 */
.portal-header {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 30;
  width: 100%;
  height: 78px;
  padding: 0 36px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  backdrop-filter: blur(14px);
  background: rgba(246, 251, 255, 0.82);
  border-bottom: 1px solid rgba(108, 145, 188, 0.12);
}

.brand-group {
  display: flex;
  align-items: center;
  gap: 14px;
}

.brand-mark {
  width: 52px;
  height: 52px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #316ff2 0%, #1cc7cf 100%);
  color: #fff;
  font-size: 22px;
  font-weight: 800;
  box-shadow: 0 12px 28px rgba(49, 111, 242, 0.2);
}

.brand-copy {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.brand-title {
  font-size: 23px;
  font-weight: 800;
  color: #102b49;
  letter-spacing: 0.2px;
}

.brand-subtitle {
  font-size: 12px;
  color: #6c829c;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.header-pill {
  height: 40px;
  padding: 0 15px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.82);
  border: 1px solid rgba(95, 137, 181, 0.16);
  display: flex;
  align-items: center;
  gap: 8px;
  color: #476680;
  font-size: 13px;
  box-shadow: 0 8px 20px rgba(88, 127, 172, 0.08);
}

.pill-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #19c7c8;
  box-shadow: 0 0 10px rgba(25, 199, 200, 0.5);
}

.header-login-btn {
  height: 44px;
  padding: 0 22px;
  border: none;
  border-radius: 14px;
  background: linear-gradient(135deg, #2f6fed 0%, #19c6d0 100%);
  color: #fff;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 14px 28px rgba(47, 111, 237, 0.18);
  transition: transform 0.22s ease, box-shadow 0.22s ease, filter 0.22s ease;
}

.header-login-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 18px 34px rgba(47, 111, 237, 0.24);
  filter: brightness(1.02);
}

/* 整体缩回上一版的感觉，但比过大的版本小一点 */
.portal-main {
  position: relative;
  z-index: 1;
  padding: 94px 42px 42px;
  max-width: 1480px;
  margin: 0 auto;
}

.hero-section {
  min-height: calc(100vh - 180px);
  display: grid;
  grid-template-columns: 1.06fr 0.94fr;
  gap: 46px;
  align-items: center;
}

.hero-left {
  padding-right: 8px;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  height: 40px;
  padding: 0 18px;
  border-radius: 999px;
  background: rgba(48, 112, 238, 0.09);
  border: 1px solid rgba(48, 112, 238, 0.12);
  color: #2a61ce;
  font-size: 13px;
  font-weight: 700;
  margin-bottom: 22px;
}

.hero-left h1 {
  font-size: 62px;
  line-height: 1.08;
  font-weight: 900;
  color: #112e4d;
  letter-spacing: -1.35px;
}

.hero-left h1 span {
  display: block;
  margin-top: 8px;
  background: linear-gradient(135deg, #1a3777 0%, #2f6fed 42%, #12bfc9 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.hero-desc {
  margin-top: 22px;
  font-size: 17px;
  line-height: 1.9;
  color: #5d7590;
  max-width: 780px;
}

.hero-actions {
  margin-top: 30px;
  display: flex;
  align-items: center;
  gap: 14px;
}

.primary-btn,
.secondary-btn {
  height: 56px;
  padding: 0 24px;
  border-radius: 18px;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.24s ease;
}

.primary-btn {
  border: none;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  color: #fff;
  background: linear-gradient(135deg, #2f6fed 0%, #19c6d0 100%);
  box-shadow: 0 18px 36px rgba(47, 111, 237, 0.18);
}

.primary-btn svg {
  width: 18px;
  height: 18px;
  stroke: currentColor;
  stroke-width: 2;
  transition: transform 0.24s ease;
}

.primary-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 22px 42px rgba(47, 111, 237, 0.24);
}

.primary-btn:hover svg {
  transform: translateX(2px);
}

.secondary-btn {
  border: 1px solid rgba(92, 128, 170, 0.18);
  background: rgba(255, 255, 255, 0.74);
  color: #36516d;
  box-shadow: 0 10px 24px rgba(100, 130, 168, 0.08);
}

.secondary-btn:hover {
  transform: translateY(-2px);
  background: #fff;
}

.hero-stats {
  margin-top: 30px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  max-width: 790px;
}

.stat-card {
  padding: 22px 20px 18px;
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.78);
  border: 1px solid rgba(109, 145, 186, 0.12);
  box-shadow: 0 18px 38px rgba(109, 145, 186, 0.08);
  transition: transform 0.24s ease, box-shadow 0.24s ease, border-color 0.24s ease;
}

.stat-card:hover {
  transform: translateY(-5px);
  border-color: rgba(49, 111, 242, 0.2);
  box-shadow: 0 22px 42px rgba(109, 145, 186, 0.12);
}

.stat-value {
  font-size: 32px;
  font-weight: 800;
  color: #15365a;
  margin-bottom: 8px;
}

.stat-label {
  font-size: 14px;
  color: #68809a;
  line-height: 1.65;
}

.hero-right {
  display: flex;
  justify-content: center;
}

.visual-panel {
  position: relative;
  width: 100%;
  max-width: 650px;
  height: 530px;
}

.visual-main {
  position: absolute;
  inset: 76px 28px 44px 28px;
  border-radius: 36px;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.92) 0%, rgba(247, 251, 255, 0.96) 100%);
  border: 1px solid rgba(120, 156, 196, 0.12);
  box-shadow:
      0 34px 76px rgba(95, 130, 171, 0.14),
      0 12px 24px rgba(95, 130, 171, 0.08);
  padding: 28px;
}

.card-title {
  font-size: 17px;
  font-weight: 800;
  color: #18395d;
  margin-bottom: 18px;
}

.mock-chart {
  height: 100%;
  border-radius: 26px;
  background: linear-gradient(180deg, rgba(229, 239, 250, 0.65) 0%, rgba(241, 247, 253, 0.92) 100%);
  border: 1px solid rgba(122, 153, 191, 0.1);
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding: 24px;
}

.chart-bars {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: flex-end;
  gap: 12px;
}

.chart-bars span {
  flex: 1;
  border-radius: 16px 16px 8px 8px;
  background: linear-gradient(180deg, #77cfff 0%, #2f6fed 100%);
  box-shadow: 0 10px 22px rgba(47, 111, 237, 0.16);
  transition: transform 0.24s ease;
}

.chart-bars span:hover {
  transform: translateY(-4px);
}

.floating-tag {
  position: absolute;
  height: 44px;
  padding: 0 18px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.94);
  border: 1px solid rgba(117, 153, 194, 0.14);
  box-shadow: 0 14px 30px rgba(95, 130, 171, 0.1);
  display: flex;
  align-items: center;
  color: #2d5277;
  font-size: 14px;
  font-weight: 700;
}

.tag-1 {
  top: 20px;
  left: 24px;
  animation: floatY 4.6s ease-in-out infinite;
}

.tag-2 {
  top: 102px;
  right: 2px;
  animation: floatY 4.8s ease-in-out infinite 1s;
}

.tag-3 {
  bottom: 6px;
  right: 16px;
  animation: floatY 5s ease-in-out infinite 2s;
}

.mini-card {
  position: absolute;
  width: 184px;
  height: 124px;
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.94);
  border: 1px solid rgba(117, 153, 194, 0.12);
  box-shadow: 0 18px 36px rgba(95, 130, 171, 0.1);
  padding: 16px;
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.mini-card:hover {
  transform: translateY(-4px) scale(1.01);
  box-shadow: 0 22px 42px rgba(95, 130, 171, 0.14);
}

.mini-a {
  left: 0;
  bottom: 66px;
}

.mini-b {
  right: 38px;
  top: 180px;
}

.mini-title {
  font-size: 14px;
  font-weight: 800;
  color: #1e4369;
  margin-bottom: 14px;
}

.mini-lines {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.mini-lines span {
  display: block;
  height: 10px;
  border-radius: 999px;
  background: linear-gradient(90deg, rgba(47, 111, 237, 0.15), rgba(25, 198, 208, 0.2));
}

.mini-lines span:nth-child(1) { width: 78%; }
.mini-lines span:nth-child(2) { width: 60%; }
.mini-lines span:nth-child(3) { width: 88%; }

.mini-progress {
  margin-top: 10px;
  height: 16px;
  border-radius: 999px;
  background: rgba(47, 111, 237, 0.08);
  overflow: hidden;
}

.mini-progress i {
  display: block;
  width: 72%;
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, #2f6fed 0%, #19c6d0 100%);
}

.feature-section {
  margin-top: 34px;
  padding-bottom: 24px;
}

.section-title-wrap {
  text-align: center;
  margin-bottom: 30px;
}

.section-kicker {
  font-size: 12px;
  letter-spacing: 1.8px;
  color: #4b7acc;
  font-weight: 800;
  margin-bottom: 10px;
}

.section-title-wrap h2 {
  font-size: 36px;
  font-weight: 900;
  color: #132f4d;
}

.feature-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 18px;
}

.feature-card {
  background: rgba(255, 255, 255, 0.82);
  border: 1px solid rgba(115, 151, 191, 0.12);
  border-radius: 24px;
  padding: 24px 22px;
  box-shadow: 0 16px 34px rgba(95, 130, 171, 0.08);
  transition: transform 0.24s ease, background 0.24s ease, box-shadow 0.24s ease;
}

.feature-card:hover {
  transform: translateY(-6px);
  background: #ffffff;
  box-shadow: 0 22px 40px rgba(95, 130, 171, 0.12);
}

.feature-icon {
  width: 44px;
  height: 44px;
  border-radius: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #2f6fed 0%, #19c6d0 100%);
  color: #fff;
  font-weight: 800;
  font-size: 15px;
  margin-bottom: 16px;
  box-shadow: 0 12px 24px rgba(47, 111, 237, 0.16);
}

.feature-title {
  font-size: 18px;
  font-weight: 800;
  color: #18395e;
  margin-bottom: 10px;
}

.feature-desc {
  font-size: 14px;
  line-height: 1.78;
  color: #69819a;
}

.bottom-note {
  margin: 22px auto 0;
  max-width: 1180px;
  padding: 16px 20px;
  border-radius: 20px;
  background: rgba(255, 248, 225, 0.78);
  border: 1px solid rgba(239, 180, 54, 0.22);
  color: #8a6326;
  display: flex;
  align-items: flex-start;
  gap: 10px;
  justify-content: center;
  text-align: center;
  font-size: 13px;
  line-height: 1.85;
}

.note-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  flex-shrink: 0;
  border-radius: 50%;
  background: #f2bd41;
  color: #fff;
  font-size: 11px;
  font-weight: 800;
  margin-top: 2px;
}

/* 登录弹窗：缩短一点，整体更轻 */
.login-overlay {
  position: fixed;
  inset: 0;
  z-index: 100;
  background: rgba(40, 61, 88, 0.2);
  backdrop-filter: blur(18px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 34px;
}

.login-modal {
  position: relative;
  width: min(930px, calc(100vw - 56px));
  height: 588px;
  border-radius: 30px;
  background:
      linear-gradient(135deg, rgba(255, 255, 255, 0.90) 0%, rgba(252, 253, 255, 0.97) 100%);
  box-shadow:
      0 40px 90px rgba(68, 95, 129, 0.16),
      0 18px 40px rgba(68, 95, 129, 0.10);
  border: 1px solid rgba(255, 255, 255, 0.72);
  overflow: hidden;
  display: grid;
  grid-template-columns: 0.4fr 0.6fr;
  backdrop-filter: blur(18px);
}

.login-modal::before {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
  background:
      linear-gradient(135deg, rgba(255,255,255,0.22) 0%, transparent 24%, transparent 70%, rgba(47,111,237,0.05) 100%);
}

.modal-close {
  position: absolute;
  top: 18px;
  right: 18px;
  z-index: 2;
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 12px;
  background: rgba(243, 248, 253, 0.92);
  color: #587290;
  cursor: pointer;
  transition: all 0.22s ease;
}

.modal-close:hover {
  background: #fff;
  color: #2e4f73;
  transform: rotate(90deg);
}

.modal-close svg {
  width: 18px;
  height: 18px;
  stroke: currentColor;
  stroke-width: 2;
}

/* 左侧加呼吸感、玻璃感 */
.login-modal-left {
  position: relative;
  height: 100%;
  padding: 28px 24px 24px;
  background:
      radial-gradient(circle at 18% 12%, rgba(47, 111, 237, 0.14) 0%, transparent 30%),
      radial-gradient(circle at 82% 78%, rgba(25, 198, 208, 0.12) 0%, transparent 34%),
      linear-gradient(180deg, rgba(236, 247, 255, 0.76) 0%, rgba(239, 247, 255, 0.84) 54%, rgba(236, 245, 254, 0.92) 100%);
  border-right: 1px solid rgba(116, 152, 193, 0.10);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.login-modal-left::before {
  content: '';
  position: absolute;
  top: 14px;
  left: 18px;
  right: 18px;
  height: 120px;
  border-radius: 30px;
  background: linear-gradient(135deg, rgba(255,255,255,0.38), rgba(255,255,255,0.04));
  filter: blur(18px);
  opacity: 0.85;
  pointer-events: none;
}

.login-modal-left::after {
  content: '';
  position: absolute;
  right: -20px;
  bottom: 80px;
  width: 150px;
  height: 150px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(25,198,208,0.18) 0%, transparent 68%);
  filter: blur(18px);
  pointer-events: none;
}

.login-modal-left > * {
  position: relative;
  z-index: 1;
}

.modal-brand {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 22px;
}

.modal-brand-mark {
  width: 46px;
  height: 46px;
  border-radius: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #2f6fed 0%, #19c6d0 100%);
  color: #fff;
  font-size: 20px;
  font-weight: 800;
  box-shadow: 0 12px 24px rgba(47, 111, 237, 0.18);
}

.modal-brand-title {
  font-size: 20px;
  font-weight: 900;
  color: #143556;
}

.modal-brand-subtitle {
  font-size: 12px;
  color: #7190ac;
  margin-top: 2px;
}

.modal-left-title {
  font-size: 28px;
  line-height: 1.18;
  font-weight: 900;
  color: #143556;
  margin-bottom: 22px;
}

.modal-left-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 2px;
}

.left-pill {
  display: flex;
  gap: 14px;
  align-items: center;
  padding: 14px 14px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.52);
  border: 1px solid rgba(255, 255, 255, 0.62);
  box-shadow:
      0 10px 24px rgba(108, 139, 176, 0.08),
      inset 0 1px 0 rgba(255, 255, 255, 0.58);
  transition: transform 0.24s ease, box-shadow 0.24s ease, background 0.24s ease;
  backdrop-filter: blur(14px);
}

.left-pill:hover {
  transform: translateY(-3px);
  background: rgba(255, 255, 255, 0.68);
  box-shadow:
      0 14px 28px rgba(108, 139, 176, 0.12),
      inset 0 1px 0 rgba(255, 255, 255, 0.70);
}

.left-pill-icon {
  width: 38px;
  height: 38px;
  flex-shrink: 0;
  border-radius: 12px;
  background: linear-gradient(135deg, #2f6fed 0%, #19c6d0 100%);
  color: #fff;
  font-size: 14px;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
}

.left-pill-copy {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.left-pill-copy strong {
  font-size: 15px;
  color: #1d4268;
  font-weight: 800;
}

.left-pill-copy span {
  font-size: 12px;
  color: #7b93ad;
  line-height: 1.4;
}

.left-highlight {
  margin-top: 6px;
  padding: 14px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.46);
  border: 1px solid rgba(255, 255, 255, 0.58);
  box-shadow:
      0 10px 24px rgba(108, 139, 176, 0.08),
      inset 0 1px 0 rgba(255,255,255,0.52);
  backdrop-filter: blur(12px);
  animation: softBreath 4.8s ease-in-out infinite;
}

.highlight-title {
  font-size: 13px;
  font-weight: 800;
  color: #315373;
  margin-bottom: 10px;
}

.highlight-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.highlight-tags span {
  height: 30px;
  padding: 0 12px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  background: rgba(47, 111, 237, 0.08);
  color: #3f6283;
  font-size: 12px;
  font-weight: 700;
}

.modal-left-foot {
  margin-top: auto;
  font-size: 12px;
  color: #7690a9;
  line-height: 1.7;
  padding: 13px 15px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.50);
  border: 1px solid rgba(255, 255, 255, 0.58);
  box-shadow:
      0 8px 20px rgba(108, 139, 176, 0.06),
      inset 0 1px 0 rgba(255,255,255,0.52);
  backdrop-filter: blur(12px);
  animation: softBreath 5.2s ease-in-out infinite;
}

.login-modal-right {
  height: 100%;
  padding: 28px 28px 24px;
  display: flex;
  flex-direction: column;
  background:
      linear-gradient(180deg, rgba(255,255,255,0.72) 0%, rgba(252,253,255,0.90) 100%);
}

.role-tabs {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  background: #eff4fa;
  padding: 7px;
  border-radius: 20px;
}

.role-tab {
  height: 48px;
  border: none;
  border-radius: 15px;
  background: transparent;
  font-size: 15px;
  font-weight: 700;
  color: #66809c;
  cursor: pointer;
  transition: all 0.22s ease;
}

.role-tab.active {
  background: #ffffff;
  color: #1d4268;
  box-shadow: 0 10px 20px rgba(113, 145, 183, 0.12);
}

.form-stage {
  flex: 1;
  margin-top: 20px;
  min-height: 0;
  display: flex;
  align-items: flex-start;
}

.login-form {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.input-group label {
  display: block;
  font-size: 13px;
  font-weight: 700;
  color: #29496f;
  margin-bottom: 8px;
}

.input-shell {
  position: relative;
}

.input-shell input {
  width: 100%;
  height: 56px;
  border-radius: 18px;
  border: 1px solid rgba(116, 152, 193, 0.14);
  background: rgba(248, 251, 255, 0.72);
  padding: 0 50px 0 48px;
  font-size: 15px;
  color: #1b3b60;
  outline: none;
  transition: all 0.22s ease;
  backdrop-filter: blur(10px);
}

.input-shell input::placeholder {
  color: #9bb0c6;
}

.input-shell input:focus {
  background: rgba(255, 255, 255, 0.88);
  border-color: rgba(48, 112, 238, 0.24);
  box-shadow:
      0 0 0 4px rgba(48, 112, 238, 0.08),
      0 10px 24px rgba(98, 128, 170, 0.08);
}

.input-icon {
  position: absolute;
  left: 17px;
  top: 50%;
  transform: translateY(-50%);
  width: 18px;
  height: 18px;
  stroke: #88a0b8;
  stroke-width: 2;
  pointer-events: none;
}

.toggle-pwd {
  position: absolute;
  right: 14px;
  top: 50%;
  transform: translateY(-50%);
  border: none;
  background: transparent;
  color: #88a0b8;
  cursor: pointer;
  transition: color 0.22s ease, transform 0.22s ease;
}

.toggle-pwd:hover {
  color: #587290;
  transform: translateY(-50%) scale(1.06);
}

.toggle-pwd svg {
  width: 18px;
  height: 18px;
  stroke: currentColor;
  stroke-width: 2;
}

.fixed-slot {
  height: 56px;
  border-radius: 18px;
  background: rgba(248, 251, 255, 0.68);
  border: 1px solid rgba(116, 152, 193, 0.12);
  display: flex;
  align-items: center;
  padding: 0 18px;
  backdrop-filter: blur(10px);
}

.fixed-slot span {
  color: #64809c;
  font-size: 14px;
  font-weight: 600;
}

.form-options {
  margin-top: 2px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 7px;
  color: #5e7893;
  font-size: 13px;
  cursor: pointer;
}

.checkbox-label input {
  accent-color: #2f6fed;
}

.link {
  color: #2f6fed;
  text-decoration: none;
  font-size: 13px;
  font-weight: 600;
}

.login-btn {
  height: 54px;
  border: none;
  border-radius: 18px;
  color: #fff;
  font-size: 15px;
  font-weight: 800;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  transition: transform 0.24s ease, box-shadow 0.24s ease, filter 0.24s ease;
}

.login-btn svg {
  width: 18px;
  height: 18px;
  stroke: currentColor;
  stroke-width: 2;
  transition: transform 0.24s ease;
}

.doctor-btn {
  background: linear-gradient(135deg, #2f6fed 0%, #19c6d0 100%);
  box-shadow: 0 16px 30px rgba(47, 111, 237, 0.18);
}

.admin-btn {
  background: linear-gradient(135deg, #234f9e 0%, #3684f5 100%);
  box-shadow: 0 16px 30px rgba(35, 79, 158, 0.18);
}

.login-btn:hover {
  transform: translateY(-2px);
  filter: brightness(1.02);
}

.login-btn:hover svg {
  transform: translateX(2px);
}

.login-footer {
  padding-top: 16px;
  border-top: 1px solid rgba(116, 152, 193, 0.12);
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.footer-row {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #5f7c98;
  font-size: 12px;
}

.footer-row.muted {
  color: #8aa0b8;
}

.footer-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #19c6d0;
  box-shadow: 0 0 10px rgba(25, 198, 208, 0.5);
}

.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.22s ease;
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(8px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: all 0.22s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

@keyframes floatY {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-9px);
  }
}

@keyframes softBreath {
  0%, 100% {
    transform: translateY(0);
    opacity: 0.92;
  }
  50% {
    transform: translateY(-2px);
    opacity: 1;
  }
}

@media (max-width: 1260px) {
  .portal-main {
    padding: 92px 24px 36px;
    max-width: 1260px;
  }

  .hero-section {
    grid-template-columns: 1fr;
    gap: 34px;
    min-height: auto;
  }

  .hero-left h1 {
    font-size: 50px;
  }

  .visual-panel {
    max-width: 600px;
    height: 470px;
  }

  .feature-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 980px) {
  .login-modal {
    width: min(760px, calc(100vw - 28px));
    height: auto;
    min-height: 650px;
    grid-template-columns: 1fr;
  }

  .login-modal-left {
    display: none;
  }

  .login-modal-right {
    padding: 58px 24px 24px;
  }
}

@media (max-width: 768px) {
  .portal-header {
    padding: 0 18px;
  }

  .brand-subtitle,
  .header-pill {
    display: none;
  }

  .brand-title {
    font-size: 20px;
  }

  .portal-main {
    padding: 88px 16px 30px;
  }

  .hero-left h1 {
    font-size: 38px;
    line-height: 1.16;
  }

  .hero-desc {
    font-size: 15px;
  }

  .hero-actions {
    flex-direction: column;
    align-items: stretch;
  }

  .hero-stats {
    grid-template-columns: 1fr;
  }

  .feature-grid {
    grid-template-columns: 1fr;
  }

  .visual-panel {
    height: 380px;
  }

  .visual-main {
    inset: 58px 10px 28px 10px;
  }

  .mini-a,
  .mini-b {
    display: none;
  }

  .floating-tag {
    font-size: 12px;
    height: 38px;
  }

  .tag-1 { left: 10px; top: 10px; }
  .tag-2 { right: 8px; top: 62px; }
  .tag-3 { right: 14px; bottom: 0; }

  .bottom-note {
    text-align: left;
    justify-content: flex-start;
  }
}
</style>
