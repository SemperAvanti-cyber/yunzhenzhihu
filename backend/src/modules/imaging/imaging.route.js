import { Router } from 'express'
import { authGuard } from '../../middlewares/authGuard.js'
import { roleGuard } from '../../middlewares/roleGuard.js'
import {
    getImagingCloudBoardController,
    confirmImageQcController
} from './imaging.controller.js'

const router = Router()

router.get(
    '/cloud-board',
    authGuard,
    roleGuard(['DOCTOR']),
    getImagingCloudBoardController
)

router.post(
    '/:imageId/qc-confirm',
    authGuard,
    roleGuard(['DOCTOR']),
    confirmImageQcController
)

export default router
