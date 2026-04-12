export function generateApprovalCode(seq = 1, year = new Date().getFullYear()) {
  return `APR-${year}-${String(seq).padStart(4, '0')}`
}
