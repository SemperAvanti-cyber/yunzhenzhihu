import { Router } from 'express'
import multer from 'multer'
import fs from 'fs'
import path from 'path'
import { authGuard } from '../../middlewares/authGuard.js'
import { roleGuard } from '../../middlewares/roleGuard.js'
import {
    getMyRecordsBoardController,
    uploadFollowUpImageController
} from './cases.controller.js'
import prisma from '../../utils/prisma.js'

const router = Router()

const storage = multer.diskStorage({
    destination: async function (req, file, cb) {
        try {
            const caseId = Number(req.params.caseId)
            const medicalCase = await prisma.medicalCase.findUnique({
                where: { id: caseId }
            })

            if (!medicalCase) {
                return cb(new Error('病例不存在'))
            }

            const dir = path.join(
                process.cwd(),
                'public/uploads/cases',
                medicalCase.caseCode,
                'followup'
            )

            fs.mkdirSync(dir, { recursive: true })
            cb(null, dir)
        } catch (error) {
            cb(error)
        }
    },
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname || '.jpg')
        const time = Date.now()
        cb(null, `followup-${time}${ext}`)
    }
})

const upload = multer({ storage })

router.get(
    '/my-records',
    authGuard,
    roleGuard(['DOCTOR']),
    getMyRecordsBoardController
)

router.post(
    '/:caseId/follow-up-upload',
    authGuard,
    roleGuard(['DOCTOR']),
    upload.single('image'),
    uploadFollowUpImageController
)

export default router
