import {
    getAdminOverviewService,
    getAdminAccountsService,
    updateAccountStatusService,
    toggleResearchAccessService,
    getApprovalBoardService,
    reviewApprovalService,
    getAuditLogBoardService
} from './admin.service.js'

export async function getAdminOverviewController(req, res, next) {
    try {
        const data = await getAdminOverviewService({
            currentUser: req.user,
            scope: req.query.scope || 'hospital'
        })

        res.json({
            success: true,
            message: '获取后台总览成功',
            data
        })
    } catch (error) {
        next(error)
    }
}

export async function getAdminAccountsController(req, res, next) {
    try {
        const data = await getAdminAccountsService({
            currentUser: req.user,
            keyword: req.query.keyword || '',
            departmentId: req.query.departmentId ? Number(req.query.departmentId) : null,
            status: req.query.status || 'ALL',
            userId: req.query.userId ? Number(req.query.userId) : null
        })

        res.json({
            success: true,
            message: '获取账号管理数据成功',
            data
        })
    } catch (error) {
        next(error)
    }
}

export async function updateAccountStatusController(req, res, next) {
    try {
        const data = await updateAccountStatusService({
            currentUser: req.user,
            targetUserId: Number(req.params.id),
            accountStatus: req.body.accountStatus
        })

        res.json({
            success: true,
            message: '账号状态更新成功',
            data
        })
    } catch (error) {
        next(error)
    }
}

export async function toggleResearchAccessController(req, res, next) {
    try {
        const data = await toggleResearchAccessService({
            currentUser: req.user,
            targetUserId: Number(req.params.id),
            hasResearchAccess: req.body.hasResearchAccess
        })

        res.json({
            success: true,
            message: '科研权限更新成功',
            data
        })
    } catch (error) {
        next(error)
    }
}

export async function getApprovalBoardController(req, res, next) {
    try {
        const data = await getApprovalBoardService({
            currentUser: req.user,
            approvalId: req.query.approvalId ? Number(req.query.approvalId) : null,
            type: req.query.type || 'ALL',
            status: req.query.status || 'ALL'
        })

        res.json({
            success: true,
            message: '获取项目合规治理数据成功',
            data
        })
    } catch (error) {
        next(error)
    }
}

export async function reviewApprovalController(req, res, next) {
    try {
        const data = await reviewApprovalService({
            currentUser: req.user,
            approvalId: Number(req.params.id),
            nextStatus: req.body.nextStatus,
            reviewerComment: req.body.reviewerComment || ''
        })

        res.json({
            success: true,
            message: '审批处理成功',
            data
        })
    } catch (error) {
        next(error)
    }
}

export async function getAuditLogBoardController(req, res, next) {
    try {
        const data = await getAuditLogBoardService({
            currentUser: req.user,
            logId: req.query.logId ? Number(req.query.logId) : null,
            keyword: req.query.keyword || '',
            actionType: req.query.actionType || 'ALL',
            riskLevel: req.query.riskLevel || 'ALL'
        })

        res.json({
            success: true,
            message: '获取审计日志数据成功',
            data
        })
    } catch (error) {
        next(error)
    }
}
