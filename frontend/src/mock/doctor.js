export const doctorResearchProfile = {
  doctorName: '张医生',
  accessStatus: 'approved',
  hasResearchAccess: true
}

export const doctorCloudOverview = {
  totalImages: '12,840',
  sharedCopies: '2,136',
  pendingQc: '28',
  todayUploads: '286',
  activeConsultations: '11',
  wardRounds: '4',
  qcWarnings: '9'
}

export const doctorCloudAbilities = [
  {
    title: '历史影像对比',
    desc: '研究副本浏览、时间轴对照、模态切换与共享调用。',
    path: '/doctor/imaging-cloud'
  },
  {
    title: '远程会诊协作',
    desc: '基层医院发起协作，上级医院接收处理。',
    path: '/doctor/referral'
  },
  {
    title: '远程查房 / 教学',
    desc: '带教、病例复盘、教学协同与区域支持。',
    path: '/doctor/referral'
  }
]

export const doctorLabOverview = {
  totalSamples: '8,426',
  pendingAnnotation: '1,208',
  experimentCount: '42'
}

export const doctorLabEntries = [
  {
    title: '数据中心',
    desc: '样本池、版本冻结、病种分布、质量统计与数据范围管理。',
    tag: 'Dataset',
    action: '进入数据中心'
  },
  {
    title: '在线标注与质控',
    desc: 'Bounding Box、Segmentation、标签修正、标注复核与一致性检查。',
    tag: 'Annotation',
    action: '开始标注'
  },
  {
    title: '训练实验',
    desc: '实验记录、模型效果、版本对比、可解释验证与结果追踪。',
    tag: 'Experiment',
    action: '查看实验'
  }
]
