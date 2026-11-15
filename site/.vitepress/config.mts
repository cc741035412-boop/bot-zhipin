import { defineConfig, type HeadConfig } from 'vitepress'
import { SITE, CONTRIBUTE_URL } from './meta.mjs'
import { generateHeaders } from '../../scripts/gen-headers.mjs'
import { botWatch } from './bot-watch.mjs'

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
  ],
  appearance: true,
  vite: { plugins: [botWatch()] },
  lastUpdated: false,
  async buildEnd(config) { await generateHeaders(config.outDir) },
  transformPageData(pageData) {
    // Bot 详情页和小队页都用自己的名字当标题、一句话介绍当 description。
    const bot = pageData.params?.bot || pageData.params?.squad
    if (bot) {
      pageData.title = bot.name
      // 客户端路由切换时 VitePress 用 setAttribute 写入它（安全）；服务端那行不转义的
      // description 会因下面 transformHead 已提供 description 而被跳过（isDescriptionOverridden）。
      pageData.description = bot.tagline
      pageData.frontmatter.title = bot.name
      delete pageData.frontmatter.description
      pageData.frontmatter.head = [
        ...((pageData.frontmatter.head || []) as HeadConfig[]).filter(([tag, attrs]) => !(tag === 'meta' && attrs?.name === 'description')),
        ['meta', { name: 'description', content: bot.tagline }],
      ]
    }
  },
  // VitePress 1.6.4 的 SSR 会过滤 frontmatter.head 中的 description。
  // 在最终 head 阶段补回，走属性转义，并覆盖默认 description，避免重复 meta。
  transformHead({ pageData }) {
    return pageData.params?.bot || pageData.params?.squad
      ? (pageData.frontmatter.head as HeadConfig[]).filter(([tag, attrs]) => tag === 'meta' && attrs?.name === 'description')
      : []
  },
  themeConfig: {
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
