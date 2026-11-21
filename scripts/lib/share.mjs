// 被搜到、被转发、被机器读到要用的几样东西：站内绝对地址、分享图的路径和版本号、Bot 详情页的标题和描述。
// 纯函数，不读盘。页面 head（site/.vitepress/config.mts）、分享图生成、catalog.json / llms.txt 共用这一份。
import { createHash } from 'node:crypto'
import { SITE } from '../../site/.vitepress/meta.mjs'
import { fullName } from './bot-name.mjs'

/** 分享图的尺寸（og:image:width / height 用的也是它）。 */
export const OG_SIZE = Object.freeze({ width: 1200, height: 630 })

/**
 * 分享图版式的版本号。改了分享图的画法（布局、配色、字体）就加 1：
 * 地址后面的 v= 跟着变，飞书、X 这类会缓存图片的平台才会重新抓。
 */
export const OG_LAYOUT_VERSION = 1

/** 站内路径 → 正式域名下的绝对地址。路径要以 / 开头。 */
export function absoluteUrl(path) {
  if (typeof path !== 'string' || !path.startsWith('/')) throw new TypeError(`站内路径要以 / 开头：${path}`)
  return new URL(path, SITE.url).href
}

/**
 * VitePress 的 relativePath → 页面的规范地址（cleanUrls：不带 .html，index 是目录本身）。
 * 'index.md' → '/'，'bots/copy-humanizer.md' → '/bots/copy-humanizer'，'submit.md' → '/submit'。
 */
export function pagePath(relativePath) {
  const path = `/${relativePath}`.replace(/\.md$/, '').replace(/(^|\/)index$/, '$1')
  return path || '/'
}

/** 分享图在构建产物里的位置（相对 outDir，不带开头的 /）。kind：'bot' | 'squad' | 'site'。 */
export function ogImageFile(kind, slug) {
  if (kind === 'site') return 'og/site.png'
  if (kind === 'bot') return `og/bots/${slug}.png`
  if (kind === 'squad') return `og/squads/${slug}.png`
  throw new TypeError(`不认识的分享图类型：${kind}`)
}

/** 画图用到的输入一变，版本号就变。input 必须能 JSON 序列化。 */
export function ogVersion(input) {
  return createHash('sha256').update(JSON.stringify([OG_LAYOUT_VERSION, input])).digest('hex').slice(0, 10)
}

/** og:image 的完整地址：绝对地址 + ?v=版本号。 */
export function ogImageUrl(kind, slug, input) {
  return `${absoluteUrl(`/${ogImageFile(kind, slug)}`)}?v=${ogVersion(input)}`
}

// 下面三个函数决定「画图用到了哪些输入」。分享图生成那边画了什么，这里就要放什么，两边对得上版本号才有意义。
// faces 是 site/.vitepress/data/faces.json 的内容（slug → { color, shape, fetchedAt }），由调用方传入。
const faceOf = (faces, slug) => {
  const entry = faces && Object.hasOwn(faces, slug) ? faces[slug] : null
  return entry ? { color: entry.color, shape: entry.shape } : null
}

/** Bot 分享图的输入：脸、中文叫法、原名、一句话介绍。 */
export function botOgInput(bot, faces) {
  return { name: bot.name, nameZh: bot.nameZh ?? null, tagline: bot.tagline, face: faceOf(faces, bot.slug) }
}

/** 小队分享图的输入：队名、一句话介绍、成员（顺序、称呼、脸）。 */
export function squadOgInput(squad, faces) {
  return {
    name: squad.name,
    tagline: squad.tagline,
    members: squad.members.map((member) => ({ bot: member.bot, name: member.name, nameZh: member.nameZh ?? null, face: faceOf(faces, member.bot) })),
  }
}

/** 全站分享图（首页和其他页面）的输入：站名、站点一句话、九只吉祥物。 */
export function siteOgInput(mascots) {
  return { name: SITE.name, tagline: SITE.tagline, mascots }
}

// 句末标点：中文句号、问号、叹号，以及英文的问号、叹号。英文句点不算（「v1.2」「x.ai」里都有）。
const SENTENCE_END = /[。！？!?]/u

/** 一段话的第一句（含句末标点）；没有句末标点就是整段。 */
export function firstSentence(text) {
  const value = typeof text === 'string' ? text.trim() : ''
  const match = SENTENCE_END.exec(value)
  return match ? value.slice(0, match.index + 1) : value
}

/** 两句话接成一段：前一句没有句末标点时补一个「。」。 */
export function joinSentences(a, b) {
  const head = typeof a === 'string' ? a.trim() : ''
  const tail = typeof b === 'string' ? b.trim() : ''
  if (!head) return tail
  if (!tail) return head
  return `${/[。！？!?…]$/u.test(head) ? head : `${head}。`}${tail}`
}

/**
 * Bot 详情页 <title> 的主体（VitePress 会在后面接「 | Bot 直聘」）：「<中文叫法>（<原名>）怎么用、值不值得装」。
 * 没有中文叫法时就是「<原名>怎么用、值不值得装」；原名以字母或数字结尾时中间空一格，和全站中英文之间空格的写法一致。
 * og:title 用的也是它（不带站名，站名放 og:site_name）。
 */
export function botPageTitle(bot) {
  const name = fullName(bot)
  return `${/[A-Za-z0-9]$/.test(name) ? `${name} ` : name}怎么用、值不值得装`
}

/** Bot 详情页的 description（og:description 同）：一句话介绍 + 编辑点评的第一句；没有点评就只有一句话介绍。 */
export function botDescription(bot) {
  return joinSentences(bot.tagline, firstSentence(bot.editorNote))
}
