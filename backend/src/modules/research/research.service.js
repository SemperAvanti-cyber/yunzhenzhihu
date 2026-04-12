import prisma from '../../utils/prisma.js'

function generateApprovalCode() {
    const stamp = String(Date.now()).slice(-6)
    return `APR-${new Date().getFullYear()}-${stamp}`
}

function formatDate(date) {
    if (!date) return '--'
    return new Date(date).toISOString().slice(0, 10)
}

function buildAccessInfo(currentUser) {
    const hasAccess = currentUser.hasResearchAccess === true

    return {
        hasResearchAccess: hasAccess,
        statusLabel: hasAccess ? '科研能力已开通' : '科研能力待开通',
        statusClass: hasAccess ? 'success' : 'warning',
        description: hasAccess
            ? '你已具备科研中心完整访问权限，可进入影像云平台与开放实验平台。'
            : '当前可先登记已获批项目，待管理员核验后开放影像云与实验平台。'
    }
}

function buildTodoList(tasks, approvals) {
    const todoList = []

    tasks
        .filter((item) => item.status !== 'DONE')
        .slice(0, 3)
        .forEach((item) => {
            todoList.push({
                id: `task-${item.id}`,
                title: item.title,
                desc: `${item.project?.name || '项目任务'} · 截止 ${formatDate(item.dueAt)}`,
                tag: item.status === 'IN_PROGRESS' ? '进行中' : '待处理',
                tagClass: item.status === 'IN_PROGRESS' ? 'blue' : 'warning',
                path: '/doctor/research/projects'
            })
        })

    approvals
        .filter((item) => ['PENDING', 'UNDER_REVIEW', 'RETURNED'].includes(item.status))
        .slice(0, 3)
        .forEach((item) => {
            todoList.push({
                id: `approval-${item.id}`,
                title:
                    item.type === 'PROJECT_REGISTRATION'
                        ? '项目登记审核中'
                        : item.type === 'EXPORT_REQUEST'
                            ? '数据导出申请处理中'
                            : '科研申请处理中',
                desc: `${item.approvalCode} · 当前状态 ${item.status}`,
                tag: item.status === 'RETURNED' ? '需补充' : '待审批',
                tagClass: item.status === 'RETURNED' ? 'danger' : 'warning',
                path: '/doctor/research/projects'
            })
        })

    return todoList
}

export async function getResearchOverviewService({ currentUser }) {
    const [memberships, tasks, approvals] = await Promise.all([
        prisma.projectMember.findMany({
            where: { userId: currentUser.id },
            include: { project: true }
        }),
        prisma.researchTask.findMany({
            where: { assigneeId: currentUser.id },
            include: { project: true },
            orderBy: { updatedAt: 'desc' },
            take: 10
        }),
        prisma.approvalRecord.findMany({
            where: { applicantId: currentUser.id },
            orderBy: { createdAt: 'desc' },
            take: 10
        })
    ])

    const now = new Date()
    const projects = memberships.map((item) => item.project)

    const projectSpaceCount = projects.length
    const pendingTaskCount = tasks.filter((item) => item.status !== 'DONE').length
    const pendingApprovalCount = approvals.filter((item) =>
        ['PENDING', 'UNDER_REVIEW', 'RETURNED'].includes(item.status)
    ).length
    const validEthicsCount = projects.filter((item) => !item.ethicsExpireAt || item.ethicsExpireAt > now).length

    await prisma.auditLog.create({
        data: {
            userId: currentUser.id,
            actorName: currentUser.realName,
            actorRole: currentUser.role,
            actionType: 'VIEW_RESEARCH_OVERVIEW',
            targetType: 'RESEARCH_CENTER',
            targetId: String(currentUser.id),
            detail: '查看科研总览页',
            ipAddress: ''
        }
    })

    return {
        access: buildAccessInfo(currentUser),
        heroStats: {
            projectSpaceCount,
            pendingTaskCount,
            pendingApprovalCount,
            validEthicsCount
        },
        todoList: buildTodoList(tasks, approvals),
        platformEntries: [
            {
                key: 'projects',
                title: '我的项目',
                desc: '查看项目空间、负责人、成员、里程碑与项目台账。',
                path: '/doctor/research/projects',
                enabled: true,
                buttonText: '立即进入',
                note: `${projectSpaceCount} 个项目空间`
            },
            {
                key: 'recruit',
                title: '协作招募',
                desc: '查看协作任务、招募信息与跨项目协同机会。',
                path: '/doctor/research/recruit',
                enabled: true,
                buttonText: '立即进入',
                note: `${pendingTaskCount} 条待办`
            },
            {
                key: 'cloud',
                title: '影像云平台',
                desc: '在项目授权范围内浏览研究副本、历史对比、共享调用与质控查看。',
                path: '/doctor/imaging-cloud',
                enabled: currentUser.hasResearchAccess === true,
                buttonText: currentUser.hasResearchAccess ? '立即进入' : '待开放',
                note: currentUser.hasResearchAccess ? '已开通' : '需科研权限'
            },
            {
                key: 'lab',
                title: '开放实验平台',
                desc: '继续完成数据整理、在线标注、统计分析、实验验证与成果沉淀。',
                path: '/doctor/open-lab',
                enabled: currentUser.hasResearchAccess === true,
                buttonText: currentUser.hasResearchAccess ? '立即进入' : '待开放',
                note: currentUser.hasResearchAccess ? '已开通' : '需科研权限'
            }
        ]
    }
}

export async function submitProjectRegistrationService({ currentUser, payload }) {
    const projectName = (payload.projectName || '').trim()
    const projectLevel = (payload.projectLevel || '').trim()
    const approvalNo = (payload.approvalNo || '').trim()
    const ethicsCode = (payload.ethicsCode || '').trim()
    const dataScope = (payload.dataScope || '').trim()
    const summary = (payload.summary || '').trim()

    if (!projectName) {
        throw new Error('请填写项目名称')
    }

    if (!approvalNo) {
        throw new Error('请填写获批编号 / 立项编号')
    }

    const approval = await prisma.approvalRecord.create({
        data: {
            approvalCode: generateApprovalCode(),
            type: 'PROJECT_REGISTRATION',
            targetType: 'RESEARCH_PROJECT',
            targetId: `PENDING-${Date.now()}`,
            applicantId: currentUser.id,
            status: 'PENDING',
            reason: `登记已获批项目：${projectName}`,
            snapshotJson: {
                projectName,
                projectLevel,
                approvalNo,
                ethicsCode,
                dataScope,
                summary,
                submittedAt: new Date().toISOString()
            }
        }
    })

    await prisma.auditLog.create({
        data: {
            userId: currentUser.id,
            actorName: currentUser.realName,
            actorRole: currentUser.role,
            actionType: 'SUBMIT_PROJECT_REGISTRATION',
            targetType: 'APPROVAL_RECORD',
            targetId: approval.approvalCode,
            detail: `提交已获批项目登记：${projectName}`,
            ipAddress: ''
        }
    })

    return {
        approvalCode: approval.approvalCode,
        status: approval.status
    }
}
