<script setup>
import { computed, inject, ref } from 'vue'
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
const props = defineProps({ bot: { type: Object, required: true } })
// 投稿预览里的数据可能还没通过校验，元信息只在取值像样时才显示。
const quota = computed(() => typeof props.bot.quotaCost === 'string' ? props.bot.quotaCost : '')
const permissions = computed(() => Array.isArray(props.bot.permissions) ? props.bot.permissions.length : 0)
</script>

<template>
  <article class="bot-card bz-bot-scope" :style="botPalette(bot.avatar ? '#8a8a93' : avatarColor(bot.slug))" data-testid="bot-card" :data-slug="bot.slug" @pointerenter="avatar?.enter($event)" @pointerleave="avatar?.leave($event)">
    <!-- article 是容器查询的容器；版式网格放在里面这层，才能按卡片自己的宽度切换。 -->
    <div class="bot-card-body">
      <BotAvatar v-if="active" ref="avatar" :bot="bot" whole-card />
      <div class="bot-head">
        <h2><a data-testid="detail-link" :href="preview ? '#submit-preview-detail' : bot.detailUrl" :target="preview ? '_self' : undefined" @click="preview && ($event.preventDefault(), showDetail())">{{ bot.name }}</a></h2>
        <div class="bot-meta">
          <span class="bot-tag category-tag" :style="categoryStyle(bot.category)">{{ bot.category }}</span>
          <span v-if="bot.external" class="bot-tag external-tag">{{ bot.official ? '官方市场' : '外部收录' }}</span>
          <span v-if="preview" class="bot-author">by {{ bot.author.name }}</span>
          <a v-else data-testid="author-link" class="bot-author" :href="bot.author.link" target="_blank" rel="noopener noreferrer">by {{ bot.author.name }}<ExternalHint /></a>
        </div>
      </div>
      <p class="bot-tagline">{{ bot.tagline }}</p>
      <div class="bot-stats">
        <BotHeat :slug="bot.slug" />
        <span v-if="quota" class="bot-stat stat-quota" :data-quota="quota">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" aria-hidden="true"><path d="M13.5 2.5 5 13.5h6L10.5 21.5 19 10.5h-6l.5-8Z" /></svg>额度 {{ quota }}
        </span>
        <span class="bot-stat stat-permissions">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3 5 6v5.5c0 4.2 2.9 7.6 7 9 4.1-1.4 7-4.8 7-9V6l-7-3Z" /><path d="m9.2 12 2 2 3.6-4" /></svg>{{ permissions ? `${permissions} 项权限` : '无需权限' }}
        </span>
      </div>
      <BotActions :bot="bot" />
    </div>
  </article>
</template>
