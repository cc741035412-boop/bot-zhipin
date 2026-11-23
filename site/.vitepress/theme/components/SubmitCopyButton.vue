<script setup lang="ts">
import { inject } from 'vue'
import { submitCopyKey } from '../submit/copy'
import SubmitIcon from './SubmitIcon.vue'
import { track } from '../track'
const props = defineProps<{ text: string; id: string; label?: string; spoken?: string; primary?: boolean }>()
const clipboard = inject(submitCopyKey)!
async function copy(event: MouseEvent) {
  const ok = await clipboard.copy(props.text, props.id, event, props.spoken)
  if (props.id === 'copy-submit-prompt') track('submit_step', { step: 'copy_prompt', ok })
}
</script>
<template>
  <!-- 复制成功时图标从 copy 换成对勾，和货架上的复制按钮一个样。文字里原来那个「✓」留在 DOM 里（读屏、测试读到的文字不变），只是不再显示，免得一排两个对勾。 -->
  <button type="button" class="bz-btn" :class="{ primary, copied: clipboard.state.copied === id }" :data-testid="id" @click="copy"><SubmitIcon :name="clipboard.state.copied === id ? 'check' : 'copy'" /><template v-if="clipboard.state.copied === id">已复制 <span class="bz-sr-only">✓</span></template><template v-else>{{ label || '复制给 AI' }}</template></button>
</template>
