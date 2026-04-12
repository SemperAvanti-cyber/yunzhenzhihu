import { request } from '../utils/request'

export async function getMyProjectsApi(params = {}) {
    const query = new URLSearchParams(params).toString()
    const res = await request(`/projects/my-projects${query ? `?${query}` : ''}`)
    return res.data
}
