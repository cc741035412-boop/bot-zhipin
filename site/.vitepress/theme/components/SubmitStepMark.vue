<script setup lang="ts">
import SubmitIcon from './SubmitIcon.vue'

// 步骤序号：各步骤照旧算出「✓」「!」或数字，这里只把前两个画成线性图标。颜色跟着步骤卡的 data-state 走（submit.css）。
defineProps<{ mark: string }>()
</script>

<template>
  <span class="submit-step-number" aria-hidden="true"><SubmitIcon v-if="mark === '✓'" name="check" :size="14" /><SubmitIcon v-else-if="mark === '!'" name="bang" :size="16" /><template v-else>{{ mark }}</template></span>
</template>
