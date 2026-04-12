export function notFoundHandler(req, res) {
  res.status(404).json({
    success: false,
    message: '接口不存在',
    path: req.path,
  })
}
