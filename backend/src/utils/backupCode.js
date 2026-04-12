export function generateBackupCode(seq = 1, year = new Date().getFullYear()) {
  return `BK-${year}-${String(seq).padStart(3, '0')}`
}
