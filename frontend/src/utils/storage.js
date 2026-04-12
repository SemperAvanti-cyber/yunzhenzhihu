const hasWindow = typeof window !== 'undefined'

export const storage = {
  get(key) {
    if (!hasWindow) return null
    try {
      return window.localStorage.getItem(key)
    } catch {
      return null
    }
  },
  set(key, value) {
    if (!hasWindow) return
    try {
      window.localStorage.setItem(key, value)
    } catch {
      /* ignore */
    }
  },
  remove(key) {
    if (!hasWindow) return
    try {
      window.localStorage.removeItem(key)
    } catch {
      /* ignore */
    }
  },
  getJson(key) {
    const raw = this.get(key)
    if (!raw) return null
    try {
      return JSON.parse(raw)
    } catch {
      return null
    }
  },
  setJson(key, value) {
    this.set(key, JSON.stringify(value))
  },
}
