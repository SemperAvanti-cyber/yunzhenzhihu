import prisma from '../../utils/prisma.js'
import { comparePassword } from '../../utils/password.js'
import { signToken } from '../../utils/token.js'

function buildUserPayload(user) {
    return {
        id: user.id,
        username: user.username,
        realName: user.realName,
        role: user.role,
        hasResearchAccess: user.hasResearchAccess,
        hospitalId: user.hospitalId,
        departmentId: user.departmentId
    }
}

export async function login({ username, password, roleType, ipAddress, userAgent }) {
    const name = typeof username === 'string' ? username.trim() : ''
    const pwd = typeof password === 'string' ? password : ''
    if (!name || !pwd) {
        throw new Error('请输入账号和密码')
    }

    const user = await prisma.user.findFirst({
        where: {
            OR: [{ username: name }, { email: name }]
        },
        include: {
            hospital: true,
            department: true
        }
    })

    if (!user) {
        await prisma.loginLog.create({
            data: {
                username: name,
                roleAttempt: roleType,
                ipAddress,
                userAgent,
                result: 'FAILED',
                reason: '用户不存在'
            }
        })
        throw new Error('账号或密码错误')
    }

    if (!user.isActive) {
        await prisma.loginLog.create({
            data: {
                userId: user.id,
                username: name,
                roleAttempt: roleType,
                ipAddress,
                userAgent,
                result: 'LOCKED',
                reason: '账号已停用'
            }
        })
        throw new Error('账号已停用')
    }

    const matched = await comparePassword(pwd, user.passwordHash)
    if (!matched) {
        await prisma.loginLog.create({
            data: {
                userId: user.id,
                username: name,
                roleAttempt: roleType,
                ipAddress,
                userAgent,
                result: 'FAILED',
                reason: '密码错误'
            }
        })
        throw new Error('账号或密码错误')
    }

    const isDoctorLogin = roleType === 'doctor'
    const isAdminLogin = roleType === 'admin'

    if (isDoctorLogin && user.role !== 'DOCTOR') {
        throw new Error('该账号不是医生端账号')
    }

    if (isAdminLogin && user.role === 'DOCTOR') {
        throw new Error('该账号不是管理员端账号')
    }

    const tokenPayload = buildUserPayload(user)

    const token = signToken(tokenPayload)

    await prisma.user.update({
        where: { id: user.id },
        data: { lastLoginAt: new Date() }
    })

    await prisma.loginLog.create({
        data: {
            userId: user.id,
            username: name,
            roleAttempt: roleType,
            ipAddress,
            userAgent,
            result: 'SUCCESS'
        }
    })

    await prisma.auditLog.create({
        data: {
            userId: user.id,
            actorName: user.realName,
            actorRole: user.role,
            actionType: 'LOGIN',
            targetType: 'AUTH',
            targetId: String(user.id),
            detail: `${roleType} 端登录成功`,
            ipAddress
        }
    })

    return {
        token,
        user: {
            ...tokenPayload,
            hospitalName: user.hospital?.name || '',
            departmentName: user.department?.name || ''
        }
    }
}

export async function getCurrentUser(userId) {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
            hospital: true,
            department: true
        }
    })

    if (!user) {
        throw new Error('用户不存在')
    }

    return {
        id: user.id,
        username: user.username,
        realName: user.realName,
        role: user.role,
        hasResearchAccess: user.hasResearchAccess,
        hospitalId: user.hospitalId,
        departmentId: user.departmentId,
        hospitalName: user.hospital?.name || '',
        departmentName: user.department?.name || ''
    }
}
