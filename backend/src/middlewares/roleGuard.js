export function roleGuard(allowedRoles = []) {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: '未登录',
                errorCode: 'UNAUTHORIZED'
            })
        }

        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: '无权限访问该资源',
                errorCode: 'FORBIDDEN'
            })
        }

        next()
    }
}
