<script setup>
import LiveAnnouncer from './LiveAnnouncer.vue'
// 首屏是球池（站名、搜索框、掉下来的真 Bot）；首屏以下的区块（主推、小队、专题、全部 Bot、页尾）都在 HomeSections 里。
// 这个文件只管页面骨架。
import HeroBallpit from './HeroBallpit.vue'
import HomeSections from './HomeSections.vue'
</script>

<template>
  <main class="shelf-page shelf-home">
    <LiveAnnouncer />
    <HeroBallpit />
    <HomeSections />
  </main>
</template>
