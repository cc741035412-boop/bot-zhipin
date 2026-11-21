// library/ 入库的统一记录格式。所有适配器只通过 makeRecord 产出记录，管线其余部分只认这里定义的字段。
// 外部仓库的文件一律当数据读：这里不执行、不 eval、不 import 任何来源里的东西。
import { createHash } from 'node:crypto'

export const KINDS = ['bot-link', 'profile', 'prompt', 'skill', 'routine', 'team', 'recipe']

// 允许出现在 license 字段里的取值（SPDX）。新来源用了别的许可，先停下来问维护者，不要往这里随手加。
export const LICENSES = ['MIT', 'CC-BY-4.0', 'CC0-1.0']

// x.ai 分享链接：ID 固定 21 位 nanoid 字符。marketplace、REPLACE 这类路径段不是 ID。
const SHARE_ID = /x\.ai\/bot\/([A-Za-z0-9_-]{21})(?![A-Za-z0-9_-])/
const SHARE_ID_ALL = new RegExp(SHARE_ID.source, 'g')

export function shareIdOf(text) {
  if (text == null) return null
  const m = String(text).match(SHARE_ID)
  return m ? m[1] : null
}

export function shareIdsIn(text) {
  if (text == null) return []
  return [...new Set([...String(text).matchAll(SHARE_ID_ALL)].map((m) => m[1]))]
}

export const shareUrlOf = (id) => (id ? `https://x.ai/bot/${id}` : null)

// 全文去重用：去掉所有空白（含全角空格和换行）后取 sha256。正文为空返回 null。
export function bodyHash(body) {
  if (body == null) return null
  const compact = String(body).replace(/\s+/gu, '')
  if (!compact) return null
  return `sha256:${createHash('sha256').update(compact, 'utf8').digest('hex')}`
}

// 钉在具体提交上的 GitHub 文件链接。sourcePath 里 # 后面是同一文件内的第几条，只进锚点。
export function githubBlobUrl(repo, commit, sourcePath) {
  const [path, anchor] = String(sourcePath).split('#')
  const encoded = path.split('/').map(encodeURIComponent).join('/')
  return `https://github.com/${repo}/blob/${commit}/${encoded}${anchor ? `#${anchor}` : ''}`
}

const REQUIRED = ['sourceKey', 'kind', 'title', 'sourceRepo', 'sourcePath', 'sourceUrl', 'license', 'fetchedAt']

function cleanAuthor(author) {
  if (author == null) return null
  const name = String(author.name ?? '').trim()
  if (!name) return null
  const out = { name }
  if (author.url) out.url = String(author.url)
  if (author.role) out.role = String(author.role)
  return out
}

/**
 * 产出一条记录。字段顺序固定，便于 JSONL 做 diff。
 * id = `${sourceKey}:${sourcePath}`，跨次运行稳定；中文字段、评分等注释文件靠它对上。
 * extra 放来源特有的字段（原分类、原摘要、来源自带的中文摘要、链接状态等），不参与去重。
 */
export function makeRecord(fields) {
  for (const key of REQUIRED) {
    if (fields[key] == null || fields[key] === '') throw new Error(`makeRecord 缺少字段 ${key}（${fields.sourcePath ?? '未知路径'}）`)
  }
  if (!KINDS.includes(fields.kind)) throw new Error(`未知 kind：${fields.kind}（${fields.sourcePath}）`)
  if (!LICENSES.includes(fields.license)) throw new Error(`未登记的许可：${fields.license}（${fields.sourcePath}）`)
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/.test(fields.fetchedAt)) throw new Error(`fetchedAt 必须是 UTC ISO 时间：${fields.fetchedAt}`)
  const body = fields.body == null || String(fields.body).trim() === '' ? null : String(fields.body).replace(/\r\n?/g, '\n').trim()
  const shareId = fields.shareId ?? null
  if (shareId != null && !/^[A-Za-z0-9_-]{21}$/.test(shareId)) throw new Error(`shareId 不是 21 位：${shareId}（${fields.sourcePath}）`)
  return {
    id: `${fields.sourceKey}:${fields.sourcePath}`,
    kind: fields.kind,
    title: String(fields.title).trim(),
    body,
    shareId,
    integrations: [...new Set((fields.integrations ?? []).map((s) => String(s).trim()).filter(Boolean))],
    sourceRepo: fields.sourceRepo,
    sourcePath: fields.sourcePath,
    sourceUrl: fields.sourceUrl,
    author: cleanAuthor(fields.author),
    license: fields.license,
    fetchedAt: fields.fetchedAt,
    bodyHash: bodyHash(body),
    extra: fields.extra ?? {},
  }
}
