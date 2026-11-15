<script setup lang="ts">
import { onMounted, ref } from 'vue'
import DefaultAvatar from './DefaultAvatar.vue'
import { NOT_FOUND } from '../../meta.mjs'
import { avatarColor } from '../avatar'
import { botPalette } from '../color'

const bot = ref<InstanceType<typeof DefaultAvatar>>()
const palette = botPalette(avatarColor('lost-bot'))
onMounted(() => bot.value?.play({ state: 'exclaim' }))
</script>

<template>
  <main id="VPContent" class="shelf-page not-found bz-bot-scope" :style="palette">
    <div class="not-found-stage bz-tile" aria-hidden="true">
      <DefaultAvatar ref="bot" slug="lost-bot" rest="thinking" :size="200" />
    </div>
    <h1>{{ NOT_FOUND.title }}</h1>
    <p>{{ NOT_FOUND.description }}</p>
    <a class="shelf-button primary" href="/">{{ NOT_FOUND.back }}</a>
  </main>
</template>
