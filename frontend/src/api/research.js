import { request } from '../utils/request'

export async function getResearchOverviewApi() {
  const res = await request('/research/overview')
  return res.data
}

export async function submitProjectRegistrationApi(payload) {
  const res = await request('/research/project-registration', {
    method: 'POST',
    body: JSON.stringify(payload)
  })
  return res.data
}
