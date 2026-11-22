<script setup lang="ts">
import { inject, onBeforeUnmount, ref } from 'vue'
import { previewMode } from '../submit/preview-mode'
import { announce } from '../announce'
import { track } from '../track'
import { reportClick } from '../heat'
import { useBotAction } from '../live/scope'
import BzIcon from './BzIcon.vue'

// 开场白：导入后可以直接发给 Bot 的第一句话。每条是一个聊天气泡样子的按钮，点一下复制，
// 图标换成对勾、旁边出现「已复制」，1.8 秒后恢复；Bot 眨一下眼。投稿预览里不可点。
const props = defineProps<{ slug: string; lines: string[] }>()
const preview = inject(previewMode, false)
const play = useBotAction()
const copied = ref(-1)
let timer: ReturnType<typeof setTimeout> | undefined

async function write(text: string) {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    // 剪贴板接口用不了（权限、旧浏览器）：退回到选中一个临时文本框再复制。
    const field = document.createElement('textarea')
    field.value = text
    field.setAttribute('readonly', '')
    field.style.cssText = 'position:fixed;top:0;left:0;opacity:0'
    document.body.append(field)
    field.select()
    let ok = false
    try { ok = document.execCommand('copy') } catch { ok = false }
    field.remove()
    return ok
  }
}
async function copy(index: number, text: string, event: MouseEvent) {
  if (preview) return
  reportClick(props.slug, 'starter')
  const button = event.currentTarget as HTMLElement
  const ok = await write(text)
  track('bot_copy_starter', { index, ok }, { slug: props.slug })
  if (!ok) {
    // 两条路都不通：把这句话选中，按 ⌘C / Ctrl+C 就能带走。
    const range = document.createRange()
    range.selectNodeContents(button.querySelector('.starter-text')!)
    const selection = getSelection()
    selection?.removeAllRanges()
    selection?.addRange(range)
    return
  }
  button.focus({ preventScroll: true })
  copied.value = index
  play({ state: 'wink' })
  void announce('已复制')
  clearTimeout(timer)
  timer = setTimeout(() => { copied.value = -1 }, 1800)
}
onBeforeUnmount(() => clearTimeout(timer))
</script>

<template>
  <ul class="starter-list">
    <li v-for="(line, index) in lines" :key="index">
      <button type="button" class="starter" data-testid="starter" :class="{ copied: copied === index }" :aria-disabled="preview || undefined" @click="copy(index, line, $event)">
        <span class="starter-text">{{ line }}</span>
        <span class="starter-copy">
          <span v-if="copied === index" class="starter-done">已复制</span>
          <span v-else class="bz-sr-only">复制</span>
          <BzIcon :name="copied === index ? 'check' : 'copy'" />
        </span>
      </button>
    </li>
  </ul>
</template>
