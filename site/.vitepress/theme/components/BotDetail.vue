<script setup>
import { computed, onMounted } from 'vue'
import { provideBotAction } from '../live/scope'
const avatar = provideBotAction()
import { avatarColor } from '../avatar'
import { botPalette, categoryStyle } from '../color'
import BotAvatar from './BotAvatar.vue'
import BotActions from './BotActions.vue'
import { loadHeat } from '../heat'
import BotHeat from './BotHeat.vue'
import ExternalHint from './ExternalHint.vue'
import LiveAnnouncer from './LiveAnnouncer.vue'
import BotScreenshot from './BotScreenshot.vue'
const props = defineProps({
  bot: { type: Object, required: true },
  copy: { type: Object, required: true },
  designHtml: { type: String, default: '' },
})
const palette = computed(() => botPalette(props.bot.avatar ? '#8a8a93' : avatarColor(props.bot.slug)))
onMounted(loadHeat)
</script>

<template>
  <main class="shelf-page bot-detail bz-bot-scope" :style="palette" data-testid="bot-detail">
    <LiveAnnouncer />
    <a class="back-link" href="/">← 返回货架</a>
    <header class="detail-header bz-bot-scope" :style="palette">
      <BotAvatar ref="avatar" :bot="bot" />
      <div class="detail-info">
      <h1>{{ bot.name }}</h1>
      <p>{{ bot.tagline }}</p>
      <p class="bot-meta">
        <span class="bot-tag category-tag" :style="categoryStyle(bot.category)">{{ bot.category }}</span>
        <span v-if="bot.external" class="bot-tag external-tag">外部收录</span>
        <a data-testid="author-link" :href="bot.author.link" target="_blank" rel="noopener noreferrer">by {{ bot.author.name }}<ExternalHint /></a>
        <span>上架日期：<time :datetime="bot.addedAt">{{ bot.addedAt }}</time></span>
        <BotHeat :slug="bot.slug" />
      </p>
      <p v-if="bot.forkedFrom" data-testid="forked-from">改编自 <a :href="`/bots/${bot.forkedFrom}`">{{ bot.forkedFromName }}</a></p>
      <BotActions :bot="bot" />
      </div>
    </header>
    <p v-if="bot.external" class="external-notice">这个 Bot 由原作者在 x.ai 发布，本站只收录链接。</p>
    <section data-testid="section-prereq">
      <h2>导入前准备</h2>
      <ul><li v-for="(item, index) in bot.prerequisites" :key="index">{{ item }}</li></ul>
    </section>
    <section data-testid="section-quota">
      <h2>额度消耗</h2>
      <p class="quota-line"><span class="bot-tag quota-tag" :data-quota="bot.quotaCost">{{ bot.quotaCost }}</span>{{ copy.quota[bot.quotaCost] }}</p>
    </section>
    <section data-testid="section-permissions">
      <h2>会用到的权限</h2>
      <ul v-if="bot.permissions.length" class="permission-list">
        <li v-for="permission in bot.permissions" :key="permission"><span class="bot-tag">{{ permission }}</span><span>{{ copy.permissions[permission] }}</span></li>
      </ul>
      <p v-else>不需要额外权限</p>
    </section>
    <section v-if="!bot.external" data-testid="section-screenshots">
      <h2>截图</h2>
      <div class="bot-screenshots">
        <BotScreenshot v-for="(url, index) in bot.screenshots" :key="url" :url="url" :alt="`${bot.name}截图 ${index + 1}`" />
      </div>
      <p v-if="!bot.screenshots.length">暂无截图。</p>
    </section>
    <section v-if="!bot.external" data-testid="section-skills">
      <h2>技能</h2>
      <ul v-if="bot.skills.length" class="skill-list">
        <li v-for="skill in bot.skills" :key="skill.sourceUrl">
          <code>{{ skill.name }}</code>
          <p>{{ skill.description }}</p>
          <a :href="skill.sourceUrl" target="_blank" rel="noopener noreferrer">查看源码<ExternalHint /></a>
        </li>
      </ul>
      <p v-else>暂无技能说明。</p>
    </section>
    <section v-if="!bot.external && bot.hasRoutines" data-testid="section-routines">
      <h2>定时任务</h2>
      <p>这个 Bot 配有定时任务，安装前请查看运行时间与输出位置。</p>
      <a :href="bot.routinesUrl" target="_blank" rel="noopener noreferrer">查看定时任务<ExternalHint /></a>
    </section>
    <section v-if="!bot.external" data-testid="section-design">
      <h2>设计说明</h2>
      <!-- 仅插入 paths 加载器安全渲染的 HTML，绝不编译投稿内容。 -->
      <div v-if="designHtml" class="vp-doc design-body" v-html="designHtml" />
      <p v-else>暂无设计说明。</p>
    </section>
  </main>
</template>
