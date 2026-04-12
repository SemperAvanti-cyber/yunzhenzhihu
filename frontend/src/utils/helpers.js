import {
  ADMIN_ROLE,
  ADMIN_ROLE_LABEL,
  APPROVAL_STATUS,
  APPROVAL_STATUS_LABEL,
  AUDIT_RISK_LEVEL,
  AUDIT_RISK_LABEL
} from './constants'

export function getAdminRoleFromQuery(queryRole) {
  if (
      queryRole === ADMIN_ROLE.HOSPITAL ||
      queryRole === ADMIN_ROLE.RESEARCH ||
      queryRole === ADMIN_ROLE.SECURITY
  ) {
    return queryRole
  }
  return ADMIN_ROLE.HOSPITAL
}

export function getAdminRoleLabel(role) {
  return ADMIN_ROLE_LABEL[role] || ADMIN_ROLE_LABEL[ADMIN_ROLE.HOSPITAL]
}

export function getApprovalStatusLabel(status) {
  return APPROVAL_STATUS_LABEL[status] || APPROVAL_STATUS_LABEL[APPROVAL_STATUS.PENDING]
}

export function getAuditRiskLabel(level) {
  return AUDIT_RISK_LABEL[level] || AUDIT_RISK_LABEL[AUDIT_RISK_LEVEL.INFO]
}

export function withAdminRoleQuery(path, role) {
  return {
    path,
    query: {
      role: getAdminRoleFromQuery(role)
    }
  }
}

export function formatPercent(value) {
  if (value === null || value === undefined || value === '') return '--'
  const num = Number(value)
  if (Number.isNaN(num)) return '--'
  return `${num}%`
}

export function safeText(value, fallback = '--') {
  if (value === null || value === undefined || value === '') return fallback
  return String(value)
}
