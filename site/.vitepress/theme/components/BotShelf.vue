<script setup>
import { computed, onBeforeUnmount, onMounted, ref, shallowRef, watch } from 'vue'
import { data as bots } from '../../data/bots.data.mjs'
import { data as enums } from '../enums.data.mjs'
import { SITE, CONTRIBUTE_URL, HERO_MASCOTS, SHELF_COPY } from '../../meta.mjs'
import { heatState, loadHeat } from '../heat'
import { categoryStyle } from '../color'
import BotCard from './BotCard.vue'
import FeaturedCard from './FeaturedCard.vue'
import HeroPortrait from './HeroPortrait.vue'
import SearchTrigger from './SearchTrigger.vue'
import { enterHero } from '../live/reactions'
import DefaultAvatar from './DefaultAvatar.vue'
import LiveAnnouncer from './LiveAnnouncer.vue'

const ALL = 'all'
// 副标题按「：，」拆成短句，各自不拆行：换行只落在标点后面，不会把词劈成两半。
const taglineClauses = SITE.tagline.match(/[^：，]+[：，]?/g) || [SITE.tagline]
const hero = ref()
let releaseEntry
const sort = ref('hot')
const filter = ref(ALL)
let manual = false
let alive = true
const ordered = shallowRef([])
const featured = shallowRef([])
const byName = new Intl.Collator('zh-CN')
const entering = ref(false)
const featuredEntering = ref(false)
const slugs = (list) => list.map((bot) => bot.slug).join(',')
const byNewest = (a, b) => b.addedAt.localeCompare(a.addedAt) || byName.compare(a.name, b.name)
const byHeat = (a, b) => (heatState.values[b.slug] ?? 0) - (heatState.values[a.slug] ?? 0) || byNewest(a, b)
// 货架上实际出现的岗位，顺序跟 schema 枚举走。
const categories = computed(() => enums.categories.filter((category) => bots.some((bot) => bot.category === category)))
const visible = computed(() => filter.value === ALL ? ordered.value : ordered.value.filter((bot) => bot.category === filter.value))
function reorder() {
  // 只在进入页面、首次 stats 返回、主动切换排序或开发数据更新时拍快照。
  ordered.value = [...bots].sort(sort.value === 'hot' ? byHeat : byNewest)
}
function pickFeatured() {
  // 精选和列表一样只拍快照：热度没到时就是最新三位，之后的点击不会让卡片跳位。
  featured.value = bots.length >= 3 ? [...bots].sort(byHeat).slice(0, 3) : []
}
function select(value) {
  manual = true
  sort.value = value
  reorder()
}
function choose(value) {
  if (filter.value === value) return
  filter.value = value
  entering.value = true
}
watch(() => bots, () => {
  reorder()
  pickFeatured()
  if (filter.value !== ALL && !categories.value.includes(filter.value)) filter.value = ALL
}, { immediate: true })
onMounted(async () => {
  releaseEntry = enterHero([...hero.value.querySelectorAll('[data-testid="live-bot"]')])
  const success = await loadHeat()
  if (!alive) return
  if (!success && !manual) sort.value = 'new'
  const previous = slugs(ordered.value), previousFeatured = slugs(featured.value)
  reorder()
  if (success) pickFeatured()
  entering.value = success && previous !== slugs(ordered.value)
  featuredEntering.value = success && previousFeatured !== slugs(featured.value)
})
onBeforeUnmount(() => { alive = false; releaseEntry?.() })
</script>

<template>
  <main class="shelf-page shelf-home">
    <LiveAnnouncer />
    <!-- 极光是独立的装饰层：文字的祖先元素上不放任何背景图。 -->
    <div class="hero-aurora" aria-hidden="true"><i /><i /><i /><i /></div>
    <header class="shelf-intro">
      <div ref="hero" class="hero-portraits" aria-hidden="true">
        <HeroPortrait v-for="mascot in HERO_MASCOTS" :key="mascot.key" :mascot="mascot" />
      </div>
      <h1>{{ SITE.name }}</h1>
      <p class="hero-sub"><span v-for="(clause, index) in taglineClauses" :key="index">{{ clause }}</span></p>
      <SearchTrigger class="hero-search" data-testid="search-trigger" />
      <a data-testid="contribute-link" class="shelf-button contribute" :href="CONTRIBUTE_URL"><svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M8 2.5v11M2.5 8h11" /></svg>{{ SHELF_COPY.contribute }}</a>
    </header>
    <section class="shelf-section" aria-labelledby="shelf-title">
      <header class="section-heading">
        <h2 id="shelf-title">{{ SHELF_COPY.sectionTitle }}</h2>
        <p>{{ SHELF_COPY.sectionSub }}</p>
      </header>
      <div v-if="featured.length" class="featured">
        <div class="block-heading">
          <h3>{{ SHELF_COPY.featuredTitle }}</h3>
          <p>{{ SHELF_COPY.featuredSub }}</p>
        </div>
        <div class="featured-grid" :class="{ 'grid-enter': featuredEntering }" @animationend="featuredEntering = false">
          <FeaturedCard v-for="bot in featured" :key="bot.slug" :bot="bot" />
        </div>
      </div>
      <div v-if="bots.length" class="shelf-toolbar">
        <div class="sort-controls" :data-sort="sort" role="group" aria-label="排序">
          <button type="button" data-testid="sort-hot" class="shelf-button" :aria-pressed="sort === 'hot'" @click="select('hot')">热门</button>
          <button type="button" data-testid="sort-new" class="shelf-button" :aria-pressed="sort === 'new'" @click="select('new')">最新</button>
        </div>
        <div class="filter-chips" role="group" :aria-label="SHELF_COPY.filterLabel">
          <button type="button" data-testid="filter-category" class="filter-chip all" :aria-pressed="filter === ALL" @click="choose(ALL)"><i class="chip-dot all" aria-hidden="true" />{{ SHELF_COPY.allCategories }}</button>
          <button v-for="category in categories" :key="category" type="button" data-testid="filter-category" class="filter-chip" :style="categoryStyle(category)" :aria-pressed="filter === category" @click="choose(category)"><i class="chip-dot" aria-hidden="true" />{{ category }}</button>
        </div>
        <span class="bot-count">共 {{ visible.length }} 个 Bot</span>
        <SearchTrigger class="toolbar-search" data-testid="search-trigger-toolbar" />
      </div>
      <div v-if="visible.length" class="bot-grid" :class="{ 'grid-enter': entering }" @animationend="entering = false">
        <BotCard v-for="bot in visible" :key="bot.slug" :bot="bot" />
      </div>
      <div v-else-if="bots.length" data-testid="empty-filter" class="empty-state">
        <DefaultAvatar slug="empty-shelf" rest="sleep" :size="120" />
        <p>{{ SHELF_COPY.emptyFilter }}</p>
        <button type="button" class="shelf-button" @click="choose(ALL)">{{ SHELF_COPY.showAll }}</button>
      </div>
      <div v-else data-testid="empty-state" class="empty-state">
        <DefaultAvatar slug="empty-shelf" rest="sleep" :size="160" />
        <p>货架上还没有 Bot</p>
        <a class="shelf-button" :href="CONTRIBUTE_URL">做第一个投稿的人</a>
      </div>
    </section>
    <footer v-if="bots.length" class="shelf-footer">
      <p>{{ SHELF_COPY.footer }}</p>
      <a class="shelf-button contribute" :href="CONTRIBUTE_URL"><svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M8 2.5v11M2.5 8h11" /></svg>{{ SHELF_COPY.contribute }}</a>
    </footer>
  </main>
</template>
