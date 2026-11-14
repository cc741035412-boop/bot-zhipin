<script setup>
import { onBeforeUnmount, onMounted, ref, shallowRef, watch } from 'vue'
import { data as bots } from '../../data/bots.data.mjs'
import { SITE, CONTRIBUTE_URL } from '../../meta.mjs'
import { heatState, loadHeat } from '../heat'
import BotCard from './BotCard.vue'

const sort = ref('hot')
let manual = false
let alive = true
const ordered = shallowRef([])
const byName = new Intl.Collator('zh-CN')
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
  reorder()
})
onBeforeUnmount(() => { alive = false })
</script>

<template>
  <main class="shelf-page">
    <header class="shelf-intro">
      <h1>{{ SITE.name }}</h1>
      <p>{{ SITE.tagline }}</p>
      <a data-testid="contribute-link" class="shelf-button" :href="CONTRIBUTE_URL" target="_blank" rel="noopener noreferrer">我要投稿</a>
    </header>
    <div class="sort-controls" role="group" aria-label="货架排序">
      <button type="button" data-testid="sort-hot" class="shelf-button" :aria-pressed="sort === 'hot'" @click="select('hot')">热门</button>
      <button type="button" data-testid="sort-new" class="shelf-button" :aria-pressed="sort === 'new'" @click="select('new')">最新</button>
    </div>
    <div v-if="ordered.length" class="bot-grid">
      <BotCard v-for="bot in ordered" :key="bot.slug" :bot="bot" />
    </div>
    <p v-else data-testid="empty-state" class="empty-state">货架上还没有 Bot，欢迎通过「我要投稿」挂上你的第一个 Bot。</p>
  </main>
</template>
