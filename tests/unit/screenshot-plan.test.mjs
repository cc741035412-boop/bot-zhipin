import { expect, it } from 'vitest'
import { planScreenshots } from '../../scripts/submission/screenshot-plan.mjs'
import { makeFilePlan } from '../../scripts/submission/screenshots.mjs'
import { MAX_IMAGE_BYTES } from '../../scripts/lib/validate/images.mjs'

const prefix = 'bots/test-bot/'
const png = new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10])
const image = { size: png.length, format: 'png', receipt: 'opaque-receipt' }
const bundle = (screenshots = ['a.jpg']) => ({ slug: 'test-bot', files: { [`${prefix}DESIGN.md`]: '![图](screenshots/a.jpg)\n![图](<./screenshots/a.jpg>)\n[外链](https://example.test/a.jpg)' }, screenshots })
it('修正文件名和简单 Markdown 引用，保留外链', () => {
  const plan = planScreenshots(bundle(), [image])
  expect(plan.images).toEqual([{ ...image, name: 'a.png' }])
  expect(plan.screenshots).toEqual(['a.png'])
  expect(plan.files[`${prefix}DESIGN.md`]).toContain('](screenshots/a.png)')
  expect(plan.files[`${prefix}DESIGN.md`]).toContain('](<./screenshots/a.png>)')
  expect(plan.files[`${prefix}DESIGN.md`]).toContain('https://example.test/a.jpg')
})
it('适配器与纯计划使用同一命名与文本改写', () => {
  const source = bundle(), planned = planScreenshots(source, [image]), disk = makeFilePlan(source, [png])
  expect(disk.files[`${prefix}DESIGN.md`]).toBe(planned.files[`${prefix}DESIGN.md`])
  expect(disk.files[`${prefix}screenshots/a.png`]).toEqual(Buffer.from(png))
  expect(Object.keys(disk)).toEqual(['slug', 'files'])
})
it('不修改输入，额外截图使用总序号', () => {
  const source = bundle(), original = structuredClone(source), images = [image, image]
  expect(planScreenshots(source, images).screenshots).toEqual(['a.png', 'screenshot-2.png'])
  expect(source).toEqual(original)
  expect(images[0]).not.toHaveProperty('name')
})
it.each(['jpg', 'jpeg', 'JPEG'])('真实 JPEG 的 %s 后缀不变', (ext) => {
  expect(planScreenshots(bundle([`shot.${ext}`]), [{ size: 8, format: 'jpeg' }]).screenshots).toEqual([`shot.${ext}`])
})
it.each(['png', 'jpeg', 'webp', 'gif'])('未声明的 %s 自动命名', (format) => {
  expect(planScreenshots(bundle([]), [{ size: 8, format }]).screenshots).toEqual([`screenshot-1.${format === 'jpeg' ? 'jpg' : format}`])
})
it('零张图片合法（第 43 条）：忽略残留的文件名声明，文本原样返回，不改输入', () => {
  const source = bundle(['a.jpg', 'b.png']), original = structuredClone(source)
  const plan = planScreenshots(source, [])
  expect(plan).toEqual({ slug: 'test-bot', files: source.files, screenshots: [], images: [] })
  expect(plan.files).not.toBe(source.files)
  expect(source).toEqual(original)
  expect(makeFilePlan(source, [])).toEqual({ slug: 'test-bot', files: source.files })
})
it('少图、重名、大小写冲突和文件数超限均拒绝', () => {
  expect(() => planScreenshots(bundle(['a.png', 'b.png']), [image])).toThrow('数量')
  expect(() => planScreenshots(bundle(['a.jpg', 'a.png']), [image, image])).toThrow('冲突')
  expect(() => planScreenshots(bundle(['A.png', 'a.png']), [image, image])).toThrow('重复')
  expect(() => planScreenshots(bundle([]), Array(30).fill(image))).toThrow('30')
})
it('2MB 边界和无效格式', () => {
  expect(() => planScreenshots(bundle(), [{ ...image, size: MAX_IMAGE_BYTES }])).not.toThrow()
  expect(() => planScreenshots(bundle(), [{ ...image, size: MAX_IMAGE_BYTES + 1 }])).toThrow('2MB')
  expect(() => planScreenshots(bundle(), [{ ...image, format: null }])).toThrow('文件头')
})
