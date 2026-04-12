/**
 * 认证状态占位：当前仍由页面直接读写 localStorage。
 * 接入 Pinia 后可改为 defineStore('auth', …)
 */
import { storage } from '../utils/storage'

export const AUTH_KEYS = Object.freeze({
  token: 'token',
  authUser: 'authUser',
  researchAccessStatus: 'researchAccessStatus',
})

export function getToken() {
  return storage.get(AUTH_KEYS.token)
}

export function getAuthUser() {
  return storage.getJson(AUTH_KEYS.authUser)
}

export function clearAuth() {
  storage.remove(AUTH_KEYS.token)
  storage.remove(AUTH_KEYS.authUser)
  storage.remove(AUTH_KEYS.researchAccessStatus)
}

/**
 * 清除本地登录态并回到门户（JWT 无服务端会话时可仅前端清理）
 * @param {import('vue-router').Router | null} router
 */
export function logout(router) {
  clearAuth()
  if (router && typeof router.replace === 'function') {
    router.replace({ name: 'portal' })
    return
  }
  if (typeof window !== 'undefined') {
    window.location.replace('/portal')
  }
}
