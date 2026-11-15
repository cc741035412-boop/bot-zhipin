<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, useId, watch } from 'vue'
import { useRouter } from 'vitepress'
import { data as bots } from '../../data/bots.data.mjs'
import { searchBots, type SearchableBot } from '../search'
import BotPortrait from './BotPortrait.vue'

const router = useRouter()
const opened = ref(false)
const query = ref('')
const selected = ref(0)
const input = ref<HTMLInputElement>()
const panel = ref<HTMLElement>()
const listId = `bz-search-${useId()}`
type PaletteBot = SearchableBot & { avatar: string | null; detailUrl: string }
const results = computed(() => searchBots<PaletteBot>(bots, query.value))
const optionId = (slug: string) => `${listId}-${slug}`
const activeId = computed(() => results.value[selected.value] && optionId(results.value[selected.value].slug))
const emptyBot = { slug: 'empty-shelf', name: '没有结果', avatar: null }
let opener: HTMLElement | null = null
let previousOverflow = ''

async function open() {
  if (opened.value) { input.value?.focus(); return }
  opener = document.activeElement instanceof HTMLElement ? document.activeElement : null
  previousOverflow = document.body.style.overflow
  document.body.style.overflow = 'hidden'
  query.value = ''
  selected.value = 0
  opened.value = true
  await nextTick()
  if (opened.value) input.value?.focus({ preventScroll: true })
}

function close() {
  if (!opened.value) return
  opened.value = false
  document.body.style.overflow = previousOverflow
  if (opener?.isConnected) opener.focus({ preventScroll: true })
  opener = null
}

function choose(index: number) {
  const bot = results.value[index]
  if (!bot) return
  close()
  void router.go(bot.detailUrl)
}

watch(query, () => { selected.value = 0 }, { flush: 'sync' })
watch([activeId, opened], () => {
  if (opened.value && activeId.value) {
    document.getElementById(activeId.value)?.scrollIntoView({ block: 'nearest' })
  }
}, { flush: 'post' })

function editable(target: EventTarget | null) {
  return target instanceof HTMLElement && (
    target.matches('input, textarea, select') || target.isContentEditable
  )
}

function keydown(event: KeyboardEvent) {
  // 候选词确认/取消不能触发导航或关掉面板（包含 Safari 的 229）。
  if (event.isComposing || event.keyCode === 229) return
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
    event.preventDefault()
    void open()
    return
  }
  if (!opened.value) {
    if (event.key === '/' && !event.defaultPrevented && !event.metaKey && !event.ctrlKey && !event.altKey && !editable(event.target)) {
      event.preventDefault()
      void open()
    }
    return
  }
  if (event.key === 'Escape') {
    event.preventDefault()
    close()
  } else if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
    event.preventDefault()
    const count = results.value.length
    if (count) selected.value = (selected.value + (event.key === 'ArrowDown' ? 1 : -1) + count) % count
  } else if (event.key === 'Enter' && event.target === input.value) {
    event.preventDefault()
    choose(selected.value)
  } else if (event.key === 'Tab') {
    event.preventDefault()
    const controls = Array.from(panel.value?.querySelectorAll<HTMLElement>('input, button') ?? [])
    const index = controls.indexOf(document.activeElement as HTMLElement)
    controls[(index + (event.shiftKey ? -1 : 1) + controls.length) % controls.length]?.focus()
  }
}

function keepFocus(event: FocusEvent) {
  if (opened.value && panel.value && !panel.value.contains(event.target as Node)) input.value?.focus()
}

// 只有客户端挂载后才能打开；SSR 与 hydration 首帧都不创建 Teleport/LiveBot。
onMounted(() => {
  window.addEventListener('keydown', keydown)
  window.addEventListener('bz-search-open', open)
  document.addEventListener('focusin', keepFocus)
})
onBeforeUnmount(() => {
  window.removeEventListener('keydown', keydown)
  window.removeEventListener('bz-search-open', open)
  document.removeEventListener('focusin', keepFocus)
  close()
})
</script>

<template>
  <Teleport v-if="opened" to="body">
    <div class="search-palette" data-testid="search-palette" role="dialog" aria-modal="true" aria-label="搜索 Bot" @click.self="close">
      <div ref="panel" class="search-panel" data-testid="search-panel">
        <div class="search-input-row">
          <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true">
            <circle cx="10.5" cy="10.5" r="6.5" /><path d="m16 16 4 4" />
          </svg>
          <input
            ref="input" v-model="query" data-testid="search-input" type="text" role="combobox"
            aria-label="搜索 Bot" aria-expanded="true" aria-autocomplete="list"
            :aria-controls="listId" :aria-activedescendant="activeId"
            placeholder="搜 Bot：名字、分类、作者…" autocomplete="off" spellcheck="false"
          >
          <button class="search-close" type="button" aria-label="关闭搜索" @click="close"><kbd>esc</kbd></button>
        </div>
        <div :id="`${listId}-heading`" class="search-heading">{{ query.trim() ? '结果' : '全部 Bot' }}</div>
        <div :id="listId" class="search-list" role="listbox" :aria-labelledby="`${listId}-heading`">
          <div
            v-for="(bot, index) in results" :id="optionId(bot.slug)" :key="bot.slug"
            class="search-item" data-testid="search-item" :data-slug="bot.slug" role="option" :aria-selected="selected === index"
            @pointermove="($event.pointerType !== 'touch') && (selected = index)" @mousedown.prevent @click="choose(index)"
          >
            <span class="search-portrait" aria-hidden="true"><BotPortrait :bot="bot" :rest="selected === index ? 'wide' : 'idle'" /></span>
            <span class="search-copy">
              <span data-part="name">{{ bot.name }}</span>
              <span data-part="tagline">{{ bot.tagline }}</span>
            </span>
            <span class="search-category">{{ bot.category }}</span>
            <span class="search-return" aria-hidden="true"><kbd v-if="selected === index">↵</kbd></span>
          </div>
        </div>
        <div v-if="!results.length" class="search-empty" data-testid="search-empty" role="status">
          <span class="search-empty-portrait" aria-hidden="true"><BotPortrait :bot="emptyBot" rest="sleep" /></span>
          <span>没找到，换个词试试</span>
        </div>
        <div class="search-footer" aria-hidden="true">
          <span><kbd>↑</kbd><kbd>↓</kbd> 选择</span>
          <span><kbd>↵</kbd> 打开</span>
          <span><kbd>esc</kbd> 关闭</span>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.search-palette {
  --search-top: min(15vh, 120px);
  position: fixed;
  inset: 0;
  z-index: 100;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: var(--search-top) 16px 16px;
  background: rgba(0, 0, 0, .6);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  color: var(--bz-ink);
  animation: search-fade 160ms ease-out;
}
.search-panel {
  width: min(640px, calc(100vw - 32px));
  max-height: calc(100dvh - var(--search-top) - 16px);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid var(--bz-border);
  border-radius: 16px;
  background: var(--bz-card);
  box-shadow: 0 24px 80px color-mix(in srgb, var(--bz-ink) 20%, transparent),
    0 4px 16px color-mix(in srgb, var(--bz-ink) 8%, transparent);
  animation: search-scale 160ms ease-out;
}
.search-input-row {
  display: flex;
  align-items: center;
  gap: 12px;
  height: 56px;
  flex-shrink: 0;
  padding: 0 16px;
  border-bottom: 1px solid var(--bz-border);
}
.search-icon { width: 20px; height: 20px; flex-shrink: 0; color: var(--bz-text-3); }
.search-input-row input {
  width: 100%;
  min-width: 0;
  height: 100%;
  padding: 0;
  border: 0;
  outline: none;
  background: transparent;
  color: var(--bz-ink);
  font: inherit;
  font-size: 16px;
}
.search-input-row input::placeholder { color: var(--bz-text-3); opacity: 1; }
.search-close { display: grid; place-items: center; flex-shrink: 0; min-width: 32px; height: 40px; color: var(--bz-text-3); cursor: pointer; }
.search-close:focus-visible { outline: 2px solid var(--bz-ink); outline-offset: 1px; border-radius: 4px; }
.search-heading { flex-shrink: 0; padding: 16px 20px 8px; font-size: 12px; line-height: 16px; color: var(--bz-text-3); }
.search-list { min-height: 0; overflow-y: auto; overscroll-behavior: contain; padding: 0 8px 8px; }
.search-item {
  display: flex;
  align-items: center;
  gap: 12px;
  min-height: 60px;
  padding: 8px 12px;
  border-radius: 10px;
  cursor: pointer;
}
.search-item[aria-selected="true"] { background: color-mix(in srgb, var(--bz-ink) 7%, transparent); }
.search-portrait { display: block; width: 32px; height: 32px; flex-shrink: 0; --bz-eye: var(--bz-card); }
.search-portrait :deep(svg), .search-portrait :deep(img),
.search-empty-portrait :deep(svg), .search-empty-portrait :deep(img) { display: block; width: 100%; height: 100%; }
.search-portrait :deep(img) { border-radius: 50%; object-fit: cover; }
.search-copy { display: flex; flex: 1; min-width: 0; flex-direction: column; gap: 2px; }
.search-copy > span { overflow: hidden; white-space: nowrap; text-overflow: ellipsis; }
.search-copy [data-part="name"] { font: 600 14px/20px var(--bz-font-display); color: var(--bz-ink); }
.search-copy [data-part="tagline"] { font-size: 13px; line-height: 18px; color: var(--bz-text-2); }
.search-category { flex-shrink: 0; padding: 1px 6px; border: 1px solid var(--bz-border); border-radius: 5px; font-size: 11px; line-height: 18px; color: var(--bz-text-2); }
.search-return { width: 20px; flex-shrink: 0; color: var(--bz-text-3); }
.search-empty { display: flex; min-height: 180px; flex-direction: column; align-items: center; justify-content: center; gap: 12px; padding: 16px; overflow-y: auto; font-size: 14px; color: var(--bz-text-2); }
.search-empty-portrait { display: block; width: 64px; height: 64px; flex-shrink: 0; --bz-eye: var(--bz-card); }
.search-footer { display: flex; flex-shrink: 0; flex-wrap: wrap; gap: 16px; padding: 10px 20px; border-top: 1px solid var(--bz-border); font-size: 12px; line-height: 20px; color: var(--bz-text-3); }
.search-footer > span { display: inline-flex; align-items: center; gap: 4px; }
kbd { display: inline-flex; align-items: center; justify-content: center; min-width: 20px; height: 20px; padding: 0 4px; border: 1px solid var(--bz-border); border-radius: 4px; background: var(--bz-card); font: inherit; font-size: 12px; line-height: 18px; }
@keyframes search-fade { from { opacity: 0; } to { opacity: 1; } }
@keyframes search-scale { from { transform: scale(.98); } to { transform: scale(1); } }
@media (max-width: 480px) {
  .search-input-row { gap: 8px; padding: 0 12px; }
  .search-item { gap: 8px; padding: 8px; }
  .search-heading { padding-left: 16px; }
  .search-footer { padding-inline: 16px; gap: 12px; }
}
@media (prefers-reduced-motion: reduce) {
  .search-panel { animation: none; }
}
</style>
