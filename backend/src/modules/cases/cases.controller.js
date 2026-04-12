import {
  getMyRecordsBoardService,
  uploadFollowUpImageService,
} from './cases.service.js'

export async function getMyRecordsBoardController(req, res, next) {
  try {
    const data = await getMyRecordsBoardService({
      currentUser: req.user,
      caseId: req.query.caseId ? Number(req.query.caseId) : null,
      status: req.query.status || 'ALL',
    })

    res.json({
      success: true,
      message: '获取我的病例看板成功',
      data,
    })
  } catch (error) {
    next(error)
  }
}

export async function uploadFollowUpImageController(req, res, next) {
  try {
    const data = await uploadFollowUpImageService({
      currentUser: req.user,
      caseId: Number(req.params.caseId),
      file: req.file,
      bodyPart: req.body?.bodyPart,
      deviceName: req.body?.deviceName,
      capturedAt: req.body?.capturedAt,
    })

    res.json({
      success: true,
      message: '随访图片上传成功',
      data,
    })
  } catch (error) {
    next(error)
  }
}
