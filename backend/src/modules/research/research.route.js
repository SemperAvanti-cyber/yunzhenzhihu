import { Router } from 'express'
import { authGuard } from '../../middlewares/authGuard.js'
import { roleGuard } from '../../middlewares/roleGuard.js'
import {
    getResearchOverviewController,
    submitProjectRegistrationController
} from './research.controller.js'

const router = Router()

router.get(
    '/overview',
    authGuard,
    roleGuard(['DOCTOR']),
    getResearchOverviewController
)

router.post(
    '/project-registration',
    authGuard,
    roleGuard(['DOCTOR']),
    submitProjectRegistrationController
)

export default router
