import {
    getResearchOverviewService,
    submitProjectRegistrationService
} from './research.service.js'

export async function getResearchOverviewController(req, res, next) {
    try {
        const data = await getResearchOverviewService({
            currentUser: req.user
        })

        res.json({
            success: true,
            message: '获取科研总览成功',
            data
        })
    } catch (error) {
        next(error)
    }
}

export async function submitProjectRegistrationController(req, res, next) {
    try {
        const data = await submitProjectRegistrationService({
            currentUser: req.user,
            payload: req.body
        })

        res.json({
            success: true,
            message: '项目登记申请已提交',
            data
        })
    } catch (error) {
        next(error)
    }
}
