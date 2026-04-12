export function assertLoginBody(body) {
  if (!body || typeof body !== 'object') {
    const err = new Error('无效的请求体')
    err.statusCode = 400
    throw err
  }
  return body
}
