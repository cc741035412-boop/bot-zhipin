<script setup>
import BotAvatar from './BotAvatar.vue'
import BotActions from './BotActions.vue'
import BotHeat from './BotHeat.vue'
import ExternalHint from './ExternalHint.vue'
defineProps({ bot: { type: Object, required: true } })
</script>

<template>
  <article class="bot-card" data-testid="bot-card" :data-slug="bot.slug">
    <BotAvatar :bot="bot" />
    <h2><a data-testid="detail-link" :href="bot.detailUrl">{{ bot.name }}</a></h2>
    <div class="bot-meta">
      <span class="bot-tag">{{ bot.category }}</span>
      <span v-if="bot.external" class="bot-tag">外部收录</span>
      <a data-testid="author-link" :href="bot.author.link" target="_blank" rel="noopener noreferrer">by {{ bot.author.name }}<ExternalHint /></a>
    </div>
    <p class="bot-tagline">{{ bot.tagline }}</p>
    <BotHeat :slug="bot.slug" />
    <BotActions :bot="bot" />
  </article>
</template>
