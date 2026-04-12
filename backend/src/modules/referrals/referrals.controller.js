import {
    getReferralBoardService,
    createReferralService,
    acknowledgeReferralService
} from './referrals.service.js'

export async function getReferralBoardController(req, res, next) {
    try {
        const data = await getReferralBoardService({
            currentUser: req.user,
            referralId: req.query.referralId ? Number(req.query.referralId) : null,
            caseId: req.query.caseId ? Number(req.query.caseId) : null,
            status: req.query.status || 'ALL'
        })

        res.json({
            success: true,
            message: '获取分级诊疗数据成功',
            data
        })
    } catch (error) {
        next(error)
    }
}

export async function createReferralController(req, res, next) {
    try {
        const data = await createReferralService({
            currentUser: req.user,
            payload: req.body
        })

        res.json({
            success: true,
            message: '申请已提交',
            data
        })
    } catch (error) {
        next(error)
    }
}

export async function acknowledgeReferralController(req, res, next) {
    try {
        const data = await acknowledgeReferralService({
            currentUser: req.user,
            referralId: Number(req.params.id)
        })

        res.json({
            success: true,
            message: '已确认查看回传意见',
            data
        })
    } catch (error) {
        next(error)
    }
}
