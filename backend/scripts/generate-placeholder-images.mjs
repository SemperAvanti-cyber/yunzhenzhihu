/**
 * 生成与 seed / 演示路径一致的占位图（复制已有示例或写入最小 PNG）。
 * 运行: node scripts/generate-placeholder-images.mjs
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const backendRoot = path.join(__dirname, '..')
const publicUploads = path.join(backendRoot, 'public', 'uploads')

// 1x1 透明 PNG（有效文件，浏览器可显示）
const MINI_PNG = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
  'base64'
)

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true })
}

function copyFile(src, dest) {
  ensureDir(path.dirname(dest))
  fs.copyFileSync(src, dest)
}

const clinicalSrc = path.join(publicUploads, 'cases', 'CASE-2026-0001', 'original', 'clinical-01.jpg')
const dermoSrc = path.join(publicUploads, 'cases', 'CASE-2026-0001', 'original', 'dermoscopy-01.jpg')
const heatmapSrc = path.join(publicUploads, 'cases', 'CASE-2026-0001', 'ai', 'heatmap-01.png')
const followupSrc = path.join(publicUploads, 'cases', 'CASE-2026-0001', 'followup', 'followup-2026-03-18.jpg')

function writeJpgPlaceholder(dest) {
  ensureDir(path.dirname(dest))
  if (fs.existsSync(clinicalSrc)) {
    fs.copyFileSync(clinicalSrc, dest)
    return 'jpg-from-template'
  }
  fs.writeFileSync(dest, MINI_PNG)
  return 'png-as-jpg-fallback'
}

function writePngPlaceholder(dest) {
  ensureDir(path.dirname(dest))
  if (fs.existsSync(heatmapSrc)) {
    fs.copyFileSync(heatmapSrc, dest)
    return 'png-from-template'
  }
  fs.writeFileSync(dest, MINI_PNG)
  return 'mini-png'
}

const created = []
const CASE_COUNT = 18

for (let i = 1; i <= CASE_COUNT; i++) {
  const code = `CASE-2026-${String(i).padStart(4, '0')}`
  const base = path.join(publicUploads, 'seed', 'cases', code)
  const clinical = path.join(base, 'clinical-1.jpg')
  const dermo = path.join(base, 'dermoscopy-1.jpg')
  const heat = path.join(base, 'heatmap-1.png')

  if (fs.existsSync(clinicalSrc)) copyFile(clinicalSrc, clinical)
  else writeJpgPlaceholder(clinical)
  created.push(clinical)

  if (fs.existsSync(dermoSrc)) copyFile(dermoSrc, dermo)
  else writeJpgPlaceholder(dermo)
  created.push(dermo)

  if (fs.existsSync(heatmapSrc)) copyFile(heatmapSrc, heat)
  else writePngPlaceholder(heat)
  created.push(heat)
}

// imaging.service.js 演示回退路径
const demoBase = path.join(publicUploads, 'demo', 'cases', 'CASE-2026-0001')
const demoFiles = [
  ['dermoscopy-01.jpg', dermoSrc],
  ['followup-2026-03-18.jpg', followupSrc],
  ['heatmap-01.png', heatmapSrc]
]
for (const [name, src] of demoFiles) {
  const dest = path.join(demoBase, name)
  if (fs.existsSync(src)) copyFile(src, dest)
  else if (name.endsWith('.png')) writePngPlaceholder(dest)
  else writeJpgPlaceholder(dest)
  created.push(dest)
}

// README 说明替换位置
const readme = path.join(publicUploads, 'PLACEHOLDER_README.txt')
const lines = [
  '云诊智护 — 占位图说明',
  '==================',
  '',
  '本目录下的占位图可由你自行替换为真实影像，保持文件名与路径不变即可。',
  '',
  '1) 种子数据（与 prisma/seed.js 一致）',
  `   ${path.join(publicUploads, 'seed', 'cases', 'CASE-2026-XXXX')}`,
  '   每个病例目录含：',
  '   - clinical-1.jpg     （临床外观照，对应 CLINICAL_PHOTO）',
  '   - dermoscopy-1.jpg （皮肤镜，对应 DERMOSCOPY）',
  '   - heatmap-1.png    （AI 热力图）',
  `   当前已生成 CASE-2026-0001 ～ CASE-2026-${String(CASE_COUNT).padStart(4, '0')} 共 ${CASE_COUNT} 套。`,
  '',
  '2) 影像云等服务演示回退（与 imaging.service.js DEMO_* 一致）',
  `   ${demoBase}`,
  '   - dermoscopy-01.jpg',
  '   - followup-2026-03-18.jpg',
  '   - heatmap-01.png',
  '',
  '3) 已有演示病例目录（可选替换）',
  `   ${path.join(publicUploads, 'cases', 'CASE-2026-0001', 'original')}  clinical-01.jpg / dermoscopy-01.jpg`,
  `   ${path.join(publicUploads, 'cases', 'CASE-2026-0001', 'followup')}   followup-*.jpg`,
  `   ${path.join(publicUploads, 'cases', 'CASE-2026-0001', 'ai')}         heatmap-01.png`,
  '',
  '图片格式：临床/皮肤镜/随访建议 JPG；热力图 PNG。',
]
fs.writeFileSync(readme, lines.join('\n'), 'utf8')

console.log('已生成占位图:', created.length, '个文件')
console.log('说明文件:', readme)
