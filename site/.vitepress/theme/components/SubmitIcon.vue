<script setup lang="ts">
import { ICONS } from '../icons'
import { SUBMIT_ICONS } from '../submit/icons'

// 投稿页的图标：全站那套加上 submit/icons.ts 里多出来的几个，渲染出来和 BzIcon 一模一样（同一个类名、同一组属性）。
// 纯装饰，读屏文字由调用处自己给。
const ALL = { ...ICONS, ...SUBMIT_ICONS }
withDefaults(defineProps<{ name: keyof typeof ALL; size?: number }>(), { size: 16 })
</script>

<template>
  <svg class="bz-icon" :data-icon="name" :width="size" :height="size" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path :d="ALL[name]" /></svg>
</template>
