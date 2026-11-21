import { defineConfig, type HeadConfig } from 'vitepress'
import { SITE, CONTRIBUTE_URL } from './meta.mjs'
import { generateHeaders } from '../../scripts/gen-headers.mjs'
import { botWatch } from './bot-watch.mjs'
import { fullName } from '../../scripts/lib/bot-name.mjs'

// 收录条目的网页标题：中文标题在前，原标题（Prompt 的 titleOriginal、Skill 的原名）放括号里，和中文叫法的 Bot 一个写法。
function libraryHead(item: { title: string, purpose: string, titleOriginal?: string | null, name?: string }) {
  const original = item.titleOriginal || (item.name && item.name !== item.title ? item.name : null)
  return { title: original ? `${item.title}（${original}）` : item.title, description: item.purpose }
}

export default defineConfig({
  lang: 'zh-CN',
  title: SITE.name,
  description: SITE.tagline,
  cleanUrls: true,
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
  vite: { plugins: [botWatch()] },
  lastUpdated: false,
  async buildEnd(config) { await generateHeaders(config.outDir) },
  transformPageData(pageData) {
    // Bot 详情页和小队页都用自己的名字当标题、一句话介绍当 description。
    // 有中文叫法的 Bot，标题是「中文叫法（原名）」：标签页上先看到中文，搜原名也搜得到。
    // Prompt、Skill 的详情页同理：标题是「中文标题（原标题 / skill 原名）」，description 是一句话用途。
    const params = pageData.params
    const libraryPath = pageData.relativePath?.match(/^(prompts|skills)\/(.+)\.md$/)
    if (libraryPath) {
      const path = `/${libraryPath[1]}/${params?.slug || (libraryPath[2] === 'index' ? '' : libraryPath[2])}`
      pageData.frontmatter.head = [...(pageData.frontmatter.head || []), ['link', { rel: 'canonical', href: SITE.url + path }]]
    }
    const page = params?.bot || params?.squad
      ? { title: fullName(params.bot || params.squad), description: (params.bot || params.squad).tagline }
      : params?.prompt || params?.skill ? libraryHead(params.prompt || params.skill) : null
    if (page) {
      const { title, description } = page
      pageData.title = title
      // 客户端路由切换时 VitePress 用 setAttribute 写入它（安全）；服务端那行不转义的
      // description 会因下面 transformHead 已提供 description 而被跳过（isDescriptionOverridden）。
      pageData.description = description
      pageData.frontmatter.title = title
      delete pageData.frontmatter.description
      pageData.frontmatter.head = [
        ...((pageData.frontmatter.head || []) as HeadConfig[]).filter(([tag, attrs]) => !(tag === 'meta' && attrs?.name === 'description')),
        ['meta', { name: 'description', content: description }],
      ]
    }
  },
  // VitePress 1.6.4 的 SSR 会过滤 frontmatter.head 中的 description。
  // 在最终 head 阶段补回，走属性转义，并覆盖默认 description，避免重复 meta。
  transformHead({ pageData }) {
    const params = pageData.params
    return params?.bot || params?.squad || params?.prompt || params?.skill
      ? (pageData.frontmatter.head as HeadConfig[]).filter(([tag, attrs]) => tag === 'meta' && attrs?.name === 'description')
      : []
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
