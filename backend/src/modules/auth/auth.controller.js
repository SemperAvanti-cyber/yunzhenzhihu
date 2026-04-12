import { getCurrentUser, login } from './auth.service.js'
import { assertLoginBody } from './auth.validator.js'

export async function loginController(req, res, next) {
    try {
        assertLoginBody(req.body)
        const { username, password, roleType } = req.body

        const result = await login({
            username,
            password,
            roleType,
            ipAddress: req.ip,
            userAgent: req.headers['user-agent'] || ''
        })

        res.json({
            success: true,
            message: '登录成功',
            data: result
        })
    } catch (error) {
        next(error)
    }
}

export async function meController(req, res, next) {
    try {
        const user = await getCurrentUser(req.user.id)
        res.json({
            success: true,
            message: '获取当前用户成功',
            data: user
        })
    } catch (error) {
        next(error)
    }
}
