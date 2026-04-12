import { request, API_ROOT } from '../utils/request'

export async function getReferralBoardApi(params = {}) {
    const query = new URLSearchParams(params).toString()
    const res = await request(`/referrals/center${query ? `?${query}` : ''}`)
    return res.data
}

export async function createReferralApi(payload) {
    const res = await request('/referrals', {
        method: 'POST',
        body: JSON.stringify(payload)
    })
    return res.data
}

export async function acknowledgeReferralApi(referralId) {
    const res = await request(`/referrals/${referralId}/acknowledge`, {
        method: 'POST'
    })
    return res.data
}

export function getBackendFileUrl(url = '') {
    if (!url) return ''
    if (url.startsWith('http')) return url
    return `${API_ROOT}${url}`
}
