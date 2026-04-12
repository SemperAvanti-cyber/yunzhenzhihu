import bcrypt from 'bcryptjs'

export async function hashPassword(plain, rounds = 10) {
  return bcrypt.hash(plain, rounds)
}

export async function comparePassword(plain, hash) {
  return bcrypt.compare(plain, hash)
}
