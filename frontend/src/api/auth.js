import { request } from '../utils/request'

export async function loginApi(payload) {
  const res = await request('/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
    // 后端 / 代理冷启动时首包易 502，仅登录多等几次，其它接口仍用默认重试
    __gatewayRetries: 5,
    __gatewayRetryStepMs: 400
  })
  if (!res?.data?.token) {
    throw new Error(res?.message || '登录响应异常，请检查后端服务')
  }
  return res.data
}

export async function getMeApi() {
  const res = await request('/auth/me')
  return res.data
}
