<script setup lang="ts">
import { computed, ref } from 'vue'
import { botFace, faceColors } from '../face'
import type { StateId } from '../vendor/bloub/states'
import type { Play } from '../live/playback'
import LiveBot from './LiveBot.vue'

const props = defineProps<{ slug: string; rest?: StateId; size?: number; look?: { yaw: number; pitch: number } | null }>()
const live = ref<InstanceType<typeof LiveBot>>()
const face = computed(() => botFace(props.slug))
const colors = computed(() => faceColors(face.value.color))
const style = computed(() => ({
  '--bz-bot-light': colors.value.light,
  '--bz-bot-dark': colors.value.dark,
  ...(colors.value.outline ? { '--bz-bot-outline': colors.value.outline } : {}),
}))
// 官方色近乎纯黑（深色主题会换成奶白的那些）：浅色主题下黑眼睛压在黑身体上看不见，交给 CSS 把眼睛换成奶白。
const inkBody = computed(() => colors.value.light !== colors.value.dark)
defineExpose({ play: (detail: Play) => live.value?.play(detail) })
</script>

<template>
  <LiveBot ref="live" :radii="face.radii" color="var(--bz-bot-body)" :shape-id="face.shape" :class="{ 'bz-live-ink': inkBody }" :style="style" :outline="colors.outline ? 'var(--bz-bot-outline)' : null" :rest="rest" :size="size" :look="look" />
</template>
