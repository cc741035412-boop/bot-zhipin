<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import BzIcon from './BzIcon.vue'

const props = defineProps<{ text: string; id: string }>()
// 两种片段都只插值成文本节点，SSR 时由 Vue 转义；绝不把正文当 HTML 解析。
const parts = computed(() => props.text.split(/(【[^【】\n]+】|\{[^{}\n]+\})/u))
const content = ref<HTMLElement>()
const expanded = ref(false), overflows = ref(false), fullHeight = ref(0)
let observer: ResizeObserver | undefined
onMounted(() => {
  const el = content.value!
  // 观察未裁切的内层，换行、改字号或改变窗口宽度时都能重新判断四行边界。
  observer = new ResizeObserver(([entry]) => {
    fullHeight.value = entry.contentRect.height
    overflows.value = fullHeight.value > 4 * parseFloat(getComputedStyle(el).lineHeight) + 0.5
    if (!overflows.value) expanded.value = false
  })
  observer.observe(el)
})
onBeforeUnmount(() => observer?.disconnect())
</script>
<template>
  <div class="ix-snip">
    <div class="ix-snip-window" :class="{ faded: overflows && !expanded }" :style="{ maxHeight: expanded ? `${fullHeight}px` : undefined }">
      <div :id="id" ref="content" class="ix-snip-text"><template v-for="(part, n) in parts" :key="n"><mark v-if="n % 2">{{ part }}</mark><template v-else>{{ part }}</template></template></div>
    </div>
  </div>
  <button v-if="overflows" type="button" class="ix-snip-toggle" :aria-expanded="expanded" :aria-controls="id" @click="expanded = !expanded">
    {{ expanded ? '收起' : '展开' }}<BzIcon name="chevron-down" :size="14" />
  </button>
</template>
