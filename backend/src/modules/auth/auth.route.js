import { Router } from 'express'
import './auth.validator.js'
import { loginController, meController } from './auth.controller.js'
import { authGuard } from '../../middlewares/authGuard.js'

const router = Router()

router.post('/login', loginController)
router.get('/me', authGuard, meController)

export default router
