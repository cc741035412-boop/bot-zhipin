<!--
  首页「专题」：一排专题卡。每张卡是一个按钮：一叠小头像、「+N」、标题、「N 个 Bot」。
  点一张 = 滚到「全部 Bot」并按这个专题筛选（由父组件处理）；正在筛选的那张 aria-pressed="true"。
-->
<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import BotStill from './BotStill.vue'
import { avatarColor } from '../avatar'
import { SHELF_COPY } from '../../meta.mjs'

interface StackBot { slug: string; name: string; avatar: string | null }
defineProps<{ collections: { slug: string; title: string; bots: StackBot[] }[]; active: string | null }>()
defineEmits<{ pick: [slug: string] }>()

// 窄屏上这一排自己横向滑动：哪一头还有卡片，哪一头渐隐（和分组切换同一个做法）。
// 量之前先当右边还有（服务端渲染出来就是这样）；渐隐只在窄屏的样式里生效。
const strip = ref<HTMLElement>()
const fade = ref<'none' | 'left' | 'right' | 'both'>('right')
let frame = 0
function measure() {
  const el = strip.value
  if (!el) return
  const left = el.scrollLeft > 1, right = el.scrollLeft + el.clientWidth < el.scrollWidth - 1
  fade.value = left && right ? 'both' : left ? 'left' : right ? 'right' : 'none'
}
function schedule() {
  if (frame) return
  frame = requestAnimationFrame(() => { frame = 0; measure() })
}
onMounted(() => {
  measure()
  window.addEventListener('resize', schedule, { passive: true })
})
onBeforeUnmount(() => {
  cancelAnimationFrame(frame)
  window.removeEventListener('resize', schedule)
})

// 头像叠最多露 4 只，其余写成「+N」。
const FACES = 4
// 卡片顶上那片柔光用这几只 Bot 自己的颜色（自定义头像没有 Bot 色，用中性灰）。
const glow = (bots: StackBot[]) => Object.fromEntries(
  bots.slice(0, FACES).map((bot, index) => [`--bz-face-${index + 1}`, bot.avatar ? '#8a8a93' : avatarColor(bot.slug)]),
)
</script>

<template>
  <section v-if="collections.length" id="collections" class="shelf-section" aria-labelledby="collections-title">
    <header class="bz-section-head">
      <div><h2 id="collections-title">{{ SHELF_COPY.collectionsTitle }}</h2></div>
    </header>
    <div ref="strip" class="collection-strip" role="group" aria-labelledby="collections-title" :data-fade="fade" @scroll.passive="schedule">
      <button
        v-for="item in collections" :key="item.slug" type="button" class="collection-card" data-testid="collection-card"
        :data-slug="item.slug" :aria-pressed="active === item.slug" :style="glow(item.bots)" @click="$emit('pick', item.slug)"
      >
        <span class="collection-faces" aria-hidden="true">
          <BotStill v-for="bot in item.bots.slice(0, FACES)" :key="bot.slug" :bot="bot" ring />
          <span v-if="item.bots.length > FACES" class="collection-more">+{{ item.bots.length - FACES }}</span>
        </span>
        <span class="collection-title">{{ item.title }}</span>
        <span class="collection-count">{{ SHELF_COPY.collectionCount(item.bots.length) }}</span>
      </button>
    </div>
  </section>
</template>
