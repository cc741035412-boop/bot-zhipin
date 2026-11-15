<script setup>
import { inject, ref } from 'vue'
import { previewMode, previewDetail, previewCardActive } from '../submit/preview-mode'
const preview = inject(previewMode, false)
const active = inject(previewCardActive, ref(true))
const showDetail = inject(previewDetail, () => {})
import { provideBotAction } from '../live/scope'
const avatar = provideBotAction()
import { avatarColor } from '../avatar'
import { botPalette, categoryStyle } from '../color'
import BotAvatar from './BotAvatar.vue'
import BotActions from './BotActions.vue'
import BotHeat from './BotHeat.vue'
import ExternalHint from './ExternalHint.vue'
defineProps({ bot: { type: Object, required: true } })
</script>

<template>
  <article class="bot-card bz-bot-scope" :style="botPalette(bot.avatar ? '#8a8a93' : avatarColor(bot.slug))" data-testid="bot-card" :data-slug="bot.slug" @pointerenter="avatar?.enter($event)" @pointerleave="avatar?.leave($event)">
    <BotAvatar v-if="active" ref="avatar" :bot="bot" whole-card />
    <h2><a data-testid="detail-link" :href="preview ? '#submit-preview-detail' : bot.detailUrl" :target="preview ? '_self' : undefined" @click="preview && ($event.preventDefault(), showDetail())">{{ bot.name }}</a></h2>
    <div class="bot-meta">
      <span class="bot-tag category-tag" :style="categoryStyle(bot.category)">{{ bot.category }}</span>
      <span v-if="bot.external" class="bot-tag external-tag">{{ bot.official ? '官方市场' : '外部收录' }}</span>
      <span v-if="preview">by {{ bot.author.name }}</span>
      <a v-else data-testid="author-link" :href="bot.author.link" target="_blank" rel="noopener noreferrer">by {{ bot.author.name }}<ExternalHint /></a>
    </div>
    <p class="bot-tagline">{{ bot.tagline }}</p>
    <BotHeat :slug="bot.slug" />
    <BotActions :bot="bot" />
  </article>
</template>
