export function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename || 'download'
  a.rel = 'noopener'
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}

export async function downloadFromUrl(url, filename) {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`下载失败 (${res.status})`)
  const blob = await res.blob()
  downloadBlob(blob, filename)
}
