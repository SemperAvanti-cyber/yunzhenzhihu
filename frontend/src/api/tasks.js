import { request } from '../utils/request'

export async function getCollaborationBoardApi(params = {}) {
    const query = new URLSearchParams(params).toString()
    const res = await request(`/tasks/collaboration-board${query ? `?${query}` : ''}`)
    return res.data
}

export async function acceptTaskApi(taskId) {
    const res = await request(`/tasks/${taskId}/accept`, {
        method: 'POST'
    })
    return res.data
}

export async function updateTaskProgressApi(taskId, payload) {
    const res = await request(`/tasks/${taskId}/progress`, {
        method: 'POST',
        body: JSON.stringify(payload)
    })
    return res.data
}
