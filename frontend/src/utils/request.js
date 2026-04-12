import { API_BASE } from '../api/client.js'

/** 与 VITE_API_BASE 一致的后端根（不含 /api），供原始 fetch、图片 URL 拼接；空串则走当前站点相对路径 */
export const API_ROOT = String(API_BASE || '').replace(/\/$/, '')

function buildUrl(path) {
  const p = path.startsWith('/') ? path : `/${path}`
  const base = String(API_BASE || '').replace(/\/$/, '')
  if (base) return `${base}/api${p}`
  return `/api${p}`
}

/** 网关未就绪或冷启动时偶发 502/503/504，短暂重试 */
const GATEWAY_RETRY = 2
const GATEWAY_RETRY_MS = 350

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms))
}

/**
 * @param {number} [maxRetries] 收到 502/503/504 后的额外重试次数（不含首次请求）
 * @param {number} [stepMs] 退避基数：第 n 次重试前等待 stepMs * n
 */
async function fetchWithGatewayRetry(url, init, maxRetries = GATEWAY_RETRY, stepMs = GATEWAY_RETRY_MS) {
  let res = await fetch(url, init)
  for (let i = 0; i < maxRetries; i++) {
    if (![502, 503, 504].includes(res.status)) break
    await sleep(stepMs * (i + 1))
    res = await fetch(url, init)
  }
  return res
}

/**
 * @param {string} path 如 /auth/login（不含 /api 前缀）
 * @param {RequestInit} [options]
 */
export async function request(path, options = {}) {
  const token =
    typeof localStorage !== 'undefined' ? localStorage.getItem('token') : null

  const gatewayRetries =
    typeof options.__gatewayRetries === 'number' ? options.__gatewayRetries : GATEWAY_RETRY
  const gatewayRetryStepMs =
    typeof options.__gatewayRetryStepMs === 'number'
      ? options.__gatewayRetryStepMs
      : GATEWAY_RETRY_MS

  const { __gatewayRetries: _r, __gatewayRetryStepMs: _s, ...fetchOpts } = options

  const headers = {
    ...fetchOpts.headers,
  }
  const body = fetchOpts.body
  const isForm = body instanceof FormData
  if (!isForm) {
    headers['Content-Type'] = headers['Content-Type'] ?? 'application/json'
  }
  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  const res = await fetchWithGatewayRetry(
    buildUrl(path),
    { ...fetchOpts, headers },
    gatewayRetries,
    gatewayRetryStepMs
  )
  const data = await res.json().catch(() => ({}))

  if (!res.ok) {
    throw new Error(data.message || data.error || `请求失败 (${res.status})`)
  }
  if (data && data.success === false && data.message) {
    throw new Error(data.message)
  }
  return data
}
