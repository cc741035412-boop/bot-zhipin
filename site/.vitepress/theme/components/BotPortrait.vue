<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import DefaultAvatar from './DefaultAvatar.vue'
import { avatarColor } from '../avatar'
import type { StateId } from '../vendor/bloub/states'
import type { Play } from '../live/playback'
const props = defineProps<{ bot: { slug: string; name: string; avatar: string | null }; rest?: StateId; look?: { yaw: number; pitch: number } | null }>()
const live = ref<InstanceType<typeof DefaultAvatar>>()
const failed = ref(false)
const image = ref<HTMLImageElement>()
// SSR 图片可能早于 hydration 失败，挂载后补查一次，不能只等 error 事件。
onMounted(() => { if (image.value?.complete && !image.value.naturalWidth) failed.value = true })
watch(() => props.bot.avatar, () => { failed.value = false })
const color = computed(() => props.bot.avatar && !failed.value ? '#8a8a93' : avatarColor(props.bot.slug))
defineExpose({ color, play: (detail: Play) => live.value?.play(detail) })
</script>

<template>
  <img v-if="bot.avatar && !failed" ref="image" :src="bot.avatar" :alt="`${bot.name}头像`" width="92" height="92" @error="failed = true">
  <DefaultAvatar v-else ref="live" :slug="bot.slug" :rest="rest" :look="look" />
</template>
