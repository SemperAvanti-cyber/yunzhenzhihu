<template>
  <div class="layout-shell">
    <header class="topbar">
      <div class="brand-wrap">
        <div class="brand-logo">肤</div>
        <div class="brand-text">
          <div class="brand-title">云诊智护 · 医疗AI协同平台</div>
          <div class="brand-subtitle">Doctor Clinical Workspace</div>
        </div>
      </div>

      <nav class="main-nav">
        <button
            v-for="item in topMenus"
            :key="item.key"
            class="main-nav-item"
            :class="{ active: item.key === activeTopMenu }"
            @click="router.push(item.path)"
        >
          {{ item.label }}
        </button>
      </nav>

      <div class="top-actions">
        <div class="role-chip">临床医生</div>

        <div class="search-box">
          <span class="search-icon">⌕</span>
          <input placeholder="搜索病例 / 转诊单 / 项目" />
        </div>

        <div class="user-box">
          <div class="user-avatar">{{ avatarText }}</div>
          <div class="user-inline">
            <span class="user-name">{{ displayName }}</span>
            <span class="user-divider">·</span>
            <span class="user-role">{{ userSubtitle }}</span>
          </div>
        </div>

        <button type="button" class="logout-btn" @click="handleLogout">退出</button>
      </div>
    </header>

    <div class="page-shell">
      <div class="page-surface">
        <aside class="sidebar">
          <div class="sidebar-title">
            {{ activeTopMenu === 'research' ? '科研中心' : '工作台' }}
          </div>

          <div class="sidebar-list">
            <button
                v-for="item in currentSideMenus"
                :key="item.key"
                class="sidebar-item"
                :class="{ active: item.key === activeSideMenu }"
                @click="router.push(item.path)"
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
      本系统基于 CR-Conformer 模型提供辅助建议，AI 输出仅供医生参考，不构成最终医学诊断。科研模块不管理正式项目申报，仅管理项目获批后的登记、协作、数据使用、进度与成果。
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

const displayName = computed(() => authUser.value?.realName || '医生')

const avatarText = computed(() => {
  const n = String(displayName.value || '').trim()
  return n ? n.slice(0, 1) : '医'
})

const userSubtitle = computed(() => {
  const u = authUser.value
  if (!u) return '临床医生'
  const dept = u.departmentName || ''
  const hosp = u.hospitalName || ''
  if (dept && hosp) return `${dept} · ${hosp}`
  return dept || hosp || '临床医生'
})

function handleLogout() {
  if (!window.confirm('确定退出登录？')) return
  doLogout(router)
}

const topMenus = [
  { key: 'workbench', label: '工作台', path: '/doctor/workbench' },
  { key: 'research', label: '科研中心', path: '/doctor/research' }
]

const workbenchMenus = [
  { key: 'workbench-home', label: '工作总览', icon: '总', path: '/doctor/workbench' },
  { key: 'diagnosis', label: '影像诊断', icon: '诊', path: '/doctor/diagnosis' },
  { key: 'records', label: '我的病例', icon: '历', path: '/doctor/records' },
  { key: 'referral', label: '分级诊疗', icon: '协', path: '/doctor/referral' }
]

const researchMenus = [
  { key: 'research-home', label: '科研总览', icon: '研', path: '/doctor/research' },
  { key: 'projects', label: '我的项目', icon: '项', path: '/doctor/research/projects' },
  { key: 'recruit', label: '协作招募', icon: '招', path: '/doctor/research/recruit' },
  { key: 'cloud', label: '影像云平台', icon: '云', path: '/doctor/imaging-cloud' },
  { key: 'lab', label: '开放实验平台', icon: '实', path: '/doctor/open-lab' }
]

const activeTopMenu = computed(() => {
  const path = route.path
  if (
      path.includes('/doctor/research') ||
      path.includes('/doctor/imaging-cloud') ||
      path.includes('/doctor/open-lab')
  ) {
    return 'research'
  }
  return 'workbench'
})

const currentSideMenus = computed(() => {
  return activeTopMenu.value === 'research' ? researchMenus : workbenchMenus
})

const activeSideMenu = computed(() => {
  const path = route.path

  if (path.includes('/doctor/diagnosis')) return 'diagnosis'
  if (path.includes('/doctor/records')) return 'records'
  if (path.includes('/doctor/referral')) return 'referral'
  if (path.includes('/doctor/research/projects')) return 'projects'
  if (path.includes('/doctor/research/recruit')) return 'recruit'
  if (path.includes('/doctor/imaging-cloud')) return 'cloud'
  if (path.includes('/doctor/open-lab')) return 'lab'
  if (path.includes('/doctor/research')) return 'research-home'

  return 'workbench-home'
})
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
  grid-template-columns: 420px 1fr 500px;
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
  background: linear-gradient(135deg, #2563eb, #0ea5e9);
  color: #fff;
  font-size: 22px;
  font-weight: 800;
  box-shadow: 0 10px 24px rgba(37, 99, 235, 0.18);
  flex-shrink: 0;
}

.brand-text {
  min-width: 0;
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
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px;
  border-radius: 18px;
  background: rgba(237, 245, 255, 0.9);
  border: 1px solid #d9e6f2;
}

.main-nav-item {
  height: 44px;
  min-width: 110px;
  padding: 0 24px;
  border: none;
  background: transparent;
  color: #5c7698;
  border-radius: 14px;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.main-nav-item.active {
  background: #ffffff;
  color: #154a8c;
  box-shadow: 0 8px 18px rgba(37, 99, 235, 0.08);
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
  min-width: 220px;
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
  background: linear-gradient(135deg, #2563eb, #06b6d4);
  color: #fff;
  font-size: 12px;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.user-inline {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  min-width: 0;
}

.user-name {
  font-size: 13px;
  font-weight: 700;
  color: #16345b;
  white-space: nowrap;
}

.user-divider,
.user-role {
  font-size: 12px;
  color: #7d97b4;
  white-space: nowrap;
}

.logout-btn {
  height: 40px;
  padding: 0 14px;
  border-radius: 12px;
  border: 1px solid #d8e5f2;
  background: #ffffff;
  color: #5c7698;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  flex-shrink: 0;
  transition: background 0.15s ease, border-color 0.15s ease, color 0.15s ease;
}

.logout-btn:hover {
  background: #fef2f2;
  border-color: #fecaca;
  color: #b91c1c;
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
  background:
      linear-gradient(180deg, rgba(247, 251, 255, 0.95) 0%, rgba(241, 247, 253, 0.95) 100%);
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
  transition: all 0.2s ease;
}

.sidebar-item.active {
  background: linear-gradient(135deg, #edf5ff, #f7fbff);
  border-color: #bfd8f8;
}

.sidebar-item-left {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
}

.sidebar-icon {
  width: 30px;
  height: 30px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #2563eb, #0ea5e9);
  color: #fff;
  font-size: 12px;
  font-weight: 800;
  flex-shrink: 0;
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
  flex-shrink: 0;
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

  .main-nav {
    justify-self: start;
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
