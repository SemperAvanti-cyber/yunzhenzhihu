import prisma from '../../utils/prisma.js'

function formatDate(date) {
    if (!date) return '--'
    return new Date(date).toISOString().slice(0, 10)
}

function buildExperimentStatusMeta(status) {
    if (status === 'DRAFT') {
        return { label: '草稿', className: 'neutral' }
    }
    if (status === 'RUNNING') {
        return { label: '运行中', className: 'blue' }
    }
    if (status === 'COMPLETED') {
        return { label: '已完成', className: 'success' }
    }
    if (status === 'FAILED') {
        return { label: '失败', className: 'danger' }
    }
    return { label: status || '未知', className: 'neutral' }
}

function buildTaskTypeLabel(type) {
    const map = {
        ANNOTATION: '标注协作',
        QC_REVIEW: '质控复核',
        DATA_CLEANING: '数据整理',
        CLINICAL_REVIEW: '临床复核',
        ANALYSIS: '统计分析',
        MATERIAL: '材料整理'
    }
    return map[type] || type || '科研任务'
}

function buildMilestoneCards(project, taskCount, experimentCount) {
    return [
        {
            title: '项目空间',
            value: project?.name || '未选择项目',
            desc: project?.projectCode || '请选择项目'
        },
        {
            title: '当前协作任务',
            value: String(taskCount),
            desc: '项目相关任务'
        },
        {
            title: '实验记录数',
            value: String(experimentCount),
            desc: '当前项目实验沉淀'
        }
    ]
}

export async function getOpenLabBoardService({
                                                 currentUser,
                                                 projectId,
                                                 taskId,
                                                 experimentId
                                             }) {
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

    const selectedMembership =
        memberships.find((item) => item.projectId === projectId) || memberships[0] || null

    const selectedProject = selectedMembership?.project || null

    const [task, tasks, experiments, myCases, myImages] = await Promise.all([
        taskId
            ? prisma.researchTask.findUnique({
                where: { id: taskId },
                include: { project: true }
            })
            : Promise.resolve(null),
        selectedProject
            ? prisma.researchTask.findMany({
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
            : Promise.resolve([]),
        selectedProject
            ? prisma.experimentRun.findMany({
                where: {
                    projectId: selectedProject.id
                },
                include: {
                    createdBy: true
                },
                orderBy: {
                    updatedAt: 'desc'
                }
            })
            : Promise.resolve([]),
        prisma.medicalCase.findMany({
            where: {
                doctorId: currentUser.id
            },
            include: {
                images: true
            }
        }),
        prisma.medicalImage.findMany({
            where: {
                medicalCase: {
                    doctorId: currentUser.id
                }
            }
        })
    ])

    const selectedExperiment =
        experiments.find((item) => item.id === experimentId) || experiments[0] || null

    const pendingAnnotation = tasks.filter((item) => item.type === 'ANNOTATION' && item.status !== 'DONE').length
    const runningExperiments = experiments.filter((item) => item.status === 'RUNNING').length
    const completedExperiments = experiments.filter((item) => item.status === 'COMPLETED').length
    const totalSamples = myImages.length

    if (selectedProject) {
        await prisma.auditLog.create({
            data: {
                userId: currentUser.id,
                actorName: currentUser.realName,
                actorRole: currentUser.role,
                actionType: 'VIEW_OPEN_LAB',
                targetType: 'RESEARCH_PROJECT',
                targetId: selectedProject.projectCode,
                detail: '查看开放实验平台',
                ipAddress: ''
            }
        })
    }

    return {
        contextBanner: {
            projectName: selectedProject?.name || '',
            projectCode: selectedProject?.projectCode || '',
            taskTitle: task?.title || '',
            hasTaskContext: !!task
        },
        summary: {
            totalSamples,
            pendingAnnotation,
            runningExperiments,
            completedExperiments
        },
        quickCards: buildMilestoneCards(selectedProject, tasks.length, experiments.length),
        moduleEntries: [
            {
                key: 'dataset',
                title: '数据中心',
                desc: '查看当前样本池、数据范围、病例来源与样本总量。',
                value: `${totalSamples} 份样本`
            },
            {
                key: 'annotation',
                title: '在线标注与质控',
                desc: '标注协作、质控复核、样本修正与一致性检查入口。',
                value: `${pendingAnnotation} 条待处理`
            },
            {
                key: 'task',
                title: '协作任务',
                desc: '查看项目当前协作任务与成员分工。',
                value: `${tasks.length} 条任务`
            },
            {
                key: 'experiment',
                title: '实验记录',
                desc: '创建与维护训练实验记录、指标与结论沉淀。',
                value: `${experiments.length} 条记录`
            }
        ],
        experimentList: experiments.map((item) => {
            const statusMeta = buildExperimentStatusMeta(item.status)
            return {
                id: item.id,
                name: item.name,
                modelName: item.modelName,
                datasetName: item.datasetName,
                status: statusMeta.label,
                statusClass: statusMeta.className,
                accuracy: item.accuracy,
                recall: item.recall,
                f1Score: item.f1Score,
                createdBy: item.createdBy?.realName || '--',
                updatedAt: formatDate(item.updatedAt)
            }
        }),
        selectedExperiment: selectedExperiment
            ? {
                id: selectedExperiment.id,
                name: selectedExperiment.name,
                modelName: selectedExperiment.modelName,
                datasetName: selectedExperiment.datasetName,
                status: buildExperimentStatusMeta(selectedExperiment.status).label,
                statusRaw: selectedExperiment.status,
                statusClass: buildExperimentStatusMeta(selectedExperiment.status).className,
                accuracy: selectedExperiment.accuracy,
                recall: selectedExperiment.recall,
                f1Score: selectedExperiment.f1Score,
                note: selectedExperiment.note || '',
                createdBy: selectedExperiment.createdBy?.realName || '--',
                updatedAt: formatDate(selectedExperiment.updatedAt)
            }
            : null,
        projectOptions: memberships.map((item) => ({
            value: item.project.id,
            label: `${item.project.projectCode} · ${item.project.name}`
        })),
        taskList: tasks.slice(0, 6).map((item) => ({
            id: item.id,
            title: item.title,
            typeLabel: buildTaskTypeLabel(item.type),
            assigneeName: item.assignee?.realName || '--',
            dueAt: formatDate(item.dueAt),
            status: item.status
        }))
    }
}

export async function createExperimentRunService({ currentUser, payload }) {
    const projectId = Number(payload.projectId)
    const name = (payload.name || '').trim()
    const modelName = (payload.modelName || '').trim()
    const datasetName = (payload.datasetName || '').trim()
    const note = (payload.note || '').trim()

    if (!projectId) {
        throw new Error('请选择项目')
    }

    if (!name) {
        throw new Error('请填写实验名称')
    }

    if (!modelName) {
        throw new Error('请填写模型名称')
    }

    if (!datasetName) {
        throw new Error('请填写数据集名称')
    }

    const membership = await prisma.projectMember.findFirst({
        where: {
            projectId,
            userId: currentUser.id
        },
        include: {
            project: true
        }
    })

    if (!membership) {
        throw new Error('你未加入该项目，无法创建实验记录')
    }

    const created = await prisma.experimentRun.create({
        data: {
            projectId,
            createdById: currentUser.id,
            name,
            modelName,
            datasetName,
            status: 'DRAFT',
            note
        }
    })

    await prisma.auditLog.create({
        data: {
            userId: currentUser.id,
            actorName: currentUser.realName,
            actorRole: currentUser.role,
            actionType: 'CREATE_EXPERIMENT_RUN',
            targetType: 'EXPERIMENT_RUN',
            targetId: String(created.id),
            detail: `创建实验记录：${name}`,
            ipAddress: ''
        }
    })

    return {
        experimentId: created.id
    }
}

export async function updateExperimentRunService({
                                                     currentUser,
                                                     experimentId,
                                                     payload
                                                 }) {
    const experiment = await prisma.experimentRun.findUnique({
        where: { id: experimentId }
    })

    if (!experiment) {
        throw new Error('实验记录不存在')
    }

    const membership = await prisma.projectMember.findFirst({
        where: {
            projectId: experiment.projectId,
            userId: currentUser.id
        }
    })

    if (!membership) {
        throw new Error('你无权修改该实验记录')
    }

    const accuracy =
        payload.accuracy === '' || payload.accuracy === null || payload.accuracy === undefined
            ? null
            : Number(payload.accuracy)

    const recall =
        payload.recall === '' || payload.recall === null || payload.recall === undefined
            ? null
            : Number(payload.recall)

    const f1Score =
        payload.f1Score === '' || payload.f1Score === null || payload.f1Score === undefined
            ? null
            : Number(payload.f1Score)

    const status = payload.status || experiment.status
    const note = (payload.note || '').trim()

    const updated = await prisma.experimentRun.update({
        where: { id: experiment.id },
        data: {
            accuracy,
            recall,
            f1Score,
            status,
            note
        }
    })

    await prisma.auditLog.create({
        data: {
            userId: currentUser.id,
            actorName: currentUser.realName,
            actorRole: currentUser.role,
            actionType: 'UPDATE_EXPERIMENT_RUN',
            targetType: 'EXPERIMENT_RUN',
            targetId: String(updated.id),
            detail: `更新实验记录：${updated.name}`,
            ipAddress: ''
        }
    })

    return {
        experimentId: updated.id
    }
}
