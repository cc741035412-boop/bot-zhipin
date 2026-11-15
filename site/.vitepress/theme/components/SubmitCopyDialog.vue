<script setup lang="ts">
import { inject, nextTick, ref, watch } from 'vue'
import { submitCopyKey } from '../submit/copy'
const clipboard = inject(submitCopyKey)!
const dialog = ref<HTMLDialogElement>(), field = ref<HTMLTextAreaElement>()
watch(() => clipboard.state.open, async (open) => {
  if (!open) return
  await nextTick(); dialog.value?.showModal(); field.value?.focus(); field.value?.select()
})
function backdrop(event: MouseEvent) {
  if (event.target !== dialog.value) return
  const r = dialog.value!.getBoundingClientRect()
  if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) dialog.value?.close()
}
</script>
<template>
  <dialog v-if="clipboard.state.open" ref="dialog" class="prompt-fallback" data-testid="submit-prompt-fallback" aria-labelledby="submit-copy-title" aria-describedby="submit-copy-help" @click="backdrop" @close="clipboard.close()">
    <h2 id="submit-copy-title">复制没成功，请手动复制</h2>
    <p id="submit-copy-help">全选下面的文字，复制后发给你的 AI</p>
    <textarea ref="field" readonly rows="8" aria-label="要复制的文字" :value="clipboard.state.text" />
    <button type="button" class="shelf-button" @click="dialog?.close()">关闭</button>
  </dialog>
</template>
