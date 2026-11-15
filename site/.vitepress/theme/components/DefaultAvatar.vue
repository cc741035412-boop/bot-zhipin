<script setup lang="ts">
import { computed } from 'vue'
import { SHAPES, COLORS } from '../vendor/bloub/skins'
import LiveBot from './LiveBot.vue'

import { avatarSeed } from '../avatar'

const props = defineProps<{ slug: string }>()
const portrait = computed(() => {
  const seed = avatarSeed(props.slug)
  const shape = SHAPES[seed % SHAPES.length]
  const color = COLORS[Math.floor(seed / SHAPES.length) % COLORS.length].hex
  return { color, shape }
})
</script>

<template>
  <LiveBot :radii="portrait.shape.radii" :color="portrait.color" :shape-id="'seed:' + portrait.shape.id" />
</template>
