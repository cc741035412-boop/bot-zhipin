<script setup>
import { computed, onBeforeUnmount, onMounted, ref, shallowRef, watch } from 'vue'
import { data as bots } from '../../data/bots.data.mjs'
import { SITE, CONTRIBUTE_URL } from '../../meta.mjs'
import { heatState, loadHeat } from '../heat'
import BotCard from './BotCard.vue'
import BotPortrait from './BotPortrait.vue'
import DefaultAvatar from './DefaultAvatar.vue'
import LiveAnnouncer from './LiveAnnouncer.vue'
import { avatarColor } from '../avatar'

const sort = ref('hot')
let manual = false
let alive = true
const ordered = shallowRef([])
const byName = new Intl.Collator('zh-CN')
const heroBots = computed(() => [...bots].sort((a, b) => b.addedAt.localeCompare(a.addedAt) || byName.compare(a.name, b.name)).slice(0, 5))
const entering = ref(false)
function heroStyle(bot, index) {
  const distance = Math.abs(index - (heroBots.value.length - 1) / 2)
  return { '--bz-hero-scale': distance < 0.6 ? 1.5 : distance < 1.6 ? 1.2 : 1.1, '--bz-bot-color': bot.avatar ? '#8a8a93' : avatarColor(bot.slug) }
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
  const success = await loadHeat()
  if (!alive) return
  if (!success && !manual) sort.value = 'new'
  const previous = ordered.value.map((bot) => bot.slug).join(',')
  reorder()
  entering.value = success && previous !== ordered.value.map((bot) => bot.slug).join(',')
})
onBeforeUnmount(() => { alive = false })
</script>

<template>
  <main class="shelf-page">
    <LiveAnnouncer />
    <header class="shelf-intro">
      <div class="hero-portraits" aria-hidden="true">
        <div v-for="(bot, index) in heroBots" :key="bot.slug" class="hero-portrait" :class="{ central: Math.abs(index - (heroBots.length - 1) / 2) < 0.6 }" :style="heroStyle(bot, index)"><BotPortrait :bot="bot" /></div>
      </div>
      <h1>{{ SITE.name }}</h1>
      <p>{{ SITE.tagline }}</p>
      <a data-testid="contribute-link" class="shelf-button primary contribute" :href="CONTRIBUTE_URL"><svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M8 2v12M2 8h12" /></svg>我要投稿</a>
    </header>
    <div class="shelf-toolbar">
    <div class="sort-controls" role="group" aria-label="排序">
      <button type="button" data-testid="sort-hot" class="shelf-button" :aria-pressed="sort === 'hot'" @click="select('hot')">热门</button>
      <button type="button" data-testid="sort-new" class="shelf-button" :aria-pressed="sort === 'new'" @click="select('new')">最新</button>
    </div>
    <span class="bot-count">共 {{ bots.length }} 个 Bot</span>
    </div>
    <div v-if="ordered.length" class="bot-grid" :class="{ 'grid-enter': entering }" @animationend="entering = false">
      <BotCard v-for="bot in ordered" :key="bot.slug" :bot="bot" />
    </div>
    <div v-else data-testid="empty-state" class="empty-state">
      <DefaultAvatar slug="empty-shelf" />
      <p>货架上还没有 Bot</p>
      <a class="shelf-button" :href="CONTRIBUTE_URL">做第一个投稿的人</a>
    </div>
  </main>
</template>
