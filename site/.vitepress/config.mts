import { defineConfig } from 'vitepress'
import { SITE } from './meta.mjs'
import { botWatch } from './bot-watch.mjs'

export default defineConfig({
  lang: 'zh-CN',
  title: SITE.name,
  description: SITE.tagline,
  cleanUrls: true,
  appearance: true,
  vite: { plugins: [botWatch()] },
  lastUpdated: false,
  transformPageData(pageData) {
    const bot = pageData.params?.bot
    if (bot) {
      pageData.title = bot.name
      pageData.description = bot.tagline
      pageData.frontmatter.title = bot.name
      pageData.frontmatter.description = bot.tagline
    }
  },
  themeConfig: {
    nav: [{ text: '我要投稿', link: `${SITE.repo}/blob/${SITE.branch}/CONTRIBUTING.md` }],
    socialLinks: [{ icon: 'github', link: SITE.repo }],
    outline: { label: '本页目录' },
    darkModeSwitchLabel: '外观',
    lightModeSwitchTitle: '切换到浅色',
    darkModeSwitchTitle: '切换到深色',
    returnToTopLabel: '回到顶部',
    sidebarMenuLabel: '菜单',
    skipToContentLabel: '跳到主要内容',
    notFound: { title: '页面不存在', quote: '这个 Bot 可能已经下架了。', linkText: '回到首页' },
  },
})
