<script setup lang="ts">
import { computed, ref } from 'vue'
import LiveBot from './LiveBot.vue'
import { shapeRadii } from '../face'
import { botPalette } from '../color'
import { nextPoke } from '../pitch'
import { isReducedMotion } from '../live/clock'

const props = defineProps<{ mascot: { key: string; shape: string; color: string } }>()
const radii = computed(() => shapeRadii(props.mascot.shape))
const root = ref<HTMLElement>()
const portrait = ref<InstanceType<typeof LiveBot>>()
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
function poke() { portrait.value?.play({ state: nextPoke(`mascot:${props.mascot.key}`).state }) }
</script>

<template>
  <div ref="root" class="hero-portrait bz-bot-scope" :style="botPalette(mascot.color)" @pointerenter="enter" @pointerleave="leave" @click="poke">
    <LiveBot ref="portrait" :radii="radii" :color="mascot.color" :shape-id="mascot.shape" :rest="hovered ? 'wide' : 'idle'" />
  </div>
</template>
