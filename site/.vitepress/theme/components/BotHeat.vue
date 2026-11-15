<script setup>
import { inject, ref } from 'vue'
import { previewMode, previewUpdate } from '../submit/preview-mode'
const preview = inject(previewMode, false)
const update = inject(previewUpdate, ref(false))
import { heatLabel, heatState } from '../heat'
defineProps({ slug: { type: String, required: true } })
</script>
<template>
  <span data-testid="heat" class="bot-heat" :class="{ 'is-loading': !preview && (heatState.status === 'loading' || heatState.status === 'idle') }" :title="!preview && heatState.status === 'failed' ? '热度暂时获取不到' : undefined">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M13 3c1 5-4 5-2 9 2-1 3-2 3-4 3 3 5 5 5 8a7 7 0 0 1-14 0c0-4 4-7 8-13Z" /></svg>
    {{ preview ? (update ? '热度 —' : '新上架') : heatLabel(slug) }}
  </span>
</template>
