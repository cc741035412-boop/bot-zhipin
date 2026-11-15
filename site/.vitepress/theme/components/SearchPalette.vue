<!--
  搜索命令面板：⌘K / Ctrl+K、「/」或 window 事件 bz-search-open 打开。
  关着的时候不渲染任何东西（SSR 也是），所以条目里的 LiveBot 只在打开期间存在。
-->
<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vitepress'
import { data as bots } from '../../data/bots.data.mjs'
import { SHELF_COPY } from '../../meta.mjs'
import { searchBots } from '../search'
import { avatarColor } from '../avatar'
import { faceColors } from '../face'
import BotPortrait from './BotPortrait.vue'

interface PaletteBot {
  slug: string
  name: string
  tagline: string
  category: string
  addedAt: string
  avatar: string | null
  detailUrl: string
}

// 一次最多列 8 条：再多就该接着输入，而不是往下翻。
const LIMIT = 8
const LIST_ID = 'bz-search-list'
const optionId = (slug: string) => `bz-search-option-${slug}`
// 空状态里睡着的那只：固定 slug，种子配色算出来是蓝色（货架空状态的 empty-shelf 是红色，放在这里像报错）。
const SLEEPER = { slug: 'search-empty', name: '', avatar: null }

// 键帽里的箭头用 SVG 画：各系统字体里的 ↑ ↓ ↵ 粗细、宽度都不一样。
const GLYPHS = {
  up: 'M8 12.5v-9M4.5 7 8 3.5 11.5 7',
  down: 'M8 3.5v9M4.5 9 8 12.5 11.5 9',
  enter: 'M12.5 3.5v4a2 2 0 0 1-2 2H3M6 6.5l-3 3 3 3',
} as const
const HINTS = [
  { keys: ['up', 'down'], label: '选择' },
  { keys: ['enter'], label: '打开' },
  { keys: ['esc'], label: '关闭' },
] as const

// 没输入时列的是「全部 Bot」，顺序和货架的「最新」一致：新上架的在前。
const byName = new Intl.Collator('zh-CN')
const shelf: PaletteBot[] = [...(bots as PaletteBot[])].sort((a, b) =>
  String(b.addedAt).localeCompare(String(a.addedAt)) || byName.compare(a.name, b.name))

const router = useRouter()
const route = useRoute()
const open = ref(false)
const query = ref('')
const active = ref(0)
const panel = ref<HTMLElement>()
const input = ref<HTMLInputElement>()
const scroller = ref<HTMLElement>()

const matches = computed(() => searchBots(shelf, query.value, Infinity))
const results = computed(() => matches.value.slice(0, LIMIT))
const more = computed(() => matches.value.length - results.value.length)
const typed = computed(() => query.value.trim() !== '')
const activeId = computed(() => {
  const bot = results.value[active.value]
  return bot ? optionId(bot.slug) : undefined
})
const emptyText = computed(() => typed.value ? '没找到，换个词试试' : '货架上还没有 Bot')
/** 念给读屏用户听的结果数。这个节点一直在，只换文字，读屏才会稳定播报。 */
const status = computed(() => {
  const total = matches.value.length
  if (!total) return emptyText.value
  return `${typed.value ? '找到' : '共'} ${total} 个 Bot${more.value > 0 ? `，列出前 ${LIMIT} 个` : ''}`
})

/** 分类标签染上 Bot 自己的颜色；自定义头像没有 Bot 色，用中性灰（CSS 里的回退值）。 */
function tint(bot: PaletteBot) {
  if (bot.avatar) return undefined
  const { light, dark } = faceColors(avatarColor(bot.slug))
  return { '--sp-tint-light': light, '--sp-tint-dark': dark }
}

let opener: HTMLElement | null = null
let unlock: (() => void) | null = null

function lockScroll() {
  const { body, documentElement } = document
  const before = { overflow: body.style.overflow, paddingRight: body.style.paddingRight }
  // 滚动条占位置的系统（Windows 等）：补上它的宽度，页面不会在面板背后横跳。
  const gutter = window.innerWidth - documentElement.clientWidth
  if (gutter > 0) body.style.paddingRight = `${parseFloat(getComputedStyle(body).paddingRight) + gutter}px`
  body.style.overflow = 'hidden'
  return () => {
    body.style.overflow = before.overflow
    body.style.paddingRight = before.paddingRight
  }
}

function show() {
  if (open.value) return
  opener = document.activeElement instanceof HTMLElement ? document.activeElement : null
  query.value = ''
  active.value = 0
  unlock = lockScroll()
  open.value = true
  void nextTick(() => input.value?.focus({ preventScroll: true }))
}

function hide() {
  if (!open.value) return
  open.value = false
  unlock?.()
  unlock = null
  const target = opener
  opener = null
  if (target?.isConnected) target.focus({ preventScroll: true })
}

function choose(index: number) {
  const bot = results.value[index]
  if (!bot) return
  hide()
  void router.go(bot.detailUrl)
}

function move(step: number) {
  const count = results.value.length
  if (!count) return
  active.value = (active.value + step + count) % count
  void nextTick(() => {
    if (activeId.value) document.getElementById(activeId.value)?.scrollIntoView({ block: 'nearest' })
  })
}

// sync：同一次输入里先归零再渲染，不会闪一帧旧的选中项。
watch(query, () => {
  active.value = 0
  if (scroller.value) scroller.value.scrollTop = 0
}, { flush: 'sync' })
// 浏览器前进、后退换了页面：面板跟着收起。
watch(() => route.path, hide)

function isTyping(target: EventTarget | null) {
  return target instanceof HTMLElement
    && (target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName))
}

function onKeydown(event: KeyboardEvent) {
  // 输入法选字时的回车、Esc 归输入法管（Safari 只给 keyCode 229）。
  if (event.isComposing || event.keyCode === 229) return
  const mod = event.metaKey || event.ctrlKey
  if (mod && !event.altKey && !event.shiftKey && event.key.toLowerCase() === 'k') {
    event.preventDefault()
    if (open.value) hide()
    else show()
    return
  }
  if (!open.value) {
    if (event.key === '/' && !mod && !event.altKey && !isTyping(event.target)) {
      event.preventDefault()
      show()
    }
    return
  }
  switch (event.key) {
    case 'Escape':
      event.preventDefault()
      hide()
      break
    case 'ArrowDown':
    case 'ArrowUp':
      event.preventDefault()
      move(event.key === 'ArrowDown' ? 1 : -1)
      break
    case 'Enter':
      // 焦点在「esc」按钮上时，回车按的是那个按钮。
      if (event.target === input.value) {
        event.preventDefault()
        choose(active.value)
      }
      break
    case 'Tab': {
      // 面板里能停焦点的只有输入框和「esc」按钮，在它们之间循环。
      event.preventDefault()
      const stops = Array.from(panel.value?.querySelectorAll<HTMLElement>('input, button') ?? [])
      const at = stops.indexOf(document.activeElement as HTMLElement)
      stops[(at + (event.shiftKey ? -1 : 1) + stops.length) % stops.length]?.focus()
      break
    }
  }
}

/** 焦点被别的脚本带到面板外面时，拉回输入框。 */
function onFocusin(event: FocusEvent) {
  if (open.value && panel.value && !panel.value.contains(event.target as Node)) {
    input.value?.focus({ preventScroll: true })
  }
}

/** 点面板里不可交互的地方（条目、小标题、提示条）不抢走输入框的焦点。 */
function keepFocus(event: MouseEvent) {
  if (!(event.target as Element).closest('input, button')) event.preventDefault()
}

// 只有按下和松开都落在遮罩上才算「点遮罩」：在输入框里拖选文字、拖出面板再松手不会误关。
let pressedBackdrop = false
function onBackdropDown(event: PointerEvent) {
  pressedBackdrop = event.target === event.currentTarget
}
function onBackdropClick(event: MouseEvent) {
  if (pressedBackdrop && event.target === event.currentTarget) hide()
  pressedBackdrop = false
}

function onHover(event: PointerEvent, index: number) {
  // 用 pointermove 而不是 mouseenter：键盘翻页让列表滚动时，停着不动的鼠标不会抢走选中项。
  if (event.pointerType !== 'touch' && active.value !== index) active.value = index
}

onMounted(() => {
  window.addEventListener('keydown', onKeydown)
  window.addEventListener('bz-search-open', show)
  document.addEventListener('focusin', onFocusin)
})
onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeydown)
  window.removeEventListener('bz-search-open', show)
  document.removeEventListener('focusin', onFocusin)
  hide()
})
</script>

<template>
  <Teleport v-if="open" to="body">
    <div
      class="sp" data-testid="search-palette" role="dialog" aria-modal="true" aria-label="搜索 Bot"
      @pointerdown="onBackdropDown" @click="onBackdropClick"
    >
      <div ref="panel" class="sp-panel" data-testid="search-panel" @mousedown="keepFocus">
        <div class="sp-field">
          <span class="sp-glass" aria-hidden="true">
            <svg viewBox="0 0 20 20" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round">
              <circle cx="9" cy="9" r="5.5" /><path d="m13.2 13.2 3.3 3.3" />
            </svg>
          </span>
          <input
            ref="input" v-model="query" class="sp-input" data-testid="search-input" type="text"
            role="combobox" aria-label="搜索 Bot" aria-expanded="true" aria-haspopup="listbox" aria-autocomplete="list"
            :aria-controls="LIST_ID" :aria-activedescendant="activeId"
            :placeholder="SHELF_COPY.searchPlaceholder"
            autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" enterkeyhint="go"
          >
          <button type="button" class="sp-esc" aria-label="关闭搜索" @click="hide"><kbd class="sp-key">esc</kbd></button>
        </div>

        <!-- 小标题在滚动区外面：列表滚动时它不会被切掉半行。 -->
        <div v-if="results.length" class="sp-heading">{{ typed ? '结果' : '全部 Bot' }}</div>
        <div ref="scroller" class="sp-scroll">
          <div :id="LIST_ID" class="sp-list" role="listbox" :aria-label="typed ? '结果' : '全部 Bot'">
            <div
              v-for="(bot, index) in results" :id="optionId(bot.slug)" :key="bot.slug"
              class="sp-item" data-testid="search-item" :data-slug="bot.slug" :style="tint(bot)"
              role="option" :aria-selected="index === active"
              @pointermove="onHover($event, index)" @click="choose(index)"
            >
              <span class="sp-face" aria-hidden="true">
                <BotPortrait :bot="bot" :rest="index === active ? 'wide' : 'idle'" />
              </span>
              <span class="sp-text">
                <span data-part="name">{{ bot.name }}</span>
                <span data-part="tagline">{{ bot.tagline }}</span>
              </span>
              <span class="sp-tag">{{ bot.category }}</span>
              <span class="sp-enter" aria-hidden="true">
                <kbd class="sp-key"><svg class="sp-glyph" viewBox="0 0 16 16"><path :d="GLYPHS.enter" /></svg></kbd>
              </span>
            </div>
          </div>
          <p v-if="more > 0" class="sp-more">还有 {{ more }} 个</p>
          <div v-if="!results.length" class="sp-empty" data-testid="search-empty">
            <span class="sp-sleeper" aria-hidden="true"><BotPortrait :bot="SLEEPER" rest="sleep" /></span>
            <span>{{ emptyText }}</span>
          </div>
        </div>
        <p class="sp-sr" role="status">{{ status }}</p>

        <div class="sp-foot" aria-hidden="true">
          <span v-for="hint in HINTS" :key="hint.label" class="sp-hint">
            <kbd v-for="key in hint.keys" :key="key" class="sp-key">
              <template v-if="key === 'esc'">esc</template>
              <svg v-else class="sp-glyph" viewBox="0 0 16 16"><path :d="GLYPHS[key]" /></svg>
            </kbd>
            {{ hint.label }}
          </span>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
/*
  颜色全部走主题 token（--bz-*），浅色、深色跟着主题走。
  只有遮罩和面板投影写死黑色：它们是压在页面上的暗层，两种主题下都该是黑的。
*/
.sp {
  --sp-top: min(15vh, 120px);
  position: fixed;
  inset: 0;
  z-index: 200;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: var(--sp-top) 16px 16px;
  background: rgba(0, 0, 0, .6);
  -webkit-backdrop-filter: blur(4px);
  backdrop-filter: blur(4px);
  color: var(--bz-ink);
  font-size: 14px;
  line-height: 20px;
  text-align: left;
  -webkit-tap-highlight-color: transparent;
  animation: sp-fade 160ms ease-out;
}
.sp-panel {
  flex: none;
  display: flex;
  flex-direction: column;
  width: min(640px, calc(100vw - 32px));
  max-height: calc(100vh - var(--sp-top) - 16px);
  max-height: calc(100dvh - var(--sp-top) - 16px);
  overflow: hidden;
  border: 1px solid var(--bz-border);
  border-radius: 16px;
  background: var(--bz-card);
  box-shadow: 0 32px 80px -16px rgba(0, 0, 0, .5), 0 12px 28px -12px rgba(0, 0, 0, .3);
  animation: sp-rise 160ms cubic-bezier(.2, .9, .3, 1);
}

/* 输入行：放大镜占一个头像的宽度，输入的字和下面条目的名字左对齐。 */
.sp-field {
  flex: none;
  display: flex;
  align-items: center;
  gap: 12px;
  height: 56px;
  padding: 0 12px 0 18px;
  border-bottom: 1px solid var(--bz-border);
}
.sp-glass { flex: none; display: grid; place-items: center; width: 32px; color: var(--bz-text-3); }
.sp-input {
  flex: 1;
  min-width: 0;
  height: 100%;
  padding: 0;
  border: 0;
  outline: none;
  background: transparent;
  color: var(--bz-ink);
  font: inherit;
  font-size: 16px;
  line-height: 24px;
}
.sp-input::placeholder { color: var(--bz-text-3); opacity: 1; }
.sp-esc { flex: none; display: grid; place-items: center; min-width: 40px; height: 36px; border-radius: 8px; cursor: pointer; }
.sp-esc:hover .sp-key { color: var(--bz-ink); }
.sp-esc:focus-visible { outline: 2px solid var(--bz-ink); outline-offset: -2px; }

.sp-key {
  display: inline-grid;
  place-items: center;
  min-width: 20px;
  height: 20px;
  padding: 0 5px;
  border: 1px solid color-mix(in srgb, var(--bz-ink) 14%, transparent);
  border-radius: 4px;
  background: color-mix(in srgb, var(--bz-ink) 3%, transparent);
  box-shadow: 0 1px 0 color-mix(in srgb, var(--bz-ink) 8%, transparent);
  color: var(--bz-text-3);
  font: 500 11px/1 var(--vp-font-family-base);
  letter-spacing: .02em;
}
.sp-glyph { display: block; width: 12px; height: 12px; margin: 0 -2px; fill: none; stroke: currentColor; stroke-width: 1.5; stroke-linecap: round; stroke-linejoin: round; }

.sp-scroll {
  flex: 0 1 auto;
  min-height: 0;
  overflow-y: auto;
  overscroll-behavior: contain;
  scroll-padding-block: 8px;
  scrollbar-width: thin;
  scrollbar-color: color-mix(in srgb, var(--bz-ink) 18%, transparent) transparent;
}
.sp-heading { flex: none; padding: 14px 18px 6px; font-size: 12px; line-height: 16px; color: var(--bz-text-3); }
.sp-list { padding: 0 8px 8px; }

.sp-item {
  --sp-tint: var(--sp-tint-light);
  display: flex;
  align-items: center;
  gap: 12px;
  min-height: 56px;
  padding: 8px 10px;
  border-radius: 10px;
  cursor: pointer;
}
.dark .sp-item { --sp-tint: var(--sp-tint-dark); }
.sp-item + .sp-item { margin-top: 2px; }
.sp-item[aria-selected="true"] { background: color-mix(in srgb, var(--bz-ink) 7%, transparent); }

/*
  LiveBot 的画布（viewBox ±112）四周只留一圈放动效的余量，身体约占 89%。
  画布放到 36px 并居中，身体正好撑满 32px 的头像位；溢出的 2px 在行内留白里。
*/
.sp-face { position: relative; flex: none; width: 32px; height: 32px; }
.sp-face :deep(svg) { position: absolute; top: -2px; left: -2px; width: 36px; height: 36px; pointer-events: none; }
.sp-face :deep(img) { display: block; width: 100%; height: 100%; border: 1px solid var(--bz-border); border-radius: 50%; object-fit: cover; }
.sp-item[aria-selected="true"] .sp-face { animation: sp-hop 360ms var(--bz-ease-pop); }

.sp-text { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 2px; }
.sp-text > span { overflow: hidden; white-space: nowrap; text-overflow: ellipsis; }
.sp-text [data-part="name"] { font: 600 14px/20px var(--bz-font-display); color: var(--bz-ink); }
.sp-text [data-part="tagline"] { font-size: 13px; line-height: 18px; color: var(--bz-text-2); }

.sp-tag {
  flex: none;
  padding: 0 8px;
  border-radius: 999px;
  background: color-mix(in srgb, var(--sp-tint, var(--bz-text-3)) 16%, transparent);
  color: var(--bz-text-2);
  font: 600 11px/20px var(--bz-font-display);
  white-space: nowrap;
}
/* 「↵」的位置一直留着，选中项换来换去时分类标签不会左右跳。 */
.sp-enter { flex: none; display: grid; visibility: hidden; }
.sp-item[aria-selected="true"] .sp-enter { visibility: visible; }

.sp-more { margin: 0; padding: 0 18px 12px; font-size: 12px; line-height: 16px; color: var(--bz-text-3); }
.sp-empty { display: flex; flex-direction: column; align-items: center; gap: 10px; padding: 16px 16px 36px; color: var(--bz-text-2); }
/*
  睡着的 Bot 是一颗上下弹的小球，一有输入会惊醒成「!」再睡回去。
  画布 94px（viewBox ±112）：小球 13px、「!」53px；只给它留 72px 的行高，画布透明的余量叠在上下留白里。
*/
.sp-sleeper { position: relative; display: block; width: 72px; height: 72px; }
.sp-sleeper :deep(svg) { position: absolute; top: -11px; left: -11px; width: 94px; height: 94px; pointer-events: none; }
/* 地上的影子：小球悬在它上面弹，「!」正好站在它上面。用 ::before，画在 Bot 下面。 */
.sp-sleeper::before {
  content: '';
  position: absolute;
  left: calc(50% - 16px);
  top: 59px;
  width: 32px;
  height: 7px;
  border-radius: 50%;
  background: radial-gradient(ellipse, color-mix(in srgb, var(--bz-ink) 16%, transparent), transparent 70%);
}
/* 深色主题的 ink 是亮色，拿来当影子会发白；换成比面板更暗的页面底色。 */
.dark .sp-sleeper::before { background: radial-gradient(ellipse, var(--bz-page), transparent 70%); }

.sp-sr {
  position: absolute; width: 1px; height: 1px; margin: -1px; padding: 0;
  overflow: hidden; clip-path: inset(50%); white-space: nowrap; border: 0;
}

.sp-foot {
  flex: none;
  display: flex;
  align-items: center;
  gap: 16px;
  height: 40px;
  padding: 0 18px;
  border-top: 1px solid var(--bz-border);
  background: color-mix(in srgb, var(--bz-ink) 2.5%, transparent);
  color: var(--bz-text-3);
  font-size: 12px;
  line-height: 16px;
  white-space: nowrap;
}
.sp-hint { display: inline-flex; align-items: center; gap: 4px; }
.sp-hint .sp-key:last-of-type { margin-right: 2px; }

@keyframes sp-fade { from { opacity: 0; } }
@keyframes sp-rise { from { transform: scale(.98); } }
@keyframes sp-hop {
  40% { transform: translateY(-2px) scale(1.12); }
  70% { transform: translateY(0) scale(.97); }
}

@media (max-width: 480px) {
  .sp-field { padding: 0 8px 0 14px; gap: 10px; }
  .sp-heading, .sp-foot { padding-inline: 14px; }
  .sp-more { padding-inline: 14px; }
  .sp-list { padding-inline: 6px; }
  .sp-item { gap: 10px; padding-inline: 8px; }
}
@media (pointer: coarse) {
  .sp-esc { min-width: 44px; height: 44px; }
}
@media (prefers-reduced-motion: reduce) {
  .sp-panel, .sp-item[aria-selected="true"] .sp-face { animation: none; }
  /* 减少动效时 LiveBot 停在醒着的静态脸，比小球大得多：画布缩一号，去掉给小球配的影子。 */
  .sp-sleeper :deep(svg) { top: -1px; left: -1px; width: 74px; height: 74px; }
  .sp-sleeper::before { display: none; }
}
</style>
