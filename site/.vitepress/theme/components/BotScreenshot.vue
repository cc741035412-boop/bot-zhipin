<script setup>
import { onMounted, ref } from 'vue'
import ExternalHint from './ExternalHint.vue'
defineProps({ url: String, alt: String })
const failed = ref(false)
const image = ref()
onMounted(() => { if (image.value?.complete && !image.value.naturalWidth) failed.value = true })
</script>
<template>
  <a class="screenshot-link" :href="url" target="_blank" rel="noopener noreferrer">
    <span v-if="failed" class="screenshot-error">图片加载失败</span>
    <img v-else ref="image" :src="url" :alt="alt" loading="lazy" @error="failed = true">
    <span class="screenshot-caption">{{ alt }}<ExternalHint /></span>
  </a>
</template>
