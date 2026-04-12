import { request } from '../utils/request'

export async function getAdminOverviewApi(params = {}) {
  const query = new URLSearchParams(params).toString()
  const res = await request(`/admin/overview${query ? `?${query}` : ''}`)
  return res.data
}

export async function getAdminAccountsApi(params = {}) {
  const query = new URLSearchParams(params).toString()
  const res = await request(`/admin/accounts${query ? `?${query}` : ''}`)
  return res.data
}

export async function updateAccountStatusApi(userId, accountStatus) {
  const res = await request(`/admin/accounts/${userId}/status`, {
    method: 'POST',
    body: JSON.stringify({ accountStatus })
  })
  return res.data
}

export async function toggleResearchAccessApi(userId, hasResearchAccess) {
  const res = await request(`/admin/accounts/${userId}/research-access`, {
    method: 'POST',
    body: JSON.stringify({ hasResearchAccess })
  })
  return res.data
}

export async function getApprovalBoardApi(params = {}) {
  const query = new URLSearchParams(params).toString()
  const res = await request(`/admin/approvals${query ? `?${query}` : ''}`)
  return res.data
}

export async function reviewApprovalApi(approvalId, payload) {
  const res = await request(`/admin/approvals/${approvalId}/review`, {
    method: 'POST',
    body: JSON.stringify(payload)
  })
  return res.data
}

export async function getAuditLogBoardApi(params = {}) {
  const query = new URLSearchParams(params).toString()
  const res = await request(`/admin/audit-logs${query ? `?${query}` : ''}`)
  return res.data
}
