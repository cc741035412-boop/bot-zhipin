<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, provide, ref } from 'vue'
import BotCard from './BotCard.vue'
import BotDetail from './BotDetail.vue'
import { previewMode, previewUpdate, previewDetail, previewCardActive } from '../submit/preview-mode'
const props = defineProps<{ preview: any; copy: any; update: boolean }>()
const expanded = ref(true), tab = ref('card'), desktop = ref(false)
let media: MediaQueryList
function resize() { desktop.value = media.matches }
provide(previewMode, true)
// 隐藏卡片保留操作行；卸载它的头像，避免同 slug 的气泡 ID 重复。
provide(previewCardActive, computed(() => tab.value === 'card'))
provide(previewUpdate, computed(() => props.update))
provide(previewDetail, () => { tab.value = 'detail'; expanded.value = true })
onMounted(() => { expanded.value = innerWidth >= 768; media = matchMedia('(min-width: 1024px)'); resize(); media.addEventListener('change', resize) })
onBeforeUnmount(() => media?.removeEventListener('change', resize))
</script>
<template>
  <aside class="submit-preview preview" data-testid="preview" aria-label="投稿预览">
    <header class="submit-preview-heading"><h2>{{ !expanded && !desktop ? '预览上架后的样子' : '上架后的样子' }}</h2><button type="button" class="submit-text-button" data-testid="preview-toggle" :aria-expanded="expanded" aria-controls="submit-preview-body" @click="expanded = !expanded">{{ expanded ? '收起预览' : '展开预览' }}</button></header>
    <div v-show="desktop || expanded" id="submit-preview-body">
      <p data-testid="preview-note" class="submit-muted">上线后效果以实际页面为准。</p>
      <div class="sort-controls" role="group" aria-label="预览方式"><button type="button" class="shelf-button" data-testid="preview-tab-card" :aria-pressed="tab === 'card'" @click="tab = 'card'">卡片</button><button type="button" class="shelf-button" data-testid="preview-tab-detail" :aria-pressed="tab === 'detail'" @click="tab = 'detail'">详情页</button></div>
      <div v-show="tab === 'card'" data-testid="preview-card" :inert="tab !== 'card'"><BotCard :bot="preview.summary" /></div>
      <div v-if="tab === 'detail'" id="submit-preview-detail" data-testid="preview-detail"><BotDetail :bot="preview.summary" :copy="copy || { quota: {}, permissions: {} }" :design-html="preview.designHtml" /></div>
    </div>
  </aside>
</template>
