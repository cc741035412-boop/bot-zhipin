<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, provide, ref, watch } from 'vue'
import BotCard from './BotCard.vue'
import BotDetail from './BotDetail.vue'
import SubmitIcon from './SubmitIcon.vue'
import { previewMode, previewUpdate, previewDetail, previewCardActive } from '../submit/preview-mode'
const props = defineProps<{ preview: any; copy: any; update: boolean }>()
const expanded = ref(true), tab = ref('card'), desktop = ref(false)
const scrollArea = ref<HTMLElement>(), scrollContent = ref<HTMLElement>()
const hasMore = ref(false)
const showScrollHint = computed(() => desktop.value && tab.value === 'detail' && hasMore.value)
let observer: ResizeObserver
function updateScrollHint() {
  const el = scrollArea.value
  hasMore.value = !!el && el.scrollHeight - el.clientHeight - el.scrollTop > 1
}
watch([desktop, tab, () => props.preview], updateScrollHint, { flush: 'post' })
let media: MediaQueryList
function resize() { desktop.value = media.matches }
provide(previewMode, true)
// 隐藏卡片保留操作行；卸载它的头像，避免同 slug 的气泡 ID 重复。
provide(previewCardActive, computed(() => tab.value === 'card'))
provide(previewUpdate, computed(() => props.update))
provide(previewDetail, () => { tab.value = 'detail'; expanded.value = true })
onMounted(() => { expanded.value = innerWidth >= 768; media = matchMedia('(min-width: 1024px)'); resize(); media.addEventListener('change', resize) })
onMounted(() => {
  observer = new ResizeObserver(updateScrollHint)
  observer.observe(scrollArea.value!)
  observer.observe(scrollContent.value!)
  updateScrollHint()
})
onBeforeUnmount(() => { media?.removeEventListener('change', resize); observer?.disconnect() })
</script>
<template>
  <aside class="submit-preview preview" data-testid="preview" aria-label="投稿预览">
    <div ref="scrollArea" class="submit-preview-scroll" @scroll="updateScrollHint">
    <div ref="scrollContent" class="submit-preview-inner">
    <header class="submit-preview-heading"><h2 class="bz-title">{{ !expanded && !desktop ? '预览上架后的样子' : '上架后的样子' }}</h2><button type="button" class="bz-btn ghost sm submit-text-button" data-testid="preview-toggle" :aria-expanded="expanded" aria-controls="submit-preview-body" @click="expanded = !expanded"><SubmitIcon name="chevron-down" />{{ expanded ? '收起预览' : '展开预览' }}</button></header>
    <div v-show="desktop || expanded" id="submit-preview-body">
      <p data-testid="preview-note" class="submit-muted">上线后效果以实际页面为准。</p>
      <!-- 分段控件用全站的 .bz-seg；sort-controls 是旧别名，测试靠它找轨道，留着。选中块的颜色见 submit.css。 -->
      <div class="bz-seg sort-controls" :data-sort="tab === 'detail' ? 'new' : 'hot'" role="group" aria-label="预览方式"><button type="button" data-testid="preview-tab-card" :aria-pressed="tab === 'card'" @click="tab = 'card'">卡片</button><button type="button" data-testid="preview-tab-detail" :aria-pressed="tab === 'detail'" @click="tab = 'detail'">详情页</button></div>
      <div v-show="tab === 'card'" data-testid="preview-card" :inert="tab !== 'card'"><BotCard :bot="preview.summary" /></div>
      <div v-if="tab === 'detail'" id="submit-preview-detail" data-testid="preview-detail"><BotDetail :bot="preview.summary" :copy="copy || { quota: {}, permissions: {} }" :design-html="preview.designHtml" /></div>
    </div>
    </div>
    </div>
    <p v-if="showScrollHint" class="submit-preview-scroll-hint" data-testid="preview-scroll-hint">向下滚动查看更多</p>
  </aside>
</template>
