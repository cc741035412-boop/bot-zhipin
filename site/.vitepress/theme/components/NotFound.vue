<script setup lang="ts">
import { onMounted, ref } from 'vue'
import DefaultAvatar from './DefaultAvatar.vue'
import { NOT_FOUND } from '../../meta.mjs'

const bot = ref<InstanceType<typeof DefaultAvatar>>()
onMounted(() => bot.value?.play({ state: 'exclaim' }))
</script>

<template>
  <main id="VPContent" class="shelf-page not-found">
    <DefaultAvatar ref="bot" slug="lost-bot" rest="thinking" :size="200" />
    <h1>{{ NOT_FOUND.title }}</h1>
    <p>{{ NOT_FOUND.description }}</p>
    <a class="shelf-button primary" href="/">{{ NOT_FOUND.back }}</a>
  </main>
</template>
