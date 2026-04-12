export function sendOk(res, data, message = '成功') {
  res.json({ success: true, message, data })
}

export function sendFail(res, status, message, extra = {}) {
  res.status(status).json({ success: false, message, ...extra })
}
