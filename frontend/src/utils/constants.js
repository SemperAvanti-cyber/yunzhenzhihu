export const AI_TRIAGE_THRESHOLD = {
  LOW_RISK_MAX: 29,
  DOCTOR_REVIEW_MIN: 30,
  DOCTOR_REVIEW_MAX: 69,
  REFERRAL_MIN: 70
}

export const AI_TRIAGE_TEXT = {
  LOW: '恶性概率 < 30%，由 AI 提供健康指导',
  REVIEW: '恶性概率 ≥ 30%，自动进入医生复核',
  REFERRAL: '恶性概率 ≥ 70%，强制触发分级转诊'
}

export const USER_TERMINAL = {
  DOCTOR: 'doctor',
  ADMIN: 'admin'
}

export const ADMIN_ROLE = {
  HOSPITAL: 'hospital',
  RESEARCH: 'research',
  SECURITY: 'security'
}

export const ADMIN_ROLE_LABEL = {
  [ADMIN_ROLE.HOSPITAL]: '医院管理员',
  [ADMIN_ROLE.RESEARCH]: '科研合规管理员',
  [ADMIN_ROLE.SECURITY]: '安全审计管理员'
}

export const ADMIN_ROLE_SCOPE = {
  [ADMIN_ROLE.HOSPITAL]: '账号管理、院内协同、跨院远程会诊行政流转',
  [ADMIN_ROLE.RESEARCH]: '项目立项审核、伦理核验、数据导出审批、脱敏抽检',
  [ADMIN_ROLE.SECURITY]: '审计日志、安全告警、备份恢复、导出追溯'
}

export const PROJECT_ROLE = {
  OWNER: 'project_owner',
  MEMBER: 'project_member'
}

export const PROJECT_ROLE_LABEL = {
  [PROJECT_ROLE.OWNER]: '项目负责人',
  [PROJECT_ROLE.MEMBER]: '项目成员'
}

export const APPROVAL_STATUS = {
  PENDING: 'pending',
  IN_REVIEW: 'in_review',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  NEED_SUPPLEMENT: 'need_supplement'
}

export const APPROVAL_STATUS_LABEL = {
  [APPROVAL_STATUS.PENDING]: '待审核',
  [APPROVAL_STATUS.IN_REVIEW]: '审核中',
  [APPROVAL_STATUS.APPROVED]: '已通过',
  [APPROVAL_STATUS.REJECTED]: '已驳回',
  [APPROVAL_STATUS.NEED_SUPPLEMENT]: '待补材料'
}

export const AUDIT_RISK_LEVEL = {
  INFO: 'info',
  WARNING: 'warning',
  DANGER: 'danger'
}

export const AUDIT_RISK_LABEL = {
  [AUDIT_RISK_LEVEL.INFO]: '普通',
  [AUDIT_RISK_LEVEL.WARNING]: '警告',
  [AUDIT_RISK_LEVEL.DANGER]: '高危'
}
