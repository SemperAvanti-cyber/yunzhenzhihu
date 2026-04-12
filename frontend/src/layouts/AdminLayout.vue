<template>
  <div class="layout-shell">
    <header class="topbar">
      <div class="brand-wrap">
        <div class="brand-logo">管</div>
        <div class="brand-text">
          <div class="brand-title">云诊智护 · 管理员后台</div>
          <div class="brand-subtitle">Administration Console · {{ activeRoleLabel }}</div>
        </div>
      </div>

      <nav class="main-nav">
        <button class="main-nav-item active">管理员控制台</button>
      </nav>

      <div class="top-actions">
        <div class="role-chip">{{ activeRoleLabel }}</div>

        <div class="search-box">
          <span class="search-icon">⌕</span>
          <input :placeholder="searchPlaceholder" />
        </div>

        <div class="user-box">
          <div class="user-avatar">{{ avatarText }}</div>
          <div class="user-inline">
            <span class="user-name">{{ displayName }}</span>
            <span class="user-divider">·</span>
            <span class="user-role">{{ activeRoleLabel }}</span>
          </div>
        </div>

        <button type="button" class="logout-btn" @click="handleLogout">退出</button>
      </div>
    </header>

    <div class="page-shell">
      <div class="page-surface">
        <aside class="sidebar">
          <div class="sidebar-title">管理菜单</div>

          <div class="sidebar-list">
            <button
                v-for="item in currentMenus"
                :key="item.key"
                class="sidebar-item"
                :class="{ active: item.key === activeMenuKey }"
                @click="go(item.path)"
            >
              <div class="sidebar-item-left">
                <div class="sidebar-icon">{{ item.icon }}</div>
                <span class="sidebar-label">{{ item.label }}</span>
              </div>
              <span class="sidebar-arrow">›</span>
            </button>
          </div>
        </aside>

        <main class="content-area">
          <router-view />
        </main>
      </div>
    </div>

    <footer class="global-footer">
      管理员端用于账号管理、项目合规、跨院协同、审计追踪与系统安全治理，不直接参与临床判断。
    </footer>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getAuthUser, logout as doLogout } from '../stores/auth'

const route = useRoute()
const router = useRouter()

const authUser = computed(() => getAuthUser())

const displayName = computed(() => authUser.value?.realName || '管理员')

const avatarText = computed(() => {
  const n = String(displayName.value || '').trim()
  return n ? n.slice(0, 1) : '管'
})

function handleLogout() {
  doLogout(router)
}

const hospitalMenus = [
  { key: 'dashboard', label: '后台总览', icon: '总', path: '/admin/dashboard' },
  { key: 'accounts', label: '账号管理', icon: '账', path: '/admin/accounts' },
  { key: 'consultation', label: '跨院会诊审批', icon: '协', path: '/admin/consultation' }
]

const researchMenus = [
  { key: 'dashboard', label: '后台总览', icon: '总', path: '/admin/dashboard' },
  { key: 'permissions', label: '项目合规治理', icon: '审', path: '/admin/permissions' }
]

const securityMenus = [
  { key: 'dashboard', label: '后台总览', icon: '总', path: '/admin/dashboard' },
  { key: 'audit', label: '审计日志', icon: '审', path: '/admin/audit' },
  { key: 'security', label: '系统安全', icon: '安', path: '/admin/security' }
]

const queryScope = computed(() => {
  const scope = route.query.scope
  if (scope === 'research' || scope === 'security' || scope === 'hospital') {
    return scope
  }
  return null
})

const activeRoleKey = computed(() => {
  if (queryScope.value) return queryScope.value

  const path = route.path
  if (path.includes('/admin/permissions')) return 'research'
  if (path.includes('/admin/audit') || path.includes('/admin/security')) return 'security'
  return 'hospital'
})

const activeRoleLabel = computed(() => {
  if (activeRoleKey.value === 'research') return '科研合规管理员'
  if (activeRoleKey.value === 'security') return '安全审计管理员'
  return '医院管理员'
})

const searchPlaceholder = computed(() => {
  if (activeRoleKey.value === 'research') return '搜索项目 / 伦理 / 导出审批'
  if (activeRoleKey.value === 'security') return '搜索日志 / 导出 / 安全事件'
  return '搜索账号 / 科室 / 会诊审批'
})

const currentMenus = computed(() => {
  if (activeRoleKey.value === 'research') return researchMenus
  if (activeRoleKey.value === 'security') return securityMenus
  return hospitalMenus
})

const activeMenuKey = computed(() => {
  const path = route.path
  if (path.includes('/admin/accounts')) return 'accounts'
  if (path.includes('/admin/permissions')) return 'permissions'
  if (path.includes('/admin/consultation')) return 'consultation'
  if (path.includes('/admin/audit')) return 'audit'
  if (path.includes('/admin/security')) return 'security'
  return 'dashboard'
})

function go(path) {
  router.push({
    path,
    query: {
      scope: activeRoleKey.value
    }
  })
}
</script>

<style scoped>
.layout-shell {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background:
      radial-gradient(circle at top right, rgba(59, 130, 246, 0.05), transparent 24%),
      linear-gradient(180deg, #f6f9fd 0%, #edf3f9 100%);
}

.topbar {
  height: 78px;
  display: grid;
  grid-template-columns: 420px 1fr 540px;
  align-items: center;
  gap: 20px;
  padding: 0 28px;
  background: rgba(255, 255, 255, 0.94);
  border-bottom: 1px solid #d9e6f2;
  backdrop-filter: blur(10px);
  position: sticky;
  top: 0;
  z-index: 20;
}

.brand-wrap {
  display: flex;
  align-items: center;
  gap: 14px;
  min-width: 0;
}

.brand-logo {
  width: 48px;
  height: 48px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #1d4ed8, #2563eb);
  color: #fff;
  font-size: 22px;
  font-weight: 800;
  box-shadow: 0 10px 24px rgba(37, 99, 235, 0.18);
  flex-shrink: 0;
}

.brand-title {
  font-size: 20px;
  font-weight: 700;
  color: #16345b;
  white-space: nowrap;
}

.brand-subtitle {
  margin-top: 4px;
  font-size: 12px;
  color: #6b88aa;
  white-space: nowrap;
}

.main-nav {
  justify-self: center;
}

.main-nav-item {
  height: 44px;
  min-width: 138px;
  padding: 0 24px;
  border: none;
  background: #ffffff;
  color: #154a8c;
  border-radius: 14px;
  font-size: 16px;
  font-weight: 700;
  box-shadow: 0 8px 18px rgba(37, 99, 235, 0.08);
  white-space: nowrap;
}

.top-actions {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 12px;
  min-width: 0;
}

.role-chip {
  height: 40px;
  padding: 0 14px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  background: #eef6ff;
  border: 1px solid #cfe0f5;
  color: #275890;
  font-size: 13px;
  white-space: nowrap;
  flex-shrink: 0;
}

.search-box {
  display: flex;
  align-items: center;
  gap: 10px;
  height: 40px;
  padding: 0 14px;
  min-width: 250px;
  background: #ffffff;
  border: 1px solid #d8e5f2;
  border-radius: 12px;
}

.search-icon {
  color: #7e96b3;
  flex-shrink: 0;
}

.search-box input {
  flex: 1;
  border: none;
  background: transparent;
  outline: none;
  color: #24486f;
  font-size: 14px;
  min-width: 0;
}

.user-box {
  height: 40px;
  padding: 0 12px;
  border-radius: 12px;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background: #ffffff;
  border: 1px solid #d8e5f2;
  white-space: nowrap;
  flex-shrink: 0;
}

.user-avatar {
  width: 28px;
  height: 28px;
  border-radius: 9px;
  background: linear-gradient(135deg, #1d4ed8, #2563eb);
  color: #fff;
  font-size: 12px;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
}

.user-inline {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.user-name {
  font-size: 13px;
  font-weight: 700;
  color: #16345b;
}

.user-divider,
.user-role {
  font-size: 12px;
  color: #7d97b4;
}

.logout-btn {
  height: 40px;
  padding: 0 16px;
  border-radius: 12px;
  border: 1px solid #d8e5f2;
  background: #ffffff;
  color: #275890;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  flex-shrink: 0;
}

.logout-btn:hover {
  background: #f0f6ff;
  border-color: #bfd8f8;
}

.page-shell {
  flex: 1;
  max-width: 1440px;
  width: 100%;
  margin: 0 auto;
  padding: 20px 28px 90px;
}

.page-surface {
  display: grid;
  grid-template-columns: 230px minmax(0, 1fr);
  min-height: calc(100vh - 188px);
  background: rgba(255, 255, 255, 0.76);
  border: 1px solid #dce8f4;
  border-radius: 28px;
  overflow: hidden;
  box-shadow: 0 14px 34px rgba(17, 56, 102, 0.06);
  backdrop-filter: blur(8px);
}

.sidebar {
  padding: 22px 16px;
  background: linear-gradient(180deg, rgba(247, 251, 255, 0.95) 0%, rgba(241, 247, 253, 0.95) 100%);
  border-right: 1px solid #e2ebf4;
}

.sidebar-title {
  font-size: 16px;
  font-weight: 800;
  color: #17385f;
  margin-bottom: 14px;
}

.sidebar-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.sidebar-item {
  width: 100%;
  padding: 12px 14px;
  border-radius: 16px;
  border: 1px solid #e3edf7;
  background: rgba(255, 255, 255, 0.78);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  cursor: pointer;
}

.sidebar-item.active {
  background: linear-gradient(135deg, #edf5ff, #f7fbff);
  border-color: #bfd8f8;
}

.sidebar-item-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.sidebar-icon {
  width: 30px;
  height: 30px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #1d4ed8, #2563eb);
  color: #fff;
  font-size: 12px;
  font-weight: 800;
}

.sidebar-label {
  font-size: 14px;
  font-weight: 700;
  color: #1d466f;
  white-space: nowrap;
}

.sidebar-arrow {
  color: #8ca4bf;
  font-size: 18px;
}

.content-area {
  min-width: 0;
  padding: 22px;
}

.global-footer {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  min-height: 40px;
  padding: 10px 24px;
  background: rgba(255, 255, 255, 0.94);
  border-top: 1px solid #d9e6f2;
  color: #7b91ac;
  font-size: 12px;
  line-height: 1.5;
  text-align: center;
  backdrop-filter: blur(8px);
}

@media (max-width: 1360px) {
  .topbar {
    grid-template-columns: 1fr;
    height: auto;
    padding-top: 18px;
    padding-bottom: 18px;
  }

  .top-actions {
    justify-content: flex-start;
    flex-wrap: wrap;
  }

  .page-shell {
    padding-left: 20px;
    padding-right: 20px;
  }

  .page-surface {
    grid-template-columns: 1fr;
  }

  .sidebar {
    border-right: none;
    border-bottom: 1px solid #e2ebf4;
  }
}
</style>
