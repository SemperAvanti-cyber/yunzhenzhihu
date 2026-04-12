import prisma from '../../utils/prisma.js'

function formatDate(date) {
    if (!date) return '--'
    return new Date(date).toISOString().slice(0, 10)
}

function buildProjectStatusMeta(status) {
    if (status === 'ACTIVE') {
        return { label: '进行中', className: 'blue' }
    }
    if (status === 'DELAYED') {
        return { label: '延期中', className: 'warning' }
    }
    if (status === 'COMPLETED') {
        return { label: '已完成', className: 'success' }
    }
    return { label: status || '未知', className: 'neutral' }
}

function buildMemberRoleLabel(role) {
    if (role === 'PI') return '项目负责人'
    if (role === 'MEMBER') return '正式成员'
    if (role === 'COLLABORATOR') return '协作成员'
    return role || '成员'
}

function buildMilestones(project, tasks) {
    const milestoneList = []

    milestoneList.push({
        title: '项目登记完成',
        desc: `项目编号 ${project.projectCode} 已进入项目空间`,
        done: true
    })

    milestoneList.push({
        title: '伦理材料有效',
        desc: project.ethicsCode
            ? `伦理批件 ${project.ethicsCode}，有效期至 ${formatDate(project.ethicsExpireAt)}`
            : '未登记伦理批件',
        done: !!project.ethicsCode
    })

    milestoneList.push({
        title: '数据使用范围确认',
        desc: project.dataScope || '暂无数据范围说明',
        done: !!project.dataScope
    })

    const pendingTasks = tasks.filter((item) => item.status !== 'DONE').length
    const doneTasks = tasks.filter((item) => item.status === 'DONE').length

    milestoneList.push({
        title: '协作任务推进',
        desc: `已完成 ${doneTasks} 项，待处理 ${pendingTasks} 项`,
        done: doneTasks > 0 || pendingTasks > 0
    })

    return milestoneList
}

function buildTaskSummary(tasks, currentUserId) {
    const myTasks = tasks.filter((item) => item.assigneeId === currentUserId)
    const pendingCount = myTasks.filter((item) => item.status !== 'DONE').length
    const doneCount = myTasks.filter((item) => item.status === 'DONE').length
    const urgentCount = myTasks.filter((item) => {
        if (item.status === 'DONE' || !item.dueAt) return false
        const due = new Date(item.dueAt).getTime()
        const now = Date.now()
        return due - now <= 3 * 24 * 60 * 60 * 1000
    }).length

    return {
        pendingCount,
        doneCount,
        urgentCount
    }
}

function buildProjectList(projectMemberships) {
    return projectMemberships.map((item) => {
        const statusMeta = buildProjectStatusMeta(item.project.status)

        return {
            projectId: item.project.id,
            projectCode: item.project.projectCode,
            name: item.project.name,
            status: statusMeta.label,
            statusClass: statusMeta.className,
            role: buildMemberRoleLabel(item.role),
            progress: item.project.progress ?? 0,
            principalInvestigator: item.project.principalInvestigator || '--'
        }
    })
}

function buildSelectedProject(project, membership, members, tasks, currentUserId) {
    if (!project || !membership) return null

    const statusMeta = buildProjectStatusMeta(project.status)
    const taskSummary = buildTaskSummary(tasks, currentUserId)

    return {
        projectId: project.id,
        projectCode: project.projectCode,
        name: project.name,
        role: buildMemberRoleLabel(membership.role),
        status: statusMeta.label,
        statusClass: statusMeta.className,
        progress: project.progress ?? 0,
        level: project.level || '--',
        principalInvestigator: project.principalInvestigator || '--',
        ethicsCode: project.ethicsCode || '--',
        ethicsExpireAt: formatDate(project.ethicsExpireAt),
        dataScope: project.dataScope || '暂无数据范围说明',
        taskSummary,
        milestones: buildMilestones(project, tasks),
        members: members.map((item) => ({
            id: item.id,
            realName: item.user?.realName || '--',
            title: item.user?.title || '--',
            role: buildMemberRoleLabel(item.role)
        })),
        tasks: tasks.map((item) => ({
            id: item.id,
            title: item.title,
            status: item.status,
            statusLabel:
                item.status === 'DONE'
                    ? '已完成'
                    : item.status === 'IN_PROGRESS'
                        ? '进行中'
                        : '待处理',
            statusClass:
                item.status === 'DONE'
                    ? 'success'
                    : item.status === 'IN_PROGRESS'
                        ? 'blue'
                        : 'warning',
            assigneeName: item.assignee?.realName || '--',
            dueAt: formatDate(item.dueAt)
        }))
    }
}

export async function getMyProjectsService({ currentUser, selectedProjectId }) {
    const memberships = await prisma.projectMember.findMany({
        where: {
            userId: currentUser.id
        },
        include: {
            project: true
        },
        orderBy: {
            project: {
                updatedAt: 'desc'
            }
        }
    })

    if (!memberships.length) {
        await prisma.auditLog.create({
            data: {
                userId: currentUser.id,
                actorName: currentUser.realName,
                actorRole: currentUser.role,
                actionType: 'VIEW_MY_PROJECTS',
                targetType: 'RESEARCH_PROJECT',
                targetId: 'EMPTY',
                detail: '查看我的项目页（无项目）',
                ipAddress: ''
            }
        })

        return {
            list: [],
            selectedProject: null
        }
    }

    const selectedMembership =
        memberships.find((item) => item.project.id === selectedProjectId) ||
        memberships[0]

    const selectedProject = selectedMembership.project

    const [members, tasks] = await Promise.all([
        prisma.projectMember.findMany({
            where: {
                projectId: selectedProject.id
            },
            include: {
                user: true
            },
            orderBy: {
                joinedAt: 'asc'
            }
        }),
        prisma.researchTask.findMany({
            where: {
                projectId: selectedProject.id
            },
            include: {
                assignee: true
            },
            orderBy: {
                updatedAt: 'desc'
            }
        })
    ])

    await prisma.auditLog.create({
        data: {
            userId: currentUser.id,
            actorName: currentUser.realName,
            actorRole: currentUser.role,
            actionType: 'VIEW_MY_PROJECTS',
            targetType: 'RESEARCH_PROJECT',
            targetId: selectedProject.projectCode,
            detail: '查看我的项目页',
            ipAddress: ''
        }
    })

    return {
        list: buildProjectList(memberships),
        selectedProject: buildSelectedProject(
            selectedProject,
            selectedMembership,
            members,
            tasks,
            currentUser.id
        )
    }
}
