import { createRouter, createWebHistory } from 'vue-router'

import EntryPortal from '../views/EntryPortal.vue'
import DoctorLayout from '../layouts/DoctorLayout.vue'
import AdminLayout from '../layouts/AdminLayout.vue'

import DoctorWorkbench from '../views/doctor/DoctorWorkbench.vue'
import AIDiagnosis from '../views/doctor/AIDiagnosis.vue'
import MyRecords from '../views/doctor/MyRecords.vue'
import ReferralCenter from '../views/doctor/ReferralCenter.vue'
import ResearchEntry from '../views/doctor/ResearchEntry.vue'
import MyProjects from '../views/doctor/MyProjects.vue'
import CollaborationRecruit from '../views/doctor/CollaborationRecruit.vue'
import ImagingCloud from '../views/doctor/ImagingCloud.vue'
import OpenLab from '../views/doctor/OpenLab.vue'

import AdminDashboard from '../views/admin/AdminDashboard.vue'
import AccountManage from '../views/admin/AccountManage.vue'
import PermissionApproval from '../views/admin/PermissionApproval.vue'
import ConsultationApproval from '../views/admin/ConsultationApproval.vue'
import AuditLog from '../views/admin/AuditLog.vue'
import SystemSecurity from '../views/admin/SystemSecurity.vue'

import { doctorResearchProfile } from '../mock/doctor'

const routes = [
  {
    path: '/',
    redirect: '/portal'
  },
  {
    path: '/portal',
    name: 'portal',
    component: EntryPortal,
    meta: { title: '系统入口' }
  },
  {
    path: '/doctor',
    component: DoctorLayout,
    redirect: '/doctor/workbench',
    children: [
      {
        path: 'workbench',
        name: 'doctor-workbench',
        component: DoctorWorkbench,
        meta: { title: '工作台' }
      },
      {
        path: 'diagnosis',
        name: 'doctor-diagnosis',
        component: AIDiagnosis,
        meta: { title: 'AI辅助诊断' }
      },
      {
        path: 'records',
        name: 'doctor-records',
        component: MyRecords,
        meta: { title: '我的病例' }
      },
      {
        path: 'referral',
        name: 'doctor-referral',
        component: ReferralCenter,
        meta: { title: '分级诊疗' }
      },
      {
        path: 'research',
        name: 'doctor-research',
        component: ResearchEntry,
        meta: { title: '科研中心' }
      },
      {
        path: 'research/projects',
        name: 'doctor-research-projects',
        component: MyProjects,
        meta: { title: '我的项目', requiresResearchAccess: true }
      },
      {
        path: 'research/recruit',
        name: 'doctor-research-recruit',
        component: CollaborationRecruit,
        meta: { title: '协作招募', requiresResearchAccess: true }
      },
      {
        path: 'imaging-cloud',
        name: 'doctor-imaging-cloud',
        component: ImagingCloud,
        meta: { title: '影像云平台', requiresResearchAccess: true }
      },
      {
        path: 'open-lab',
        name: 'doctor-open-lab',
        component: OpenLab,
        meta: { title: '开放实验平台', requiresResearchAccess: true }
      }
    ]
  },
  {
    path: '/admin',
    component: AdminLayout,
    redirect: '/admin/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'admin-dashboard',
        component: AdminDashboard,
        meta: { title: '管理员首页' }
      },
      {
        path: 'accounts',
        name: 'admin-accounts',
        component: AccountManage,
        meta: { title: '账号管理' }
      },
      {
        path: 'permissions',
        name: 'admin-permissions',
        component: PermissionApproval,
        meta: { title: '项目合规与数据治理' }
      },
      {
        path: 'consultation',
        name: 'admin-consultation',
        component: ConsultationApproval,
        meta: { title: '跨院远程会诊审批' }
      },
      {
        path: 'audit',
        name: 'admin-audit',
        component: AuditLog,
        meta: { title: '审计日志' }
      },
      {
        path: 'security',
        name: 'admin-security',
        component: SystemSecurity,
        meta: { title: '系统安全' }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  }
})

function hasResearchAccess() {
  const storageStatus = window.localStorage.getItem('researchAccessStatus')

  if (storageStatus === 'approved') return true
  if (storageStatus === 'pending' || storageStatus === 'rejected') return false

  return doctorResearchProfile.hasResearchAccess === true
}

router.beforeEach((to) => {
  if (to.meta?.requiresResearchAccess && !hasResearchAccess()) {
    return { name: 'doctor-research' }
  }

  return true
})

router.afterEach((to) => {
  document.title = to.meta?.title ? `${to.meta.title} - 一肤当关` : '一肤当关'
})

export default router
