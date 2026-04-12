import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    console.log('开始清理旧数据...')

    await prisma.auditLog.deleteMany()
    await prisma.loginLog.deleteMany()
    await prisma.backupRecord.deleteMany()
    await prisma.securityAlert.deleteMany()
    await prisma.approvalRecord.deleteMany()
    await prisma.researchTask.deleteMany()
    await prisma.projectMember.deleteMany()
    await prisma.researchProject.deleteMany()
    await prisma.referral.deleteMany()
    await prisma.diagnosis.deleteMany()
    await prisma.aIAnalysis.deleteMany()
    await prisma.medicalImage.deleteMany()
    await prisma.medicalCase.deleteMany()
    await prisma.patient.deleteMany()
    await prisma.user.deleteMany()
    await prisma.department.deleteMany()
    await prisma.hospital.deleteMany()

    console.log('开始插入基础组织数据...')

    const hospitals = await Promise.all([
        prisma.hospital.create({
            data: {
                name: '乌鲁木齐市第一人民医院',
                code: 'HOSP-001',
                level: '三级综合医院',
                address: '乌鲁木齐市天山区健康路 1 号'
            }
        }),
        prisma.hospital.create({
            data: {
                name: '自治区皮肤病区域协同中心',
                code: 'HOSP-002',
                level: '区域协同中心',
                address: '乌鲁木齐市新市区协同大道 88 号'
            }
        }),
        prisma.hospital.create({
            data: {
                name: '基层协作门诊',
                code: 'HOSP-003',
                level: '基层示范点',
                address: '乌鲁木齐市米东区基层路 16 号'
            }
        })
    ])

    const departments = []
    departments.push(
        await prisma.department.create({
            data: { name: '皮肤科', code: 'DEPT-001', hospitalId: hospitals[0].id }
        })
    )
    departments.push(
        await prisma.department.create({
            data: { name: '病理科', code: 'DEPT-002', hospitalId: hospitals[0].id }
        })
    )
    departments.push(
        await prisma.department.create({
            data: { name: '医学影像协同中心', code: 'DEPT-003', hospitalId: hospitals[1].id }
        })
    )
    departments.push(
        await prisma.department.create({
            data: { name: '科研管理办公室', code: 'DEPT-004', hospitalId: hospitals[1].id }
        })
    )
    departments.push(
        await prisma.department.create({
            data: { name: '信息安全中心', code: 'DEPT-005', hospitalId: hospitals[1].id }
        })
    )
    departments.push(
        await prisma.department.create({
            data: { name: '教学与远程会诊中心', code: 'DEPT-006', hospitalId: hospitals[2].id }
        })
    )

    const passwordHash = await bcrypt.hash('123456', 10)

    console.log('开始插入用户数据...')

    const userSeeds = [
        { username: 'doctor01', email: 'doctor01@example.com', realName: '张医生', role: 'DOCTOR', title: '主治医师', hospitalId: hospitals[0].id, departmentId: departments[0].id, hasResearchAccess: true },
        { username: 'doctor02', email: 'doctor02@example.com', realName: '李医生', role: 'DOCTOR', title: '副主任医师', hospitalId: hospitals[0].id, departmentId: departments[0].id, hasResearchAccess: true },
        { username: 'doctor03', email: 'doctor03@example.com', realName: '王医生', role: 'DOCTOR', title: '住院医师', hospitalId: hospitals[0].id, departmentId: departments[1].id, hasResearchAccess: false },
        { username: 'doctor04', email: 'doctor04@example.com', realName: '周医生', role: 'DOCTOR', title: '主治医师', hospitalId: hospitals[1].id, departmentId: departments[2].id, hasResearchAccess: true },
        { username: 'doctor05', email: 'doctor05@example.com', realName: '赵医生', role: 'DOCTOR', title: '副主任医师', hospitalId: hospitals[1].id, departmentId: departments[2].id, hasResearchAccess: true },
        { username: 'doctor06', email: 'doctor06@example.com', realName: '孙医生', role: 'DOCTOR', title: '住院医师', hospitalId: hospitals[2].id, departmentId: departments[5].id, hasResearchAccess: false },
        { username: 'doctor07', email: 'doctor07@example.com', realName: '吴医生', role: 'DOCTOR', title: '主治医师', hospitalId: hospitals[2].id, departmentId: departments[5].id, hasResearchAccess: false },
        { username: 'doctor08', email: 'doctor08@example.com', realName: '郑医生', role: 'DOCTOR', title: '主任医师', hospitalId: hospitals[0].id, departmentId: departments[0].id, hasResearchAccess: true },
        { username: 'doctor09', email: 'doctor09@example.com', realName: '冯医生', role: 'DOCTOR', title: '副主任医师', hospitalId: hospitals[1].id, departmentId: departments[2].id, hasResearchAccess: true },
        { username: 'doctor10', email: 'doctor10@example.com', realName: '陈医生', role: 'DOCTOR', title: '住院医师', hospitalId: hospitals[2].id, departmentId: departments[5].id, hasResearchAccess: false },
        { username: 'doctor11', email: 'doctor11@example.com', realName: '何医生', role: 'DOCTOR', title: '主治医师', hospitalId: hospitals[0].id, departmentId: departments[1].id, hasResearchAccess: true },
        { username: 'doctor12', email: 'doctor12@example.com', realName: '高医生', role: 'DOCTOR', title: '主治医师', hospitalId: hospitals[1].id, departmentId: departments[2].id, hasResearchAccess: true },

        { username: 'admin_hospital_01', email: 'admin_hospital_01@example.com', realName: '王管理员', role: 'HOSPITAL_ADMIN', title: '医院管理员', hospitalId: hospitals[0].id, departmentId: departments[0].id, hasResearchAccess: false },
        { username: 'admin_hospital_02', email: 'admin_hospital_02@example.com', realName: '刘管理员', role: 'HOSPITAL_ADMIN', title: '医院管理员', hospitalId: hospitals[2].id, departmentId: departments[5].id, hasResearchAccess: false },
        { username: 'admin_hospital_03', email: 'admin_hospital_03@example.com', realName: '许管理员', role: 'HOSPITAL_ADMIN', title: '医院管理员', hospitalId: hospitals[1].id, departmentId: departments[2].id, hasResearchAccess: false },

        { username: 'admin_research_01', email: 'admin_research_01@example.com', realName: '科研管理员甲', role: 'RESEARCH_ADMIN', title: '科研管理员', hospitalId: hospitals[1].id, departmentId: departments[3].id, hasResearchAccess: false },
        { username: 'admin_research_02', email: 'admin_research_02@example.com', realName: '科研管理员乙', role: 'RESEARCH_ADMIN', title: '科研管理员', hospitalId: hospitals[0].id, departmentId: departments[3].id, hasResearchAccess: false },

        { username: 'admin_security_01', email: 'admin_security_01@example.com', realName: '安全管理员甲', role: 'SECURITY_ADMIN', title: '安全管理员', hospitalId: hospitals[1].id, departmentId: departments[4].id, hasResearchAccess: false },
        { username: 'admin_security_02', email: 'admin_security_02@example.com', realName: '安全管理员乙', role: 'SECURITY_ADMIN', title: '安全管理员', hospitalId: hospitals[0].id, departmentId: departments[4].id, hasResearchAccess: false },
        { username: 'admin_security_03', email: 'admin_security_03@example.com', realName: '安全管理员丙', role: 'SECURITY_ADMIN', title: '安全管理员', hospitalId: hospitals[2].id, departmentId: departments[4].id, hasResearchAccess: false }
    ]

    const users = []
    for (const item of userSeeds) {
        const user = await prisma.user.create({
            data: {
                ...item,
                passwordHash,
                isActive: true
            }
        })
        users.push(user)
    }

    console.log('开始插入患者数据...')

    const patients = []
    const patientSeeds = [
        ['PAT-2026-001', '马某某', '男', 43],
        ['PAT-2026-002', '张某某', '女', 35],
        ['PAT-2026-003', '李某某', '男', 58],
        ['PAT-2026-004', '王某某', '女', 27],
        ['PAT-2026-005', '赵某某', '男', 49],
        ['PAT-2026-006', '周某某', '女', 31],
        ['PAT-2026-007', '孙某某', '男', 62],
        ['PAT-2026-008', '陈某某', '女', 24],
        ['PAT-2026-009', '何某某', '女', 40],
        ['PAT-2026-010', '郑某某', '男', 52],
        ['PAT-2026-011', '吴某某', '女', 37],
        ['PAT-2026-012', '冯某某', '男', 45]
    ]

    for (let i = 0; i < patientSeeds.length; i++) {
        const [patientCode, name, gender, age] = patientSeeds[i]
        const y = new Date().getFullYear() - (age || 40)
        const birthDate = new Date(`${y}-06-15T00:00:00`)
        const idCard = `650102${y}${String((i % 12) + 1).padStart(2, '0')}${String((i % 28) + 1).padStart(2, '0')}1234`
        const patient = await prisma.patient.create({
            data: {
                patientCode,
                name,
                gender,
                age,
                birthDate,
                idCard,
                phone: `1390000${String(Math.floor(Math.random() * 9000) + 1000)}`
            }
        })
        patients.push(patient)
    }

    console.log('开始插入病例、影像、AI分析、诊断数据...')

    const caseTemplates = [
        { complaint: '左前臂色素性皮损 2 月余', status: 'PENDING_REVIEW', risk: 44, disease: '色素痣' },
        { complaint: '背部皮损反复脱屑半年', status: 'IN_TREATMENT', risk: 21, disease: '银屑病' },
        { complaint: '右侧小腿红斑瘙痒 10 天', status: 'IN_TREATMENT', risk: 16, disease: '湿疹' },
        { complaint: '面部色素不均伴边界不清', status: 'REFERRED', risk: 81, disease: '黑色素瘤' },
        { complaint: '头皮斑片状脱屑伴瘙痒', status: 'IN_TREATMENT', risk: 26, disease: '脂溢性皮炎' },
        { complaint: '背部黑褐色斑块逐渐增大', status: 'REFERRED', risk: 74, disease: '基底细胞癌' },
        { complaint: '双手散在丘疹伴脱屑', status: 'PENDING_REVIEW', risk: 38, disease: '真菌感染' },
        { complaint: '颈部白色脱色斑 3 月', status: 'IN_TREATMENT', risk: 12, disease: '白癜风' },
        { complaint: '胸前褐色病灶边缘不规则', status: 'REFERRED', risk: 79, disease: '黑色素瘤' },
        { complaint: '足底角化样皮损反复发作', status: 'IN_TREATMENT', risk: 33, disease: '日光性角化病' },
        { complaint: '面部红斑鳞屑伴灼热感', status: 'PENDING_REVIEW', risk: 29, disease: '玫瑰痤疮' },
        { complaint: '左肩部色素痣近期变大', status: 'REFERRED', risk: 72, disease: '色素痣' },
        { complaint: '肘部慢性斑块样皮损', status: 'IN_TREATMENT', risk: 25, disease: '银屑病' },
        { complaint: '右臂瘙痒性丘疹反复 1 月', status: 'CLOSED', risk: 11, disease: '湿疹' },
        { complaint: '鼻翼黑色丘疹伴轻度破溃', status: 'PENDING_REVIEW', risk: 66, disease: '基底细胞癌' },
        { complaint: '前胸皮损伴边缘色素沉着', status: 'IN_TREATMENT', risk: 41, disease: '色素痣' },
        { complaint: '头皮局部白斑伴毛发变白', status: 'CLOSED', risk: 9, disease: '白癜风' },
        { complaint: '足背红色鳞屑斑块 2 周', status: 'PENDING_REVIEW', risk: 35, disease: '真菌感染' }
    ]

    const cases = []
    for (let i = 0; i < caseTemplates.length; i++) {
        const template = caseTemplates[i]
        const patient = patients[i % patients.length]
        const doctor = users[i % 12]

        const medicalCase = await prisma.medicalCase.create({
            data: {
                caseCode: `CASE-2026-${String(i + 1).padStart(4, '0')}`,
                patientId: patient.id,
                doctorId: doctor.id,
                chiefComplaint: template.complaint,
                status: template.status,
                riskLevel: template.risk,
                finalConclusion: template.status === 'CLOSED' ? `${template.disease}，症状已改善，建议定期复查` : null
            }
        })
        cases.push(medicalCase)

        await prisma.medicalImage.createMany({
            data: [
                {
                    imageCode: `IMG-2026-${String(i + 1).padStart(4, '0')}-A`,
                    caseId: medicalCase.id,
                    imageUrl: `/uploads/seed/cases/${medicalCase.caseCode}/clinical-1.jpg`,
                    type: 'CLINICAL_PHOTO',
                    bodyPart: '上肢',
                    capturedAt: new Date('2026-04-01T10:00:00'),
                    capturedBy: doctor.realName,
                    deviceName: 'iPhone 14 Pro',
                    accessLevel: 'CLINICAL_RAW',
                    isQcPassed: true
                },
                {
                    imageCode: `IMG-2026-${String(i + 1).padStart(4, '0')}-B`,
                    caseId: medicalCase.id,
                    imageUrl: `/uploads/seed/cases/${medicalCase.caseCode}/dermoscopy-1.jpg`,
                    type: 'DERMOSCOPY',
                    bodyPart: '上肢',
                    capturedAt: new Date('2026-04-01T10:05:00'),
                    capturedBy: doctor.realName,
                    deviceName: 'DermLite DL5',
                    accessLevel: 'CONSULT_COPY',
                    isQcPassed: true
                }
            ]
        })

        await prisma.aIAnalysis.create({
            data: {
                caseId: medicalCase.id,
                malignancyProb: template.risk / 100,
                top1Disease: template.disease,
                top1Prob: 0.68,
                top2Disease: '湿疹',
                top2Prob: 0.18,
                top3Disease: '色素痣',
                top3Prob: 0.09,
                modelVersion: 'CR-Conformer-v1.2.0',
                heatmapUrl: `/uploads/seed/cases/${medicalCase.caseCode}/heatmap-1.png`,
                lesionBoxesJson: {
                    x: 122,
                    y: 86,
                    width: 210,
                    height: 168
                },
                summary: `AI 提示 ${template.disease} 可能性较高，恶性概率 ${template.risk}% ，建议结合临床进一步判断。`
            }
        })

        await prisma.diagnosis.create({
            data: {
                caseId: medicalCase.id,
                doctorId: doctor.id,
                conclusion: `${template.disease} 待进一步复核`,
                treatmentPlan: template.risk >= 70 ? '建议尽快上转上级医院进一步检查' : '建议局部治疗并复诊观察',
                suggestion: template.risk >= 70 ? '建议 3 日内完成专科进一步检查' : '建议 2 周后随访',
                isFinal: template.status === 'CLOSED'
            }
        })
    }

    console.log('开始插入转诊/会诊数据...')

    const referralSeeds = [
        { caseIndex: 0, from: 2, to: 1, type: 'REMOTE_CONSULTATION', status: 'PENDING', note: '基层医院申请远程会诊支持', callbackOpinion: null },
        { caseIndex: 3, from: 0, to: 1, type: 'REFERRAL', status: 'IN_PROGRESS', note: '疑似黑色素瘤，上转区域协同中心', callbackOpinion: null },
        { caseIndex: 5, from: 2, to: 0, type: 'REFERRAL', status: 'ACCEPTED', note: '基层门诊转至上级医院', callbackOpinion: '上级医院已接收，安排专科门诊' },
        { caseIndex: 8, from: 0, to: 1, type: 'REMOTE_CONSULTATION', status: 'COMPLETED', note: '专家中心已完成远程会诊', callbackOpinion: '建议按会诊意见调整用药并 2 周复查' },
        { caseIndex: 11, from: 2, to: 1, type: 'REFERRAL', status: 'PENDING', note: '高风险病例待接收', callbackOpinion: null },
        { caseIndex: 14, from: 0, to: 1, type: 'INTERNAL_CONSULTATION', status: 'COMPLETED', note: '院内多学科会诊已完成', callbackOpinion: 'MDT 结论已同步至主管医生' },
        { caseIndex: 15, from: 2, to: 0, type: 'REMOTE_CONSULTATION', status: 'IN_PROGRESS', note: '图像已同步，等待复核', callbackOpinion: null },
        { caseIndex: 16, from: 0, to: 1, type: 'INTERNAL_CONSULTATION', status: 'REJECTED', note: '资料不足，退回补充', callbackOpinion: '请补充皮肤镜原图与病理报告后再提交' },
        { caseIndex: 17, from: 2, to: 1, type: 'REFERRAL', status: 'PENDING', note: '基层申请上转', callbackOpinion: null },
        { caseIndex: 9, from: 0, to: 1, type: 'REMOTE_CONSULTATION', status: 'ACCEPTED', note: '会诊排队中', callbackOpinion: '已排期，请保持电话畅通' }
    ]

    for (let i = 0; i < referralSeeds.length; i++) {
        const item = referralSeeds[i]
        await prisma.referral.create({
            data: {
                referralCode: `RC-2026-${String(i + 1).padStart(3, '0')}`,
                caseId: cases[item.caseIndex].id,
                fromHospitalId: hospitals[item.from].id,
                toHospitalId: hospitals[item.to].id,
                type: item.type,
                status: item.status,
                note: item.note,
                callbackOpinion: item.callbackOpinion
            }
        })
    }

    console.log('开始插入科研项目数据...')

    const projectNames = [
        '银屑病多模态影像研究',
        '黑色素瘤高危识别队列研究',
        '白癜风随访影像变化分析',
        '皮肤镜图像辅助诊断一致性研究',
        '病理图与临床图联合判读研究',
        '远程会诊质控指标研究',
        '基层 AI 误差样本复核项目',
        '匿名样本脱敏质量评估项目',
        '皮损分割模型对比实验',
        '少数民族地区皮肤病影像库建设试点'
    ]

    const projects = []
    for (let i = 0; i < projectNames.length; i++) {
        const project = await prisma.researchProject.create({
            data: {
                projectCode: `PRJ-2026-${String(i + 1).padStart(3, '0')}`,
                name: projectNames[i],
                level: i < 3 ? '院级重点' : '一般项目',
                principalInvestigator: users[i % 8].realName,
                ethicsCode: `ETH-2026-${String(i + 1).padStart(3, '0')}`,
                ethicsExpireAt: new Date(`2027-12-${String((i % 9) + 10).padStart(2, '0')}T00:00:00`),
                dataScope: '限定匿名化研究副本，仅限项目空间内使用',
                status: i < 6 ? 'ACTIVE' : i < 8 ? 'DELAYED' : 'COMPLETED',
                progress: i < 6 ? 20 + i * 10 : i < 8 ? 45 : 100
            }
        })
        projects.push(project)
    }

    console.log('开始插入项目成员与任务...')

    for (let i = 0; i < projects.length; i++) {
        const project = projects[i]

        await prisma.projectMember.createMany({
            data: [
                { projectId: project.id, userId: users[i % 8].id, role: 'PI' },
                { projectId: project.id, userId: users[(i + 1) % 12].id, role: 'MEMBER' },
                { projectId: project.id, userId: users[(i + 2) % 12].id, role: 'MEMBER' },
                { projectId: project.id, userId: users[(i + 3) % 12].id, role: 'COLLABORATOR' }
            ],
            skipDuplicates: true
        })

        const taskDefs = [
            { title: '样本筛选', type: 'SAMPLING', progress: 35, note: '队列构建与入排标准核对' },
            { title: '在线标注', type: 'ANNOTATION', progress: 10, note: null },
            { title: '争议样本复核', type: 'REVIEW', progress: 100, note: '已完成一轮复核' }
        ]

        for (let j = 0; j < taskDefs.length; j++) {
            const t = taskDefs[j]
            await prisma.researchTask.create({
                data: {
                    title: `${project.name}-${t.title}`,
                    description: `围绕项目 ${project.name} 开展 ${t.title} 工作`,
                    type: t.type,
                    projectId: project.id,
                    assignerId: users[i % 8].id,
                    assigneeId: users[(i + j + 1) % 12].id,
                    status: j === 0 ? 'IN_PROGRESS' : j === 1 ? 'PENDING' : 'DONE',
                    progress: t.progress,
                    note: t.note,
                    dueAt: new Date(`2026-05-${String((i + j + 5) % 28 + 1).padStart(2, '0')}T18:00:00`)
                }
            })
        }
    }

    console.log('开始插入审批记录...')

    const approvalSeeds = [
        { code: 'APR-2026-001', type: 'PROJECT_REGISTRATION', targetType: 'RESEARCH_PROJECT', targetId: 'PRJ-2026-001', applicantId: users[0].id, reviewerId: users[15].id, projectId: projects[0].id, status: 'PENDING', reason: '申请登记项目空间' },
        { code: 'APR-2026-002', type: 'EXPORT_REQUEST', targetType: 'DATA_EXPORT', targetId: 'EXP-2026-001', applicantId: users[1].id, reviewerId: users[16].id, projectId: projects[1].id, status: 'UNDER_REVIEW', reason: '申请匿名样本导出分析' },
        { code: 'APR-2026-003', type: 'CONSULTATION_REQUEST', targetType: 'REFERRAL', targetId: 'RC-2026-001', applicantId: users[5].id, reviewerId: users[12].id, status: 'APPROVED', reason: '基层门诊发起远程会诊' },
        { code: 'APR-2026-004', type: 'PROJECT_REGISTRATION', targetType: 'RESEARCH_PROJECT', targetId: 'PRJ-2026-002', applicantId: users[2].id, reviewerId: users[15].id, projectId: projects[2].id, status: 'RETURNED', reason: '伦理材料需补充' },
        { code: 'APR-2026-005', type: 'EXPORT_REQUEST', targetType: 'DATA_EXPORT', targetId: 'EXP-2026-002', applicantId: users[3].id, reviewerId: users[16].id, projectId: projects[3].id, status: 'REJECTED', reason: '导出范围越界' },
        { code: 'APR-2026-006', type: 'PROJECT_REGISTRATION', targetType: 'RESEARCH_PROJECT', targetId: 'PRJ-2026-003', applicantId: users[4].id, reviewerId: users[15].id, projectId: projects[4].id, status: 'APPROVED', reason: '项目登记通过' },
        { code: 'APR-2026-007', type: 'EXPORT_REQUEST', targetType: 'DATA_EXPORT', targetId: 'EXP-2026-003', applicantId: users[8].id, reviewerId: users[16].id, projectId: projects[5].id, status: 'PENDING', reason: '申请统计分析数据包' },
        { code: 'APR-2026-008', type: 'CONSULTATION_REQUEST', targetType: 'REFERRAL', targetId: 'RC-2026-002', applicantId: users[6].id, reviewerId: users[12].id, status: 'UNDER_REVIEW', reason: '外院协作确认中' },
        { code: 'APR-2026-009', type: 'ROLE_CHANGE', targetType: 'USER', targetId: String(users[10].id), applicantId: users[12].id, reviewerId: users[17].id, status: 'APPROVED', reason: '开通科研权限' },
        { code: 'APR-2026-010', type: 'EXPORT_REQUEST', targetType: 'DATA_EXPORT', targetId: 'EXP-2026-004', applicantId: users[9].id, reviewerId: users[16].id, projectId: projects[6].id, status: 'PENDING', reason: '导出研究副本' }
    ]

    for (const item of approvalSeeds) {
        await prisma.approvalRecord.create({
            data: {
                approvalCode: item.code,
                type: item.type,
                targetType: item.targetType,
                targetId: item.targetId,
                applicantId: item.applicantId,
                reviewerId: item.reviewerId,
                projectId: item.projectId || null,
                status: item.status,
                reason: item.reason,
                snapshotJson: {
                    remark: item.reason
                }
            }
        })
    }

    console.log('开始插入安全告警与备份记录...')

    const alertSeeds = [
        ['AL-2026-001', '异常高频访问高敏感样本', '样本访问监控', 'HIGH', 'OPEN'],
        ['AL-2026-002', '导出链路追溯复核', '导出审计模块', 'MEDIUM', 'IN_PROGRESS'],
        ['AL-2026-003', '夜间异常登录尝试', '登录监控', 'HIGH', 'OPEN'],
        ['AL-2026-004', '跨院会诊通道波动', '会诊链路监控', 'LOW', 'RESOLVED'],
        ['AL-2026-005', '权限越权访问预警', '权限审计', 'CRITICAL', 'OPEN'],
        ['AL-2026-006', '备份任务执行超时', '备份中心', 'MEDIUM', 'IN_PROGRESS'],
        ['AL-2026-007', '高危样本重复导出申请', '导出审计模块', 'HIGH', 'OPEN'],
        ['AL-2026-008', '审计日志写入延迟', '审计服务', 'LOW', 'RESOLVED'],
        ['AL-2026-009', '会话异常并发登录', '登录监控', 'MEDIUM', 'OPEN'],
        ['AL-2026-010', '高权限账号密码输入失败过多', '登录监控', 'HIGH', 'IN_PROGRESS']
    ]

    for (const [alertCode, title, source, level, status] of alertSeeds) {
        await prisma.securityAlert.create({
            data: {
                alertCode,
                title,
                source,
                level,
                status,
                targetType: 'SYSTEM',
                targetId: alertCode,
                detail: `${title}，请及时跟进处置。`
            }
        })
    }

    const backupSeeds = [
        ['BK-2026-001', 'AUTO', 'SUCCESS', '/uploads/seed/backups/backup-001.zip'],
        ['BK-2026-002', 'AUTO', 'SUCCESS', '/uploads/seed/backups/backup-002.zip'],
        ['BK-2026-003', 'MANUAL', 'SUCCESS', '/uploads/seed/backups/backup-003.zip'],
        ['BK-2026-004', 'RESTORE_POINT', 'SUCCESS', '/uploads/seed/backups/restore-001.zip'],
        ['BK-2026-005', 'AUTO', 'FAILED', '/uploads/seed/backups/backup-005.zip'],
        ['BK-2026-006', 'MANUAL', 'RUNNING', '/uploads/seed/backups/backup-006.zip']
    ]

    for (const [backupCode, type, status, storagePath] of backupSeeds) {
        await prisma.backupRecord.create({
            data: {
                backupCode,
                type,
                status,
                storagePath,
                sizeMb: 128.5,
                note: '系统自动生成备份记录'
            }
        })
    }

    console.log('开始插入登录日志和审计日志...')

    for (let i = 0; i < users.length; i++) {
        await prisma.loginLog.create({
            data: {
                userId: users[i].id,
                username: users[i].username,
                roleAttempt: users[i].role,
                ipAddress: `192.168.1.${i + 10}`,
                userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
                result: 'SUCCESS'
            }
        })
    }

    const auditActions = [
        'LOGIN',
        'VIEW_IMAGE',
        'SUBMIT_DIAGNOSIS',
        'CREATE_REFERRAL',
        'APPROVE_PROJECT',
        'EXPORT_IMAGE',
        'CHANGE_ROLE',
        'UPDATE_SECURITY_POLICY'
    ]

    for (let i = 0; i < 60; i++) {
        const user = users[i % users.length]
        await prisma.auditLog.create({
            data: {
                userId: user.id,
                actorName: user.realName,
                actorRole: user.role,
                actionType: auditActions[i % auditActions.length],
                targetType: i % 2 === 0 ? 'MEDICAL_CASE' : 'RESEARCH_PROJECT',
                targetId: i % 2 === 0
                    ? `CASE-2026-${String((i % cases.length) + 1).padStart(4, '0')}`
                    : `PRJ-2026-${String((i % projects.length) + 1).padStart(3, '0')}`,
                detail: '系统生成的审计测试数据',
                ipAddress: `10.10.0.${(i % 20) + 1}`
            }
        })
    }

    console.log('开始插入实验运行数据...')

    await prisma.experimentRun.createMany({
        data: [
            {
                projectId: 1,
                createdById: 2,
                name: '银屑病多模态基线实验',
                modelName: 'CR-Conformer v1.2',
                datasetName: 'PSO-TRAIN-V1',
                status: 'COMPLETED',
                accuracy: 0.923,
                recall: 0.901,
                f1Score: 0.912,
                note: '基线实验已完成，后续计划扩大训练集。'
            },
            {
                projectId: 1,
                createdById: 2,
                name: '边界样本增强实验',
                modelName: 'CR-Conformer v2',
                datasetName: 'PSO-AUG-V2',
                status: 'RUNNING',
                accuracy: null,
                recall: null,
                f1Score: null,
                note: '当前正在进行边界样本增强对比。'
            },
            {
                projectId: 2,
                createdById: 2,
                name: '黑色素瘤风险评分实验',
                modelName: 'Mel-RiskNet',
                datasetName: 'MEL-TRAIN-V1',
                status: 'DRAFT',
                accuracy: null,
                recall: null,
                f1Score: null,
                note: '准备中，待确认数据集版本。'
            }
        ]
    })

    console.log('插入演示用完整 AI 分析数据...')

    await prisma.aIAnalysis.create({
        data: {
            caseId: 1,
            imageId: 1,
            malignancyProb: 0.67,
            top1Disease: '黑色素瘤',
            top1Prob: 0.67,
            top2Disease: '色素痣异变',
            top2Prob: 0.19,
            top3Disease: '炎症性色素沉着',
            top3Prob: 0.14,
            modelVersion: 'CR-Conformer v1.2',
            summary: '检测到边界不规则、色素分布不均，结合皮肤镜特征提示高风险色素性病变，建议医生进一步复核。',
            heatmapUrl: '/uploads/cases/CASE-2026-0001/ai/heatmap-01.png',
            lesionBoxesJson: [
                { x: 36, y: 29, w: 26, h: 24, label: '病灶A：边缘不规则' },
                { x: 55, y: 51, w: 18, h: 17, label: '病灶B：色素不均' }
            ],
            featureJson: {
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
            }
        }
    })

    console.log('测试数据插入完成 ✅')
    console.log('默认测试密码：123456')
    console.log('医生账号：doctor01')
    console.log('医院管理员账号：admin_hospital_01')
    console.log('科研管理员账号：admin_research_01')
    console.log('安全管理员账号：admin_security_01')
}

main()
    .catch((error) => {
        console.error('seed 执行失败 ❌', error)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })