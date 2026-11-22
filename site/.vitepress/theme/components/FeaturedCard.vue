<script setup lang="ts">
import { computed, ref } from 'vue'
import BotName from './BotName.vue'
import BotPortrait from './BotPortrait.vue'
import BzIcon from './BzIcon.vue'
import ExternalHint from './ExternalHint.vue'
import RoleMascot from './RoleMascot.vue'
import { avatarColor } from '../avatar'
import { botPalette, categoryStyle } from '../color'
import { reportClick } from '../heat'
import { nextPoke } from '../pitch'

// 主推卡：活 Bot、名字、作者、介绍、编辑点评、分组和额度、导入。不带台词气泡，也不参与筛选。
// 编辑点评（note）来自策展文件：只显示点评本身，前面一个引号图标，不写「编辑说」。
// 整张卡可点进详情：名字那个链接用伪元素铺满整卡（样式在 home.css），砖（戳）、作者、导入在它上面。
const props = defineProps<{
  bot: {
    slug: string; name: string; nameZh?: string | null; tagline: string; avatar: string | null; category: string; quotaCost: string
    templateUrl: string; detailUrl: string; author: { name: string; link: string; page: string | null }; external?: boolean; official?: boolean
  }
  note?: string | null
}>()
const portrait = ref<InstanceType<typeof BotPortrait>>()
const hovered = ref(false)
const palette = computed(() => botPalette(props.bot.avatar ? '#8a8a93' : avatarColor(props.bot.slug)))
const origin = computed(() => props.bot.external ? (props.bot.official ? '官方市场' : '社区收录') : '')
function enter(event: PointerEvent) {
  if (event.pointerType !== 'mouse') return
  hovered.value = true
  portrait.value?.play({ state: 'wide', hold: Infinity })
}
function leave(event: PointerEvent) { if (event.pointerType === 'mouse') hovered.value = false }
function poke() { portrait.value?.play({ state: nextPoke(props.bot.slug).state }) }
function importBot() {
  portrait.value?.play({ state: 'comet' })
  reportClick(props.bot.slug, 'import')
}
</script>

<template>
  <article class="featured-card bz-bot-scope" :style="palette" data-testid="featured-card" :data-slug="bot.slug" @pointerenter="enter" @pointerleave="leave">
    <div class="featured-head">
      <div class="featured-tile bz-tile" aria-hidden="true" @click="poke">
        <BotPortrait ref="portrait" :bot="bot" :rest="hovered ? 'wide' : 'idle'" />
      </div>
      <div class="bot-head">
        <div class="bot-title">
          <h3 class="bot-name"><a :href="bot.detailUrl"><BotName :bot="bot" /></a></h3>
          <span v-if="!bot.external" class="bz-tag source-tag">作者投稿</span>
        </div>
        <p class="bot-byline">
          <a v-if="bot.author.page" class="bot-author" :href="bot.author.page">by {{ bot.author.name }}</a>
          <a v-else class="bot-author" data-track-kind="author" :href="bot.author.link" target="_blank" rel="noopener noreferrer">by {{ bot.author.name }}<ExternalHint /></a>
          <span v-if="origin" class="bot-origin">· {{ origin }}</span>
        </p>
      </div>
    </div>
    <p class="bot-tagline">{{ bot.tagline }}</p>
    <blockquote v-if="note" class="featured-note" data-testid="featured-note">
      <BzIcon name="quote" :size="20" />
      <p>{{ note }}</p>
    </blockquote>
    <div class="featured-foot">
      <div class="bot-stats">
        <span class="bz-tag role category-tag" :style="categoryStyle(bot.category)"><RoleMascot :category="bot.category" :size="12" />{{ bot.category }}</span>
        <span class="bot-stat stat-quota" :data-quota="bot.quotaCost"><BzIcon name="bolt" />额度 {{ bot.quotaCost }}</span>
      </div>
      <a data-testid="featured-import" class="bz-btn sm" :href="bot.templateUrl" target="_blank" rel="noopener noreferrer" @click="importBot"><BzIcon name="arrow-up-right" />导入<span class="bz-sr-only">（在新标签页打开）</span></a>
    </div>
  </article>
</template>
