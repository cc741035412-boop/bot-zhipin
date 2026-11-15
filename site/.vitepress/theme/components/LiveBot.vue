<!-- 渲染方式参考 jeremy-prt/bloub BloubBot.vue（MIT，提交 b4bb3c1）。 -->
<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, shallowRef, useId, watch } from 'vue'
import { BotEngine, type BotFrame } from '../vendor/bloub/engine'
import { NOTIF_BLUE } from '../vendor/bloub/decor'
import { RAYON, DEMI_VIEWBOX } from '../vendor/bloub/repere'
import { STATE_BY_ID, type StateId } from '../vendor/bloub/states'
import { isReducedMotion, now, register } from '../live/clock'
import { createGaze } from '../live/gaze'

const props = withDefaults(defineProps<{
  radii: number[] | null
  color: string
  outline?: string | null
  shapeId?: string
  size?: number
}>(), { size: 96 })

const svg = ref<SVGSVGElement>()
const uid = `bz-${useId()}`
const maskId = `${uid}-mask`
const VB = DEMI_VIEWBOX
const paper = 'var(--bz-eye, var(--vp-c-bg))'
let engine = new BotEngine(RAYON, 'idle', props.radii)
// SSR 和首次客户端渲染都只取 t=0；注册时钟放在 onMounted 里。
const frame = shallowRef<BotFrame>(engine.sample(0))
const state = ref<StateId>('idle')
let until = Infinity
let unregister: (() => void) | undefined
let gaze: ReturnType<typeof createGaze> | undefined

function staticFrame() {
  gaze?.reset(now())
  until = Infinity
  state.value = 'idle'
  engine = new BotEngine(RAYON, 'idle', props.radii)
  frame.value = engine.sample(0)
}

function play(event: Event) {
  if (isReducedMotion()) return
  const detail = (event as CustomEvent<{ state?: StateId; hold?: number }>).detail
  const def = detail && STATE_BY_ID.get(detail.state as StateId)
  if (!def) return
  const t = now()
  engine.setState(def.id, t)
  state.value = def.id
  const hold = detail.hold ?? def.duration
  until = t + (Number.isFinite(hold) ? Math.max(0, hold) : def.duration)
}

function tick(t: number) {
  if (t >= until) {
    engine.setState('idle', t)
    state.value = 'idle'
    until = Infinity
  }
  gaze?.tick(t)
  frame.value = engine.sample(t)
}

watch(() => props.radii, (radii) => {
  if (isReducedMotion()) staticFrame()
  else engine.setShape(radii, now())
})

onMounted(() => {
  if (!svg.value) return
  gaze = createGaze(svg.value, (look, t, morph) => engine.setLook(look, t, morph))
  unregister = register({
    el: svg.value,
    tick,
    motionChange: (reduced) => { if (reduced) staticFrame() },
  })
})
onBeforeUnmount(() => {
  unregister?.()
  gaze?.dispose()
})

function dotAttrs(dot: BotFrame['dots'][number]) {
  // CSS color-mix 保留深度雾，同时支持 CSS 变量、rgb() 等非 hex 身体颜色。
  const fill = dot.color ?? (dot.depth === undefined
    ? props.color
    : `color-mix(in srgb, ${props.color} ${dot.depth * 100}%, ${paper})`)
  const common = { style: { fill }, opacity: dot.opacity }
  return dot.d
    ? { ...common, d: dot.d, transform: `translate(${dot.x} ${dot.y}) rotate(${dot.rot ?? 0}) scale(${RAYON})` }
    : { ...common, cx: dot.x, cy: dot.y, r: dot.r }
}
</script>

<template>
  <svg
    ref="svg"
    class="bz-live"
    data-testid="live-bot"
    :data-state="state"
    data-running="false"
    data-follow="rest"
    :data-shape="shapeId"
    :width="size"
    :height="size"
    :viewBox="`${-VB} ${-VB} ${VB * 2} ${VB * 2}`"
    aria-hidden="true"
    @bz-play="play"
  >
    <defs>
      <!-- 眼睛是 mask 中的洞，移动到身体边缘时自然裁切。 -->
      <mask :id="maskId" maskUnits="userSpaceOnUse" :x="-VB" :y="-VB" :width="VB * 2" :height="VB * 2">
        <path :d="frame.bodyPath" fill="#fff" />
        <path
          v-for="(eye, i) in frame.eyes"
          :key="i"
          data-part="eye"
          :d="eye.d"
          :transform="eye.matrix"
          :opacity="eye.alpha"
          fill="#000"
        />
        <circle v-if="frame.notch" :cx="frame.notch.x" :cy="frame.notch.y" :r="frame.notch.r" fill="#000" />
      </mask>
      <linearGradient
        v-for="arc in frame.arcs"
        :id="`${uid}-${arc.id}`"
        :key="arc.id"
        gradientUnits="userSpaceOnUse"
        :x1="arc.grad.x1"
        :y1="arc.grad.y1"
        :x2="arc.grad.x2"
        :y2="arc.grad.y2"
      >
        <stop v-for="(color, i) in arc.grad.stops" :key="i" :offset="i / (arc.grad.stops.length - 1)" :stop-color="color" />
      </linearGradient>
    </defs>

    <!-- 圆环后半和爆裂粒子先画；paper 层防止它们从眼洞透出。 -->
    <g fill="none" stroke-linecap="round">
      <path
        v-for="arc in frame.arcs"
        :key="arc.id"
        data-part="arc"
        :d="arc.back"
        :stroke="`url(#${uid}-${arc.id})`"
        :stroke-width="arc.width"
        :opacity="arc.opacity"
      />
    </g>
    <g v-if="frame.dotsBehind">
      <component :is="dot.d ? 'path' : 'circle'" v-for="(dot, i) in frame.dots" :key="i" data-part="dot" v-bind="dotAttrs(dot)" />
    </g>
    <g :opacity="frame.bodyAlpha">
      <path data-part="body" :d="frame.bodyPath" :style="{ fill: paper }" />
      <g :mask="`url(#${maskId})`">
        <rect :x="-VB" :y="-VB" :width="VB * 2" :height="VB * 2" :style="{ fill: color }" />
      </g>
      <path v-if="outline" :d="frame.bodyPath" fill="none" :style="{ stroke: outline }" stroke-width="1.5" vector-effect="non-scaling-stroke" />
    </g>
    <g v-if="!frame.dotsBehind">
      <component :is="dot.d ? 'path' : 'circle'" v-for="(dot, i) in frame.dots" :key="i" data-part="dot" v-bind="dotAttrs(dot)" />
    </g>
    <circle v-if="frame.notif" data-part="notif" :cx="frame.notif.x" :cy="frame.notif.y" :r="frame.notif.r" :fill="NOTIF_BLUE" />
    <g fill="none" stroke-linecap="round">
      <path
        v-for="arc in frame.arcs"
        :key="arc.id"
        data-part="arc"
        :d="arc.front"
        :stroke="`url(#${uid}-${arc.id})`"
        :stroke-width="arc.width"
        :opacity="arc.opacity"
      />
    </g>
  </svg>
</template>
