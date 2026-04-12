export function generateReferralCode(seq = 1, year = new Date().getFullYear()) {
  return `REF-${year}-${String(seq).padStart(4, '0')}`
}
