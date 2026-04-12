import prisma from '../../utils/prisma.js'

function formatDate(date) {
    if (!date) return '--'
    return new Date(date).toISOString().slice(0, 10)
}

function calcAge(birthDate) {
    if (!birthDate) return '--'
    const now = new Date()
    const birth = new Date(birthDate)
    let age = now.getFullYear() - birth.getFullYear()
    const m = now.getMonth() - birth.getMonth()
    if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) {
        age--
    }
    return age
}

function maskIdCard(idCard) {
    if (!idCard) return '--'
    if (idCard.length < 8) return idCard
    return `${idCard.slice(0, 4)}********${idCard.slice(-4)}`
}

function maskPhone(phone) {
    if (!phone) return '--'
    if (phone.length < 7) return phone
    return `${phone.slice(0, 3)}****${phone.slice(-4)}`
}

function buildCaseStatusLabel(status) {
    if (status === 'PENDING_REVIEW') return { label: '待复核', className: 'warning' }
    if (status === 'IN_TREATMENT') return { label: '处理中', className: 'blue' }
    if (status === 'REFERRED') return { label: '已转诊', className: 'danger' }
    if (status === 'CLOSED') return { label: '已结案', className: 'success' }
    return { label: status || '未知', className: 'neutral' }
}

function pickCoverImage(images = []) {
    const sorted = [...images].sort((a, b) => {
        return new Date(b.capturedAt || b.createdAt) - new Date(a.capturedAt || a.createdAt)
    })

    return (
        sorted.find((item) => item.type === 'FOLLOW_UP') ||
        sorted.find((item) => item.type === 'DERMOSCOPY') ||
        sorted.find((item) => item.type === 'CLINICAL_PHOTO') ||
        sorted[0] ||
        null
    )
}

function buildRecordsList(cases) {
    return cases.map((item) => {
        const cover = pickCoverImage(item.images || [])
        const statusMeta = buildCaseStatusLabel(item.status)

        return {
            caseId: item.id,
            caseCode: item.caseCode,
            patientName: item.patient?.name || '--',
            chiefComplaint: item.chiefComplaint || '暂无主诉',
            updatedAt: formatDate(item.updatedAt),
            status: statusMeta.label,
            statusClass: statusMeta.className,
            coverUrl: cover?.imageUrl || ''
        }
    })
}

export async function getMyRecordsBoardService({ currentUser, caseId, status }) {
    const records = await prisma.medicalCase.findMany({
        where: {
            doctorId: currentUser.id
        },
        include: {
            patient: true,
            images: {
                orderBy: { capturedAt: 'desc' }
            },
            aiAnalyses: {
                orderBy: { createdAt: 'desc' },
                take: 1
            },
            referrals: {
                orderBy: { createdAt: 'desc' },
                take: 1
            }
        },
        orderBy: {
            updatedAt: 'desc'
        }
    })

    const filtered =
        status === 'ALL'
            ? records
            : records.filter((item) => item.status === status)

    const selected =
        filtered.find((item) => item.id === caseId) ||
        filtered[0] ||
        records[0] ||
        null

    if (selected) {
        await prisma.auditLog.create({
            data: {
                userId: currentUser.id,
                actorName: currentUser.realName,
                actorRole: currentUser.role,
                actionType: 'VIEW_MY_RECORDS',
                targetType: 'MEDICAL_CASE',
                targetId: selected.caseCode,
                detail: '查看我的病例页',
                ipAddress: ''
            }
        })
    }

    const summary = {
        totalCount: records.length,
        pendingCount: records.filter((item) => item.status === 'PENDING_REVIEW').length,
        followUpCount: records.filter((item) => (item.images || []).some((img) => img.type === 'FOLLOW_UP')).length,
        referredCount: records.filter((item) => item.status === 'REFERRED').length
    }

    return {
        summary,
        filters: {
            currentStatus: status,
            statusOptions: [
                { value: 'ALL', label: '全部' },
                { value: 'PENDING_REVIEW', label: '待复核' },
                { value: 'IN_TREATMENT', label: '处理中' },
                { value: 'REFERRED', label: '已转诊' },
                { value: 'CLOSED', label: '已结案' }
            ]
        },
        list: buildRecordsList(filtered),
        selectedCase: selected
            ? {
                caseId: selected.id,
                caseCode: selected.caseCode,
                chiefComplaint: selected.chiefComplaint || '--',
                status: buildCaseStatusLabel(selected.status).label,
                riskLevel: selected.riskLevel ?? '--',
                patient: {
                    patientCode: selected.patient?.patientCode || '--',
                    name: selected.patient?.name || '--',
                    gender: selected.patient?.gender || '--',
                    age: calcAge(selected.patient?.birthDate),
                    idCard: maskIdCard(selected.patient?.idCard),
                    phone: maskPhone(selected.patient?.phone)
                },
                coverImage: pickCoverImage(selected.images || []),
                images: (selected.images || []).map((img) => ({
                    imageId: img.id,
                    imageCode: img.imageCode,
                    type: img.type,
                    typeLabel:
                        img.type === 'FOLLOW_UP'
                            ? '随访图'
                            : img.type === 'DERMOSCOPY'
                                ? '皮肤镜'
                                : img.type === 'PATHOLOGY'
                                    ? '病理图'
                                    : '临床照片',
                    imageUrl: img.imageUrl,
                    capturedAt: formatDate(img.capturedAt || img.createdAt),
                    bodyPart: img.bodyPart || '--'
                }))
            }
            : null
    }
}

export async function uploadFollowUpImageService({
                                                     currentUser,
                                                     caseId,
                                                     file,
                                                     bodyPart,
                                                     deviceName,
                                                     capturedAt
                                                 }) {
    if (!file) {
        throw new Error('请上传图片文件')
    }

    const medicalCase = await prisma.medicalCase.findFirst({
        where: {
            id: caseId,
            doctorId: currentUser.id
        }
    })

    if (!medicalCase) {
        throw new Error('病例不存在，或你无权操作')
    }

    const relativePath = `/uploads/cases/${medicalCase.caseCode}/followup/${file.filename}`

    const imageCount = await prisma.medicalImage.count({
        where: {
            caseId: medicalCase.id
        }
    })

    const imageCode = `IMG-${new Date().getFullYear()}-${medicalCase.caseCode.slice(-4)}-FU-${String(imageCount + 1).padStart(2, '0')}`

    const created = await prisma.medicalImage.create({
        data: {
            caseId: medicalCase.id,
            imageCode,
            imageUrl: relativePath,
            type: 'FOLLOW_UP',
            bodyPart: bodyPart || null,
            deviceName: deviceName || '门诊随访上传',
            capturedAt: capturedAt ? new Date(capturedAt) : new Date(),
            isQcPassed: true,
            accessLevel: 'CLINICAL_RAW'
        }
    })

    await prisma.auditLog.create({
        data: {
            userId: currentUser.id,
            actorName: currentUser.realName,
            actorRole: currentUser.role,
            actionType: 'UPLOAD_FOLLOW_UP_IMAGE',
            targetType: 'MEDICAL_IMAGE',
            targetId: created.imageCode,
            detail: `病例 ${medicalCase.caseCode} 上传随访图片`,
            ipAddress: ''
        }
    })

    return {
        imageId: created.id,
        imageCode: created.imageCode,
        imageUrl: created.imageUrl
    }
}
