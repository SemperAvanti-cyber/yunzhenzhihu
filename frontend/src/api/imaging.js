import { request, API_ROOT } from '../utils/request'

export async function getImagingCloudBoardApi(params = {}) {
    const query = new URLSearchParams(params).toString()
    const res = await request(`/imaging/cloud-board${query ? `?${query}` : ''}`)
    return res.data
}

export async function confirmImageQcApi(imageId) {
    const res = await request(`/imaging/${imageId}/qc-confirm`, {
        method: 'POST'
    })
    return res.data
}

export function getBackendFileUrl(url = '') {
    if (!url) return ''
    if (url.startsWith('http')) return url
    return `${API_ROOT}${url}`
}
