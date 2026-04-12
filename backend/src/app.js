import express from 'express'
import cors from 'cors'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import authRoutes from './modules/auth/auth.route.js'
import referralsRoutes from './modules/referrals/referrals.route.js'
import researchRoutes from './modules/research/research.route.js'
import clinicalRoutes from './modules/clinical/clinical.route.js'
import projectsRoutes from './modules/projects/projects.route.js'
import tasksRoutes from './modules/tasks/tasks.route.js'
import imagingRoutes from './modules/imaging/imaging.route.js'
import labRoutes from './modules/lab/lab.route.js'
import diagnosisRoutes from './modules/diagnosis/diagnosis.route.js'
import casesRoutes from './modules/cases/cases.route.js'
import adminRoutes from './modules/admin/admin.route.js'


import { notFoundHandler } from './middlewares/notFoundHandler.js'
import { errorHandler } from './middlewares/errorHandler.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const app = express()

app.use(cors())
app.use(express.json())

app.get('/health', (_req, res) => {
  res.json({ ok: true })
})


app.use('/uploads', express.static(path.join(process.cwd(), 'public/uploads')))

const uploadsRoot = path.join(__dirname, '..', 'uploads')
app.use('/uploads', express.static(uploadsRoot))

app.use('/api/auth', authRoutes)
app.use('/api/diagnosis', diagnosisRoutes)
app.use('/api/referrals', referralsRoutes)
app.use('/api/research', researchRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/clinical', clinicalRoutes)
app.use('/api/projects', projectsRoutes)
app.use('/api/tasks', tasksRoutes)
app.use('/api/imaging', imagingRoutes)
app.use('/api/lab', labRoutes)
app.use('/api/cases', casesRoutes)

app.use(notFoundHandler)
app.use(errorHandler)

export default app
