/** 生成病例编码占位（接入序列表后替换） */
export function generateCaseCode(seq = 1, year = new Date().getFullYear()) {
  return `CASE-${year}-${String(seq).padStart(4, '0')}`
}
