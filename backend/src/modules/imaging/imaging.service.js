import fs from 'fs'
import path from 'path'
import prisma from '../../utils/prisma.js'

const DEMO_BASE = '/uploads/demo/cases/CASE-2026-0001'
const DEMO_CURRENT_IMAGE = `${DEMO_BASE}/dermoscopy-01.jpg`
const DEMO_HISTORY_IMAGE = `${DEMO_BASE}/followup-2026-03-18.jpg`
const DEMO_HEATMAP = `${DEMO_BASE}/heatmap-01.png`

function formatDate(date) {
    if (!date) return '--'
    return new Date(date).toISOString().slice(0, 10)
}

function ensurePublicFile(relativeUrl, fallbackUrl) {
    if (!relativeUrl) return fallbackUrl
    const filePath = path.join(process.cwd(), 'public', relativeUrl.replace(/^\//, ''))
    return fs.existsSync(filePath) ? relativeUrl : fallbackUrl
}

function buildModalityLabel(type) {
    if (type === 'DERMOSCOPY') return '皮肤镜图像'
    if (type === 'PATHOLOGY') return '病理图像'
    if (type === 'FOLLOW_UP') return '随访图像'
    return '普通临床图像'
}

function buildAccessLevelLabel(level) {
    if (level === 'CLINICAL_RAW') return '临床原始影像'
    if (level === 'CONSULT_COPY') return '会诊共享副本'
    if (level === 'RESEARCH_ANON') return '匿名化科研副本'
    return '未标注'
}

function buildQcItems(image) {
    return [
        {
            label: '清晰度',
            value: image.isQcPassed ? '清晰可用' : '待人工复核',
            status: image.isQcPassed ? 'good' : 'warn'
        },
        {
            label: '部位标注',
            value: image.bodyPart || '未标注部位',
            status: image.bodyPart ? 'good' : 'warn'
        },
        {
            label: '模态识别',
            value: buildModalityLabel(image.type),
            status: image.type ? 'good' : 'warn'
        },
        {
            label: '采集设备',
            value: image.deviceName || '未登记设备',
            status: image.deviceName ? 'good' : 'warn'
        }
    ]
}

function buildTop3(ai) {
    return [
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
    ]
}

function buildImageList(cases, modality) {
    const allImages = cases.flatMap((medicalCase) =>
        (medicalCase.images || []).map((image) => ({
            ...image,
            caseInfo: medicalCase
        }))
    )

    const filtered =
        modality === 'ALL'
            ? allImages
            : allImages.filter((item) => item.type === modality)

    return filtered
        .sort((a, b) => new Date(b.capturedAt || b.createdAt) - new Date(a.capturedAt || a.createdAt))
        .map((item) => ({
            imageId: item.id,
            caseId: item.caseId,
            imageCode: item.imageCode,
            caseCode: item.caseInfo.caseCode,
            patientCode: item.caseInfo.patient?.patientCode || '--',
            title: `${item.caseInfo.chiefComplaint || '病例影像'} · ${buildModalityLabel(item.type)}`,
            meta: `${item.caseInfo.caseCode} · ${item.caseInfo.patient?.patientCode || '--'} · ${formatDate(item.capturedAt || item.createdAt)}`
        }))
}

function buildSelectedImage(selectedImage, selectedCase, project, task) {
    const latestAi = selectedCase.aiAnalyses?.[0] || null

    const caseImages = [...(selectedCase.images || [])].sort((a, b) => {
        return new Date(b.capturedAt || b.createdAt) - new Date(a.capturedAt || a.createdAt)
    })

    const historyImage =
        caseImages.find((img) => img.id !== selectedImage.id) || selectedImage

    return {
        imageId: selectedImage.id,
        imageCode: selectedImage.imageCode,
        caseId: selectedCase.id,
        caseCode: selectedCase.caseCode,
        patientCode: selectedCase.patient?.patientCode || '--',
        patientName: selectedCase.patient?.name || '--',
        bodyPart: selectedImage.bodyPart || '未标注部位',
        modalityLabel: buildModalityLabel(selectedImage.type),
        capturedAt: formatDate(selectedImage.capturedAt || selectedImage.createdAt),
        deviceName: selectedImage.deviceName || '未登记设备',
        accessLevelLabel: buildAccessLevelLabel(selectedImage.accessLevel),
        imageUrl: ensurePublicFile(selectedImage.imageUrl, DEMO_CURRENT_IMAGE),
        heatmapUrl: DEMO_HEATMAP,
        qc: {
            passed: selectedImage.isQcPassed === true,
            label: selectedImage.isQcPassed ? '质控通过' : '待人工质控',
            items: buildQcItems(selectedImage)
        },
        ai: {
            riskText: latestAi ? `${Math.round((latestAi.malignancyProb || 0) * 100)}%` : '--',
            modelVersion: latestAi?.modelVersion || 'CR-Conformer v1.2',
            summary:
                latestAi?.summary ||
                '当前影像已进入科研影像查看流程，可结合热力图、病灶框与历史对比结果进行复核。',
            top3: buildTop3(latestAi),
            lesionBoxes: [
                {
                    x: 32,
                    y: 27,
                    w: 26,
                    h: 24,
                    label: '病灶A：边缘不规则'
                },
                {
                    x: 51,
                    y: 48,
                    w: 18,
                    h: 17,
                    label: '病灶B：色素不均'
                }
            ]
        },
        compare: {
            currentLabel: '本次影像',
            historyLabel: historyImage.id === selectedImage.id ? '历史影像缺失' : '历史影像',
            currentImageUrl: ensurePublicFile(selectedImage.imageUrl, DEMO_CURRENT_IMAGE),
            historyImageUrl: ensurePublicFile(historyImage.imageUrl, DEMO_HISTORY_IMAGE)
        },
        context: {
            projectName: project?.name || '',
            taskTitle: task?.title || ''
        }
    }
}

export async function getImagingCloudBoardService({
                                                      currentUser,
                                                      projectId,
                                                      taskId,
                                                      caseId,
                                                      imageId,
                                                      modality
                                                  }) {
    const [cases, project, task] = await Promise.all([
        prisma.medicalCase.findMany({
            where: {
                doctorId: currentUser.id
            },
            include: {
                patient: true,
                images: {
                    orderBy: {
                        capturedAt: 'desc'
                    }
                },
                aiAnalyses: {
                    orderBy: {
                        createdAt: 'desc'
                    },
                    take: 1
                },
                referrals: true
            },
            orderBy: {
                updatedAt: 'desc'
            }
        }),
        projectId
            ? prisma.researchProject.findUnique({
                where: { id: projectId }
            })
            : Promise.resolve(null),
        taskId
            ? prisma.researchTask.findUnique({
                where: { id: taskId }
            })
            : Promise.resolve(null)
    ])

    const allImages = cases.flatMap((item) => item.images || [])
    const filteredImages =
        modality === 'ALL'
            ? allImages
            : allImages.filter((item) => item.type === modality)

    let selectedImage =
        filteredImages.find((item) => item.id === imageId) ||
        allImages.find((item) => item.caseId === caseId) ||
        filteredImages[0] ||
        allImages[0] ||
        null

    const selectedCase =
        selectedImage
            ? cases.find((item) => item.id === selectedImage.caseId)
            : null

    if (selectedImage) {
        await prisma.auditLog.create({
            data: {
                userId: currentUser.id,
                actorName: currentUser.realName,
                actorRole: currentUser.role,
                actionType: 'VIEW_IMAGING_CLOUD',
                targetType: 'MEDICAL_IMAGE',
                targetId: selectedImage.imageCode,
                detail: '查看影像云平台',
                ipAddress: ''
            }
        })
    }

    const activeConsultations = cases.flatMap((item) => item.referrals || []).filter((item) =>
        ['PENDING', 'IN_PROGRESS', 'ACCEPTED'].includes(item.status)
    ).length

    return {
        contextBanner: {
            projectName: project?.name || '',
            taskTitle: task?.title || '',
            hasTaskContext: !!task
        },
        summary: {
            totalImages: allImages.length,
            pendingQc: allImages.filter((item) => item.isQcPassed !== true).length,
            sharedCopies: allImages.filter((item) => item.accessLevel !== 'CLINICAL_RAW').length,
            activeConsultations
        },
        filters: {
            currentModality: modality || 'ALL',
            modalityOptions: [
                { value: 'ALL', label: '全部' },
                { value: 'CLINICAL_PHOTO', label: '普通照片' },
                { value: 'DERMOSCOPY', label: '皮肤镜' },
                { value: 'PATHOLOGY', label: '病理图' },
                { value: 'FOLLOW_UP', label: '随访图' }
            ]
        },
        imageList: buildImageList(cases, modality || 'ALL'),
        selectedImage: selectedImage && selectedCase
            ? buildSelectedImage(selectedImage, selectedCase, project, task)
            : null
    }
}

export async function confirmImageQcService({ currentUser, imageId }) {
    const image = await prisma.medicalImage.findUnique({
        where: { id: imageId }
    })

    if (!image) {
        throw new Error('影像不存在')
    }

    const medicalCase = await prisma.medicalCase.findFirst({
        where: {
            id: image.caseId,
            doctorId: currentUser.id
        }
    })

    if (!medicalCase) {
        throw new Error('你无权操作该影像')
    }

    const updated = await prisma.medicalImage.update({
        where: { id: image.id },
        data: {
            isQcPassed: true
        }
    })

    await prisma.auditLog.create({
        data: {
            userId: currentUser.id,
            actorName: currentUser.realName,
            actorRole: currentUser.role,
            actionType: 'CONFIRM_IMAGE_QC',
            targetType: 'MEDICAL_IMAGE',
            targetId: updated.imageCode,
            detail: '确认影像质控通过',
            ipAddress: ''
        }
    })

    return {
        imageId: updated.id,
        imageCode: updated.imageCode,
        isQcPassed: updated.isQcPassed
    }
}
