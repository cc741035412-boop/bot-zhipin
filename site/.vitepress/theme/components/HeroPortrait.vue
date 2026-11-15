<script setup lang="ts">
import { ref } from 'vue'
import BotPortrait from './BotPortrait.vue'
import { nextPoke } from '../pitch'
import { isReducedMotion } from '../live/clock'

const props = defineProps<{ bot: { slug: string; name: string; avatar: string | null } }>()
const root = ref<HTMLElement>()
const portrait = ref<InstanceType<typeof BotPortrait>>()
const hovered = ref(false)
function enter(event: PointerEvent) {
  if (event.pointerType !== 'mouse') return
  hovered.value = true
  portrait.value?.play({ state: 'wide', hold: Infinity })
  root.value?.classList.remove('is-speaking')
  if (!isReducedMotion()) {
    void root.value?.offsetWidth
    root.value?.classList.add('is-speaking')
  }
}
function leave(event: PointerEvent) { if (event.pointerType === 'mouse') hovered.value = false }
function poke() { portrait.value?.play({ state: nextPoke(props.bot.slug).state }) }
</script>

<template>
  <div ref="root" class="hero-portrait bz-bot-scope" @pointerenter="enter" @pointerleave="leave" @click="poke">
    <BotPortrait ref="portrait" :bot="bot" :rest="hovered ? 'wide' : 'idle'" />
  </div>
</template>
