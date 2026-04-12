import { Router } from 'express'
import { authGuard } from '../../middlewares/authGuard.js'
import { roleGuard } from '../../middlewares/roleGuard.js'
import {
    getOpenLabBoardController,
    createExperimentRunController,
    updateExperimentRunController
} from './lab.controller.js'

const router = Router()

router.get(
    '/open-lab',
    authGuard,
    roleGuard(['DOCTOR']),
    getOpenLabBoardController
)

router.post(
    '/experiments',
    authGuard,
    roleGuard(['DOCTOR']),
    createExperimentRunController
)

router.post(
    '/experiments/:id/update',
    authGuard,
    roleGuard(['DOCTOR']),
    updateExperimentRunController
)

export default router
