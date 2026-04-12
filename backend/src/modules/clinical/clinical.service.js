import prisma from '../../utils/prisma.js'

function calcAgreementRate(items) {
    if (!items.length) return 0

    let matched = 0
    for (const item of items) {
        const aiTop1 = item.aiAnalyses?.[0]?.top1Disease || ''
        const diagnosisText =
            item.diagnoses?.[0]?.conclusion ||
            item.finalConclusion ||
            ''

        if (aiTop1 && diagnosisText.includes(aiTop1)) {
            matched += 1
        }
    }

    return Math.round((matched / items.length) * 1000) / 10
}

export async function getWorkbenchData(user) {
    const doctorId = user.id
    const hospitalId = user.hospitalId

    const doctorCases = await prisma.medicalCase.findMany({
        where: {
            OR: [
                { doctorId },
                {
                    doctor: {
                        hospitalId
                    }
                }
            ]
        },
        include: {
            patient: true,
            aiAnalyses: {
                orderBy: { createdAt: 'desc' },
                take: 1
            },
            diagnoses: {
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

    const pendingReviewCases = doctorCases.filter((item) => item.status === 'PENDING_REVIEW')
    const highRiskCases = doctorCases.filter((item) => (item.riskLevel || 0) >= 70)
    const followUpCases = doctorCases.filter(
        (item) => item.status === 'IN_TREATMENT' && (item.riskLevel || 0) >= 30
    )

    const referrals = await prisma.referral.findMany({
        where: {
            OR: [
                { fromHospitalId: hospitalId },
                { toHospitalId: hospitalId }
            ]
        },
        include: {
            medicalCase: {
                include: {
                    patient: true
                }
            }
        },
        orderBy: {
            updatedAt: 'desc'
        }
    })

    const completedReferrals = referrals.filter((item) => item.status === 'COMPLETED')
    const activeHighRiskReferrals = referrals.filter(
        (item) =>
            ['PENDING', 'IN_PROGRESS', 'ACCEPTED'].includes(item.status) &&
            (item.medicalCase?.riskLevel || 0) >= 70
    )
    const pendingCallbacks = referrals.filter((item) =>
        ['PENDING', 'IN_PROGRESS', 'ACCEPTED'].includes(item.status)
    )

    const agreementRate = calcAgreementRate(
        doctorCases.filter((item) => item.aiAnalyses.length && item.diagnoses.length)
    )

    const highRiskResponseRate = highRiskCases.length
        ? Math.round(
        (highRiskCases.filter((item) => item.referrals.length || item.diagnoses.length).length /
            highRiskCases.length) *
        1000
    ) / 10
        : 0

    const queueList = [
        ...pendingReviewCases.slice(0, 3).map((item) => ({
            id: `review-${item.id}`,
            target: 'diagnosis',
            caseId: item.id,
            risk: '待复核',
            riskClass: 'warning',
            title: `${item.chiefComplaint}复核`,
            meta: `${item.patient?.name || '患者'} · ${item.caseCode}`,
            rightTop: `恶性概率 ${Math.round((item.aiAnalyses?.[0]?.malignancyProb || 0) * 100)}%`,
            rightBottom: '待医生复核',
            priority: item.riskLevel || 0
        })),
        ...activeHighRiskReferrals.slice(0, 2).map((item) => ({
            id: `referral-${item.id}`,
            target: 'referral',
            caseId: item.caseId,
            referralCode: item.referralCode,
            risk: '待转诊',
            riskClass: 'danger',
            title: `${item.medicalCase?.chiefComplaint || '高危病例'}高危处理`,
            meta: `${item.referralCode} · ${item.medicalCase?.caseCode || ''}`,
            rightTop: `恶性概率 ${item.medicalCase?.riskLevel || 0}%`,
            rightBottom: '等待流转处理',
            priority: (item.medicalCase?.riskLevel || 0) + 100
        })),
        ...followUpCases.slice(0, 2).map((item) => ({
            id: `follow-${item.id}`,
            target: 'records',
            caseId: item.id,
            risk: '随访提醒',
            riskClass: 'neutral',
            title: `${item.chiefComplaint}随访跟踪`,
            meta: `${item.patient?.name || '患者'} · 治疗中`,
            rightTop: `风险分层 ${item.riskLevel || 0}`,
            rightBottom: '建议查看病例时间轴',
            priority: item.riskLevel || 0
        }))
    ]
        .sort((a, b) => (b.priority || 0) - (a.priority || 0))
        .slice(0, 5)

    const updates = [
        ...completedReferrals.slice(0, 2).map((item) => ({
            id: `update-referral-${item.id}`,
            target: 'referral',
            referralCode: item.referralCode,
            tag: '会诊',
            tagClass: 'green',
            title: `会诊/转诊结果已回传`,
            meta: `${item.referralCode} 已完成，可查看回传结果`,
            time: new Date(item.updatedAt).toLocaleTimeString('zh-CN', {
                hour: '2-digit',
                minute: '2-digit'
            })
        })),
        ...pendingReviewCases.slice(0, 1).map((item) => ({
            id: `update-case-${item.id}`,
            target: 'diagnosis',
            caseId: item.id,
            tag: '病例',
            tagClass: 'blue',
            title: `新增待复核病例`,
            meta: `${item.caseCode} 已进入工作台待处理队列`,
            time: new Date(item.updatedAt).toLocaleTimeString('zh-CN', {
                hour: '2-digit',
                minute: '2-digit'
            })
        })),
        ...activeHighRiskReferrals.slice(0, 1).map((item) => ({
            id: `update-highrisk-${item.id}`,
            target: 'referral',
            referralCode: item.referralCode,
            tag: '转诊',
            tagClass: 'orange',
            title: `高危病例进入流转流程`,
            meta: `${item.referralCode} 当前状态：${item.status}`,
            time: new Date(item.updatedAt).toLocaleTimeString('zh-CN', {
                hour: '2-digit',
                minute: '2-digit'
            })
        }))
    ]
        .sort((a, b) => String(b.time).localeCompare(String(a.time)))
        .slice(0, 3)

    return {
        metrics: [
            {
                label: '今日复核',
                value: String(pendingReviewCases.length).padStart(2, '0'),
                trend: `+${Math.max(1, pendingReviewCases.length)}`,
                type: 'up',
                note: '待医生确认'
            },
            {
                label: '已完成转诊',
                value: String(completedReferrals.length).padStart(2, '0'),
                trend: `+${Math.max(1, completedReferrals.length)}`,
                type: 'up',
                note: '高危优先处理'
            },
            {
                label: 'AI-医生一致率',
                value: `${agreementRate}%`,
                trend: agreementRate >= 80 ? '+稳定' : '需关注',
                type: agreementRate >= 80 ? 'up' : 'warning',
                note: '基于当前可比病例'
            },
            {
                label: '高危响应率',
                value: `${highRiskResponseRate}%`,
                trend: highRiskResponseRate >= 80 ? '+稳定' : '需提升',
                type: highRiskResponseRate >= 80 ? 'up' : 'warning',
                note: '高危病例处理闭环'
            }
        ],
        queueList,
        updates,
        focusStats: {
            highRiskPending: `${activeHighRiskReferrals.length} 例`,
            followUpReminders: `${followUpCases.length} 例`,
            pendingCallbacks: `${pendingCallbacks.length} 例`
        }
    }
}
