export function generateImageCode(prefix = 'IMG', seq = 1) {
  return `${prefix}-${String(seq).padStart(5, '0')}`
}
