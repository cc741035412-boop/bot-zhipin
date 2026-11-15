<!-- 首页的小队卡：左边一张活的合影，右边是标签、名字、介绍和一行名单。没有按钮，整张卡点进小队页。 -->
<script setup lang="ts">
import { computed, ref } from 'vue'
import SquadLineup from './SquadLineup.vue'
import BzIcon from './BzIcon.vue'
import { SQUAD_COPY } from '../../meta.mjs'
import { rosterLine } from '../squad'

interface Member { bot: string; name: string; nameZh?: string | null; title: string | null; avatar: string | null; lead: boolean }
const props = defineProps<{ squad: { slug: string; name: string; tagline: string; formation: string; detailUrl: string; members: Member[] } }>()
const photo = ref<InstanceType<typeof SquadLineup>>()
const hovered = ref(false)
const roster = computed(() => rosterLine(props.squad.members))
function enter(event: PointerEvent) {
  if (event.pointerType !== 'mouse') return
  hovered.value = true
  photo.value?.wave()
}
function leave(event: PointerEvent) { if (event.pointerType === 'mouse') hovered.value = false }
</script>

<template>
  <article class="squad-card" data-testid="squad-card" :data-slug="squad.slug" @pointerenter="enter" @pointerleave="leave">
    <SquadLineup ref="photo" class="squad-card-photo" variant="card" :members="squad.members" :formation="squad.formation" :active="hovered" />
    <div class="squad-card-body">
      <p class="squad-tags">
        <span class="bz-tag squad-tag"><BzIcon name="users" :size="12" />{{ SQUAD_COPY.tag }}</span>
        <span class="bz-tag" data-testid="squad-card-formation">{{ squad.formation }}</span>
        <span class="squad-count" data-testid="squad-card-count">{{ SQUAD_COPY.count(squad.members.length) }}</span>
      </p>
      <h3 class="squad-card-name"><a :href="squad.detailUrl">{{ squad.name }}</a></h3>
      <p class="squad-card-tagline">{{ squad.tagline }}</p>
      <p class="squad-card-roster" data-testid="squad-card-roster">{{ roster }}</p>
    </div>
  </article>
</template>
