// 网站用的收录条目（Prompt、Skill）数据形状：纯函数，不读盘。
// 详情页拿完整的一条（路由参数）；本库列表与筛选用去掉长文字的列表版，控制每个页面要加载的数据量。
import { schema as promptSchema } from './validate/generated/prompt-schema.mjs'
import { schema as skillSchema } from './validate/generated/skill-schema.mjs'

const SCHEMAS = { prompt: promptSchema, skill: skillSchema }
const str = (value) => typeof value === 'string' && value.trim() !== '' ? value : null
const strings = (value) => Array.isArray(value) ? value.filter((item) => typeof item === 'string' && item.trim() !== '') : []
// YAML 的 | 块会在末尾留一个换行；页面上不要它。正文中间的空行、缩进原样保留。
const block = (value) => str(value) ? value.replace(/\s+$/, '') : null

/** 网站路由和清单共用的最小上架口径：YAML 能解析、slug 合法且和文件名一致。完整内容规则由 validate 负责。 */
export function isPublicEntry(entry) {
  const rule = SCHEMAS[entry?.kind]?.properties.slug
  const slug = entry?.data?.slug
  return Boolean(rule) && !entry.stray && !entry.yamlError && !entry.yamlTooLarge && slug === entry.slug &&
    typeof slug === 'string' && slug !== 'index' && slug.length >= rule.minLength && slug.length <= rule.maxLength && new RegExp(rule.pattern).test(slug)
}

function common(data, kind) {
  return {
    kind,
    slug: data.slug,
    title: str(data.title) ?? data.slug,
    category: data.category,
    purpose: str(data.purpose) ?? '',
    scenarios: strings(data.scenarios),
    tags: strings(data.tags),
    source: { url: str(data.source?.url), name: str(data.source?.name) ?? str(data.source?.url) ?? '' },
    author: { name: str(data.author?.name) ?? '', url: str(data.author?.url) },
    license: str(data.license),
    licenseUrl: str(data.licenseUrl),
    addedAt: typeof data.addedAt === 'string' ? data.addedAt : null,
    detailUrl: `/${kind}s/${data.slug}`,
  }
}

/** 详情页保留原文和本站译文，两者的换行和缩进都不改。 */
export function summarizePrompt(entry) {
  const data = entry.data
  const body = str(data.body)
  return {
    ...common(data, 'prompt'),
    titleOriginal: str(data.titleOriginal),
    lang: str(data.lang),
    copyright: str(data.copyright),
    body,
    bodyZh: str(data.bodyZh),
    hasBody: body !== null,
    summary: block(data.summary),
    usage: block(data.usage),
  }
}

/** 一个 Skill 的完整数据（详情页用）。Skill 不收正文。 */
export function summarizeSkill(entry) {
  const data = entry.data
  return {
    ...common(data, 'skill'),
    name: str(data.name) ?? data.slug,
    agents: strings(data.agents),
    summary: block(data.summary),
    install: Array.isArray(data.install) ? data.install.filter((item) => str(item?.command)).map((item) => ({
      agent: str(item.agent), command: item.command, note: str(item.note),
    })) : [],
    requires: strings(data.requires),
  }
}

/** 列表版：去掉只有详情页才用的长文字（Prompt 的原文、译文、摘要、用法；Skill 的摘要、安装和依赖）。 */
export const listPrompt = ({ body, bodyZh, summary, usage, copyright, ...item }) => item
export const listSkill = ({ summary, install, requires, ...item }) => item

// FNV-1a 32：slug 只含 ASCII，按无符号整数比较。
function slugHash(slug) {
  let h = 2166136261
  for (const c of slug) h = Math.imul(h ^ c.charCodeAt(0), 16777619)
  return h >>> 0
}

/** 整库固定顺序；查询和分类只缩小集合，不重排。 */
export function sortEntries(items) {
  return [...items].sort((a, b) => String(b.addedAt).localeCompare(String(a.addedAt)) || slugHash(a.slug) - slugHash(b.slug))
}
