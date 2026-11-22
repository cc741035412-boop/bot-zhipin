<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import BzIcon from './BzIcon.vue'
import LibraryCopy from './LibraryCopy.vue'

const props = defineProps<{ text: string; id: string }>()
// 两种片段都只插值成文本节点，SSR 时由 Vue 转义；绝不把正文当 HTML 解析。
const parts = computed(() => props.text.split(/(【[^【】\n]+】|\{[^{}\n]+\}|<(?=[^<>\r\n\u2028\u2029]{1,30}>)[^<>\r\n\u2028\u2029]*\p{Script=Han}[^<>\r\n\u2028\u2029]*>)/u))
const content = ref<HTMLElement>()
const expanded = ref(false), overflows = ref(false), fullHeight = ref(0)
const openButton = ref<HTMLButtonElement>(), closeButton = ref<HTMLButtonElement>()
async function toggle() {
  const row = content.value?.closest('article')
  const returnToRow = expanded.value && row && row.getBoundingClientRect().top < 0
  expanded.value = !expanded.value
  await nextTick()
  const trigger = expanded.value ? closeButton : openButton
  trigger.value?.focus({ preventScroll: true })
  if (returnToRow) row.scrollIntoView({ block: 'start', behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' })
}
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
    <div v-if="expanded" class="ix-snip-toolbar">
      <button ref="closeButton" type="button" class="ix-snip-toggle" aria-expanded="true" :aria-controls="id" @click="toggle">收起<BzIcon name="chevron-down" :size="14" /></button>
      <LibraryCopy class="sm" compact :value="text" :target="id" />
    </div>
  </div>
  <button v-if="overflows && !expanded" ref="openButton" type="button" class="ix-snip-toggle" aria-expanded="false" :aria-controls="id" @click="toggle">
    展开<BzIcon name="chevron-down" :size="14" />
  </button>
</template>
