import { verifyToken } from '../utils/token.js'

export function authGuard(req, res, next) {
    try {
        const authHeader = req.headers.authorization || ''
        const token = authHeader.startsWith('Bearer ')
            ? authHeader.slice(7)
            : null

        if (!token) {
            return res.status(401).json({
                success: false,
                message: '未登录或登录已失效',
                errorCode: 'UNAUTHORIZED'
            })
        }

        const decoded = verifyToken(token)
        req.user = decoded
        next()
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: '登录状态无效，请重新登录',
            errorCode: 'INVALID_TOKEN'
        })
    }
}
