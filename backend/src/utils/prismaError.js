import { Prisma } from '@prisma/client'

/**
 * 将 Prisma / 数据库底层错误转换为用户可读文案（不暴露长堆栈与内部细节）
 */
export function toClientDbMessage(err) {
  if (!err) return '服务器错误'

  if (err instanceof Prisma.PrismaClientInitializationError) {
    return '数据库连接失败，请确认 MySQL 已启动，并正确配置 backend/.env 中的 DATABASE_URL'
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P1000') {
      return '数据库登录失败：用户名或密码错误，请修改 DATABASE_URL，勿再使用占位符 USER、PASSWORD'
    }
    if (err.code === 'P1001' || err.code === 'P1017') {
      return '无法连接数据库服务器，请检查地址、端口以及 MySQL 是否已启动'
    }
    if (err.code === 'P1003') {
      return '数据库不存在，请先创建库并执行 npx prisma db push 或迁移命令'
    }
  }

  const raw = String(err.message || '')

  if (/Invalid `prisma\./.test(raw)) {
    if (/Authentication failed|provided database credentials|not valid/i.test(raw)) {
      return '数据库账号或密码不正确。请在 backend/.env 的 DATABASE_URL 中填写本机 MySQL 真实用户名与密码'
    }
    if (/Can't reach database server|ECONNREFUSED/i.test(raw)) {
      return '无法连接到数据库，请确认 MySQL 服务已启动且地址端口正确'
    }
    if (/Unknown database/i.test(raw)) {
      return '数据库不存在，请先创建数据库并同步表结构（prisma db push / migrate）'
    }
    return '数据服务暂时不可用，请检查数据库配置后重试'
  }

  return raw || '服务器错误'
}
