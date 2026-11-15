<script setup>
import { computed, inject, ref } from 'vue'
import { previewMode, previewUpdate } from '../submit/preview-mode'
const preview = inject(previewMode, false)
const update = inject(previewUpdate, ref(false))
import { heatLabel, heatState } from '../heat'
import BzIcon from './BzIcon.vue'
// compact：列表卡用。热度大于 0 才出现，只显示火苗和数字（「热度」两个字留给读屏）；没有热度就不占位。
const props = defineProps({ slug: { type: String, required: true }, compact: { type: Boolean, default: false } })
const value = computed(() => heatState.values[props.slug] ?? 0)
</script>
<template>
  <span v-if="!compact || preview || value > 0" data-testid="heat" class="bot-heat" :class="{ 'is-loading': !preview && (heatState.status === 'loading' || heatState.status === 'idle') }" :title="!preview && heatState.status === 'failed' ? '热度暂时获取不到' : undefined">
    <BzIcon name="flame" :class="{ 'is-hot': !preview && value > 0 }" />
    <template v-if="compact && !preview"><span class="bz-sr-only">热度</span> {{ value }}</template>
    <template v-else>{{ preview ? (update ? '热度 —' : '新上架') : heatLabel(slug) }}</template>
  </span>
</template>
