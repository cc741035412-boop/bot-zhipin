<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import DefaultAvatar from './DefaultAvatar.vue'
import { activePitch, nextPitch } from '../pitch'

const props = defineProps<{ bot: { slug: string; name: string; avatar: string | null; pitch?: string | null } }>()
const owner = Symbol('头像台词')
const root = ref<HTMLElement>()
const text = ref('')
const open = computed(() => activePitch.value === owner)
function show() {
  if (open.value) return
  text.value = nextPitch(props.bot.slug, props.bot.pitch)
  activePitch.value = owner
}
function close() {
  if (open.value) activePitch.value = null
}
function outside(event: Event) {
  if (!root.value?.contains(event.target as Node)) close()
}
onMounted(() => document.addEventListener('pointerdown', outside))
onBeforeUnmount(() => {
  document.removeEventListener('pointerdown', outside)
  close()
})
</script>

<template>
  <div ref="root" class="avatar-wrap">
    <button
      type="button" class="bot-avatar" data-testid="avatar"
      :aria-label="`${bot.name}的自荐台词`" :aria-expanded="open"
      @pointerenter="($event.pointerType !== 'touch') && show()"
      @pointerleave="($event.pointerType !== 'touch') && close()"
      @focus="show" @blur="close" @click="show" @keydown.esc="close"
    >
      <img v-if="bot.avatar" :src="bot.avatar" :alt="`${bot.name}头像`" width="96" height="96">
      <DefaultAvatar v-else :slug="bot.slug" />
    </button>
    <p v-show="open" data-testid="pitch-bubble" :data-open="String(open)" class="pitch-bubble" role="status">{{ text }}</p>
  </div>
</template>
