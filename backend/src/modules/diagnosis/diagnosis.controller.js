import {
    getDiagnosisWorkspaceService,
    confirmAiDiagnosisService,
    reviseDiagnosisService,
    exportDiagnosisReportService
} from './diagnosis.service.js'

export async function getDiagnosisWorkspaceController(req, res, next) {
    try {
        const data = await getDiagnosisWorkspaceService({
            currentUser: req.user,
            caseId: req.query.caseId ? Number(req.query.caseId) : null,
            imageId: req.query.imageId ? Number(req.query.imageId) : null
        })

        res.json({
            success: true,
            message: '获取影像诊断工作区成功',
            data
        })
    } catch (error) {
        next(error)
    }
}

export async function confirmAiDiagnosisController(req, res, next) {
    try {
        const data = await confirmAiDiagnosisService({
            currentUser: req.user,
            caseId: Number(req.params.caseId),
            payload: req.body
        })

        res.json({
            success: true,
            message: '已确认辅助结论',
            data
        })
    } catch (error) {
        next(error)
    }
}

export async function reviseDiagnosisController(req, res, next) {
    try {
        const data = await reviseDiagnosisService({
            currentUser: req.user,
            caseId: Number(req.params.caseId),
            payload: req.body
        })

        res.json({
            success: true,
            message: '医生修正判断已保存',
            data
        })
    } catch (error) {
        next(error)
    }
}

export async function exportDiagnosisReportController(req, res, next) {
    try {
        const result = await exportDiagnosisReportService({
            currentUser: req.user,
            caseId: Number(req.params.caseId)
        })

        res.setHeader('Content-Type', 'text/plain; charset=utf-8')
        res.setHeader(
            'Content-Disposition',
            `attachment; filename="${encodeURIComponent(result.fileName)}"`
        )
        res.send(result.content)
    } catch (error) {
        next(error)
    }
}
