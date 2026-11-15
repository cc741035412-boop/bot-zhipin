<script setup lang="ts">
import { onMounted, ref } from 'vue'
import DefaultAvatar from './DefaultAvatar.vue'
import BzIcon from './BzIcon.vue'
import { NOT_FOUND } from '../../meta.mjs'
import { avatarColor } from '../avatar'
import { botPalette } from '../color'

const bot = ref<InstanceType<typeof DefaultAvatar>>()
const palette = botPalette(avatarColor('lost-bot'))
onMounted(() => bot.value?.play({ state: 'exclaim' }))
</script>

<template>
  <main id="VPContent" class="shelf-page not-found bz-bot-scope" :style="palette">
    <div class="not-found-stage bz-tile s120" aria-hidden="true">
      <DefaultAvatar ref="bot" slug="lost-bot" rest="thinking" :size="96" />
    </div>
    <p class="not-found-code" aria-hidden="true">404</p>
    <h1>{{ NOT_FOUND.title }}</h1>
    <a class="bz-btn" href="/"><BzIcon name="arrow-left" />{{ NOT_FOUND.back }}</a>
  </main>
</template>
