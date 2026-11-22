<script setup lang="ts">
import { computed, inject, onMounted, onBeforeUnmount, ref, watch } from 'vue'
import { useData, useRoute } from 'vitepress'
const { theme, page } = useData()
const route = useRoute()
const active = computed(() => {
  if (page.value.isNotFound) return null
  const dir = route.path.split('/')[1]
  if (dir === 'prompts' || dir === 'skills') return `/${dir}/`
  return ['', 'index.html', 'bots', 'squads', 'collections', 'authors'].includes(dir) ? '/' : null
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
const nav = ref<HTMLElement>()
const slider = ref<{ width: string; transform: string }>()
function align() {
  const link = nav.value?.querySelector<HTMLElement>('[aria-current="page"]')
  slider.value = link && {
    width: `${link.getBoundingClientRect().width}px`,
    transform: `translateX(${link.offsetLeft}px)`,
  }
}
function syncScroll() {
  nav.value?.closest('.VPNav')?.classList.toggle('is-scrolled', window.scrollY > 8)
}
watch(() => route.path, () => { if (nav.value) { align(); syncScroll() } }, { flush: 'post' })
let observer: ResizeObserver
let desktop: MediaQueryList
function breakpoint(e: MediaQueryListEvent) { if (e.matches) close?.() }
onMounted(() => {
  align(); syncScroll()
  observer = new ResizeObserver(align)
  nav.value!.querySelectorAll('a').forEach(link => observer.observe(link))
  void document.fonts.ready.then(align)
  window.addEventListener('resize', align)
  window.addEventListener('scroll', syncScroll, { passive: true })
  desktop = matchMedia('(min-width: 768px)')
  desktop.addEventListener('change', breakpoint)
  document.addEventListener('keydown', onKey)
  document.addEventListener('pointerdown', outside)
})
onBeforeUnmount(() => {
  observer.disconnect()
  window.removeEventListener('resize', align)
  window.removeEventListener('scroll', syncScroll)
  desktop.removeEventListener('change', breakpoint)
  document.removeEventListener('keydown', onKey)
  document.removeEventListener('pointerdown', outside)
})
</script>
<template>
  <nav ref="nav" class="module-nav" aria-label="模块">
    <span v-if="slider" class="module-slider" aria-hidden="true" :style="slider" />
    <a v-for="m in theme.modules" :key="m.link" :href="m.link" :target="route.path === m.link ? '_self' : undefined"
       :aria-current="active === m.link ? 'page' : undefined">{{ m.text }}</a>
  </nav>
</template>
