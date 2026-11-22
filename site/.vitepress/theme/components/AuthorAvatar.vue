<script setup>
import { computed, ref, onMounted } from 'vue'
import { authorAvatarPath } from '../../../../scripts/lib/authors.mjs'

const props = defineProps({ author: { type: Object, required: true }, size: String })
const initial = computed(() => {
  const name = props.author.name.trimStart()
  if (!name) return '?'
  const first = typeof Intl.Segmenter === 'function'
    ? new Intl.Segmenter(undefined, { granularity: 'grapheme' }).segment(name).containing(0).segment
    : Array.from(name)[0]
  const up = first.toUpperCase()
  return Array.from(up).length === Array.from(first).length ? up : first
})
const state = ref('loading')
const img = ref(null)
onMounted(() => {
  if (img.value?.complete) state.value = img.value.naturalWidth > 0 ? 'image' : 'fallback'
})
</script>

<template>
  <span class="author-avatar" data-testid="author-avatar" :data-state="state" aria-hidden="true" :style="{ width: size, height: size }">
    {{ initial }}
    <img v-if="state !== 'fallback'" ref="img" :src="authorAvatarPath(author.key)" alt="" decoding="async" @load="state = 'image'" @error="state = 'fallback'" />
  </span>
</template>
