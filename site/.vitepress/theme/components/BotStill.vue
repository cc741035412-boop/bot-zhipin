<!--
  不会动的小 Bot：和活体同一个引擎出的第一帧，只画一次，不进共享时钟。
  给 20–28px 的小头像用（名单、流程的文字版、搜索条目），这么小看不出呼吸眨眼，没必要每帧重画。
  ghost：只画一圈虚线轮廓，表示「这个位置还空着」（招募卡、没收录的成员）。
-->
<script lang="ts">
import { BotEngine } from '../vendor/bloub/engine'
import { EXPRESSION_BY_ID } from '../vendor/bloub/expressions'
import { RAYON } from '../vendor/bloub/repere'

type Still = { body: string; eyes: { d: string; matrix: string }[] }
const cache = new WeakMap<number[], Still>()
/** 同一个形状只算一次；radii 是 face.ts 里共享的数组，可以直接当键。 */
function still(radii: number[]): Still {
  let frame = cache.get(radii)
  if (!frame) {
    const first = new BotEngine(RAYON, 'idle', radii, EXPRESSION_BY_ID.get('attentif')!).sample(0)
    frame = { body: first.bodyPath, eyes: first.eyes.map((eye) => ({ d: eye.d, matrix: eye.matrix })) }
    cache.set(radii, frame)
  }
  return frame
}
</script>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { botFace, faceColors, shapeRadii } from '../face'

const props = defineProps<{
  /** 货架上的 Bot：按它的官方脸画 */
  bot?: { slug: string; name?: string; avatar?: string | null } | null
  /** 没有 Bot 时直接给形状（空位剪影用） */
  shape?: string
  ghost?: boolean
}>()
const failed = ref(false)
watch(() => props.bot?.avatar, () => { failed.value = false })
const face = computed(() => props.bot ? botFace(props.bot.slug) : null)
const frame = computed(() => still(face.value?.radii ?? shapeRadii(props.shape ?? 'blob') ?? shapeRadii('blob')!))
const colors = computed(() => face.value ? faceColors(face.value.color) : null)
const style = computed(() => colors.value && !props.ghost ? {
  '--bz-bot-light': colors.value.light,
  '--bz-bot-dark': colors.value.dark,
  ...(colors.value.outline ? { '--bz-bot-outline': colors.value.outline } : {}),
} : undefined)
const ink = computed(() => !!colors.value && colors.value.light !== colors.value.dark)
</script>

<template>
  <img v-if="bot?.avatar && !failed && !ghost" class="bz-still" :src="bot.avatar" alt="" width="28" height="28" @error="failed = true">
  <svg v-else class="bz-still bz-live" :class="{ 'bz-live-ink': ink, 'is-ghost': ghost }" :style="style" viewBox="-112 -112 224 224" width="28" height="28" aria-hidden="true">
    <path class="still-body" :d="frame.body" />
    <path v-if="!ghost && colors?.outline" data-part="outline" :d="frame.body" fill="none" style="stroke: var(--bz-bot-outline)" stroke-width="1.5" vector-effect="non-scaling-stroke" />
    <path v-for="(eye, index) in frame.eyes" :key="index" class="still-eye" :d="eye.d" :transform="eye.matrix" />
  </svg>
</template>
