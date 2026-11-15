<script setup lang="ts">
import { inject, nextTick, onBeforeUnmount, ref } from 'vue'
import { previewMode } from '../submit/preview-mode'
const preview = inject(previewMode, false)
import { installPrompt } from '../../meta.mjs'
import { reportClick } from '../heat'
import { announceCopy } from '../announce'
import ExternalHint from './ExternalHint.vue'

const props = defineProps<{ bot: { slug: string; templateUrl: string; external: boolean } }>()
const copied = ref(false)
const fallback = ref(false)
const dialog = ref<HTMLDialogElement>()
const field = ref<HTMLTextAreaElement>()
const copyButton = ref<HTMLButtonElement>()
let timer: ReturnType<typeof setTimeout> | undefined
async function copyPrompt() {
  if (preview) return
  reportClick(props.bot.slug, 'prompt')
  try {
    await navigator.clipboard.writeText(installPrompt(props.bot.slug))
    copied.value = true
    void announceCopy()
    clearTimeout(timer)
    timer = setTimeout(() => { copied.value = false }, 1800)
  } catch {
    fallback.value = true
    await nextTick()
    dialog.value?.showModal()
    field.value?.focus()
    field.value?.select()
  }
}
function backdrop(event: MouseEvent) {
  if (event.target !== dialog.value) return
  const bounds = dialog.value.getBoundingClientRect()
  if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.value.close()
}
onBeforeUnmount(() => clearTimeout(timer))
</script>

<template>
  <div class="bot-actions">
    <button v-if="preview" data-testid="btn-import" type="button" class="shelf-button primary" aria-disabled="true">一键导入</button>
    <a v-else data-testid="btn-import" class="shelf-button primary" :href="bot.templateUrl" target="_blank" rel="noopener noreferrer" @click="reportClick(bot.slug, 'import')">一键导入<ExternalHint /></a>
    <button v-if="!bot.external" ref="copyButton" data-testid="btn-prompt" type="button" class="shelf-button" :class="{ copied }" :aria-disabled="preview || undefined" @click="copyPrompt">{{ copied ? '已复制 ✓' : '复制安装提示词' }}</button>
  </div>
  <p v-if="preview" data-testid="preview-actions-note">上架后可用</p>
  <dialog v-if="fallback && !bot.external" ref="dialog" class="prompt-fallback" data-testid="prompt-fallback" :aria-labelledby="`copy-title-${bot.slug}`" :aria-describedby="`copy-help-${bot.slug}`" @click="backdrop" @close="fallback = false; copyButton?.focus()">
    <h2 :id="`copy-title-${bot.slug}`">复制没成功，请手动复制</h2>
    <p :id="`copy-help-${bot.slug}`">全选下面的文字，复制后发给你的 Grok Bot</p>
    <textarea ref="field" aria-label="安装提示词" readonly :value="installPrompt(bot.slug)" rows="7" />
    <button type="button" class="shelf-button" @click="dialog?.close()">关闭</button>
  </dialog>
</template>
