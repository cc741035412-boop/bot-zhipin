<script setup lang="ts">
import { computed, ref } from 'vue'
import LiveBot from './LiveBot.vue'
import { shapeRadii } from '../face'
import { botPalette } from '../color'
import { nextPoke } from '../pitch'
import { isReducedMotion } from '../live/clock'

const props = defineProps<{ mascot: { key: string; shape: string; color: string } }>()
const radii = computed(() => shapeRadii(props.mascot.shape))
const hop = ref<HTMLElement>()
const portrait = ref<InstanceType<typeof LiveBot>>()
const hovered = ref(false)
function enter(event: PointerEvent) {
  if (event.pointerType !== 'mouse') return
  hovered.value = true
  portrait.value?.play({ state: 'wide', hold: Infinity })
  // 砖本身只上浮 2px；跳动放在里面那层，两种位移互不覆盖。
  hop.value?.classList.remove('is-speaking')
  if (!isReducedMotion()) {
    void hop.value?.offsetWidth
    hop.value?.classList.add('is-speaking')
  }
}
function leave(event: PointerEvent) { if (event.pointerType === 'mouse') hovered.value = false }
function poke() { portrait.value?.play({ state: nextPoke(`mascot:${props.mascot.key}`).state }) }
</script>

<template>
  <div class="hero-portrait bz-tile bz-bot-scope" :style="botPalette(mascot.color)" @pointerenter="enter" @pointerleave="leave" @click="poke">
    <span ref="hop" class="hero-bot">
      <LiveBot ref="portrait" :radii="radii" :color="mascot.color" :shape-id="mascot.shape" :rest="hovered ? 'wide' : 'idle'" />
    </span>
  </div>
</template>
