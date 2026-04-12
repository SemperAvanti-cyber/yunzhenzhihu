import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import app from './app.js'
import { env } from './config/env.js'
import { logInfo } from './utils/logger.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
fs.mkdirSync(path.join(__dirname, '..', 'logs'), { recursive: true })

app.listen(env.port, () => {
  const msg = `API http://localhost:${env.port}`
  console.log(msg)
  logInfo(msg).catch(() => {})
})