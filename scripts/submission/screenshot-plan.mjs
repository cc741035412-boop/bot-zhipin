import { MAX_IMAGE_BYTES } from '../lib/validate/images.mjs'
import { assertFileSet } from './bundle-core.mjs'
import { fail } from './errors.mjs'

const bad = (problem, fix = '请拖入真实的 PNG/JPG/WEBP/GIF 截图，每张不超过 2MB；不要粘贴外站图片地址。') => fail('Issue', 'screenshots', problem, fix)

/** images: [{ size, format, ...回执字段 }]，顺序与上传顺序一致。
 * 返回 { slug, files: 改写后的文本映射, screenshots: 最终文件名[], images: 带最终 name 的描述符[] }。
 * 不修改输入、不接触图片字节；回执的验签由调用方负责。
 */
export function planScreenshots(bundle, images) {
  if (!images.length) bad('至少需要一张截图。')
  if (images.length < bundle.screenshots.length) bad('截图数量少于投稿包里的文件名数量。', '按投稿包里的顺序补齐截图，或让 AI 删除不再需要的文件名和引用。')
  const files = { ...bundle.files }, renames = [], planned = [], paths = new Set(Object.keys(files))
  for (let i = 0; i < images.length; i++) {
    const { size, format } = images[i]
    if (size > MAX_IMAGE_BYTES) bad('截图超过 2MB。')
    if (!['png', 'jpeg', 'webp', 'gif'].includes(format)) bad('截图文件头无法识别，不能只改扩展名伪装图片。')
    const ext = format === 'jpeg' ? 'jpg' : format
    const original = bundle.screenshots[i]
    const extension = original?.split('.').at(-1).toLowerCase()
    const matches = extension === ext || (format === 'jpeg' && extension === 'jpeg')
    const name = original ? (matches ? original : `${original.replace(/\.[^.]+$/, '')}.${ext}`) : `screenshot-${i + 1}.${ext}`
    if (original && name !== original) renames.push([original, name])
    const path = `bots/${bundle.slug}/screenshots/${name}`
    if (paths.has(path)) bad('截图命名冲突，请为截图选择不同文件名。')
    paths.add(path)
    planned.push({ ...images[i], name })
  }
  assertFileSet([...paths])
  for (const [file, value] of Object.entries(files)) {
    if (!file.toLowerCase().endsWith('.md') || typeof value !== 'string') continue
    let text = value
    for (const [oldName, newName] of renames) {
      for (const prefix of ['screenshots/', './screenshots/']) {
        text = text.replaceAll(`](${prefix}${oldName})`, `](${prefix}${newName})`)
          .replaceAll(`](<${prefix}${oldName}>)`, `](<${prefix}${newName}>)`)
      }
    }
    files[file] = text
  }
  return { slug: bundle.slug, files, screenshots: planned.map((image) => image.name), images: planned }
}
