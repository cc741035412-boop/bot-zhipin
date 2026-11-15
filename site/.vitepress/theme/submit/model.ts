import { unpack } from '../../../../scripts/submission/bundle-core.mjs'
import { applyServerFields } from '../../../../scripts/lib/submit-fields.mjs'
import { modelFromBundle } from '../../../../scripts/lib/bot-model.mjs'
import { planScreenshots } from '../../../../scripts/submission/screenshot-plan.mjs'

// 投稿不收截图（DECISIONS 第 43 条）：与后端一致，没有图片时忽略投稿包里残留的截图文件名。
export function submissionModel(plaintext: string, {
  login, now = new Date(), addedAt,
}: { login?: string | null; now?: Date | string | number; addedAt?: string } = {}) {
  const bundle = unpack(plaintext)
  const path = `bots/${bundle.slug}/bot.yaml`
  const date = addedAt || new Date(new Date(now).getTime() + 8 * 3600_000).toISOString().slice(0, 10)
  // YAML/author 不合法时保留原文，交给内核产生中文四项诊断，预览仍显示其他文件。
  if (typeof bundle.files[path] === 'string') {
    try { bundle.files[path] = applyServerFields(bundle.files[path], { login: login || 'submitter', addedAt: date }) }
    catch { /* 不吞校验：下面的模型保留原始错误字段 */ }
  }
  const plan = planScreenshots(bundle, [])
  return { model: modelFromBundle(plan, plan.images), plan, slug: bundle.slug }
}
