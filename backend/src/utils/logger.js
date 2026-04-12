import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const rootDir = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', '..')
const logsDir = path.join(rootDir, 'logs')
const appLogPath = path.join(logsDir, 'app.log')
const errorLogPath = path.join(logsDir, 'error.log')

async function ensureLogsDir() {
  await fs.mkdir(logsDir, { recursive: true })
}

function line(level, msg) {
  return `[${new Date().toISOString()}] [${level}] ${msg}\n`
}

export async function logInfo(msg) {
  await ensureLogsDir()
  await fs.appendFile(appLogPath, line('INFO', msg))
}

export async function logError(msg, err) {
  await ensureLogsDir()
  const detail = err && err.stack ? `${msg} ${err.stack}` : `${msg} ${err ?? ''}`
  await fs.appendFile(errorLogPath, line('ERROR', detail))
}
