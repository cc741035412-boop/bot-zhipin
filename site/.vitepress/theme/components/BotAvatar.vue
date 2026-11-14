<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import BotPortrait from './BotPortrait.vue'
import { avatarColor } from '../avatar'
import { activePitch, nextPitch } from '../pitch'

const props = defineProps<{ bot: { slug: string; name: string; avatar: string | null; pitch?: string | null } }>()
const owner = Symbol('头像台词')
const root = ref<HTMLElement>()
const button = ref<HTMLButtonElement>()
const portrait = ref<InstanceType<typeof BotPortrait>>()
const color = computed(() => portrait.value?.color || (props.bot.avatar ? '#8a8a93' : avatarColor(props.bot.slug)))
const text = ref('')
const open = computed(() => activePitch.value === owner)
const bubbleId = computed(() => `pitch-${props.bot.slug}`)
let timer: ReturnType<typeof setTimeout> | undefined
let pointerFocus = false
function show(touch = false) {
  clearTimeout(timer)
  text.value = nextPitch(props.bot.slug, props.bot.pitch)
  activePitch.value = owner
  // 重启 CSS 动画，不替换按钮 DOM，保留键盘焦点。
  button.value?.classList.remove('is-speaking')
  void button.value?.offsetWidth
  button.value?.classList.add('is-speaking')
  if (touch) timer = setTimeout(close, 4000)
}
function close() {
  clearTimeout(timer)
  if (open.value) activePitch.value = null
}
function focus() {
  if (!pointerFocus) show()
}
function click(event: MouseEvent) {
  show('pointerType' in event && event.pointerType === 'touch')
  pointerFocus = false
}
function outside(event: Event) {
  if (!root.value?.contains(event.target as Node)) close()
}
function escape(event: KeyboardEvent) {
  if (event.key === 'Escape') close()
}
function releasePointer() { pointerFocus = false }
watch(open, (value) => { if (!value) clearTimeout(timer) })
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
</script>

<template>
  <div ref="root" class="avatar-stage" :style="{ '--bz-bot-color': color }">
    <button
      ref="button" type="button" class="bot-avatar" data-testid="avatar"
      :aria-label="`听听${bot.name}的自荐`" :aria-describedby="open ? bubbleId : undefined"
      @pointerenter="($event.pointerType === 'mouse') && show()"
      @pointerleave="($event.pointerType === 'mouse') && close()"
      @pointerdown="pointerFocus = true"
      @focus="focus" @blur="close" @click="click"
    >
      <BotPortrait ref="portrait" :bot="bot" />
    </button>
    <p :id="bubbleId" data-testid="pitch-bubble" :data-open="String(open)" :aria-hidden="!open" class="pitch-bubble" role="tooltip"><span>{{ text }}</span></p>
  </div>
</template>
