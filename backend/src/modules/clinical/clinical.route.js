import { Router } from 'express'
import { authGuard } from '../../middlewares/authGuard.js'
import { roleGuard } from '../../middlewares/roleGuard.js'
import { getWorkbenchController } from './clinical.controller.js'

const router = Router()

router.get(
    '/workbench',
    authGuard,
    roleGuard(['DOCTOR']),
    getWorkbenchController
)

export default router
