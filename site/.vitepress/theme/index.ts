import DefaultTheme from 'vitepress/theme'
import { h } from 'vue'
import NotFound from './components/NotFound.vue'
import SearchPalette from './components/SearchPalette.vue'
import type { Theme } from 'vitepress'
import './style.css'
import './styles/tokens.css'
import './styles/base.css'
import './styles/home.css'
import './styles/detail.css'

export default {
  extends: DefaultTheme,
  Layout: () => h(DefaultTheme.Layout, null, {
    'not-found': () => h(NotFound),
    'layout-bottom': () => h(SearchPalette),
  }),
  enhanceApp() {},
} satisfies Theme
