import { buildBotModel } from '../../../../scripts/lib/bot-model.mjs'
import { validateModels } from '../../../../scripts/lib/validate/core.mjs'
import { LIMITS, unpack } from '../../../../scripts/submission/bundle-core.mjs'
import { screenshotNames, submissionModel } from './model'
import type { SubmitContext } from './context'

export function checkBundle(plaintext: string, {
  context, login, now = new Date(),
}: { context?: SubmitContext | null; login?: string | null; now?: Date | string | number } = {}) {
  const { slug } = unpack(plaintext)
  const existing = context?.index.find((bot) => bot.slug === slug)
  const update = Boolean(login && existing?.authorGithub?.toLowerCase() === login.toLowerCase())
  const { model } = submissionModel(plaintext, { login, now, addedAt: update ? existing?.addedAt : undefined })
  let template
  if (context) {
    template = buildBotModel('_template', {
      files: Object.entries(context.template.files).map(([rel, text]) => ({ rel, text, size: new TextEncoder().encode(text).length })),
    })
  } else {
    // 核心要求一个完整的模板模型。空模板跳过标题/示例比较，不修改 L1。
    template = buildBotModel('_template', { files: [] })
    template.data = { slug: null, tagline: null, pitch: null, author: { github: null } }
    template.design = ''
    template.routines = '\0'
  }
  const { errors, warnings } = validateModels([model], {
    template, now, others: (context?.index || []).filter((bot) => bot.slug !== slug),
    policy: { submission: { login: login || 'submitter' } },
  })
  const bundle = unpack(plaintext)
  const shotLimit = Math.min(12, LIMITS.files - Object.keys(bundle.files).length)
  if (screenshotNames(bundle).length > shotLimit) errors.push({
    file: `bots/${slug}/screenshots`, where: '截图数量',
    problem: `本次网站投稿最多可放 ${shotLimit} 张截图。`, fix: '请让 AI 精简截图声明和设计说明中的图片引用，再生成投稿链接。',
  })
  return { errors, warnings, slug, update }
}
