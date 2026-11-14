<script setup lang="ts">
import { nextTick, onBeforeUnmount, ref } from 'vue'
import { installPrompt } from '../../meta.mjs'
import { reportClick } from '../heat'

const props = defineProps<{ bot: { slug: string; templateUrl: string; external: boolean } }>()
const copied = ref(false)
const fallback = ref(false)
const field = ref<HTMLTextAreaElement>()
const copyButton = ref<HTMLButtonElement>()
let timer: ReturnType<typeof setTimeout> | undefined
async function copyPrompt() {
  reportClick(props.bot.slug, 'prompt')
  try {
    await navigator.clipboard.writeText(installPrompt(props.bot.slug))
    fallback.value = false
    copied.value = true
    clearTimeout(timer)
    timer = setTimeout(() => { copied.value = false }, 2000)
  } catch {
    fallback.value = true
    await nextTick()
    field.value?.focus()
    field.value?.select()
  }
}
function closeFallback() {
  fallback.value = false
  copyButton.value?.focus()
}
onBeforeUnmount(() => clearTimeout(timer))
</script>

<template>
  <div class="bot-actions">
    <a data-testid="btn-import" class="shelf-button" :href="bot.templateUrl" target="_blank" rel="noopener noreferrer" @click="reportClick(bot.slug, 'import')">一键导入</a>
    <button v-if="!bot.external" ref="copyButton" data-testid="btn-prompt" type="button" class="shelf-button" aria-live="polite" @click="copyPrompt">{{ copied ? '已复制' : '复制安装提示词' }}</button>
  </div>
  <div v-if="fallback && !bot.external" class="prompt-fallback" @keydown.esc="closeFallback">
    <label>
      自动复制失败，请在文本框中全选并复制：
      <textarea ref="field" data-testid="prompt-fallback" readonly :value="installPrompt(bot.slug)" rows="7" />
    </label>
    <button type="button" class="shelf-button" @click="closeFallback">关闭</button>
  </div>
</template>
