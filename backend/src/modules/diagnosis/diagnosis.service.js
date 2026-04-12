import fs from 'fs'
import path from 'path'
import prisma from '../../utils/prisma.js'

function formatDate(date) {
    if (!date) return '--'
    return new Date(date).toISOString().slice(0, 10)
}

function ensurePublicFile(relativeUrl, fallbackUrl = '') {
    if (!relativeUrl) return fallbackUrl
    const filePath = path.join(process.cwd(), 'public', relativeUrl.replace(/^\//, ''))
    return fs.existsSync(filePath) ? relativeUrl : fallbackUrl
}

function safeJson(value, fallback) {
    if (!value) return fallback
    if (typeof value === 'object') return value
    try {
        return JSON.parse(value)
    } catch {
        return fallback
    }
}

function buildReviewRuleText(prob) {
    if (prob < 0.3) return '低于 30%，通常可给出护理建议'
    if (prob < 0.7) return '30%～70% 进入医生复核'
    return '达到 70% 以上，建议优先上转 / 会诊'
}

function buildDefaultConclusion(ai) {
    if (!ai?.top1Disease) return '待医生复核'
    if ((ai.malignancyProb || 0) >= 0.7) return `高度怀疑${ai.top1Disease}`
    return `倾向${ai.top1Disease}`
}

async function getOwnedCase(currentUser, caseId) {
    const medicalCase = await prisma.medicalCase.findFirst({
        where: {
            id: caseId,
            doctorId: currentUser.id
        },
        include: {
            patient: true,
            images: {
                orderBy: { capturedAt: 'desc' }
            },
            aiAnalyses: {
                orderBy: { createdAt: 'desc' }
            },
            diagnoses: {
                orderBy: { createdAt: 'desc' }
            }
        }
    })

    if (!medicalCase) {
        throw new Error('病例不存在，或你无权查看该病例')
    }

    return medicalCase
}

export async function getDiagnosisWorkspaceService({ currentUser, caseId, imageId }) {
    if (!caseId) {
        throw new Error('请传入 caseId')
    }

    const medicalCase = await getOwnedCase(currentUser, caseId)

    const currentImage =
        medicalCase.images.find((item) => item.id === imageId) ||
        medicalCase.images[0]

    if (!currentImage) {
        throw new Error('该病例下暂无影像')
    }

    const ai =
        medicalCase.aiAnalyses.find((item) => item.imageId === currentImage.id) ||
        medicalCase.aiAnalyses[0] ||
        null

    const latestDiagnosis = medicalCase.diagnoses[0] || null
    const historyImage = medicalCase.images.find((item) => item.id !== currentImage.id) || currentImage

    const lesionBoxes = safeJson(ai?.lesionBoxesJson, [
        { x: 36, y: 29, w: 26, h: 24, label: '病灶A：边缘不规则' },
        { x: 55, y: 51, w: 18, h: 17, label: '病灶B：色素不均' }
    ])

    const featureJson = safeJson(ai?.featureJson, {
        abcde: {
            asymmetry: '中高',
            border: '边缘不规则',
            color: '多色分布',
            diameter: '6.8mm',
            evolution: '近两月增大'
        },
        dermoscopy: ['不规则色网', '蓝白结构', '点球状分布不均'],
        quality: {
            clarity: '合格',
            exposure: '正常',
            framing: '完整'
        }
    })

    await prisma.auditLog.create({
        data: {
            userId: currentUser.id,
            actorName: currentUser.realName,
            actorRole: currentUser.role,
            actionType: 'VIEW_DIAGNOSIS_WORKSPACE',
            targetType: 'MEDICAL_CASE',
            targetId: medicalCase.caseCode,
            detail: `查看影像诊断工作区，image=${currentImage.imageCode}`,
            ipAddress: ''
        }
    })

    return {
        caseInfo: {
            caseId: medicalCase.id,
            caseCode: medicalCase.caseCode,
            patientCode: medicalCase.patient?.patientCode || '--',
            patientName: medicalCase.patient?.name || '--',
            sourceLabel: currentImage.deviceName || '院内上传',
            modalityLabel:
                currentImage.type === 'DERMOSCOPY'
                    ? '皮肤镜图像'
                    : currentImage.type === 'PATHOLOGY'
                        ? '病理图像'
                        : currentImage.type === 'FOLLOW_UP'
                            ? '随访图像'
                            : '普通临床图像',
            historyLabel: medicalCase.images
                .slice(0, 3)
                .map((item) => formatDate(item.capturedAt || item.createdAt))
                .join(' / '),
            bodyPart: currentImage.bodyPart || '未标注部位'
        },
        timeline: medicalCase.images.map((item, index) => ({
            id: item.id,
            label: index === 0 ? '本次影像' : `${formatDate(item.capturedAt || item.createdAt)} 随访`,
            capturedAt: formatDate(item.capturedAt || item.createdAt),
            active: item.id === currentImage.id
        })),
        currentImage: {
            id: currentImage.id,
            imageCode: currentImage.imageCode,
            imageUrl: ensurePublicFile(currentImage.imageUrl),
            heatmapUrl: ensurePublicFile(ai?.heatmapUrl || ''),
            opacity: 0.68
        },
        aiReport: {
            malignancyProb: ai?.malignancyProb || 0,
            riskText: `${Math.round((ai?.malignancyProb || 0) * 100)}%`,
            reviewRuleText: buildReviewRuleText(ai?.malignancyProb || 0),
            top3: [
                {
                    name: ai?.top1Disease || '疑似黑色素瘤',
                    prob: ai?.top1Prob ?? ai?.malignancyProb ?? 0.67,
                    color: 'red'
                },
                {
                    name: ai?.top2Disease || '色素痣异变',
                    prob: ai?.top2Prob ?? 0.19,
                    color: 'gold'
                },
                {
                    name: ai?.top3Disease || '炎症性色素沉着',
                    prob: ai?.top3Prob ?? 0.14,
                    color: 'blue'
                }
            ],
            lesionBoxes,
            metrics: {
                diameter: featureJson?.abcde?.diameter || '6.8mm',
                evolution: featureJson?.abcde?.evolution || '近两月增大',
                modelVersion: ai?.modelVersion || 'CR-Conformer v1.2'
            },
            summary:
                ai?.summary ||
                '检测到边界不规则、色素分布不均，建议结合历史影像变化与临床病史进行复核。',
            featureJson
        },
        doctorReview: {
            conclusion: latestDiagnosis?.conclusion || buildDefaultConclusion(ai),
            treatmentPlan: latestDiagnosis?.treatmentPlan || '建议进一步临床复核',
            suggestion:
                latestDiagnosis?.suggestion ||
                '建议结合既往影像变化与病史，必要时进入分级诊疗流程'
        },
        compare: {
            historyImageUrl: ensurePublicFile(historyImage.imageUrl),
            currentImageUrl: ensurePublicFile(currentImage.imageUrl)
        },
        actions: {
            canConfirm: true,
            canRevise: true,
            canRefer: (ai?.malignancyProb || 0) >= 0.7,
            canExport: true
        }
    }
}

async function createDiagnosisRecord({
                                         currentUser,
                                         caseId,
                                         conclusion,
                                         treatmentPlan,
                                         suggestion,
                                         actionType
                                     }) {
    const medicalCase = await getOwnedCase(currentUser, caseId)

    const created = await prisma.diagnosis.create({
        data: {
            caseId: medicalCase.id,
            doctorId: currentUser.id,
            conclusion,
            treatmentPlan,
            suggestion
        }
    })

    const latestAi = medicalCase.aiAnalyses[0]

    await prisma.medicalCase.update({
        where: { id: medicalCase.id },
        data: {
            status: (latestAi?.malignancyProb || 0) >= 0.7 ? 'REFERRED' : 'IN_TREATMENT',
            riskLevel: Math.round((latestAi?.malignancyProb || 0) * 100)
        }
    })

    await prisma.auditLog.create({
        data: {
            userId: currentUser.id,
            actorName: currentUser.realName,
            actorRole: currentUser.role,
            actionType,
            targetType: 'DIAGNOSIS',
            targetId: String(created.id),
            detail: `病例 ${medicalCase.caseCode} 提交医生复核意见`,
            ipAddress: ''
        }
    })

    return created
}

export async function confirmAiDiagnosisService({ currentUser, caseId, payload }) {
    const conclusion = (payload.conclusion || '').trim() || '确认 AI 辅助结论'
    const treatmentPlan = (payload.treatmentPlan || '').trim() || '建议按 AI 辅助意见继续评估'
    const suggestion = (payload.suggestion || '').trim() || '已确认 AI 辅助判断，进入临床处置流程'

    const created = await createDiagnosisRecord({
        currentUser,
        caseId,
        conclusion,
        treatmentPlan,
        suggestion,
        actionType: 'CONFIRM_AI_DIAGNOSIS'
    })

    return {
        diagnosisId: created.id
    }
}

export async function reviseDiagnosisService({ currentUser, caseId, payload }) {
    const conclusion = (payload.conclusion || '').trim()
    const treatmentPlan = (payload.treatmentPlan || '').trim()
    const suggestion = (payload.suggestion || '').trim()

    if (!conclusion) {
        throw new Error('请填写医生结论')
    }

    const created = await createDiagnosisRecord({
        currentUser,
        caseId,
        conclusion,
        treatmentPlan,
        suggestion,
        actionType: 'REVISE_AI_DIAGNOSIS'
    })

    return {
        diagnosisId: created.id
    }
}

export async function exportDiagnosisReportService({ currentUser, caseId }) {
    const data = await getDiagnosisWorkspaceService({
        currentUser,
        caseId,
        imageId: null
    })

    await prisma.auditLog.create({
        data: {
            userId: currentUser.id,
            actorName: currentUser.realName,
            actorRole: currentUser.role,
            actionType: 'EXPORT_AI_REPORT',
            targetType: 'MEDICAL_CASE',
            targetId: data.caseInfo.caseCode,
            detail: '导出影像诊断辅助报告',
            ipAddress: ''
        }
    })

    const content = `
影像诊断辅助报告
====================
病例编号：${data.caseInfo.caseCode}
患者编号：${data.caseInfo.patientCode}
患者姓名：${data.caseInfo.patientName}
部位：${data.caseInfo.bodyPart}
模态：${data.caseInfo.modalityLabel}

AI 风险参考：${data.aiReport.riskText}
复核规则：${data.aiReport.reviewRuleText}
Top1：${data.aiReport.top3[0].name}
Top2：${data.aiReport.top3[1].name}
Top3：${data.aiReport.top3[2].name}

AI 摘要：
${data.aiReport.summary}

医生结论：
${data.doctorReview.conclusion}

处理建议：
${data.doctorReview.treatmentPlan}

随访建议：
${data.doctorReview.suggestion}
`.trim()

    return {
        fileName: `${data.caseInfo.caseCode}-diagnosis-report.txt`,
        content
    }
}
