import { Router } from 'express'
import { authGuard } from '../../middlewares/authGuard.js'
import { roleGuard } from '../../middlewares/roleGuard.js'
import {
    getReferralBoardController,
    createReferralController,
    acknowledgeReferralController
} from './referrals.controller.js'

const router = Router()

router.get(
    '/center',
    authGuard,
    roleGuard(['DOCTOR']),
    getReferralBoardController
)

router.post(
    '/',
    authGuard,
    roleGuard(['DOCTOR']),
    createReferralController
)

router.post(
    '/:id/acknowledge',
    authGuard,
    roleGuard(['DOCTOR']),
    acknowledgeReferralController
)

export default router
