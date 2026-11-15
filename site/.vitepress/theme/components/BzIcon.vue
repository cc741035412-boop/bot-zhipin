<script setup lang="ts">
import { ICONS, type IconName } from '../icons'
// 路径数据都是本仓库 icons.ts 里的常量，不含任何投稿内容。
withDefaults(defineProps<{ name: IconName; size?: number }>(), { size: 16 })
</script>

<template>
  <svg :width="size" :height="size" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" v-html="ICONS[name]" />
</template>
