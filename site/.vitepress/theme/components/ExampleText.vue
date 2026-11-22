<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
const props = defineProps<{ id: string; text: string; lines: number }>()
const inner = ref<HTMLElement>(), expanded = ref(false), overflow = ref(false)
let observer: ResizeObserver
onMounted(() => {
  observer = new ResizeObserver(([{ contentRect }]) => {
    overflow.value = contentRect.height > parseFloat(getComputedStyle(inner.value!).lineHeight) * props.lines + 0.5
    if (!overflow.value) expanded.value = false
  })
  observer.observe(inner.value!)
})
onBeforeUnmount(() => observer?.disconnect())
</script>
<template>
  <div :id="id" class="ix-example-window" :style="{maxHeight: expanded ? 'none' : `${lines}lh`}"><div ref="inner">{{ text }}</div></div>
  <button v-if="overflow" class="ix-snip-toggle" type="button" :aria-expanded="expanded" :aria-controls="id" @click="expanded = !expanded">{{ expanded ? '收起' : '展开' }}</button>
</template>
