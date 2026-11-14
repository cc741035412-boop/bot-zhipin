<script setup>
import BotAvatar from './BotAvatar.vue'
import BotActions from './BotActions.vue'
import { heatLabel } from '../heat'
defineProps({ bot: { type: Object, required: true } })
</script>

<template>
  <article class="bot-card" data-testid="bot-card" :data-slug="bot.slug">
    <BotAvatar :bot="bot" />
    <h2><a data-testid="detail-link" :href="bot.detailUrl">{{ bot.name }}</a></h2>
    <p>{{ bot.tagline }}</p>
    <p class="bot-meta">
      <a data-testid="author-link" :href="bot.author.link" target="_blank" rel="noopener noreferrer">{{ bot.author.name }}</a>
      <span>{{ bot.category }}</span>
      <span data-testid="heat">{{ heatLabel(bot.slug) }}</span>
    </p>
    <BotActions :bot="bot" />
  </article>
</template>
