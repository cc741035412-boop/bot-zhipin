<script setup lang="ts">
import { computed, onMounted, onBeforeUnmount, ref } from 'vue'
import { categoriesFor, listQuery, readQuery, type LibraryItem } from '../library'
import { tint } from '../library-marks'
import LibraryTile from './LibraryTile.vue'
import LibraryCopy from './LibraryCopy.vue'
import LibrarySource from './LibrarySource.vue'
import BzIcon from './BzIcon.vue'
const props = defineProps<{ item: LibraryItem }>()
const summaryOnly = computed(() => props.item.kind === 'prompt' && !props.item.hasBody)
const suffix = ref('')
function restore() { const {q, cat} = readQuery(categoriesFor(props.item.kind)); suffix.value = listQuery(q, cat) }
onMounted(() => { restore(); window.addEventListener('popstate', restore) })
onBeforeUnmount(() => window.removeEventListener('popstate', restore))
</script>
<template>
  <main class="ix ix-detail lib-page" :style="{ ...tint(item.kind, item.category), '--lib-ambient': 'var(--c)' }">
    <aside class="ix-mast">
      <a class="bz-btn ghost ix-back" :href="`/${item.kind}s/${suffix}`"><BzIcon name="arrow-left" />返回</a>
      <LibraryTile class="ix-id" :kind="item.kind" :category="item.category" :size="96" />
      <div class="ix-actions">
        <LibraryCopy v-if="item.body" class="primary block lg" :value="item.body" target="body" />
        <LibrarySource class="bz-btn block lg" :class="{ primary: summaryOnly }" :href="item.source.url" />
      </div>
      <dl class="ix-meta">
        <div v-if="item.agents"><dt>能用在</dt><dd>{{ item.agents.join('、') }}</dd></div>
        <div><dt>作者</dt><dd><LibrarySource v-if="item.author.url" class="ext" :href="item.author.url">{{ item.author.name }}</LibrarySource><template v-else>{{ item.author.name }}</template></dd></div>
        <div><dt>许可证</dt><dd><LibrarySource v-if="item.licenseUrl" class="ext" :href="item.licenseUrl">{{ item.license }}</LibrarySource><template v-else>{{ item.license }}</template><small v-if="item.copyright">{{ item.copyright }}</small></dd></div>
        <div><dt>收录</dt><dd><time>{{ item.addedAt }}</time></dd></div>
      </dl>
    </aside>
    <article class="ix-read">
      <header class="ix-title">
        <p class="ix-kicker"><span class="ix-cat">{{ item.category }}</span><em v-if="summaryOnly" class="bz-tag outline">仅摘要</em></p>
        <h1>{{ item.title }}</h1><p v-if="item.titleOriginal" class="ix-orig">{{ item.titleOriginal }}</p><p v-if="item.name" class="ix-orig"><code>{{ item.name }}</code></p>
        <p class="ix-lead">{{ item.purpose }}</p>
      </header>
      <div class="ix-body">
        <section v-if="item.install?.length" class="ix-sec"><header><h2>安装</h2></header>
          <div v-for="(s,n) in item.install" :key="n" class="ix-term"><header><span>{{ s.agent }}</span><LibraryCopy class="sm" :class="{ primary: !n }" :value="s.command" :target="`command-${n}`" /></header>
            <pre><code :id="`command-${n}`" v-text="s.command" /></pre><p v-if="s.note">{{ s.note }}</p>
          </div>
        </section>
        <section v-if="item.requires?.length" class="ix-sec"><header><h2>运行依赖</h2></header><ul class="ix-points"><li v-for="r in item.requires" :key="r">{{ r }}</li></ul></section>
        <section v-if="item.summary" class="ix-sec"><header><h2>摘要</h2></header>
          <div v-if="summaryOnly" class="ix-sheet is-summary"><p>{{ item.summary }}</p><footer>{{ item.source.name }} · <LibrarySource class="ext ix-link" :href="item.source.url" /></footer></div>
          <p v-else class="ix-text">{{ item.summary }}</p>
        </section>
        <section class="ix-sec"><header><h2>适用场景</h2></header><ul class="ix-points"><li v-for="s in item.scenarios" :key="s">{{ s }}</li></ul></section>
        <section v-if="item.body" class="ix-sec"><header><h2>正文</h2><LibraryCopy class="sm ghost" :value="item.body" target="body" /></header><div id="body" class="ix-sheet" :lang="item.lang" v-text="item.body" /></section>
        <section v-if="item.usage" class="ix-sec"><header><h2>怎么用</h2></header><p class="ix-text">{{ item.usage }}</p></section>
        <section v-if="!summaryOnly" class="ix-sec"><header><h2>来源</h2></header><p class="ix-text"><LibrarySource class="ext ix-link" :href="item.source.url">{{ item.source.name }}</LibrarySource></p></section>
      </div>
    </article>
  </main>
</template>
