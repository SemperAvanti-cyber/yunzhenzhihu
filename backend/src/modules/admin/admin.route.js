import { Router } from 'express'
import { authGuard } from '../../middlewares/authGuard.js'
import {
    getAdminOverviewController,
    getAdminAccountsController,
    updateAccountStatusController,
    toggleResearchAccessController,
    getApprovalBoardController,
    reviewApprovalController,
    getAuditLogBoardController
} from './admin.controller.js'

const router = Router()

router.get('/overview', authGuard, getAdminOverviewController)

router.get('/accounts', authGuard, getAdminAccountsController)
router.post('/accounts/:id/status', authGuard, updateAccountStatusController)
router.post('/accounts/:id/research-access', authGuard, toggleResearchAccessController)

router.get('/approvals', authGuard, getApprovalBoardController)
router.post('/approvals/:id/review', authGuard, reviewApprovalController)

router.get('/audit-logs', authGuard, getAuditLogBoardController)

export default router
