import {
    getCollaborationBoardService,
    acceptTaskService,
    updateTaskProgressService
} from './tasks.service.js'

export async function getCollaborationBoardController(req, res, next) {
    try {
        const data = await getCollaborationBoardService({
            currentUser: req.user,
            status: req.query.status || 'ALL'
        })

        res.json({
            success: true,
            message: '获取协作任务成功',
            data
        })
    } catch (error) {
        next(error)
    }
}

export async function acceptTaskController(req, res, next) {
    try {
        const data = await acceptTaskService({
            currentUser: req.user,
            taskId: Number(req.params.taskId)
        })

        res.json({
            success: true,
            message: '任务已接受',
            data
        })
    } catch (error) {
        next(error)
    }
}

export async function updateTaskProgressController(req, res, next) {
    try {
        const data = await updateTaskProgressService({
            currentUser: req.user,
            taskId: Number(req.params.taskId),
            payload: req.body
        })

        res.json({
            success: true,
            message: '任务进度已更新',
            data
        })
    } catch (error) {
        next(error)
    }
}
