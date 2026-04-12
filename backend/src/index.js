import http from 'node:http'

const server = http.createServer((req, res) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8')
  res.end(JSON.stringify({ ok: true, message: 'API 占位，可在此接入路由与数据库' }))
})

const port = Number(process.env.PORT) || 3000
server.listen(port, () => {
  console.log(`http://localhost:${port}`)
})
