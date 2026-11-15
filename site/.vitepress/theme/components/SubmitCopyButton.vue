<script setup lang="ts">
import { inject } from 'vue'
import { submitCopyKey } from '../submit/copy'
defineProps<{ text: string; id: string; label?: string; spoken?: string; primary?: boolean }>()
const clipboard = inject(submitCopyKey)!
</script>
<template>
  <button type="button" class="shelf-button" :class="{ primary, copied: clipboard.state.copied === id }" :data-testid="id" @click="clipboard.copy(text, id, $event, spoken)">{{ clipboard.state.copied === id ? '已复制 ✓' : (label || '复制给 AI') }}</button>
</template>
