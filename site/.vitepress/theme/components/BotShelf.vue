<script setup>
import { onBeforeUnmount, onMounted, ref, shallowRef, watch } from 'vue'
import { data as bots } from '../../data/bots.data.mjs'
import { SITE, CONTRIBUTE_URL, HERO_MASCOTS } from '../../meta.mjs'
import { heatState, loadHeat } from '../heat'
import BotCard from './BotCard.vue'
import HeroPortrait from './HeroPortrait.vue'
import { enterHero } from '../live/reactions'
import DefaultAvatar from './DefaultAvatar.vue'
import LiveAnnouncer from './LiveAnnouncer.vue'

const hero = ref()
let releaseEntry
const sort = ref('hot')
let manual = false
let alive = true
const ordered = shallowRef([])
const byName = new Intl.Collator('zh-CN')
const entering = ref(false)
function heroStyle(index) {
  const distance = Math.abs(index - (HERO_MASCOTS.length - 1) / 2)
  return { '--bz-hero-size': `${[96, 80, 68, 60][distance]}px` }
}
function reorder() {
  // 只在进入页面、首次 stats 返回、主动切换排序或开发数据更新时拍快照。
  ordered.value = [...bots].sort((a, b) =>
    (sort.value === 'hot' ? (heatState.values[b.slug] ?? 0) - (heatState.values[a.slug] ?? 0) : 0)
    || b.addedAt.localeCompare(a.addedAt)
    || byName.compare(a.name, b.name))
}
function select(value) {
  manual = true
  sort.value = value
  reorder()
}
watch(() => bots, reorder, { immediate: true })
onMounted(async () => {
  releaseEntry = enterHero([...hero.value.querySelectorAll('[data-testid="live-bot"]')])
  const success = await loadHeat()
  if (!alive) return
  if (!success && !manual) sort.value = 'new'
  const previous = ordered.value.map((bot) => bot.slug).join(',')
  reorder()
  entering.value = success && previous !== ordered.value.map((bot) => bot.slug).join(',')
})
onBeforeUnmount(() => { alive = false; releaseEntry?.() })
</script>

<template>
  <main class="shelf-page">
    <LiveAnnouncer />
    <header class="shelf-intro">
      <div ref="hero" class="hero-portraits" aria-hidden="true">
        <HeroPortrait v-for="(mascot, index) in HERO_MASCOTS" :key="mascot.key" :mascot="mascot" :class="{ central: index === 3, 'hero-edge': index === 0 || index === 6 }" :style="heroStyle(index)" />
      </div>
      <h1>{{ SITE.name }}</h1>
      <p>{{ SITE.tagline }}</p>
      <a data-testid="contribute-link" class="shelf-button primary contribute" :href="CONTRIBUTE_URL"><svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M8 2v12M2 8h12" /></svg>我要投稿</a>
    </header>
    <div class="shelf-toolbar">
    <div class="sort-controls" :data-sort="sort" role="group" aria-label="排序">
      <button type="button" data-testid="sort-hot" class="shelf-button" :aria-pressed="sort === 'hot'" @click="select('hot')">热门</button>
      <button type="button" data-testid="sort-new" class="shelf-button" :aria-pressed="sort === 'new'" @click="select('new')">最新</button>
    </div>
    <span class="bot-count">共 {{ bots.length }} 个 Bot</span>
    </div>
    <div v-if="ordered.length" class="bot-grid" :class="{ 'grid-enter': entering }" @animationend="entering = false">
      <BotCard v-for="bot in ordered" :key="bot.slug" :bot="bot" />
    </div>
    <div v-else data-testid="empty-state" class="empty-state">
      <DefaultAvatar slug="empty-shelf" rest="sleep" :size="160" />
      <p>货架上还没有 Bot</p>
      <a class="shelf-button" :href="CONTRIBUTE_URL">做第一个投稿的人</a>
    </div>
  </main>
</template>
