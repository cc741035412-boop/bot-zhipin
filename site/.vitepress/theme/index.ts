import DefaultTheme from 'vitepress/theme'
import { h } from 'vue'
import NotFound from './components/NotFound.vue'
import SearchPalette from './components/SearchPalette.vue'
import { inBrowser, type Theme } from 'vitepress'
import './styles/tokens.css'
import './styles/base.css'
import './styles/nav.css'
import './styles/hero.css'
import './styles/home.css'
import './styles/detail.css'
import './styles/misc.css'

export default {
  extends: DefaultTheme,
  Layout: () => h(DefaultTheme.Layout, null, {
    'not-found': () => h(NotFound),
    'layout-bottom': () => h(SearchPalette),
  }),
  enhanceApp() {
    // 标签页小图标换成一只随机变化的 Bot；单独成块，不拖慢首屏。
    if (inBrowser) void import('./live/favicon').then(({ startFavicon }) => startFavicon())
  },
} satisfies Theme
