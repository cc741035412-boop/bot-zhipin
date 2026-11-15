import { IMAGE_EXTS } from '../bot-model.mjs'

export const MAX_IMAGE_BYTES = 2 * 1024 * 1024
export function imageFormat(bytes) {
  if ([137, 80, 78, 71, 13, 10, 26, 10].every((byte, i) => bytes[i] === byte)) return 'png'
  if (bytes.length >= 3 && bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255) return 'jpeg'
  const ascii = (start, end) => String.fromCharCode(...bytes.subarray(start, end).map((byte) => byte & 0x7f))
  const start = ascii(0, 6)
  if (start === 'GIF87a' || start === 'GIF89a') return 'gif'
  if (bytes.length >= 12 && ascii(0, 4) === 'RIFF' && ascii(8, 12) === 'WEBP') return 'webp'
  return null
}

export function validateImages(bot, report) {
  let validShots = 0
  for (const file of [...bot.screenshots, ...(bot.avatar ? [bot.avatar] : [])]) {
    const name = file.path.split('/').at(-1)
    const dot = name.lastIndexOf('.')
    const ext = dot > 0 ? name.slice(dot).toLowerCase() : ''
    const format = file.format !== undefined ? file.format : imageFormat(file.head || new Uint8Array())
    if (file.size > MAX_IMAGE_BYTES) {
      report(file.path, '文件大小', `图片超过 2MB：实际 ${file.size} 字节（${(file.size / 1024 / 1024).toFixed(2)} MB）`, `压缩或替换图片，大小不能超过 ${MAX_IMAGE_BYTES} 字节。`)
    }
    if (!IMAGE_EXTS.includes(ext)) {
      report(file.path, '图片格式', `不支持扩展名 ${ext || '（无）'}；允许的格式：${IMAGE_EXTS.map((s) => s.slice(1)).join('、')}`, '导出为允许的图片格式，不能只改扩展名。')
    } else if (format !== (ext === '.jpg' ? 'jpeg' : ext.slice(1))) {
      report(file.path, '文件头', `图片文件头与扩展名 ${ext} 不符：真实格式为 ${format || '无法识别（不是支持的图片）'}`, `重新导出真正的 ${ext.slice(1).toUpperCase()} 图片；不要把其他文件直接改名。`)
    } else if (file !== bot.avatar) validShots++
  }
  if (bot.data?.external !== true && validShots === 0) {
    report('screenshots', '截图', '至少需要一张截图', '在 screenshots/ 放入至少一张真实使用截图，支持 png、jpg、jpeg、webp、gif。')
  }
}
