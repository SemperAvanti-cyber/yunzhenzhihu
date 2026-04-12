import {
    getOpenLabBoardService,
    createExperimentRunService,
    updateExperimentRunService
} from './lab.service.js'

export async function getOpenLabBoardController(req, res, next) {
    try {
        const data = await getOpenLabBoardService({
            currentUser: req.user,
            projectId: req.query.projectId ? Number(req.query.projectId) : null,
            taskId: req.query.taskId ? Number(req.query.taskId) : null,
            experimentId: req.query.experimentId ? Number(req.query.experimentId) : null
        })

        res.json({
            success: true,
            message: '获取开放实验平台数据成功',
            data
        })
    } catch (error) {
        next(error)
    }
}

export async function createExperimentRunController(req, res, next) {
    try {
        const data = await createExperimentRunService({
            currentUser: req.user,
            payload: req.body
        })

        res.json({
            success: true,
            message: '实验记录已创建',
            data
        })
    } catch (error) {
        next(error)
    }
}

export async function updateExperimentRunController(req, res, next) {
    try {
        const data = await updateExperimentRunService({
            currentUser: req.user,
            experimentId: Number(req.params.id),
            payload: req.body
        })

        res.json({
            success: true,
            message: '实验记录已更新',
            data
        })
    } catch (error) {
        next(error)
    }
}
