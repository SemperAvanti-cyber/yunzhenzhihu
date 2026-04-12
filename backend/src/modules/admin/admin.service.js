import prisma from '../../utils/prisma.js'

const MANAGED_USER_ROLES = ['DOCTOR', 'HOSPITAL_ADMIN', 'RESEARCH_ADMIN', 'SECURITY_ADMIN']

function assertAdminUser(currentUser) {
    const role = currentUser?.role || ''
    const ok =
        role === 'HOSPITAL_ADMIN' ||
        role === 'RESEARCH_ADMIN' ||
        role === 'SECURITY_ADMIN'

    if (!ok) {
        throw new Error('你无权访问管理员接口')
    }
}

function buildUserRoleLabel(role) {
    if (role === 'DOCTOR') return '医生'
    if (role === 'HOSPITAL_ADMIN') return '医院管理员'
    if (role === 'RESEARCH_ADMIN') return '科研管理员'
    if (role === 'SECURITY_ADMIN') return '安全管理员'
    return role || '--'
}

function formatDate(date) {
    if (!date) return '--'
    return new Date(date).toISOString().slice(0, 10)
}

function getTodayStart() {
    const d = new Date()
    d.setHours(0, 0, 0, 0)
    return d
}

function buildScopeMeta(scope) {
    if (scope === 'research') {
        return {
            label: '科研合规管理员',
            desc: '负责项目登记审核、伦理核验、数据导出审批与匿名化抽检'
        }
    }

    if (scope === 'security') {
        return {
            label: '安全审计管理员',
            desc: '负责审计日志、敏感操作追踪、导出追溯与系统级安全治理'
        }
    }

    return {
        label: '医院管理员',
        desc: '负责医生账号、院内业务协同与跨院会诊行政流转'
    }
}

function buildMetric(label, value, note, trend, type = 'up') {
    return { label, value: String(value), note, trend, type }
}

function buildAccountStatusMeta(status) {
    if (status === 'PENDING') {
        return { label: '待审核', className: 'warning' }
    }
    if (status === 'DISABLED') {
        return { label: '停用', className: 'danger' }
    }
    return { label: '启用', className: 'success' }
}

function buildApprovalTypeLabel(type) {
    if (type === 'PROJECT_REGISTRATION') return '项目登记'
    if (type === 'EXPORT_REQUEST') return '导出审批'
    if (type === 'ANONYMIZATION_QC') return '脱敏抽检'
    return type || '未知类型'
}

function buildApprovalStatusMeta(status) {
    if (status === 'PENDING') return { label: '待审核', className: 'warning' }
    if (status === 'UNDER_REVIEW') return { label: '审核中', className: 'blue' }
    if (status === 'APPROVED') return { label: '已通过', className: 'success' }
    if (status === 'RETURNED') return { label: '已退回', className: 'warning' }
    if (status === 'REJECTED') return { label: '已驳回', className: 'danger' }
    return { label: status || '未知', className: 'neutral' }
}

function buildRiskMeta(actionType = '', detail = '') {
    const highRiskActions = [
        'DISABLE_ACCOUNT',
        'ENABLE_ACCOUNT',
        'TOGGLE_RESEARCH_ACCESS',
        'EXPORT_AI_REPORT',
        'CREATE_REFERRAL',
        'RESET_PASSWORD',
        'REVIEW_APPROVAL'
    ]

    const warningActions = [
        'UPDATE_EXPERIMENT_RUN',
        'UPLOAD_FOLLOW_UP_IMAGE',
        'CONFIRM_AI_DIAGNOSIS',
        'REVISE_AI_DIAGNOSIS'
    ]

    if (highRiskActions.includes(actionType)) {
        return { level: '高危', className: 'danger' }
    }

    if (warningActions.includes(actionType)) {
        return { level: '警告', className: 'warning' }
    }

    if ((detail || '').includes('导出')) {
        return { level: '警告', className: 'warning' }
    }

    return { level: '普通', className: 'info' }
}

export async function getAdminOverviewService({ currentUser, scope }) {
    assertAdminUser(currentUser)

    const todayStart = getTodayStart()
    const scopeMeta = buildScopeMeta(scope)
    const hospitalId = currentUser.hospitalId || null

    const [
        totalUsers,
        enabledDoctors,
        pendingAccounts,
        pendingReferrals,
        todayAuditCount,
        pendingProjectApprovals,
        pendingExportApprovals,
        pendingQcSampling,
        securityHighRiskCount,
        exportTraceCount
    ] = await Promise.all([
        prisma.user.count({
            where: hospitalId ? { hospitalId } : {}
        }),
        prisma.user.count({
            where: {
                ...(hospitalId ? { hospitalId } : {}),
                role: 'DOCTOR',
                accountStatus: 'ENABLED'
            }
        }),
        prisma.user.count({
            where: {
                ...(hospitalId ? { hospitalId } : {}),
                accountStatus: 'PENDING'
            }
        }),
        prisma.referral.count({
            where: {
                status: 'PENDING',
                ...(hospitalId
                    ? {
                        medicalCase: {
                            doctor: { hospitalId }
                        }
                    }
                    : {})
            }
        }),
        prisma.auditLog.count({
            where: {
                createdAt: {
                    gte: todayStart
                }
            }
        }),
        prisma.approvalRecord.count({
            where: {
                type: 'PROJECT_REGISTRATION',
                status: {
                    in: ['PENDING', 'UNDER_REVIEW']
                }
            }
        }),
        prisma.approvalRecord.count({
            where: {
                type: 'EXPORT_REQUEST',
                status: {
                    in: ['PENDING', 'UNDER_REVIEW']
                }
            }
        }),
        prisma.approvalRecord.count({
            where: {
                type: 'ANONYMIZATION_QC',
                status: {
                    in: ['PENDING', 'UNDER_REVIEW']
                }
            }
        }),
        prisma.auditLog.count({
            where: {
                createdAt: { gte: todayStart },
                actionType: {
                    in: [
                        'DISABLE_ACCOUNT',
                        'RESET_PASSWORD',
                        'EXPORT_AI_REPORT',
                        'CREATE_REFERRAL',
                        'TOGGLE_RESEARCH_ACCESS'
                    ]
                }
            }
        }),
        prisma.auditLog.count({
            where: {
                actionType: {
                    in: ['EXPORT_AI_REPORT']
                }
            }
        })
    ])

    let metrics = []
    let todos = []
    let quickEntries = []

    if (scope === 'research') {
        metrics = [
            buildMetric('待审核项目', pendingProjectApprovals, '项目登记与材料核验'),
            buildMetric('待审批导出', pendingExportApprovals, '导出默认进入审批流', '重点', 'warning'),
            buildMetric('待抽检样本', pendingQcSampling, '脱敏质量与边界抽检', '抽检', 'warning'),
            buildMetric('今日审计记录', todayAuditCount, '所有关键操作留痕')
        ]

        todos = [
            {
                title: '项目登记待审核',
                desc: `${pendingProjectApprovals} 条项目登记等待核验材料与伦理状态`,
                badge: '待处理',
                badgeType: 'warning',
                path: '/admin/permissions'
            },
            {
                title: '导出审批待终审',
                desc: `${pendingExportApprovals} 条匿名数据导出申请等待合规确认`,
                badge: '进行中',
                badgeType: 'info',
                path: '/admin/permissions'
            },
            {
                title: '匿名化抽检任务',
                desc: `${pendingQcSampling} 条脱敏样本需要抽查边界`,
                badge: '抽检',
                badgeType: 'danger',
                path: '/admin/permissions'
            }
        ]

        quickEntries = [
            {
                title: '项目合规治理',
                desc: '审核项目登记、伦理材料、导出申请与匿名化抽检',
                path: '/admin/permissions'
            }
        ]
    } else if (scope === 'security') {
        metrics = [
            buildMetric('今日审计记录', todayAuditCount, '全平台关键行为留痕'),
            buildMetric('高危安全告警', securityHighRiskCount, '建议优先闭环', '高优先级', 'danger'),
            buildMetric('导出追溯记录', exportTraceCount, '可追踪历史导出链路', '追溯', 'warning'),
            buildMetric('活跃账号总数', totalUsers, '平台当前活跃范围')
        ]

        todos = [
            {
                title: '高危敏感操作复核',
                desc: `${securityHighRiskCount} 条高风险操作需要安全管理员确认`,
                badge: '高优先级',
                badgeType: 'danger',
                path: '/admin/audit'
            },
            {
                title: '导出链路追溯',
                desc: `${exportTraceCount} 条导出记录支持链路追踪与复核`,
                badge: '追溯',
                badgeType: 'warning',
                path: '/admin/audit'
            },
            {
                title: '系统级安全治理',
                desc: '检查越权访问预警、备份恢复与安全策略配置',
                badge: '系统',
                badgeType: 'info',
                path: '/admin/security'
            }
        ]

        quickEntries = [
            {
                title: '审计日志',
                desc: '检索敏感操作、筛查导出行为、定位异常轨迹',
                path: '/admin/audit'
            },
            {
                title: '系统安全',
                desc: '管理策略、备份恢复、预警与安全基线',
                path: '/admin/security'
            }
        ]
    } else {
        metrics = [
            buildMetric('启用医生账号', enabledDoctors, '当前医院医生账号正常使用'),
            buildMetric('待审核账号', pendingAccounts, '等待账号开通确认', '待处理', 'warning'),
            buildMetric('待审批会诊', pendingReferrals, '跨院会诊行政流转', '协同', 'warning'),
            buildMetric('今日治理日志', todayAuditCount, '账号与关键业务留痕')
        ]

        todos = [
            {
                title: '账号开通待处理',
                desc: `${pendingAccounts} 个账号待医院管理员确认开通`,
                badge: '待处理',
                badgeType: 'warning',
                path: '/admin/accounts'
            },
            {
                title: '跨院会诊行政流转',
                desc: `${pendingReferrals} 条会诊申请等待流转确认`,
                badge: '协同',
                badgeType: 'info',
                path: '/admin/consultation'
            },
            {
                title: '账号状态与权限调整',
                desc: '检查停用账号、科研权限与科室归属是否准确',
                badge: '账号',
                badgeType: 'warning',
                path: '/admin/accounts'
            }
        ]

        quickEntries = [
            {
                title: '账号管理',
                desc: '启停账号、分配科室、管理基础权限与科研权限',
                path: '/admin/accounts'
            },
            {
                title: '跨院会诊审批',
                desc: '处理跨院远程会诊行政流转与协同确认',
                path: '/admin/consultation'
            }
        ]
    }

    return {
        scope,
        scopeLabel: scopeMeta.label,
        scopeDesc: scopeMeta.desc,
        metrics,
        todos,
        boundaries: [
            {
                title: '医院管理员',
                desc: '负责账号、院内协同与跨院会诊行政流转，不参与临床判断'
            },
            {
                title: '科研合规管理员',
                desc: '负责项目合规、伦理核验、导出审批与匿名化抽检'
            },
            {
                title: '安全审计管理员',
                desc: '负责审计日志、安全预警、导出追溯与系统级治理'
            }
        ],
        quickEntries
    }
}

export async function getAdminAccountsService({
                                                  currentUser,
                                                  keyword,
                                                  departmentId,
                                                  status,
                                                  userId
                                              }) {
    assertAdminUser(currentUser)

    const hospitalId = currentUser.hospitalId || null
    const todayStart = getTodayStart()

    const where = {
        ...(hospitalId ? { hospitalId } : {}),
        role: {
            in: MANAGED_USER_ROLES
        },
        ...(departmentId ? { departmentId } : {}),
        ...(status !== 'ALL' ? { accountStatus: status } : {}),
        ...(keyword
            ? {
                OR: [
                    { realName: { contains: keyword } },
                    { username: { contains: keyword } },
                    { email: { contains: keyword } }
                ]
            }
            : {})
    }

    const [users, departments, enabledCount, pendingCount, disabledCount, todayChanges] =
        await Promise.all([
            prisma.user.findMany({
                where,
                include: {
                    department: true,
                    hospital: true
                },
                orderBy: {
                    updatedAt: 'desc'
                }
            }),
            prisma.department.findMany({
                where: hospitalId ? { hospitalId } : {},
                orderBy: { id: 'asc' }
            }),
            prisma.user.count({
                where: {
                    ...(hospitalId ? { hospitalId } : {}),
                    accountStatus: 'ENABLED'
                }
            }),
            prisma.user.count({
                where: {
                    ...(hospitalId ? { hospitalId } : {}),
                    accountStatus: 'PENDING'
                }
            }),
            prisma.user.count({
                where: {
                    ...(hospitalId ? { hospitalId } : {}),
                    accountStatus: 'DISABLED'
                }
            }),
            prisma.auditLog.count({
                where: {
                    createdAt: { gte: todayStart },
                    actionType: {
                        in: [
                            'ENABLE_ACCOUNT',
                            'DISABLE_ACCOUNT',
                            'TOGGLE_RESEARCH_ACCESS',
                            'RESET_PASSWORD'
                        ]
                    }
                }
            })
        ])

    const selected =
        users.find((item) => item.id === userId) ||
        users[0] ||
        null

    const recentActions = selected
        ? await prisma.auditLog.findMany({
            where: {
                OR: [
                    { userId: selected.id },
                    { targetId: String(selected.id) }
                ]
            },
            orderBy: {
                createdAt: 'desc'
            },
            take: 6
        })
        : []

    if (selected) {
        await prisma.auditLog.create({
            data: {
                userId: currentUser.id,
                actorName: currentUser.realName,
                actorRole: currentUser.role,
                actionType: 'VIEW_ACCOUNT_MANAGE',
                targetType: 'USER',
                targetId: String(selected.id),
                detail: '查看账号管理页',
                ipAddress: ''
            }
        })
    }

    return {
        summary: {
            enabledCount,
            pendingCount,
            disabledCount,
            todayChanges
        },
        filters: {
            keyword,
            currentDepartmentId: departmentId || '',
            currentStatus: status,
            departmentOptions: departments.map((item) => ({
                value: item.id,
                label: item.name
            })),
            statusOptions: [
                { value: 'ALL', label: '全部状态' },
                { value: 'ENABLED', label: '启用' },
                { value: 'PENDING', label: '待审核' },
                { value: 'DISABLED', label: '停用' }
            ]
        },
        list: users.map((item) => {
            const statusMeta = buildAccountStatusMeta(item.accountStatus)
            return {
                id: item.id,
                realName: item.realName || '--',
                account: item.username || '--',
                email: item.email || '--',
                department: item.department?.name || '--',
                title: item.title || '--',
                roleLabel: buildUserRoleLabel(item.role),
                status: statusMeta.label,
                statusClass: statusMeta.className,
                hasResearchAccess: item.hasResearchAccess === true,
                lastLoginAt: formatDate(item.lastLoginAt || item.updatedAt)
            }
        }),
        selected: selected
            ? {
                id: selected.id,
                realName: selected.realName || '--',
                account: selected.username || '--',
                email: selected.email || '--',
                department: selected.department?.name || '--',
                hospital: selected.hospital?.name || '--',
                title: selected.title || '--',
                roleLabel: buildUserRoleLabel(selected.role),
                status: buildAccountStatusMeta(selected.accountStatus).label,
                statusRaw: selected.accountStatus,
                statusClass: buildAccountStatusMeta(selected.accountStatus).className,
                hasResearchAccess: selected.hasResearchAccess === true,
                lastLoginAt: formatDate(selected.lastLoginAt || selected.updatedAt),
                recentActions: recentActions.map((item) => ({
                    id: item.id,
                    actionType: item.actionType,
                    detail: item.detail || '--',
                    createdAt: formatDate(item.createdAt)
                }))
            }
            : null
    }
}

export async function updateAccountStatusService({
                                                     currentUser,
                                                     targetUserId,
                                                     accountStatus
                                                 }) {
    assertAdminUser(currentUser)

    const target = await prisma.user.findUnique({
        where: { id: targetUserId }
    })

    if (!target) {
        throw new Error('目标账号不存在')
    }

    const updated = await prisma.user.update({
        where: { id: target.id },
        data: {
            accountStatus
        }
    })

    await prisma.auditLog.create({
        data: {
            userId: currentUser.id,
            actorName: currentUser.realName,
            actorRole: currentUser.role,
            actionType:
                accountStatus === 'DISABLED'
                    ? 'DISABLE_ACCOUNT'
                    : accountStatus === 'ENABLED'
                        ? 'ENABLE_ACCOUNT'
                        : 'PENDING_ACCOUNT',
            targetType: 'USER',
            targetId: String(updated.id),
            detail: `更新账号状态为 ${accountStatus}`,
            ipAddress: ''
        }
    })

    return {
        userId: updated.id,
        accountStatus: updated.accountStatus
    }
}

export async function toggleResearchAccessService({
                                                      currentUser,
                                                      targetUserId,
                                                      hasResearchAccess
                                                  }) {
    assertAdminUser(currentUser)

    const target = await prisma.user.findUnique({
        where: { id: targetUserId }
    })

    if (!target) {
        throw new Error('目标账号不存在')
    }

    const updated = await prisma.user.update({
        where: { id: target.id },
        data: {
            hasResearchAccess
        }
    })

    await prisma.auditLog.create({
        data: {
            userId: currentUser.id,
            actorName: currentUser.realName,
            actorRole: currentUser.role,
            actionType: 'TOGGLE_RESEARCH_ACCESS',
            targetType: 'USER',
            targetId: String(updated.id),
            detail: `${hasResearchAccess ? '开通' : '关闭'}科研权限`,
            ipAddress: ''
        }
    })

    return {
        userId: updated.id,
        hasResearchAccess: updated.hasResearchAccess
    }
}

export async function getApprovalBoardService({
                                                  currentUser,
                                                  approvalId,
                                                  type,
                                                  status
                                              }) {
    assertAdminUser(currentUser)

    const where = {
        ...(type !== 'ALL' ? { type } : {}),
        ...(status !== 'ALL' ? { status } : {})
    }

    const [records, pendingProjectCount, pendingExportCount, pendingQcCount] =
        await Promise.all([
            prisma.approvalRecord.findMany({
                where,
                include: {
                    applicant: true,
                    project: true
                },
                orderBy: {
                    updatedAt: 'desc'
                }
            }),
            prisma.approvalRecord.count({
                where: {
                    type: 'PROJECT_REGISTRATION',
                    status: {
                        in: ['PENDING', 'UNDER_REVIEW']
                    }
                }
            }),
            prisma.approvalRecord.count({
                where: {
                    type: 'EXPORT_REQUEST',
                    status: {
                        in: ['PENDING', 'UNDER_REVIEW']
                    }
                }
            }),
            prisma.approvalRecord.count({
                where: {
                    type: 'ANONYMIZATION_QC',
                    status: {
                        in: ['PENDING', 'UNDER_REVIEW']
                    }
                }
            })
        ])

    const selected =
        records.find((item) => item.id === approvalId) ||
        records[0] ||
        null

    if (selected) {
        await prisma.auditLog.create({
            data: {
                userId: currentUser.id,
                actorName: currentUser.realName,
                actorRole: currentUser.role,
                actionType: 'VIEW_APPROVAL_BOARD',
                targetType: 'APPROVAL_RECORD',
                targetId: selected.approvalCode,
                detail: '查看项目合规治理页',
                ipAddress: ''
            }
        })
    }

    return {
        summary: {
            pendingProjectCount,
            pendingExportCount,
            pendingQcCount
        },
        filters: {
            currentType: type,
            currentStatus: status,
            typeOptions: [
                { value: 'ALL', label: '全部类型' },
                { value: 'PROJECT_REGISTRATION', label: '项目登记' },
                { value: 'EXPORT_REQUEST', label: '导出审批' },
                { value: 'ANONYMIZATION_QC', label: '脱敏抽检' }
            ],
            statusOptions: [
                { value: 'ALL', label: '全部状态' },
                { value: 'PENDING', label: '待审核' },
                { value: 'UNDER_REVIEW', label: '审核中' },
                { value: 'APPROVED', label: '已通过' },
                { value: 'RETURNED', label: '已退回' },
                { value: 'REJECTED', label: '已驳回' }
            ]
        },
        queue: records.map((item) => {
            const typeMeta = buildApprovalTypeLabel(item.type)
            const statusMeta = buildApprovalStatusMeta(item.status)
            return {
                id: item.id,
                approvalCode: item.approvalCode,
                typeLabel: typeMeta,
                typeRaw: item.type,
                title: item.title,
                applicantName: item.applicant?.realName || '--',
                projectName: item.project?.name || '--',
                status: statusMeta.label,
                statusRaw: item.status,
                statusClass: statusMeta.className,
                updatedAt: formatDate(item.updatedAt)
            }
        }),
        selected: selected
            ? {
                id: selected.id,
                approvalCode: selected.approvalCode,
                title: selected.title,
                typeLabel: buildApprovalTypeLabel(selected.type),
                typeRaw: selected.type,
                status: buildApprovalStatusMeta(selected.status).label,
                statusRaw: selected.status,
                statusClass: buildApprovalStatusMeta(selected.status).className,
                applicantName: selected.applicant?.realName || '--',
                projectName: selected.project?.name || '--',
                projectCode: selected.project?.projectCode || '--',
                materialSummary: selected.materialSummary || '暂无材料摘要',
                dataScope: selected.dataScope || '暂无数据范围说明',
                reviewerComment: selected.reviewerComment || ''
            }
            : null
    }
}

export async function reviewApprovalService({
                                                currentUser,
                                                approvalId,
                                                nextStatus,
                                                reviewerComment
                                            }) {
    assertAdminUser(currentUser)

    const record = await prisma.approvalRecord.findUnique({
        where: { id: approvalId }
    })

    if (!record) {
        throw new Error('审批记录不存在')
    }

    const allowed = ['APPROVED', 'RETURNED', 'REJECTED', 'UNDER_REVIEW']
    if (!allowed.includes(nextStatus)) {
        throw new Error('审批状态不合法')
    }

    const updated = await prisma.approvalRecord.update({
        where: { id: record.id },
        data: {
            status: nextStatus,
            reviewerId: currentUser.id,
            reviewerComment: reviewerComment || ''
        }
    })

    await prisma.auditLog.create({
        data: {
            userId: currentUser.id,
            actorName: currentUser.realName,
            actorRole: currentUser.role,
            actionType: 'REVIEW_APPROVAL',
            targetType: 'APPROVAL_RECORD',
            targetId: updated.approvalCode,
            detail: `审批处理结果：${nextStatus}`,
            ipAddress: ''
        }
    })

    return {
        approvalId: updated.id,
        status: updated.status
    }
}

export async function getAuditLogBoardService({
                                                  currentUser,
                                                  logId,
                                                  keyword,
                                                  actionType,
                                                  riskLevel
                                              }) {
    assertAdminUser(currentUser)

    const todayStart = getTodayStart()

    const logs = await prisma.auditLog.findMany({
        where: {
            ...(actionType !== 'ALL' ? { actionType } : {}),
            ...(keyword
                ? {
                    OR: [
                        { actorName: { contains: keyword } },
                        { actionType: { contains: keyword } },
                        { detail: { contains: keyword } },
                        { targetId: { contains: keyword } }
                    ]
                }
                : {})
        },
        orderBy: {
            createdAt: 'desc'
        },
        take: 200
    })

    const logsWithRisk = logs.map((item) => {
        const riskMeta = buildRiskMeta(item.actionType, item.detail || '')
        return {
            ...item,
            riskLevel: riskMeta.level,
            riskClass: riskMeta.className
        }
    })

    const filteredLogs =
        riskLevel === 'ALL'
            ? logsWithRisk
            : logsWithRisk.filter((item) => item.riskLevel === riskLevel)

    const selected =
        filteredLogs.find((item) => item.id === logId) ||
        filteredLogs[0] ||
        null

    const [todayCount, highRiskCount, exportTraceCount, uniqueActorCount] =
        await Promise.all([
            prisma.auditLog.count({
                where: {
                    createdAt: { gte: todayStart }
                }
            }),
            prisma.auditLog.count({
                where: {
                    createdAt: { gte: todayStart },
                    actionType: {
                        in: [
                            'DISABLE_ACCOUNT',
                            'ENABLE_ACCOUNT',
                            'TOGGLE_RESEARCH_ACCESS',
                            'EXPORT_AI_REPORT',
                            'CREATE_REFERRAL',
                            'REVIEW_APPROVAL'
                        ]
                    }
                }
            }),
            prisma.auditLog.count({
                where: {
                    actionType: 'EXPORT_AI_REPORT'
                }
            }),
            prisma.auditLog.groupBy({
                by: ['actorName'],
                where: {
                    createdAt: { gte: todayStart }
                }
            }).then((rows) => rows.length)
        ])

    const relatedLogs = selected
        ? logsWithRisk
            .filter((item) => item.actorName === selected.actorName)
            .slice(0, 6)
            .map((item) => ({
                id: item.id,
                actionType: item.actionType,
                detail: item.detail || '--',
                createdAt: formatDate(item.createdAt)
            }))
        : []

    if (selected) {
        await prisma.auditLog.create({
            data: {
                userId: currentUser.id,
                actorName: currentUser.realName,
                actorRole: currentUser.role,
                actionType: 'VIEW_AUDIT_BOARD',
                targetType: 'AUDIT_LOG',
                targetId: String(selected.id),
                detail: '查看审计日志页',
                ipAddress: ''
            }
        })
    }

    const actionTypeOptions = [
        'ALL',
        ...Array.from(new Set(logs.map((item) => item.actionType))).sort()
    ]

    return {
        summary: {
            todayCount,
            highRiskCount,
            exportTraceCount,
            uniqueActorCount
        },
        filters: {
            keyword,
            currentActionType: actionType,
            currentRiskLevel: riskLevel,
            actionTypeOptions: actionTypeOptions.map((item) => ({
                value: item,
                label: item === 'ALL' ? '全部动作' : item
            })),
            riskOptions: [
                { value: 'ALL', label: '全部风险' },
                { value: '高危', label: '高危' },
                { value: '警告', label: '警告' },
                { value: '普通', label: '普通' }
            ]
        },
        list: filteredLogs.map((item) => ({
            id: item.id,
            actorName: item.actorName || '--',
            actorRole: item.actorRole || '--',
            actionType: item.actionType,
            targetType: item.targetType || '--',
            targetId: item.targetId || '--',
            riskLevel: item.riskLevel,
            riskClass: item.riskClass,
            createdAt: formatDate(item.createdAt),
            detail: item.detail || '--'
        })),
        selected: selected
            ? {
                id: selected.id,
                actorName: selected.actorName || '--',
                actorRole: selected.actorRole || '--',
                actionType: selected.actionType,
                targetType: selected.targetType || '--',
                targetId: selected.targetId || '--',
                riskLevel: selected.riskLevel,
                riskClass: selected.riskClass,
                detail: selected.detail || '--',
                ipAddress: selected.ipAddress || '--',
                createdAt: formatDate(selected.createdAt),
                relatedLogs
            }
            : null
    }
}
