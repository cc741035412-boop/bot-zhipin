<!--
  静止的小 Bot：和 LiveBot 首帧（t=0、idle）同一个轮廓、同一双眼睛，但不注册时钟、不跟随、不变身。
  给一排排的小头像用（专题卡的头像叠、分组切换和分组标签里的小吉祥物），数量多也不占每帧的计算。
-->
<script lang="ts">
import { BotEngine, type BotFrame } from '../vendor/bloub/engine'
import { EXPRESSION_BY_ID } from '../vendor/bloub/expressions'
import { RAYON } from '../vendor/bloub/repere'

// 同一种轮廓只算一次首帧；key 是轮廓数组本身（face.ts 保证同一形状拿到的是同一个数组）。
const frames = new WeakMap<number[], BotFrame>()
let round: BotFrame | undefined
const sample = (radii: number[] | null) => new BotEngine(RAYON, 'idle', radii, EXPRESSION_BY_ID.get('attentif')!).sample(0)
function firstFrame(radii: number[] | null): BotFrame {
  if (!radii) return round ??= sample(null)
  let frame = frames.get(radii)
  if (!frame) frames.set(radii, frame = sample(radii))
  return frame
}
</script>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  radii: number[] | null
  /** 身体颜色：色值，或 var(--bz-bot-body)（由 .bz-live 按主题切换）。 */
  color: string
  /** 近乎纯白的身体在浅色主题下加的那圈描边。 */
  outline?: string | null
  size?: number
  /** 身体外面垫一圈底色，叠在一起时互相分得开；颜色读 --bz-still-ring。 */
  ring?: boolean
}>(), { size: 28, outline: null, ring: false })

// 和 LiveBot 同一个镜头，两种头像放在一起大小一致。
const VB = 112
const frame = computed(() => firstFrame(props.radii))
</script>

<template>
  <svg class="bz-live bz-still" data-testid="still-bot" :width="size" :height="size" :viewBox="`${-VB} ${-VB} ${VB * 2} ${VB * 2}`" aria-hidden="true">
    <path v-if="ring" data-part="ring" :d="frame.bodyPath" fill="none" stroke-linejoin="round" />
    <path data-part="body" :d="frame.bodyPath" :style="{ fill: color }" />
    <path v-if="outline" data-part="outline" :d="frame.bodyPath" fill="none" :style="{ stroke: outline }" stroke-width="1.5" vector-effect="non-scaling-stroke" />
    <path v-for="(eye, i) in frame.eyes" :key="i" data-part="eye" :d="eye.d" :transform="eye.matrix" :opacity="eye.alpha" />
  </svg>
</template>
