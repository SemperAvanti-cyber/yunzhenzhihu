import { request, API_ROOT } from '../utils/request'

export async function getDiagnosisWorkspaceApi(params = {}) {
  const query = new URLSearchParams(params).toString()
  const res = await request(`/diagnosis/workspace${query ? `?${query}` : ''}`)
  return res.data
}

export async function confirmAiDiagnosisApi(caseId, payload) {
  const res = await request(`/diagnosis/${caseId}/confirm-ai`, {
    method: 'POST',
    body: JSON.stringify(payload)
  })
  return res.data
}

export async function reviseDiagnosisApi(caseId, payload) {
  const res = await request(`/diagnosis/${caseId}/revise`, {
    method: 'POST',
    body: JSON.stringify(payload)
  })
  return res.data
}

export function getDiagnosisExportUrl(caseId) {
  const token = window.localStorage.getItem('token')
  const authQuery = token ? `?token=${encodeURIComponent(token)}` : ''
  return `${API_ROOT}/api/diagnosis/${caseId}/export-report${authQuery}`
}

export function getBackendFileUrl(url = '') {
  if (!url) return ''
  if (url.startsWith('http')) return url
  return `${API_ROOT}${url}`
}
