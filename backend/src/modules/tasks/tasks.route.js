import { Router } from 'express'
import { authGuard } from '../../middlewares/authGuard.js'
import { roleGuard } from '../../middlewares/roleGuard.js'
import {
    getCollaborationBoardController,
    acceptTaskController,
    updateTaskProgressController
} from './tasks.controller.js'

const router = Router()

router.get(
    '/collaboration-board',
    authGuard,
    roleGuard(['DOCTOR']),
    getCollaborationBoardController
)

router.post(
    '/:taskId/accept',
    authGuard,
    roleGuard(['DOCTOR']),
    acceptTaskController
)

router.post(
    '/:taskId/progress',
    authGuard,
    roleGuard(['DOCTOR']),
    updateTaskProgressController
)

export default router
