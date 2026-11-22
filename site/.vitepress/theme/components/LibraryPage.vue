<script setup lang="ts">
import { computed, onMounted, onBeforeUnmount, ref, watch } from 'vue'
import { categoriesFor, fieldsFor, listQuery, norm, readQuery, type LibraryCard } from '../library'
import { markFor, tint } from '../library-marks'
import LibraryCopy from './LibraryCopy.vue'
import PromptSnippet from './PromptSnippet.vue'
import LibrarySource from './LibrarySource.vue'
import LibraryTile from './LibraryTile.vue'
import BzIcon from './BzIcon.vue'
const props = defineProps<{ title: 'Prompt'|'Skills'; items: LibraryCard[] }>()
const kind = computed(() => props.title === 'Prompt' ? 'prompt' : 'skill')
const categories = computed(() => categoriesFor(kind.value).filter(c => props.items.some(i => i.category === c)))
const q = ref(''), cat = ref(''), search = ref<HTMLInputElement>()
const index = computed(() => props.items.map(item => ({ item, values: fieldsFor(item) })))
const matches = computed(() => {
  const words = norm(q.value).split(/\s+/).filter(Boolean)
  return index.value.filter(({ values }) => words.every(w => values.some(v => v.includes(w)))).map(row => row.item)
})
const counts = computed(() => matches.value.reduce((acc, i) => acc.set(i.category, (acc.get(i.category) || 0) + 1), new Map<string, number>()))
const visible = computed(() => matches.value.filter(item => !cat.value || item.category === cat.value))
const suffix = computed(() => listQuery(q.value, cat.value))
function writeUrl() {
  if (location.search !== suffix.value) history.replaceState(history.state, '', location.pathname + suffix.value + location.hash)
}
function restore() {
  const state = readQuery(categories.value)
  q.value = state.q; cat.value = state.cat; writeUrl()
}
const pop = () => { if (location.pathname === `/${kind.value}s/`) restore() }
onMounted(() => { restore(); window.addEventListener('popstate', pop) })
onBeforeUnmount(() => window.removeEventListener('popstate', pop))
watch(suffix, writeUrl)
function reset() { q.value = ''; cat.value = ''; search.value?.focus() }
function escape(e: KeyboardEvent) { if (!e.isComposing && e.keyCode !== 229) q.value = '' }
function by(i: LibraryCard) {
  return i.agents?.length ? i.agents[0] + (i.agents.length > 1 ? ` +${i.agents.length - 1}` : '') : i.author.name
}
</script>
<template>
  <main class="ix lib-page" :style="{ '--lib-ambient': cat ? markFor(kind, cat).color : 'transparent' }">
    <aside class="ix-mast">
      <header class="ix-heading"><h1>{{ title }}</h1><p class="bz-count" role="status">共 {{ visible.length }} 条</p></header>
      <label class="bz-search"><BzIcon name="search" :size="18" /><input id="library-search" ref="search" v-model="q" aria-label="搜索" placeholder="搜索" autocomplete="off" @keydown.esc="escape"><kbd aria-hidden="true">/</kbd></label>
      <div class="ix-cats" role="group" aria-label="分类">
        <button v-for="c in ['', ...categories]" :key="c" :data-cat="c" :style="tint(kind, c)" :aria-pressed="cat === c" :class="{ 'is-zero': c && !counts.get(c) }" @click="cat = c">
          <LibraryTile :kind="kind" :category="c" :size="28" /><span>{{ c || '全部' }}</span><small>{{ c ? counts.get(c) || 0 : matches.length }}</small>
        </button>
      </div>
    </aside>
    <section class="ix-list" :aria-label="title">
      <div v-if="visible.length" class="entries">
        <article v-for="i in visible" :key="i.slug" class="ix-row entry" :data-slug="i.slug" :style="tint(kind, i.category)">
          <LibraryTile :kind="kind" :category="i.category" :size="48" />
          <div v-if="kind === 'prompt'" class="ix-prompt">
            <header class="ix-prompt-head">
              <h2>
                <a class="entry-link" :href="i.detailUrl + suffix">{{ i.title }}<BzIcon name="arrow-right" class="ix-row-go" /></a>
                <LibrarySource v-if="!i.hasBody" class="bz-tag outline source-link" :href="i.source.url" aria-label="查看原文">仅摘要</LibrarySource>
              </h2>
              <span class="ix-row-by">{{ i.author.name }}</span>
              <LibraryCopy v-if="i.copyText" class="sm" compact :value="i.copyText" :target="`snip-${i.slug}`" />
            </header>
            <span class="bz-sr-only">{{ i.category }}</span><p>{{ i.purpose }}</p>
            <PromptSnippet v-if="i.copyText" :id="`snip-${i.slug}`" :text="i.copyText" />
          </div>
          <template v-else>
            <div><h2><a class="entry-link" :href="i.detailUrl + suffix">{{ i.title }}</a><code v-if="i.name">{{ i.name }}</code></h2><span class="bz-sr-only">{{ i.category }}</span><p>{{ i.purpose }}</p></div>
            <span class="ix-row-by" :title="i.agents?.join('、')">{{ by(i) }}</span><BzIcon name="arrow-right" class="ix-row-go" />
          </template>
        </article>
      </div>
      <div v-else class="bz-empty lib-empty"><span class="bz-tile s72"><BzIcon name="search" :size="28" /></span><h2>没有找到</h2><button class="bz-btn" @click="reset">看看全部</button></div>
    </section>
  </main>
</template>
