<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue'
import { track } from '../track'
import type { EventProps } from '../../../../functions/_lib/events'
import BzIcon from './BzIcon.vue'
const props = defineProps<{ value: string; target: string; compact?: boolean; track?: { name: 'prompt_copy' | 'skill_copy'; slug: string; props: EventProps<'prompt_copy'> | EventProps<'skill_copy'> } }>()
const label = ref<'复制'|'已复制'|'未复制'>('复制')
let timer: ReturnType<typeof setTimeout>, version = 0
async function copy() {
  const event = props.track
  const record = (ok: boolean) => { if (event) track(event.name, { ...event.props, ok }, { slug: event.slug }) }
  const id = ++version
  clearTimeout(timer)
  try {
    await navigator.clipboard.writeText(props.value)
    record(true)
    if (id !== version) return
    label.value = '已复制'
  } catch {
    record(false)
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
  <button class="bz-btn copy" type="button" :aria-label="compact ? label : undefined" :class="{copied: label === '已复制', failed: label === '未复制'}" @click="copy">
    <BzIcon :name="label === '复制' ? 'copy' : label === '已复制' ? 'check' : 'x'" /><span role="status">{{ label }}</span>
  </button>
</template>
