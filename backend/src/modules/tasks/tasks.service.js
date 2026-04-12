import prisma from '../../utils/prisma.js'

function formatDate(date) {
    if (!date) return '--'
    return new Date(date).toISOString().slice(0, 10)
}

function buildStatusMeta(status) {
    if (status === 'PENDING') {
        return { label: '待接受', className: 'warning', actionText: '接受任务' }
    }
    if (status === 'IN_PROGRESS') {
        return { label: '进行中', className: 'blue', actionText: '继续处理' }
    }
    if (status === 'DONE') {
        return { label: '已完成', className: 'success', actionText: '已完成' }
    }
    return { label: status || '未知', className: 'neutral', actionText: '查看任务' }
}

function buildTypeLabel(type) {
    const map = {
        ANNOTATION: '标注协作',
        QC_REVIEW: '质控复核',
        DATA_CLEANING: '数据整理',
        CLINICAL_REVIEW: '临床复核',
        ANALYSIS: '统计分析',
        MATERIAL: '材料整理'
    }
    return map[type] || type || '协作任务'
}

function buildEntryTarget(type) {
    if (['ANNOTATION', 'QC_REVIEW', 'CLINICAL_REVIEW'].includes(type)) {
        return 'cloud'
    }
    if (['DATA_CLEANING', 'ANALYSIS', 'MATERIAL'].includes(type)) {
        return 'lab'
    }
    return 'project'
}

export async function getCollaborationBoardService({ currentUser, status }) {
    const tasks = await prisma.researchTask.findMany({
        where: {
            assigneeId: currentUser.id
        },
        include: {
            project: true
        },
        orderBy: {
            updatedAt: 'desc'
        }
    })

    const filteredTasks =
        status === 'ALL'
            ? tasks
            : tasks.filter((item) => item.status === status)

    const pendingCount = tasks.filter((item) => item.status === 'PENDING').length
    const progressCount = tasks.filter((item) => item.status === 'IN_PROGRESS').length

    const startOfWeek = new Date()
    const day = startOfWeek.getDay() || 7
    startOfWeek.setDate(startOfWeek.getDate() - day + 1)
    startOfWeek.setHours(0, 0, 0, 0)

    const weeklyNewCount = tasks.filter((item) => new Date(item.createdAt) >= startOfWeek).length

    await prisma.auditLog.create({
        data: {
            userId: currentUser.id,
            actorName: currentUser.realName,
            actorRole: currentUser.role,
            actionType: 'VIEW_COLLABORATION_BOARD',
            targetType: 'RESEARCH_TASK',
            targetId: String(currentUser.id),
            detail: '查看协作任务页',
            ipAddress: ''
        }
    })

    return {
        summary: {
            pendingCount,
            progressCount,
            weeklyNewCount
        },
        statusOptions: [
            { value: 'ALL', label: '全部' },
            { value: 'PENDING', label: '待接受' },
            { value: 'IN_PROGRESS', label: '进行中' },
            { value: 'DONE', label: '已完成' }
        ],
        currentStatus: status,
        tasks: filteredTasks.map((item) => {
            const meta = buildStatusMeta(item.status)
            return {
                id: item.id,
                title: item.title,
                desc: item.description || '暂无任务说明',
                projectName: item.project?.name || '--',
                projectId: item.project?.id || null,
                projectCode: item.project?.projectCode || '--',
                typeLabel: buildTypeLabel(item.type),
                typeRaw: item.type,
                dueAt: formatDate(item.dueAt),
                progress: item.progress ?? 0,
                note: item.note || '',
                status: meta.label,
                statusRaw: item.status,
                statusClass: meta.className,
                actionText: meta.actionText,
                entryTarget: buildEntryTarget(item.type)
            }
        })
    }
}

export async function acceptTaskService({ currentUser, taskId }) {
    const task = await prisma.researchTask.findFirst({
        where: {
            id: taskId,
            assigneeId: currentUser.id
        }
    })

    if (!task) {
        throw new Error('任务不存在，或你无权操作')
    }

    await prisma.researchTask.update({
        where: { id: task.id },
        data: {
            status: 'IN_PROGRESS',
            progress: task.progress > 0 ? task.progress : 10
        }
    })

    await prisma.auditLog.create({
        data: {
            userId: currentUser.id,
            actorName: currentUser.realName,
            actorRole: currentUser.role,
            actionType: 'ACCEPT_RESEARCH_TASK',
            targetType: 'RESEARCH_TASK',
            targetId: String(task.id),
            detail: `接受任务：${task.title}`,
            ipAddress: ''
        }
    })

    return { taskId: task.id }
}

export async function updateTaskProgressService({ currentUser, taskId, payload }) {
    const task = await prisma.researchTask.findFirst({
        where: {
            id: taskId,
            assigneeId: currentUser.id
        }
    })

    if (!task) {
        throw new Error('任务不存在，或你无权操作')
    }

    const progress = Number(payload.progress ?? task.progress ?? 0)
    const note = (payload.note || '').trim()
    const done = payload.done === true

    await prisma.researchTask.update({
        where: { id: task.id },
        data: {
            progress: done ? 100 : Math.max(0, Math.min(progress, 100)),
            note,
            status: done ? 'DONE' : 'IN_PROGRESS'
        }
    })

    await prisma.auditLog.create({
        data: {
            userId: currentUser.id,
            actorName: currentUser.realName,
            actorRole: currentUser.role,
            actionType: 'UPDATE_RESEARCH_TASK_PROGRESS',
            targetType: 'RESEARCH_TASK',
            targetId: String(task.id),
            detail: `更新任务进度：${task.title}`,
            ipAddress: ''
        }
    })

    return { taskId: task.id }
}
