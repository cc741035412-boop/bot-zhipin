<script setup>
import { inject, ref } from 'vue'
import { previewMode, previewDetail, previewCardActive } from '../submit/preview-mode'
const preview = inject(previewMode, false)
const active = inject(previewCardActive, ref(true))
const showDetail = inject(previewDetail, () => {})
import BotAvatar from './BotAvatar.vue'
import BotActions from './BotActions.vue'
import BotHeat from './BotHeat.vue'
import ExternalHint from './ExternalHint.vue'
defineProps({ bot: { type: Object, required: true } })
</script>

<template>
  <article class="bot-card" data-testid="bot-card" :data-slug="bot.slug">
    <BotAvatar v-if="active" :bot="bot" />
    <h2><a data-testid="detail-link" :href="preview ? '#submit-preview-detail' : bot.detailUrl" :target="preview ? '_self' : undefined" @click="preview && ($event.preventDefault(), showDetail())">{{ bot.name }}</a></h2>
    <div class="bot-meta">
      <span class="bot-tag">{{ bot.category }}</span>
      <span v-if="bot.external" class="bot-tag">外部收录</span>
      <span v-if="preview">by {{ bot.author.name }}</span>
      <a v-else data-testid="author-link" :href="bot.author.link" target="_blank" rel="noopener noreferrer">by {{ bot.author.name }}<ExternalHint /></a>
    </div>
    <p class="bot-tagline">{{ bot.tagline }}</p>
    <BotHeat :slug="bot.slug" />
    <BotActions :bot="bot" />
  </article>
</template>
