<!--
  「全部 Bot」的工具栏：左边分组切换（全部 + 货架上有的分组，各带数量），右边排序（推荐 / 最新 / 最热）。
  吸在导航条下面；吸住以后 data-stuck="true"，样式换成玻璃底。两组都是带 aria-pressed 的按钮，单选。
-->
<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import BzIcon from './BzIcon.vue'
import RoleMascot from './RoleMascot.vue'
import { SHELF_COPY } from '../../meta.mjs'
import { ALL_ROLES, type ShelfSort } from '../shelf'

const props = defineProps<{
  tabs: { category: string; count: number }[]
  total: number
  role: string
  sort: ShelfSort
}>()
defineEmits<{ role: [value: string]; sort: [value: ShelfSort] }>()

const SORTS: { value: ShelfSort; label: string }[] = [
  { value: 'rec', label: SHELF_COPY.sortRec },
  { value: 'new', label: SHELF_COPY.sortNew },
  { value: 'hot', label: SHELF_COPY.sortHot },
]
const bar = ref<HTMLElement>()
const tabsEl = ref<HTMLElement>()
const stuck = ref(false)
// 分组放不下时自己横向滑动：哪一头还有内容，哪一头就渐隐。
const fade = ref<'none' | 'left' | 'right' | 'both'>('none')
let frame = 0

function measureFade() {
  const el = tabsEl.value
  if (!el) return
  const left = el.scrollLeft > 1, right = el.scrollLeft + el.clientWidth < el.scrollWidth - 1
  fade.value = left && right ? 'both' : left ? 'left' : right ? 'right' : 'none'
}
/**
 * 吸住了没有：吸顶的那个元素（手机上是分组那一条，其余是整条工具栏）顶边到了 CSS 的 top 就算。
 * 每次滚动量一下，一帧最多一次；不用 IntersectionObserver，是因为跳着滚（锚点、刷新后恢复位置）时它收不到通知。
 */
function measureStuck() {
  const sticky = tabsEl.value && getComputedStyle(tabsEl.value).position === 'sticky' ? tabsEl.value : bar.value
  if (!sticky) return
  stuck.value = sticky.getBoundingClientRect().top <= (parseFloat(getComputedStyle(sticky).top) || 0) + .5
}
function schedule() {
  if (frame) return
  frame = requestAnimationFrame(() => { frame = 0; measureStuck(); measureFade() })
}
/** 选中的分组滑到看得见的地方（只动这一条自己的横向滚动，不带着页面跑）。 */
function reveal() {
  const el = tabsEl.value, tab = el?.querySelector<HTMLElement>('[aria-pressed="true"]')
  if (!el || !tab) return
  const pad = 32, left = tab.offsetLeft, right = left + tab.offsetWidth
  if (left - pad < el.scrollLeft) el.scrollLeft = Math.max(0, left - pad)
  else if (right + pad > el.scrollLeft + el.clientWidth) el.scrollLeft = right + pad - el.clientWidth
}
watch(() => props.role, () => nextTick(() => { reveal(); measureFade() }))
onMounted(() => {
  measureStuck()
  reveal()
  measureFade()
  window.addEventListener('scroll', schedule, { passive: true })
  window.addEventListener('resize', schedule, { passive: true })
})
onBeforeUnmount(() => {
  cancelAnimationFrame(frame)
  window.removeEventListener('scroll', schedule)
  window.removeEventListener('resize', schedule)
})
</script>

<template>
  <div ref="bar" class="shelf-toolbar" :data-stuck="stuck">
    <div ref="tabsEl" class="bz-seg free role-tabs" role="group" :aria-label="SHELF_COPY.roleLabel" :data-fade="fade" @scroll.passive="measureFade">
      <button type="button" data-testid="role-tab" :data-role="ALL_ROLES" :aria-pressed="role === ALL_ROLES" @click="$emit('role', ALL_ROLES)">
        <BzIcon name="grid" /><span>{{ SHELF_COPY.allRoles }}</span><span class="tab-count">{{ total }}</span>
      </button>
      <button v-for="tab in tabs" :key="tab.category" type="button" data-testid="role-tab" :data-role="tab.category" :aria-pressed="role === tab.category" @click="$emit('role', tab.category)">
        <RoleMascot :category="tab.category" :size="16" /><span>{{ tab.category }}</span><span class="tab-count">{{ tab.count }}</span>
      </button>
    </div>
    <div class="bz-seg sort-seg" role="group" :aria-label="SHELF_COPY.sortLabel">
      <button v-for="item in SORTS" :key="item.value" type="button" :data-testid="`sort-${item.value}`" :aria-pressed="sort === item.value" @click="$emit('sort', item.value)">{{ item.label }}</button>
    </div>
  </div>
</template>
