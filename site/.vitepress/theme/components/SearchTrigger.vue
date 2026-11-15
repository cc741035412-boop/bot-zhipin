<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { SHELF_COPY } from '../../meta.mjs'
import BzIcon from './BzIcon.vue'

// 长得像输入框的按钮：真正的搜索在 SearchPalette 里，这里只负责把它叫出来。
// SSR 和首帧固定显示 ⌘；挂载后非苹果设备换成 Ctrl，两种快捷键面板都认。
const modifier = ref('⌘')
onMounted(() => {
  if (!/Mac|iPhone|iPad|iPod/i.test(navigator.platform || navigator.userAgent)) modifier.value = 'Ctrl'
})
function open() { window.dispatchEvent(new CustomEvent('bz-search-open')) }
</script>

<template>
  <button type="button" class="search-trigger" :aria-label="SHELF_COPY.searchLabel" aria-haspopup="dialog" @click="open">
    <BzIcon class="search-trigger-icon" name="search" />
    <span class="search-trigger-text">{{ SHELF_COPY.searchPlaceholder }}</span>
    <span class="search-trigger-keys" aria-hidden="true"><kbd>{{ modifier }}</kbd><kbd>K</kbd></span>
  </button>
</template>
