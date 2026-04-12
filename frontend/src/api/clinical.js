import { request } from '../utils/request'

export async function getWorkbenchApi() {
    const res = await request('/clinical/workbench')
    return res.data
}
