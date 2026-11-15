<!-- 渲染方式参考 jeremy-prt/bloub BloubBot.vue（MIT，提交 b4bb3c1）。 -->
<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, shallowRef, useAttrs, useId, watch } from 'vue'

defineOptions({ inheritAttrs: false })
import { BotEngine, type BotFrame, type Look } from '../vendor/bloub/engine'
import { EXPRESSION_BY_ID } from '../vendor/bloub/expressions'
import { NOTIF_BLUE } from '../vendor/bloub/decor'
import { RAYON, DEMI_VIEWBOX } from '../vendor/bloub/repere'
import { type StateId } from '../vendor/bloub/states'
import { createPlayback, type Play } from '../live/playback'
import { registerReactions } from '../live/reactions'
import { isReducedMotion, now, register } from '../live/clock'
import { createGaze } from '../live/gaze'

const props = withDefaults(defineProps<{
  radii: number[] | null
  color: string
  outline?: string | null
  shapeId?: string
  size?: number
  rest?: StateId
  /** 没有鼠标可跟时看向哪里（度）。不传就是正脸；传了也照常眨眼、漂移，鼠标一动仍然先跟鼠标。小队合影里用它让队员看向队长。 */
  look?: { yaw: number; pitch: number } | null
}>(), { size: 96, rest: 'idle', look: null })

const svg = ref<SVGSVGElement>()
const uid = `bz-${useId()}`
const maskId = `${uid}-mask`
const VB = 112
// 只收紧镜头，不收紧 mask/填色画布，避免临时变身的身体被切掉。
const PAINT = DEMI_VIEWBOX
const eyeColor = 'var(--bz-eye, #16161b)'
const fogColor = 'var(--bz-card, var(--vp-c-bg))'
const expression = EXPRESSION_BY_ID.get('attentif')!
// 常驻视线：mix=1 顶替状态自带的朝向，wander=1 保留自然漂移。时间戳早于 0、过渡极短，t=0 的首帧（SSR 也是）就已经看过去了。
const homeLook = (): Look | null => props.look ? { yaw: props.look.yaw, pitch: props.look.pitch, mix: 1, spin: 0, wander: 1 } : null
function createEngine(rest: StateId) {
  const next = new BotEngine(RAYON, rest, props.radii, expression)
  const look = homeLook()
  if (look) next.setLook(look, -1, .001)
  return next
}
let engine = createEngine(props.rest)
// SSR 和首次客户端渲染都只取 t=0；注册时钟放在 onMounted 里。
const frame = shallowRef<BotFrame>(engine.sample(0))
const state = ref<StateId>(props.rest)
const playback = createPlayback(props.rest, (next, t) => {
  engine.setState(next, t)
  state.value = next
})
let unregister: (() => void) | undefined
let releaseReactions: (() => void) | undefined
let gaze: ReturnType<typeof createGaze> | undefined

function staticFrame() {
  gaze?.reset(now())
  playback.reset(now(), true)
  engine = createEngine('idle')
  frame.value = engine.sample(0)
}

function play(detail: Play) {
  if (!isReducedMotion()) playback.play(detail, now())
}
function eventPlay(event: Event) { play((event as CustomEvent<Play>).detail) }
function dispatch(detail: Play) {
  svg.value?.dispatchEvent(new CustomEvent('bz-play', { detail }))
}
defineExpose({ play: dispatch })

const attrs = useAttrs()
// 根属性不依赖 frame：避免每帧 fallthrough 合并 style，覆盖运行时 CSS 变量或重复写颜色。
const svgAttrs = computed(() => ({
  ...attrs,
  ref: svg,
  class: ['bz-live', attrs.class],
  'data-testid': 'live-bot',
  'data-state': state.value,
  'data-running': 'false',
  'data-follow': 'rest',
  'data-shape': props.shapeId,
  width: props.size,
  height: props.size,
  viewBox: `${-VB} ${-VB} ${VB * 2} ${VB * 2}`,
  'aria-hidden': 'true',
  'onBz-play': eventPlay,
}))

function tick(t: number) {
  playback.tick(t)
  gaze?.tick(t)
  frame.value = engine.sample(t)
}

watch(() => props.rest, (rest) => {
  playback.setRest(rest, now())
  if (isReducedMotion()) staticFrame()
}, { flush: 'sync' })
watch(() => props.look, () => {
  if (isReducedMotion()) staticFrame()
  else if (svg.value?.getAttribute('data-follow') !== 'pointer') engine.setLook(homeLook(), now(), .6)
})
watch(() => props.radii, (radii) => {
  if (isReducedMotion()) staticFrame()
  else engine.setShape(radii, now())
})

onMounted(() => {
  if (!svg.value) return
  // 鼠标不再可跟时（gaze 传 null）回到常驻视线，而不是一律回正脸。
  gaze = createGaze(svg.value, (look, t, morph) => engine.setLook(look ?? homeLook(), t, morph))
  unregister = register({
    el: svg.value,
    tick,
    motionChange: (reduced) => { if (reduced) staticFrame(); else playback.reset(now()) },
  })
  releaseReactions = registerReactions({
    el: svg.value,
    state: () => state.value,
    busy: () => playback.busy,
    play: dispatch,
  })
})
onBeforeUnmount(() => {
  unregister?.()
  releaseReactions?.()
  gaze?.dispose()
})

function dotAttrs(dot: BotFrame['dots'][number]) {
  // CSS color-mix 保留深度雾，同时支持 CSS 变量、rgb() 等非 hex 身体颜色。
  const fill = dot.color ?? (dot.depth === undefined
    ? props.color
    : `color-mix(in srgb, ${props.color} ${dot.depth * 100}%, ${fogColor})`)
  const common = { style: { fill }, opacity: dot.opacity }
  return dot.d
    ? { ...common, d: dot.d, transform: `translate(${dot.x} ${dot.y}) rotate(${dot.rot ?? 0}) scale(${RAYON})` }
    : { ...common, cx: dot.x, cy: dot.y, r: dot.r }
}
</script>

<template>
  <svg v-bind="svgAttrs">
    <defs>
      <!-- 眼睛是 mask 中的洞，移动到身体边缘时自然裁切。 -->
      <mask :id="maskId" maskUnits="userSpaceOnUse" :x="-PAINT" :y="-PAINT" :width="PAINT * 2" :height="PAINT * 2">
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

    <!-- 圆环后半和爆裂粒子先画；深色垫底层防止它们从眼洞透出。 -->
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
      <path data-part="body" :d="frame.bodyPath" :style="{ fill: eyeColor }" />
      <g :mask="`url(#${maskId})`">
        <rect data-part="fill" :x="-PAINT" :y="-PAINT" :width="PAINT * 2" :height="PAINT * 2" :style="{ fill: color }" />
      </g>
      <path v-if="outline" data-part="outline" :d="frame.bodyPath" fill="none" :style="{ stroke: outline }" stroke-width="1.5" vector-effect="non-scaling-stroke" />
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
