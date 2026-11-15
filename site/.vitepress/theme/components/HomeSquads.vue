<!--
  首页的「小队」区块：每支小队一张卡，最后补一张招募卡。自成一体，BotShelf 里只要一行 <HomeSquads />。
  一支小队都没有时整块不渲染。
-->
<script setup lang="ts">
import { data as squads } from '../../data/squads.data.mjs'
import { SQUAD_COPY, SQUAD_CONTRIBUTE_URL } from '../../meta.mjs'
import SquadCard from './SquadCard.vue'
import SquadStill from './SquadStill.vue'
import BzIcon from './BzIcon.vue'
import ExternalHint from './ExternalHint.vue'

// 招募卡上的三个空位：中间大一号，是留给队长的位置。
const SEATS = ['pebble', 'blob', 'hex']
</script>

<template>
  <section v-if="squads.length" id="squads" class="shelf-section home-squads" aria-labelledby="squads-title">
    <header class="bz-section-head">
      <div><h2 id="squads-title">{{ SQUAD_COPY.title }}</h2></div>
    </header>
    <div class="squad-grid">
      <SquadCard v-for="squad in squads" :key="squad.slug" :squad="squad" />
      <div class="squad-card squad-recruit" data-testid="squad-recruit">
        <div class="recruit-seats" aria-hidden="true">
          <SquadStill v-for="(shape, index) in SEATS" :key="shape" ghost :shape="shape" :class="{ lead: index === 1 }" />
        </div>
        <a class="bz-btn sm" :href="SQUAD_CONTRIBUTE_URL" target="_blank" rel="noopener noreferrer"><BzIcon name="plus" />{{ SQUAD_COPY.recruit }}<ExternalHint /></a>
      </div>
    </div>
  </section>
</template>
