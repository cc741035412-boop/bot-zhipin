<script setup lang="ts">
import { computed, ref } from 'vue'
import { botFace, faceColors } from '../face'
import type { StateId } from '../vendor/bloub/states'
import type { Play } from '../live/playback'
import LiveBot from './LiveBot.vue'

const props = defineProps<{ slug: string; rest?: StateId; size?: number }>()
const live = ref<InstanceType<typeof LiveBot>>()
const face = computed(() => botFace(props.slug))
const colors = computed(() => faceColors(face.value.color))
const style = computed(() => ({
  '--bz-bot-light': colors.value.light,
  '--bz-bot-dark': colors.value.dark,
  ...(colors.value.outline ? { '--bz-bot-outline': colors.value.outline } : {}),
}))
defineExpose({ play: (detail: Play) => live.value?.play(detail) })
</script>

<template>
  <LiveBot ref="live" :radii="face.radii" color="var(--bz-bot-body)" :shape-id="face.shape" :style="style" :outline="colors.outline ? 'var(--bz-bot-outline)' : null" :rest="rest" :size="size" />
</template>
