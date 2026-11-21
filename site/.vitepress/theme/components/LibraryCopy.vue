<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue'
import BzIcon from './BzIcon.vue'
const props = defineProps<{ value: string; target: string }>()
const label = ref<'复制'|'已复制'|'未复制'>('复制')
let timer: ReturnType<typeof setTimeout>, version = 0
async function copy() {
  const id = ++version
  clearTimeout(timer)
  try {
    await navigator.clipboard.writeText(props.value)
    if (id !== version) return
    label.value = '已复制'
  } catch {
    if (id !== version) return
    const node = document.getElementById(props.target)
    if (node) {
      const range = document.createRange(); range.selectNodeContents(node)
      const selection = window.getSelection(); selection?.removeAllRanges(); selection?.addRange(range)
    }
    label.value = '未复制'
  }
  timer = setTimeout(() => label.value = '复制', 1800)
}
onBeforeUnmount(() => { version++; clearTimeout(timer) })
</script>
<template>
  <button class="bz-btn copy" type="button" :class="{copied: label === '已复制', failed: label === '未复制'}" @click="copy">
    <BzIcon :name="label === '复制' ? 'copy' : label === '已复制' ? 'check' : 'x'" /><span role="status">{{ label }}</span>
  </button>
</template>
