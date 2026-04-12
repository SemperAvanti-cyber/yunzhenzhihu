import prisma from '../../utils/prisma.js'

function formatDate(date) {
    if (!date) return '--'
    return new Date(date).toISOString().slice(0, 10)
}

function buildStatusMeta(status) {
    if (status === 'PENDING') return { label: '待审批', className: 'warning' }
    if (status === 'IN_PROGRESS') return { label: '处理中', className: 'blue' }
    if (status === 'ACCEPTED') return { label: '已接收', className: 'blue' }
    if (status === 'COMPLETED') return { label: '已完成', className: 'success' }
    if (status === 'REJECTED') return { label: '已驳回', className: 'danger' }
    return { label: status || '未知', className: 'neutral' }
}

function buildTypeLabel(type) {
    if (type === 'REFERRAL') return '上转'
    if (type === 'REMOTE_CONSULTATION') return '远程会诊'
    return '院内会诊'
}

function generateReferralCode() {
    return `RC-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`
}

function pickCasePreview(images = []) {
    return (
        images.find((item) => item.type === 'FOLLOW_UP') ||
        images.find((item) => item.type === 'DERMOSCOPY') ||
        images.find((item) => item.type === 'CLINICAL_PHOTO') ||
        images[0] ||
        null
    )
}

export async function getReferralBoardService({ currentUser, referralId, caseId, status }) {
    const [referrals, cases, hospitals] = await Promise.all([
        prisma.referral.findMany({
            where: {
                medicalCase: {
                    doctorId: currentUser.id
                }
            },
            include: {
                medicalCase: {
                    include: {
                        patient: true,
                        images: {
                            orderBy: { capturedAt: 'desc' }
                        }
                    }
                },
                fromHospital: true,
                toHospital: true
            },
            orderBy: {
                updatedAt: 'desc'
            }
        }),
        prisma.medicalCase.findMany({
            where: {
                doctorId: currentUser.id
            },
            include: {
                patient: true,
                images: true
            },
            orderBy: {
                updatedAt: 'desc'
            }
        }),
        prisma.hospital.findMany({
            orderBy: { id: 'asc' }
        })
    ])

    const filtered =
        status === 'ALL'
            ? referrals
            : referrals.filter((item) => item.status === status)

    const selected =
        filtered.find((item) => item.id === referralId) ||
        filtered.find((item) => item.caseId === caseId) ||
        filtered[0] ||
        referrals[0] ||
        null

    if (selected) {
        await prisma.auditLog.create({
            data: {
                userId: currentUser.id,
                actorName: currentUser.realName,
                actorRole: currentUser.role,
                actionType: 'VIEW_REFERRAL_CENTER',
                targetType: 'REFERRAL',
                targetId: selected.referralCode,
                detail: '查看分级诊疗页',
                ipAddress: ''
            }
        })
    }

    return {
        summary: {
            pendingCount: referrals.filter((item) => item.status === 'PENDING').length,
            progressCount: referrals.filter((item) => ['IN_PROGRESS', 'ACCEPTED'].includes(item.status)).length,
            completedCount: referrals.filter((item) => item.status === 'COMPLETED').length
        },
        filters: {
            currentStatus: status,
            statusOptions: [
                { value: 'ALL', label: '全部' },
                { value: 'PENDING', label: '待审批' },
                { value: 'IN_PROGRESS', label: '处理中' },
                { value: 'COMPLETED', label: '已完成' }
            ]
        },
        queue: filtered.map((item) => ({
            referralId: item.id,
            referralCode: item.referralCode,
            caseId: item.caseId,
            patientName: item.medicalCase?.patient?.name || '--',
            caseCode: item.medicalCase?.caseCode || '--',
            typeLabel: buildTypeLabel(item.type),
            status: buildStatusMeta(item.status).label,
            statusClass: buildStatusMeta(item.status).className,
            updatedAt: formatDate(item.updatedAt)
        })),
        selected: selected
            ? {
                referralId: selected.id,
                referralCode: selected.referralCode,
                caseId: selected.caseId,
                caseCode: selected.medicalCase?.caseCode || '--',
                patientName: selected.medicalCase?.patient?.name || '--',
                patientCode: selected.medicalCase?.patient?.patientCode || '--',
                typeLabel: buildTypeLabel(selected.type),
                status: buildStatusMeta(selected.status).label,
                statusClass: buildStatusMeta(selected.status).className,
                fromHospital: selected.fromHospital?.name || '--',
                toHospital: selected.toHospital?.name || '--',
                note: selected.note || '暂无申请说明',
                callbackOpinion: selected.callbackOpinion || '',
                previewUrl: pickCasePreview(selected.medicalCase?.images || [])?.imageUrl || ''
            }
            : null,
        formOptions: {
            caseOptions: cases.map((item) => ({
                value: item.id,
                label: `${item.caseCode} · ${item.patient?.name || '--'}`
            })),
            hospitalOptions: hospitals
                .filter((item) => item.id !== currentUser.hospitalId)
                .map((item) => ({
                    value: item.id,
                    label: item.name
                })),
            typeOptions: [
                { value: 'REFERRAL', label: '上转' },
                { value: 'REMOTE_CONSULTATION', label: '远程会诊' },
                { value: 'INTERNAL_CONSULTATION', label: '院内会诊' }
            ]
        }
    }
}

export async function createReferralService({ currentUser, payload }) {
    const caseId = Number(payload.caseId)
    const toHospitalId = Number(payload.toHospitalId)
    const type = payload.type
    const note = (payload.note || '').trim()

    if (!caseId) throw new Error('请选择病例')
    if (!toHospitalId) throw new Error('请选择目标医院')

    const medicalCase = await prisma.medicalCase.findFirst({
        where: {
            id: caseId,
            doctorId: currentUser.id
        }
    })

    if (!medicalCase) {
        throw new Error('病例不存在，或你无权操作')
    }

    const created = await prisma.referral.create({
        data: {
            referralCode: generateReferralCode(),
            caseId,
            fromHospitalId: currentUser.hospitalId,
            toHospitalId,
            type,
            status: 'PENDING',
            note
        }
    })

    await prisma.medicalCase.update({
        where: { id: medicalCase.id },
        data: {
            status: 'REFERRED'
        }
    })

    await prisma.auditLog.create({
        data: {
            userId: currentUser.id,
            actorName: currentUser.realName,
            actorRole: currentUser.role,
            actionType: 'CREATE_REFERRAL',
            targetType: 'REFERRAL',
            targetId: created.referralCode,
            detail: `发起${buildTypeLabel(type)}`,
            ipAddress: ''
        }
    })

    return {
        referralId: created.id,
        referralCode: created.referralCode
    }
}

export async function acknowledgeReferralService({ currentUser, referralId }) {
    const referral = await prisma.referral.findFirst({
        where: {
            id: referralId,
            medicalCase: {
                doctorId: currentUser.id
            }
        }
    })

    if (!referral) {
        throw new Error('申请不存在，或你无权操作')
    }

    await prisma.auditLog.create({
        data: {
            userId: currentUser.id,
            actorName: currentUser.realName,
            actorRole: currentUser.role,
            actionType: 'ACKNOWLEDGE_REFERRAL_CALLBACK',
            targetType: 'REFERRAL',
            targetId: referral.referralCode,
            detail: '确认查看回传意见',
            ipAddress: ''
        }
    })

    return {
        referralId: referral.id
    }
}
