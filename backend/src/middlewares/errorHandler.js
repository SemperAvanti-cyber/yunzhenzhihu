import { toClientDbMessage } from '../utils/prismaError.js'

export function errorHandler(err, _req, res, _next) {
  console.error(err)
  const status =
    typeof err.statusCode === 'number'
      ? err.statusCode
      : typeof err.status === 'number'
        ? err.status
        : 500
  const safe = status >= 400 && status < 600 ? status : 500

  const message =
    safe >= 500 ? toClientDbMessage(err) : err.message || '服务器错误'

  res.status(safe).json({
    success: false,
    message,
  })
}
