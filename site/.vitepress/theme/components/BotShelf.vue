<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { SITE, HERO_MASCOTS } from '../../meta.mjs'
import HeroPortrait from './HeroPortrait.vue'
import SearchTrigger from './SearchTrigger.vue'
import { enterHero } from '../live/reactions'
import LiveAnnouncer from './LiveAnnouncer.vue'
// 首屏以下的区块（主推、小队、专题、全部 Bot、页尾）都在 HomeSections 里；这个文件只管页面骨架和首屏。
import HomeSections from './HomeSections.vue'

const hero = ref()
let releaseEntry
onMounted(() => {
  releaseEntry = enterHero([...hero.value.querySelectorAll('[data-testid="live-bot"]')])
})
onBeforeUnmount(() => { releaseEntry?.() })
</script>

<template>
  <main class="shelf-page shelf-home">
    <LiveAnnouncer />
    <!-- 极光是独立的装饰层：文字的祖先元素上不放任何背景图。 -->
    <div class="hero-aurora" aria-hidden="true"><i /><i /><i /><i /></div>
    <header class="shelf-intro">
      <div ref="hero" class="hero-portraits" aria-hidden="true">
        <HeroPortrait v-for="mascot in HERO_MASCOTS" :key="mascot.key" :mascot="mascot" />
      </div>
      <h1>{{ SITE.name }}</h1>
      <SearchTrigger class="hero-search" data-testid="search-trigger" />
    </header>
    <HomeSections />
  </main>
</template>
