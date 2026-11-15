<script setup lang="ts">
import { computed, ref } from 'vue'
import BotPortrait from './BotPortrait.vue'
import BzIcon from './BzIcon.vue'
import ExternalHint from './ExternalHint.vue'
import { avatarColor } from '../avatar'
import { botPalette, categoryStyle } from '../color'
import { reportClick } from '../heat'
import { nextPoke } from '../pitch'

// 精选卡：活 Bot、名字、作者、介绍、分类和额度、导入。不带台词气泡，也不参与分类筛选。
const props = defineProps<{ bot: {
  slug: string; name: string; tagline: string; avatar: string | null; category: string; quotaCost: string
  templateUrl: string; detailUrl: string; author: { name: string; link: string }; external?: boolean; official?: boolean
} }>()
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
          <h3 class="bot-name"><a :href="bot.detailUrl">{{ bot.name }}</a></h3>
          <span v-if="!bot.external" class="bz-tag source-tag">作者投稿</span>
        </div>
        <p class="bot-byline">
          <a class="bot-author" :href="bot.author.link" target="_blank" rel="noopener noreferrer">by {{ bot.author.name }}<ExternalHint /></a>
          <span v-if="origin" class="bot-origin">· {{ origin }}</span>
        </p>
      </div>
    </div>
    <p class="bot-tagline">{{ bot.tagline }}</p>
    <div class="featured-foot">
      <div class="bot-stats">
        <span class="bz-tag category-tag" :style="categoryStyle(bot.category)">{{ bot.category }}</span>
        <span class="bot-stat stat-quota" :data-quota="bot.quotaCost"><BzIcon name="bolt" />额度 {{ bot.quotaCost }}</span>
      </div>
      <a data-testid="featured-import" class="bz-btn sm" :href="bot.templateUrl" target="_blank" rel="noopener noreferrer" @click="importBot">导入<ExternalHint /></a>
    </div>
  </article>
</template>
