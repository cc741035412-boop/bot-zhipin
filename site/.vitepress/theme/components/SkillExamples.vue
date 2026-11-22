<script setup lang="ts">
import type { LibraryItem } from '../library'
import BzIcon from './BzIcon.vue'
import ExampleText from './ExampleText.vue'
import LibraryCopy from './LibraryCopy.vue'
import LibrarySource from './LibrarySource.vue'
defineProps<{ slug: string; examples: NonNullable<LibraryItem['examples']> }>()
const imageUrl = (file: string) => `/media/skills/${file}`
</script>
<template>
  <section class="ix-sec ix-examples"><header><h2>示例</h2></header>
    <div v-for="(e, i) in examples" :key="i" class="ix-example">
      <p class="ix-text">{{ e.caption }}</p>
      <div v-if="e.ask" class="ix-ask">
        <LibraryCopy compact class="sm" :track="{ name: 'skill_copy', slug, props: { what: 'example', index: i } }" :value="e.askZh ?? e.ask" :target="`ask-${i}`" />
        <ExampleText :id="`ask-${i}`" :text="e.askZh ?? e.ask" :lines="6" />
      </div>
      <div v-if="e.reply" class="ix-sheet ix-reply">
        <span v-if="e.excerpt" class="bz-tag outline">节选</span>
        <ExampleText :id="`reply-${i}`" :text="e.replyZh ?? e.reply" :lines="8" />
      </div>
      <details v-if="e.askZh || e.replyZh" class="ix-original"><summary>英文原文</summary>
        <div v-if="e.ask" class="ix-sheet" lang="en">{{ e.ask }}</div>
        <div v-if="e.reply" class="ix-sheet" lang="en">{{ e.reply }}</div>
      </details>
      <a v-for="img in e.images" :key="img.file" :href="imageUrl(img.file)" target="_blank" rel="noopener noreferrer"><img :src="imageUrl(img.file)" :alt="img.alt" :width="img.width" :height="img.height" loading="lazy" /></a>
      <div v-if="e.video || e.file" class="ix-example-links">
        <a v-if="e.video" class="bz-btn sm" :href="e.video" target="_blank" rel="noopener noreferrer"><BzIcon name="play" />看演示视频</a>
        <a v-if="e.file" class="bz-btn sm" :href="e.file" target="_blank" rel="noopener noreferrer"><BzIcon name="file" />看示例文件</a>
      </div>
      <footer><LibrarySource class="ext" :href="e.source.url">{{ e.source.name }}</LibrarySource> · {{ e.rights }}</footer>
    </div>
  </section>
</template>
