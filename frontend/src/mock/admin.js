export const adminRoles = [
  {
    key: 'hospital',
    label: '医院管理员',
    desc: '负责医生账号、科室归属、启停状态以及跨院远程会诊的行政流转确认。'
  },
  {
    key: 'research',
    label: '科研合规管理员',
    desc: '负责项目获批后的登记审核、伦理材料核验、匿名数据导出审批与脱敏抽检。'
  },
  {
    key: 'security',
    label: '安全审计管理员',
    desc: '负责审计日志、安全告警、导出追溯、备份恢复与系统级保障。'
  }
]

export const hospitalAdminMenus = [
  { key: 'dashboard', label: '后台总览', path: '/admin/dashboard' },
  { key: 'accounts', label: '账号管理', path: '/admin/accounts' },
  { key: 'consultation', label: '跨院远程会诊审批', path: '/admin/consultation' }
]

export const researchAdminMenus = [
  { key: 'dashboard', label: '后台总览', path: '/admin/dashboard' },
  { key: 'permissions', label: '项目合规与数据治理', path: '/admin/permissions' }
]

export const securityAdminMenus = [
  { key: 'dashboard', label: '后台总览', path: '/admin/dashboard' },
  { key: 'audit', label: '审计日志', path: '/admin/audit' },
  { key: 'security', label: '系统安全', path: '/admin/security' }
]

export const hospitalConsultationQueue = [
  {
    id: 'RC-2026-041',
    title: '疑似黑色素瘤跨院会诊申请',
    desc: '基层医院申请上级医院专家远程会诊支持。',
    fromHospital: '基层协作门诊',
    toHospital: '自治区皮肤病区域协同中心',
    status: '待审批'
  },
  {
    id: 'RC-2026-038',
    title: '疑难皮损远程会诊',
    desc: '申请外院专家协助判断疑难病例图像表现。',
    fromHospital: '乌鲁木齐市第二人民医院',
    toHospital: '自治区皮肤病区域协同中心',
    status: '流转中'
  }
]

export const researchApprovalQueue = [
  {
    id: 'PRJ-2026-011',
    type: '项目登记',
    title: '银屑病多模态影像研究',
    owner: '张医生',
    status: '待审核'
  },
  {
    id: 'EXP-2041',
    type: '导出审批',
    title: '匿名数据导出申请',
    owner: '李医生',
    status: '审核中'
  },
  {
    id: 'QC-1188',
    type: '脱敏抽检',
    title: '匿名样本质检抽查',
    owner: '系统任务',
    status: '待处理'
  }
]

export const securityAlarmQueue = [
  {
    id: 'AL-2201',
    title: '异常高频访问高敏感样本',
    source: '样本访问监控',
    level: '高危',
    status: '待处理'
  },
  {
    id: 'AL-2188',
    title: '导出链路追溯复核',
    source: '导出审计模块',
    level: '警告',
    status: '处理中'
  }
]

export const adminDashboardStats = [
  {
    label: '活跃管理员账号',
    value: '18',
    trend: '+2',
    type: 'up',
    note: '本周新增 2 个治理岗位账号'
  },
  {
    label: '待处理审批单',
    value: '11',
    trend: '重点',
    type: 'warning',
    note: '含数据治理审批与跨院会诊审批'
  },
  {
    label: '高危安全告警',
    value: '2',
    trend: '需处置',
    type: 'danger',
    note: '建议 30 分钟内完成处置闭环'
  },
  {
    label: '今日审计记录',
    value: '346',
    trend: '+38',
    type: 'up',
    note: '关键操作均已留痕，可追溯'
  }
]

export const adminDashboardTodos = [
  {
    title: '导出审批待复核',
    desc: '3 条匿名数据导出申请待管理员终审。',
    badge: '待处理',
    badgeType: 'warning'
  },
  {
    title: '跨院会诊申请排队',
    desc: '2 条跨院远程会诊申请待流转确认。',
    badge: '进行中',
    badgeType: 'info'
  },
  {
    title: '异常访问告警',
    desc: '检测到 1 条高敏样本异常访问，需要安全管理员处置。',
    badge: '高优先级',
    badgeType: 'danger'
  }
]
