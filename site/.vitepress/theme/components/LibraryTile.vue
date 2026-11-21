<script setup lang="ts">
import { computed } from 'vue'
import { markFor, type Kind } from '../library-marks'
const props = defineProps<{ kind: Kind; category: string; size: number }>()
const mark = computed(() => markFor(props.kind, props.category))
</script>
<template>
  <span :class="['bz-tile', `s${size}`]" aria-hidden="true">
    <svg class="ps-mascot" viewBox="-104 -104 208 208">
      <path d="M100 0C100 55 55 100 0 100S-100 55-100 0-55-100 0-100 100-55 100 0Z" :fill="category ? mark.color : 'var(--bz-ink)'" />
      <path :d="mark.path" transform="translate(-66 -66) scale(5.5)" fill="none" :stroke="category ? '#16161b' : 'var(--bz-page)'" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" />
    </svg>
  </span>
</template>
