<!-- 货架上某个 Bot 的静止小头像：有自定义头像用图片，没有就画它的官方真脸（静止帧）。纯装饰，名字由调用处给。 -->
<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import StaticBot from './StaticBot.vue'
import { botFace, faceColors } from '../face'

const props = withDefaults(defineProps<{ bot: { slug: string; avatar: string | null }; size?: number; ring?: boolean }>(), { size: 28, ring: false })
const failed = ref(false)
const image = ref<HTMLImageElement>()
// 图片可能在接管页面之前就加载失败了，挂载后补查一次。
onMounted(() => { if (image.value?.complete && !image.value.naturalWidth) failed.value = true })
watch(() => props.bot.avatar, () => { failed.value = false })
const face = computed(() => botFace(props.bot.slug))
const colors = computed(() => faceColors(face.value.color))
const style = computed(() => ({
  '--bz-bot-light': colors.value.light,
  '--bz-bot-dark': colors.value.dark,
  ...(colors.value.outline ? { '--bz-bot-outline': colors.value.outline } : {}),
}))
</script>

<template>
  <img v-if="bot.avatar && !failed" ref="image" class="bot-still" :src="bot.avatar" alt="" :width="size" :height="size" loading="lazy" @error="failed = true">
  <StaticBot v-else class="bot-still" :class="{ 'bz-live-ink': colors.light !== colors.dark }" :style="style" :radii="face.radii" color="var(--bz-bot-body)" :outline="colors.outline ? 'var(--bz-bot-outline)' : null" :size="size" :ring="ring" />
</template>
