<script setup lang="ts">
import { computed, ref } from 'vue'
import BotPortrait from './BotPortrait.vue'
import BotHeat from './BotHeat.vue'
import ExternalHint from './ExternalHint.vue'
import { avatarColor } from '../avatar'
import { botPalette } from '../color'
import { reportClick } from '../heat'
import { nextPoke } from '../pitch'

// 精选大卡：只有活 Bot、名字、介绍、作者和导入，不带台词气泡，也不参与分类筛选。
const props = defineProps<{ bot: {
  slug: string; name: string; tagline: string; avatar: string | null
  templateUrl: string; detailUrl: string; author: { name: string; link: string }
} }>()
const portrait = ref<InstanceType<typeof BotPortrait>>()
const hovered = ref(false)
const palette = computed(() => botPalette(props.bot.avatar ? '#8a8a93' : avatarColor(props.bot.slug)))
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
    <div class="featured-tile bz-tile" aria-hidden="true" @click="poke">
      <BotPortrait ref="portrait" :bot="bot" :rest="hovered ? 'wide' : 'idle'" />
    </div>
    <h4><a :href="bot.detailUrl">{{ bot.name }}</a></h4>
    <p class="bot-tagline">{{ bot.tagline }}</p>
    <p class="featured-meta">
      <a class="bot-author" :href="bot.author.link" target="_blank" rel="noopener noreferrer">by {{ bot.author.name }}<ExternalHint /></a>
      <BotHeat :slug="bot.slug" />
    </p>
    <a data-testid="featured-import" class="shelf-button primary" :href="bot.templateUrl" target="_blank" rel="noopener noreferrer" @click="importBot">一键导入<ExternalHint /></a>
  </article>
</template>
