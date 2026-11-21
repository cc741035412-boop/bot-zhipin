<script setup lang="ts">
import { computed, inject, onMounted, onBeforeUnmount } from 'vue'
import { useData, useRoute } from 'vitepress'
const { theme, page } = useData()
const route = useRoute()
const active = computed(() => {
  if (page.value.isNotFound) return null
  const dir = route.path.split('/')[1]
  if (dir === 'prompts' || dir === 'skills') return `/${dir}/`
  return ['', 'index.html', 'bots', 'squads', 'collections'].includes(dir) ? '/' : null
})
const close = inject<() => void>('close-screen')
const menu = () => document.querySelector<HTMLButtonElement>('.VPNavBarHamburger[aria-expanded="true"]')
function onKey(e: KeyboardEvent) {
  const trigger = menu()
  if (e.key === 'Escape' && trigger && !document.querySelector('[aria-modal="true"]')) {
    close?.(); trigger.focus()
  }
}
function outside(e: PointerEvent) {
  if (menu() && e.target instanceof Element && !e.target.closest('.VPNavBar,.VPNavScreen')) close?.()
}
let desktop: MediaQueryList
function breakpoint(e: MediaQueryListEvent) { if (e.matches) close?.() }
onMounted(() => {
  desktop = matchMedia('(min-width: 768px)')
  desktop.addEventListener('change', breakpoint)
  document.addEventListener('keydown', onKey)
  document.addEventListener('pointerdown', outside)
})
onBeforeUnmount(() => {
  desktop.removeEventListener('change', breakpoint)
  document.removeEventListener('keydown', onKey)
  document.removeEventListener('pointerdown', outside)
})
</script>
<template>
  <nav class="module-nav" aria-label="模块">
    <a v-for="m in theme.modules" :key="m.link" :href="m.link" :target="route.path === m.link ? '_self' : undefined"
       :aria-current="active === m.link ? 'page' : undefined">{{ m.text }}</a>
  </nav>
</template>
