import { Router } from 'express'
import { authGuard } from '../../middlewares/authGuard.js'
import { roleGuard } from '../../middlewares/roleGuard.js'
import {
    getDiagnosisWorkspaceController,
    confirmAiDiagnosisController,
    reviseDiagnosisController,
    exportDiagnosisReportController
} from './diagnosis.controller.js'

const router = Router()

router.get(
    '/workspace',
    authGuard,
    roleGuard(['DOCTOR']),
    getDiagnosisWorkspaceController
)

router.post(
    '/:caseId/confirm-ai',
    authGuard,
    roleGuard(['DOCTOR']),
    confirmAiDiagnosisController
)

router.post(
    '/:caseId/revise',
    authGuard,
    roleGuard(['DOCTOR']),
    reviseDiagnosisController
)

router.get(
    '/:caseId/export-report',
    authGuard,
    roleGuard(['DOCTOR']),
    exportDiagnosisReportController
)

export default router
