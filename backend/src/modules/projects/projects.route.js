import { Router } from 'express'
import { authGuard } from '../../middlewares/authGuard.js'
import { roleGuard } from '../../middlewares/roleGuard.js'
import { getMyProjectsController } from './projects.controller.js'

const router = Router()

router.get(
    '/my-projects',
    authGuard,
    roleGuard(['DOCTOR']),
    getMyProjectsController
)

export default router
