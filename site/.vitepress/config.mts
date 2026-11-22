import { cp, mkdir, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { defineConfig, type HeadConfig, type PageData } from 'vitepress'
import { SITE, CONTRIBUTE_URL, HERO_MASCOTS } from './meta.mjs'
import faces from './data/faces.json'
import { shelfData } from './data/bots.mjs'
import { ROOT, loadEnums } from '../../scripts/lib/load-bots.mjs'
import * as share from '../../scripts/lib/share.mjs'
import { buildCatalog } from '../../scripts/lib/catalog.mjs'
import { renderLlms } from '../../scripts/lib/llms.mjs'
import { INDEX_PATH, SKILL_DIR, buildAgentData } from '../../scripts/lib/agent-data.mjs'
import { promptData, skillData } from './data/prompts-skills.mjs'
import { generateOgImages } from '../../scripts/og/index.mjs'
import { generateHeaders } from '../../scripts/gen-headers.mjs'
import { skillMedia } from './skill-media.mjs'
import { botWatch } from './bot-watch.mjs'
import { fullName } from '../../scripts/lib/bot-name.mjs'

// 收录条目的网页标题：中文标题在前，原标题（Prompt 的 titleOriginal、Skill 的原名）放括号里。
function entryHead(item: { title: string, purpose: string, titleOriginal?: string | null, name?: string }) {
  const original = item.titleOriginal || (item.name && item.name !== item.title ? item.name : null)
  return { title: original ? `${item.title}（${original}）` : item.title, description: item.purpose }
}

const siteImage = share.ogImageUrl('site', undefined, share.siteOgInput(HERO_MASCOTS))

function sharingHead(page: PageData): HeadConfig[] {
  if (!page.relativePath || page.relativePath === '404.md') return []
  const { bot, squad } = page.params ?? {}
  const path = share.pagePath(page.relativePath)
  const url = share.absoluteUrl(path)
  // Bot 页的 frontmatter.title 已在 transformPageData 里换成新标题；没写标题的页面用站名兜底。
  const title = path === '/' ? SITE.name : squad?.name ?? page.frontmatter.title ?? SITE.name
  const description = page.description || SITE.tagline
  const image = bot ? share.ogImageUrl('bot', bot.slug, share.botOgInput(bot, faces))
    : squad ? share.ogImageUrl('squad', squad.slug, share.squadOgInput(squad, faces)) : siteImage
  const og = (key: string, content: string): HeadConfig => ['meta', { property: `og:${key}`, content }]
  const twitter = (key: string, content: string): HeadConfig => ['meta', { name: `twitter:${key}`, content }]
  return [
    ['link', { rel: 'canonical', href: url }],
    og('url', url), og('type', 'website'), og('site_name', SITE.name), og('locale', 'zh_CN'),
    og('title', title), og('description', description), og('image', image),
    og('image:width', String(share.OG_SIZE.width)), og('image:height', String(share.OG_SIZE.height)),
    og('image:alt', bot ? fullName(bot) : squad?.name ?? SITE.name),
    twitter('card', 'summary_large_image'), twitter('title', title),
    twitter('description', description), twitter('image', image),
  ]
}

export default defineConfig({
  lang: 'zh-CN',
  title: SITE.name,
  description: SITE.tagline,
  cleanUrls: true,
  sitemap: { hostname: SITE.url },
  // 静态图标给没有脚本、不支持 SVG 图标的环境兜底；脚本起来后由 theme/live/favicon.ts 接管。
  // 三个文件由 npm run gen:favicon 生成。.ico 写 sizes 是为了不让 Chrome 优先选它而放着 SVG 不用。
  head: [
    ['link', { rel: 'icon', href: '/favicon.ico', sizes: '32x32' }],
    ['link', { rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' }],
    ['link', { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' }],
    // 旧地址（*.pages.dev）打开时立刻换到正式域名，路径、参数、#后面的投稿包都带上。放在页面头部、渲染之前跑。
    // 不用 Functions 做 301：那样每个静态请求都要过一次函数，占免费额度。投稿页的 CSP 会自动给它算哈希（gen-headers.mjs）。
    ['script', {}, `if(location.hostname===${JSON.stringify(SITE.legacyHost)})location.replace(${JSON.stringify(SITE.url)}+location.pathname+location.search+location.hash)`],
  ],
  appearance: true,
  vite: { plugins: [botWatch(), skillMedia()] },
  lastUpdated: false,
  // 构建产物里补这些：分享图（og/）、catalog.json、llms.txt、按投稿页内联脚本算出的 CSP（_headers），
  // 以及给 AI 用的 Prompt、Skill、Bot 数据（data/）和 bot-zhipin skill 的文件（skill/bot-zhipin/，决策 70）。
  async buildEnd({ outDir }) {
    const shelf = shelfData()
    const catalog = buildCatalog(shelf)
    const prompts = promptData()
    const skills = skillData()
    const agentData = buildAgentData({ prompts, skills, bots: catalog.bots })
    const json = (data: unknown) => JSON.stringify(data, null, 2) + '\n'
    const out = (path: string) => join(outDir, path.slice(1))
    await generateOgImages(outDir)
    await Promise.all(['/data/prompts/', '/data/skills/', '/data/bots/'].map((dir) => mkdir(out(dir), { recursive: true })))
    await Promise.all([
      generateHeaders(outDir),
      writeFile(join(outDir, 'catalog.json'), json(catalog)),
      writeFile(join(outDir, 'llms.txt'), renderLlms(shelf, loadEnums().categories, { prompts, skills })),
      writeFile(out(INDEX_PATH), json(agentData.index)),
      ...agentData.files.map(({ path, data }) => writeFile(out(path), json(data))),
      mkdir(dirname(out(SKILL_DIR)), { recursive: true }).then(() => cp(join(ROOT, 'integrations/bot-zhipin/skills/bot-zhipin'), out(SKILL_DIR), {
        recursive: true, filter: (src) => !/(__pycache__|\.pyc$|\.DS_Store$)/.test(src),
      })),
    ])
  },
  transformPageData(pageData) {
    if (pageData.relativePath === '404.md') return
    const { bot, squad, entryJson } = pageData.params ?? {}
    if (bot || squad) {
      // Bot 详情页：「中文叫法（原名）怎么用、值不值得装」+ 一句话介绍接编辑点评第一句（规则在 share.mjs，决策 56）。
      // 小队页仍用队名和一句话介绍。
      pageData.title = bot ? share.botPageTitle(bot) : fullName(squad)
      pageData.frontmatter.title = pageData.title
      // 客户端路由切换时 VitePress 用 setAttribute 写入 description（安全）；服务端那行不转义的
      // description 会因下面 transformHead 已提供 description 而被跳过（isDescriptionOverridden）。
      pageData.description = bot ? share.botDescription(bot) : squad.tagline
      delete pageData.frontmatter.description
    } else if (entryJson) {
      const { title, description } = entryHead(JSON.parse(entryJson))
      pageData.title = pageData.frontmatter.title = title
      pageData.description = description
      delete pageData.frontmatter.description
    } else if (pageData.relativePath) {
      pageData.description = pageData.relativePath === 'index.md' ? SITE.tagline : pageData.frontmatter.description || SITE.tagline
    } else return

    // 写入 frontmatter.head，让客户端切换路由时也更新 canonical 和分享卡片。
    pageData.frontmatter.head = [
      ...((pageData.frontmatter.head || []) as HeadConfig[]).filter(([tag, attrs]) => !(tag === 'meta' && attrs?.name === 'description')),
      ['meta', { name: 'description', content: pageData.description }],
      ...sharingHead(pageData),
    ]
  },
  // VitePress 1.6.4 的 SSR 会过滤 frontmatter.head 中的 description。
  // 在最终 head 阶段补回，走属性转义，并覆盖默认 description，避免重复 meta。
  transformHead({ pageData }) {
    return ((pageData.frontmatter.head || []) as HeadConfig[]).filter(([tag, attrs]) => tag === 'meta' && attrs?.name === 'description')
  },
  themeConfig: {
    modules: [{ text: 'Bot', link: '/' }, { text: 'Prompt', link: '/prompts/' }, { text: 'Skills', link: '/skills/' }],
    nav: [{ text: '我要投稿', link: CONTRIBUTE_URL }],
    socialLinks: [{ icon: 'github', link: SITE.repo }],
    outline: { label: '本页目录' },
    darkModeSwitchLabel: '外观',
    lightModeSwitchTitle: '切换到浅色',
    darkModeSwitchTitle: '切换到深色',
    returnToTopLabel: '回到顶部',
    sidebarMenuLabel: '菜单',
    skipToContentLabel: '跳到主要内容',
  },
})
