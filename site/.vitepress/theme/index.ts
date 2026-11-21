import DefaultTheme from 'vitepress/theme'
import { h } from 'vue'
import NotFound from './components/NotFound.vue'
import SearchPalette from './components/SearchPalette.vue'
import ModuleNav from './components/ModuleNav.vue'
import SiteFooter from './components/SiteFooter.vue'
import { inBrowser, type Theme } from 'vitepress'
import './styles/tokens.css'
import './styles/base.css'
import './styles/nav.css'
import './styles/hero.css'
import './styles/home.css'
import './styles/detail.css'
import './styles/squad.css'
import './styles/misc.css'
import './styles/library.css'

export default {
  extends: DefaultTheme,
  Layout: () => h(DefaultTheme.Layout, null, {
    'nav-bar-content-before': () => h(ModuleNav),
    'not-found': () => h(NotFound),
    // 全站页脚接在内容后面；搜索面板是浮层，放哪都一样
    'layout-bottom': () => [h(SiteFooter), h(SearchPalette)],
  }),
  enhanceApp() {
    // 标签页小图标换成一只随机变化的 Bot；单独成块，不拖慢首屏。
    if (inBrowser) void import('./live/favicon').then(({ startFavicon }) => startFavicon())
  },
} satisfies Theme
