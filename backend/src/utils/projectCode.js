export function generateProjectCode(seq = 1, year = new Date().getFullYear()) {
  return `PRJ-${year}-${String(seq).padStart(3, '0')}`
}
