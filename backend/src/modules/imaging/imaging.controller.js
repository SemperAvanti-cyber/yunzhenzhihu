import {
    getImagingCloudBoardService,
    confirmImageQcService
} from './imaging.service.js'

export async function getImagingCloudBoardController(req, res, next) {
    try {
        const data = await getImagingCloudBoardService({
            currentUser: req.user,
            projectId: req.query.projectId ? Number(req.query.projectId) : null,
            taskId: req.query.taskId ? Number(req.query.taskId) : null,
            caseId: req.query.caseId ? Number(req.query.caseId) : null,
            imageId: req.query.imageId ? Number(req.query.imageId) : null,
            modality: req.query.modality || 'ALL'
        })

        res.json({
            success: true,
            message: '获取影像云平台数据成功',
            data
        })
    } catch (error) {
        next(error)
    }
}

export async function confirmImageQcController(req, res, next) {
    try {
        const data = await confirmImageQcService({
            currentUser: req.user,
            imageId: Number(req.params.imageId)
        })

        res.json({
            success: true,
            message: '影像质控已确认通过',
            data
        })
    } catch (error) {
        next(error)
    }
}
