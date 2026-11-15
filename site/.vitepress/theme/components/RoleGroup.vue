<!--
  「全部 Bot」里的一个分组：组头（吉祥物 + 分组名 + 数量）→ 两列卡片 → 展开 / 收起。
  collapsible 为真时先露前 preview 张（两行），其余收在「展开 N 个」后面；选中单个分组时全部展开、没有按钮。
  只多出不到一行的小组不折：为了藏一两张卡多一个按钮不划算，直接全露。
-->
<script setup lang="ts">
import { computed, nextTick, ref, useId } from 'vue'
import BotCard from './BotCard.vue'
import BzIcon from './BzIcon.vue'
import LiveBot from './LiveBot.vue'
import { CATEGORY_MASCOTS, botPalette } from '../color'
import { shapeRadii } from '../face'
import { nextPoke } from '../pitch'
import { isReducedMotion } from '../live/clock'
import { CATEGORY_COPY, SHELF_COPY } from '../../meta.mjs'

const props = defineProps<{ category: string; bots: { slug: string }[]; expanded: boolean; collapsible: boolean; preview: number }>()
const emit = defineEmits<{ toggle: [] }>()

const id = useId()
const root = ref<HTMLElement>()
const more = ref<HTMLButtonElement>()
const hop = ref<HTMLElement>()
const portrait = ref<InstanceType<typeof LiveBot>>()
const hovered = ref(false)
// 刚展开出来的那几张淡入一下；收起、切换筛选都不播。
const revealing = ref(false)
const mascot = computed(() => Object.hasOwn(CATEGORY_MASCOTS, props.category) ? CATEGORY_MASCOTS[props.category] : null)
// 分组说明不直接显示，放在分组名的悬停提示里。
const hint = computed(() => Object.hasOwn(CATEGORY_COPY, props.category) ? (CATEGORY_COPY as Record<string, string>)[props.category] : undefined)
// 两行是 preview 张，所以一行是 preview / 2 张；比两行多出一整行以上才值得折起来。
const foldable = computed(() => props.collapsible && props.bots.length > props.preview + props.preview / 2)
const folded = computed(() => foldable.value && !props.expanded)
const visible = computed(() => folded.value ? props.bots.slice(0, props.preview) : props.bots)
const extra = computed(() => Math.max(0, props.bots.length - props.preview))

// 吉祥物和首屏砖墙里那只一样：悬停睁大眼跳一下，点它是戳。
function enter(event: PointerEvent) {
  if (event.pointerType !== 'mouse') return
  hovered.value = true
  portrait.value?.play({ state: 'wide', hold: Infinity })
  hop.value?.classList.remove('is-speaking')
  if (!isReducedMotion()) {
    void hop.value?.offsetWidth
    hop.value?.classList.add('is-speaking')
  }
}
function leave(event: PointerEvent) { if (event.pointerType === 'mouse') hovered.value = false }
function poke() { portrait.value?.play({ state: nextPoke(`mascot:${props.category}`).state }) }

async function toggle() {
  const button = more.value
  const before = button?.getBoundingClientRect().top ?? 0
  const collapsing = props.expanded
  revealing.value = !collapsing
  emit('toggle')
  await nextTick()
  if (!collapsing || !button || !root.value) return
  // 收起：按钮留在手指底下（上面的卡片收走了多少，页面就跟着回滚多少）；
  // 要是这样组头被顶出了屏幕，就退到组头，别让人不知道自己在哪一组。
  window.scrollBy({ top: button.getBoundingClientRect().top - before, behavior: 'instant' })
  const limit = parseFloat(getComputedStyle(root.value).scrollMarginTop) || 0
  if (root.value.getBoundingClientRect().top < limit) root.value.scrollIntoView({ block: 'start', behavior: 'instant' })
}
</script>

<template>
  <section ref="root" class="role-group" data-testid="role-group" :data-role="category" :data-folded="folded" :aria-labelledby="`${id}-title`">
    <header class="role-head">
      <span v-if="mascot" class="role-tile bz-tile s40 bz-bot-scope" :style="botPalette(mascot.color)" aria-hidden="true" @pointerenter="enter" @pointerleave="leave" @click="poke">
        <span ref="hop" class="role-hop">
          <LiveBot ref="portrait" :radii="shapeRadii(mascot.shape)" :color="mascot.color" :shape-id="mascot.shape" :rest="hovered ? 'wide' : 'idle'" />
        </span>
      </span>
      <h3 :id="`${id}-title`" :title="hint">{{ category }}</h3>
      <span class="bz-count">{{ SHELF_COPY.groupCount(bots.length) }}</span>
    </header>
    <div :id="`${id}-grid`" class="bot-grid" @animationend="revealing = false">
      <BotCard v-for="(bot, index) in visible" :key="bot.slug" :bot="bot" :show-category="false" :class="{ 'is-revealed': revealing && index >= preview }" />
    </div>
    <div v-if="foldable" class="group-more">
      <button ref="more" type="button" class="bz-btn ghost sm" data-testid="group-more" :aria-expanded="expanded" :aria-controls="`${id}-grid`" @click="toggle">
        <BzIcon name="chevron-down" />{{ expanded ? SHELF_COPY.collapse : SHELF_COPY.expand(extra) }}
      </button>
    </div>
  </section>
</template>
