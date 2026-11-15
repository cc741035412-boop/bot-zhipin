import MarkdownIt from 'markdown-it'
import { prepareDesignSource, installSafeDesignRules } from '../../../../scripts/lib/design-markdown.mjs'
import { summarizeBot } from '../../../../scripts/lib/bot-summary.mjs'
import { validate } from '../../../../scripts/lib/validate/generated/bot-schema.mjs'
import { submissionModel, type PreviewImage } from './model'
export { summarizeBot }

export function renderDesign(markdown: string, {
  slug, assetUrl = () => null,
}: { slug: string; assetUrl?: (name: string) => string | null }) {
  const md = new MarkdownIt({
    html: false, linkify: true,
    highlight: (code: string) => `<pre><code>${md.utils.escapeHtml(code)}</code></pre>`,
  })
  // 与 VitePress 一致：只自动识别带协议的链接，不猜测裸域名。
  md.linkify.set({ fuzzyLink: false })
  // 不安装 attrs、snippet、frontmatter、Vue 等插件；HTML 仅供 v-html，不可编译。
  installSafeDesignRules(md, { assetUrl })
  return md.render(prepareDesignSource(markdown), { slug })
}

export function previewModel(plaintext: string, {
  images = [], login, addedAt, names = new Map(), now,
}: {
  images?: (PreviewImage | null)[]; login?: string | null; addedAt?: string
  names?: Map<string, string>; now?: Date | string | number
} = {}) {
  const { model, plan, slug } = submissionModel(plaintext, { images, login, addedAt, now })
  const urls = new Map(plan.images.map((image: PreviewImage & { name: string }) => {
    const url = image.url || image.thumb || null
    return [image.name, url && /^(?:blob:|data:image\/(?:jpeg|png|webp|gif);base64,)/i.test(url) ? url : null]
  }))
  const asset = (name: string) => urls.get(decodeURIComponent(name)) ?? null
  const summary = summarizeBot(model, { asset, names })
  validate(model.data)
  const invalid = [...(validate.errors || [])]
  const bad = (path: string) => !model.data || invalid.some((error) =>
    error.instancePath === '' || error.instancePath === path || error.instancePath.startsWith(path + '/'))
  if (bad('/templateUrl') || typeof summary.templateUrl !== 'string') summary.templateUrl = null
  if (bad('/author')) {
    summary.author.url = null
    summary.author.link = null
  } else {
    summary.author.link = summary.author.github
      ? `https://github.com/${summary.author.github}`
      : summary.author.url || summary.templateUrl || null
  }
  if (bad('/forkedFrom')) { summary.forkedFrom = null; summary.forkedFromName = null }
  return { model, summary, designHtml: renderDesign(model.design || '', { slug, assetUrl: asset }), slug }
}
