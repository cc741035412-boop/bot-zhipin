<script setup>
import { computed, onMounted, provide } from 'vue'
import { currentAuthorPage } from '../author-context'
import { loadHeat } from '../heat'
import { AUTHOR_COPY as copy } from '../../meta.mjs'
import AuthorAvatar from './AuthorAvatar.vue'
import BotCard from './BotCard.vue'
import SquadCard from './SquadCard.vue'
import ExternalHint from './ExternalHint.vue'
import BzIcon from './BzIcon.vue'
const props = defineProps({ author: { type: Object, required: true } })
provide(currentAuthorPage, computed(() => props.author.page))
onMounted(() => { loadHeat() })
</script>

<template>
  <main class="shelf-page author-page" data-testid="author-page">
    <a class="bz-btn ghost sm back-link" href="/"><BzIcon name="arrow-left" />返回货架</a>
    <header class="author-header" data-testid="author-header">
      <AuthorAvatar :author="author" size="var(--author-size)" />
      <div>
        <h1>{{ author.name }}</h1>
        <a class="author-handle" :href="author.github" target="_blank" rel="noopener noreferrer" data-track-kind="author">{{ copy.handle(author.login) }}<ExternalHint /></a>
      </div>
    </header>
    <section v-if="author.bots.length" aria-labelledby="author-bots">
      <header class="bz-section-head"><div><h2 id="author-bots">{{ copy.botsTitle }}</h2></div><span class="bz-count">{{ copy.botCount(author.bots.length) }}</span></header>
      <div class="bot-grid"><BotCard v-for="bot in author.bots" :key="bot.slug" :bot="bot" show-category /></div>
    </section>
    <section v-if="author.squads.length" aria-labelledby="author-squads">
      <header class="bz-section-head"><div><h2 id="author-squads">{{ copy.squadsTitle }}</h2></div><span class="bz-count">{{ copy.squadCount(author.squads.length) }}</span></header>
      <div class="squad-grid"><SquadCard v-for="squad in author.squads" :key="squad.slug" :squad="squad" /></div>
    </section>
  </main>
</template>
