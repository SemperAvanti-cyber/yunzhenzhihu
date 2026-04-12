import { request, API_ROOT } from '../utils/request'

export async function getMyRecordsBoardApi(params = {}) {
    const query = new URLSearchParams(params).toString()
    const res = await request(`/cases/my-records${query ? `?${query}` : ''}`)
    return res.data
}

export async function uploadFollowUpImageApi(caseId, formData) {
    const token = window.localStorage.getItem('token')
    const res = await fetch(`${API_ROOT}/api/cases/${caseId}/follow-up-upload`, {
        method: 'POST',
        headers: {
            Authorization: token ? `Bearer ${token}` : ''
        },
        body: formData
    })

    const data = await res.json()
    if (!res.ok || data.success === false) {
        throw new Error(data.message || '上传失败')
    }
    return data.data
}

export function getBackendFileUrl(url = '') {
    if (!url) return ''
    if (url.startsWith('http')) return url
    return `${API_ROOT}${url}`
}
