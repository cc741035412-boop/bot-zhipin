<script setup lang="ts">
import { ICONS, type IconName } from '../icons'

// 全站图标：<BzIcon name="bolt" />，size 默认 16。纯装饰，读屏文字由调用处自己给。
withDefaults(defineProps<{ name: IconName; size?: number }>(), { size: 16 })
</script>

<template>
  <svg class="bz-icon" :data-icon="name" :width="size" :height="size" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path :d="ICONS[name]" /></svg>
</template>
