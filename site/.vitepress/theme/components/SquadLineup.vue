<!--
  小队合影：一块舞台面板，成员站在同一块地面上。
  队长最大、站在最前面，队员看向队长；鼠标一动，全队一起看过来。每只脚下有一团自己颜色的光，混在一起就是这支队的颜色。
  card：首页小队卡里的小合影，纯装饰，点它等于点卡片。stage：小队页头部的大合影，每只脚下一块小名牌写着它在队里的岗位，点谁戳谁。
-->
<script setup lang="ts">
import { computed, ref } from 'vue'
import BotPortrait from './BotPortrait.vue'
import { avatarColor } from '../avatar'
import { botPalette } from '../color'
import { nextPoke } from '../pitch'
import { isReducedMotion } from '../live/clock'
import { lineup, type LineupVariant } from '../squad'
import type { Play } from '../live/playback'

interface Member { bot: string; name: string; nameZh?: string | null; title?: string | null; avatar: string | null; lead: boolean }
const props = withDefaults(defineProps<{
  members: Member[]
  formation: string
  variant?: LineupVariant
  /** 外面（整张卡）悬停时传 true：全员睁大眼 */
  active?: boolean
}>(), { variant: 'card', active: false })

const layout = computed(() => lineup(props.members, props.formation, props.variant))
const cast = computed(() => layout.value.slots.map((slot) => {
  const member = props.members.find((item) => item.bot === slot.bot)!
  return { slot, member, portrait: { slug: member.bot, name: member.name, nameZh: member.nameZh, avatar: member.avatar }, palette: botPalette(member.avatar ? '#8a8a93' : avatarColor(member.bot)) }
}))
const stage = computed(() => props.variant === 'stage')
const hovered = ref<string | null>(null)
const portraits = new Map<string, InstanceType<typeof BotPortrait>>()
const hops = new Map<string, HTMLElement>()
const keep = <T,>(map: Map<string, T>, slug: string) => (el: unknown) => { if (el) map.set(slug, el as T); else map.delete(slug) }

function hop(slug: string, delay = 0) {
  const el = hops.get(slug)
  if (!el) return
  el.classList.remove('is-hopping')
  if (isReducedMotion()) return
  el.style.animationDelay = `${delay}ms`
  void el.offsetWidth
  el.classList.add('is-hopping')
}
/** 从左到右依次跳一下，每只隔 80ms。 */
function wave() { layout.value.slots.forEach((slot) => hop(slot.bot, slot.order * 80)) }
function play(slug: string, detail: Play) { portraits.get(slug)?.play(detail) }
function enter(event: PointerEvent, slug: string) {
  if (!stage.value || event.pointerType !== 'mouse') return
  hovered.value = slug
  hop(slug)
}
function leave(event: PointerEvent) { if (event.pointerType === 'mouse') hovered.value = null }
function poke(slug: string) { if (stage.value) play(slug, { state: nextPoke(slug).state }) }
defineExpose({ wave, play })
</script>

<template>
  <div class="squad-photo" :class="variant" :style="{ '--lu-w': layout.width, '--lu-h': layout.height }" aria-hidden="true">
    <!-- 光是单独一层，自己裁在面板里；Bot 在另一层，变身时的粒子可以画到面板外面。 -->
    <div class="photo-glow">
      <i v-for="{ slot, palette } in cast" :key="slot.bot" class="photo-pool bz-bot-scope" :style="[palette, { '--x': slot.x, '--s': slot.size }]" />
    </div>
    <div class="photo-cast">
      <div
        v-for="{ slot, member, portrait, palette } in cast" :key="slot.bot"
        class="photo-member bz-bot-scope" :class="{ lead: slot.lead }" :data-slug="slot.bot"
        :style="[palette, { '--x': slot.x, '--lift': slot.lift, '--s': slot.size, zIndex: slot.z }]"
        @pointerenter="enter($event, slot.bot)" @pointerleave="leave" @click="poke(slot.bot)"
      >
        <i class="photo-shadow" />
        <span :ref="keep(hops, slot.bot)" class="photo-hop" @animationend="($event.currentTarget as HTMLElement).classList.remove('is-hopping')">
          <BotPortrait :ref="keep(portraits, slot.bot)" :bot="portrait" :rest="active || hovered === slot.bot ? 'wide' : 'idle'" :look="slot.look" />
        </span>
        <span v-if="stage && member.title" class="photo-plate">{{ member.title }}</span>
      </div>
    </div>
  </div>
</template>
