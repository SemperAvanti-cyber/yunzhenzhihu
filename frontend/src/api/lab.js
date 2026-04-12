import { request } from '../utils/request'

export async function getOpenLabBoardApi(params = {}) {
    const query = new URLSearchParams(params).toString()
    const res = await request(`/lab/open-lab${query ? `?${query}` : ''}`)
    return res.data
}

export async function createExperimentRunApi(payload) {
    const res = await request('/lab/experiments', {
        method: 'POST',
        body: JSON.stringify(payload)
    })
    return res.data
}

export async function updateExperimentRunApi(experimentId, payload) {
    const res = await request(`/lab/experiments/${experimentId}/update`, {
        method: 'POST',
        body: JSON.stringify(payload)
    })
    return res.data
}
