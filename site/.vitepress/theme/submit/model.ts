import { unpack, assertFilename } from '../../../../scripts/submission/bundle-core.mjs'
import { applyServerFields } from '../../../../scripts/lib/submit-fields.mjs'
import { modelFromBundle } from '../../../../scripts/lib/bot-model.mjs'
import { planScreenshots } from '../../../../scripts/submission/screenshot-plan.mjs'

export interface PreviewImage {
  name?: string
  size?: number
  format?: 'png' | 'jpeg' | 'webp' | 'gif'
  url?: string
  thumb?: string
}

// 与 CLI 相同：声明优先，其次 DESIGN 引用，最后一个必填占位槽。
export function screenshotNames(bundle: ReturnType<typeof unpack>): string[] {
  if (bundle.screenshots.length) return [...bundle.screenshots]
  const design = bundle.files[`bots/${bundle.slug}/DESIGN.md`] || ''
  const names = [...new Set<string>([...design.matchAll(/\]\(<?(?:\.\/)?screenshots\/([^\s)>]+)>?\)/g)].map((match: RegExpMatchArray) => match[1]))]
  names.forEach(assertFilename)
  return names.length ? names : ['screenshot-1.png']
}

export function submissionModel(plaintext: string, {
  images = [], login, now = new Date(), addedAt,
}: { images?: (PreviewImage | null)[]; login?: string | null; now?: Date | string | number; addedAt?: string } = {}) {
  const bundle = unpack(plaintext)
  const path = `bots/${bundle.slug}/bot.yaml`
  const date = addedAt || new Date(new Date(now).getTime() + 8 * 3600_000).toISOString().slice(0, 10)
  // YAML/author 不合法时保留原文，交给内核产生中文四项诊断，预览仍显示其他文件。
  if (typeof bundle.files[path] === 'string') {
    try { bundle.files[path] = applyServerFields(bundle.files[path], { login: login || 'submitter', addedAt: date }) }
    catch { /* 不吞校验：下面的模型保留原始错误字段 */ }
  }
  bundle.screenshots = screenshotNames(bundle)
  const count = Math.max(bundle.screenshots.length, images.length)
  const placeholders = Array.from({ length: count }, (_, i) => ({
    ...images[i], size: images[i]?.size ?? 0, format: images[i]?.format ?? 'png',
  }))
  const plan = planScreenshots(bundle, placeholders)
  return { model: modelFromBundle(plan, plan.images), plan, slug: bundle.slug }
}
