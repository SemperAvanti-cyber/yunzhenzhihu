export function generatePatientCode(seq = 1, year = new Date().getFullYear()) {
  return `PAT-${year}-${String(seq).padStart(3, '0')}`
}
