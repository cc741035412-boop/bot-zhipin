<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import BotPortrait from './BotPortrait.vue'
import { activePitch, nextPitch, nextPoke } from '../pitch'
import { isReducedMotion, now, register } from '../live/clock'
import type { Play } from '../live/playback'

const props = defineProps<{ bot: { slug: string; name: string; avatar: string | null; pitch?: string | null }; wholeCard?: boolean }>()
const owner = Symbol('头像台词')
const root = ref<HTMLElement>()
const button = ref<HTMLButtonElement>()
const bubble = ref<HTMLElement>()
const portrait = ref<InstanceType<typeof BotPortrait>>()
const hovered = ref(false)
const text = ref('')
const visibleText = ref('')
const typing = ref(false)
const open = computed(() => activePitch.value === owner)
const bubbleId = computed(() => `pitch-${props.bot.slug}`)
let timer: ReturnType<typeof setTimeout> | undefined
let stopTyping: (() => void) | undefined
let pointerFocus = false

function play(detail: Play) { portrait.value?.play(detail) }
function finishTyping() {
  typing.value = false
  visibleText.value = text.value
  stopTyping?.()
  stopTyping = undefined
}
function show(line: string, touch = false, bounce = true) {
  clearTimeout(timer)
  stopTyping?.()
  text.value = line
  activePitch.value = owner
  visibleText.value = ''
  typing.value = !isReducedMotion()
  // 打字也消费共享时钟；只有当前气泡注册，完成/关闭立即释放，不开逐字定时循环。
  if (typing.value && bubble.value) {
    const start = now(), letters = [...line]
    stopTyping = register({
      el: bubble.value,
      motionChange: (reduced) => { if (reduced) finishTyping() },
      tick(t) {
        if (t - start < .35) return
        typing.value = false
        const count = Math.min(letters.length, Math.floor((t - start - .35) / .028) + 1)
        visibleText.value = letters.slice(0, count).join('')
        if (count === letters.length) finishTyping()
      },
    })
    if (!typing.value) finishTyping()
  } else finishTyping()
  // 重启 CSS 动画，不替换按钮 DOM，保留键盘焦点。
  button.value?.classList.remove('is-speaking')
  if (bounce && !isReducedMotion()) {
    void button.value?.offsetWidth
    button.value?.classList.add('is-speaking')
  }
  if (touch) timer = setTimeout(close, 4000)
}
function close() {
  clearTimeout(timer)
  stopTyping?.()
  stopTyping = undefined
  if (open.value) activePitch.value = null
}
function enter(event: PointerEvent) {
  if (event.pointerType !== 'mouse') return
  hovered.value = true
  play({ state: 'wide', hold: Infinity })
  show(nextPitch(props.bot.slug, props.bot.pitch))
}
function leave(event: PointerEvent) {
  if (event.pointerType !== 'mouse') return
  hovered.value = false // rest prop 释放 wide，但不会打断临时动作。
  close()
}
function focus() {
  if (!pointerFocus) show(nextPitch(props.bot.slug, props.bot.pitch))
}
function click(event: MouseEvent) {
  const pointer = 'pointerType' in event && event.pointerType
  if (!pointer && event.detail === 0) show(nextPitch(props.bot.slug, props.bot.pitch))
  else {
    const poke = nextPoke(props.bot.slug)
    play({ state: poke.state })
    // 戳本身已有变身反馈，不叠加按钮位移，让连续点按保持稳定命中。
    show(poke.text, pointer === 'touch', false)
  }
  pointerFocus = false
}
function outside(event: Event) {
  if (!root.value?.contains(event.target as Node)) close()
}
function escape(event: KeyboardEvent) { if (event.key === 'Escape') close() }
function releasePointer() { pointerFocus = false }
watch(open, (value) => { if (!value) close() }, { flush: 'sync' })
onMounted(() => {
  document.addEventListener('pointerdown', outside)
  document.addEventListener('pointerup', releasePointer)
  document.addEventListener('pointercancel', releasePointer)
  document.addEventListener('keydown', escape)
})
onBeforeUnmount(() => {
  document.removeEventListener('pointerdown', outside)
  document.removeEventListener('pointerup', releasePointer)
  document.removeEventListener('pointercancel', releasePointer)
  document.removeEventListener('keydown', escape)
  close()
})
defineExpose({ enter, leave, play })
</script>

<template>
  <div ref="root" class="avatar-root">
    <!-- 外层在卡片里不占盒子：玻璃砖和气泡各自落进卡片网格；详情页里它是气泡的定位容器。 -->
    <div class="avatar-stage bz-tile" @pointerenter="!wholeCard && enter($event)" @pointerleave="!wholeCard && leave($event)">
      <button
        ref="button" type="button" class="bot-avatar" data-testid="avatar"
        :aria-label="`听听${bot.name}的自荐`" :aria-describedby="open ? bubbleId : undefined"
        @pointerdown="pointerFocus = true"
        @focus="focus" @blur="close" @click="click"
      >
        <BotPortrait ref="portrait" :bot="bot" :rest="hovered ? 'wide' : 'idle'" />
      </button>
    </div>
    <p ref="bubble" data-testid="pitch-bubble" :data-open="String(open)" :data-text="text" aria-hidden="true" class="pitch-bubble" role="tooltip">
      <i v-if="typing" data-testid="typing" class="typing" aria-hidden="true"><i /><i /><i /></i>
      <span>{{ visibleText }}</span>
    </p>
    <p :id="bubbleId" class="bz-sr-only">{{ text }}</p>
  </div>
</template>
