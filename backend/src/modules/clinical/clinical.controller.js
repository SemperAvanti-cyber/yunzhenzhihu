import { getWorkbenchData } from './clinical.service.js'

export async function getWorkbenchController(req, res, next) {
    try {
        const data = await getWorkbenchData(req.user)

        res.json({
            success: true,
            message: '获取工作台成功',
            data
        })
    } catch (error) {
        next(error)
    }
}
