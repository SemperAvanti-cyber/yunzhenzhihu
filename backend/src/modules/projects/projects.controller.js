import { getMyProjectsService } from './projects.service.js'

export async function getMyProjectsController(req, res, next) {
    try {
        const data = await getMyProjectsService({
            currentUser: req.user,
            selectedProjectId: req.query.projectId ? Number(req.query.projectId) : null
        })

        res.json({
            success: true,
            message: '获取我的项目成功',
            data
        })
    } catch (error) {
        next(error)
    }
}
