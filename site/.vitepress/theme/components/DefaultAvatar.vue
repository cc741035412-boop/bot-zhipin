<script setup lang="ts">
import { computed } from 'vue'
import { BotEngine } from '../vendor/bloub/engine'
import { SHAPES, COLORS } from '../vendor/bloub/skins'
import { RAYON, DEMI_VIEWBOX } from '../vendor/bloub/repere'

const props = defineProps<{ slug: string }>()
// FNV-1a，明确使用 32 位乘法；不依赖时间、随机数或浏览器。
function hash(text: string) {
  let value = 0x811c9dc5
  for (let i = 0; i < text.length; i++) value = Math.imul(value ^ text.charCodeAt(i), 0x01000193)
  return value >>> 0
}
const portrait = computed(() => {
  const seed = hash(props.slug)
  const shape = SHAPES[seed % SHAPES.length]
  const color = COLORS[Math.floor(seed / SHAPES.length) % COLORS.length].hex
  // idle 的 t=0 尚未进入自然眨眼区间，两只眼睛睁开；只取一次静态帧。
  const frame = new BotEngine(RAYON, 'idle', shape.radii).sample(0)
  return { color, frame }
})
const box = `${-DEMI_VIEWBOX} ${-DEMI_VIEWBOX} ${DEMI_VIEWBOX * 2} ${DEMI_VIEWBOX * 2}`
</script>

<template>
  <svg :viewBox="box" width="96" height="96" aria-hidden="true">
    <path :d="portrait.frame.bodyPath" :fill="portrait.color" :opacity="portrait.frame.bodyAlpha" />
    <path :d="portrait.frame.eyes[0].d" :transform="portrait.frame.eyes[0].matrix" :opacity="portrait.frame.eyes[0].alpha" fill="var(--vp-c-bg)" />
    <path :d="portrait.frame.eyes[1].d" :transform="portrait.frame.eyes[1].matrix" :opacity="portrait.frame.eyes[1].alpha" fill="var(--vp-c-bg)" />
  </svg>
</template>
