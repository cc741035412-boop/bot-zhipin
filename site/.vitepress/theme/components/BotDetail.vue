<script setup>
import { computed, inject, onMounted } from 'vue'
import { previewMode } from '../submit/preview-mode'
const preview = inject(previewMode, false)
import { provideBotAction } from '../live/scope'
const avatar = provideBotAction()
import { avatarColor } from '../avatar'
import { botPalette, categoryStyle } from '../color'
import BotAvatar from './BotAvatar.vue'
import BotActions from './BotActions.vue'
import { loadHeat } from '../heat'
import BotHeat from './BotHeat.vue'
import BzIcon from './BzIcon.vue'
import ExternalHint from './ExternalHint.vue'
import LiveAnnouncer from './LiveAnnouncer.vue'
import BotScreenshot from './BotScreenshot.vue'
const props = defineProps({
  bot: { type: Object, required: true },
  copy: { type: Object, required: true },
  designHtml: { type: String, default: '' },
})
const palette = computed(() => botPalette(props.bot.avatar ? '#8a8a93' : avatarColor(props.bot.slug)))
// 来源：外部收录的写进作者那一项（官方市场 / 社区收录）；作者自己投稿的挂「作者投稿」标签。和列表卡同一套规则。
const origin = computed(() => props.bot.external ? (props.bot.official ? '官方市场' : '社区收录') : '')
onMounted(() => { if (!preview) loadHeat() })
</script>

<template>
  <component :is="preview ? 'div' : 'main'" class="shelf-page bot-detail bz-bot-scope" :style="palette" data-testid="bot-detail">
    <LiveAnnouncer v-if="!preview" />
    <a v-if="!preview" class="bz-btn ghost sm back-link" href="/"><BzIcon name="arrow-left" />返回货架</a>
    <header class="detail-header bz-bot-scope" :style="palette">
      <BotAvatar ref="avatar" :bot="bot" />
      <div class="detail-info">
      <component :is="preview ? 'h2' : 'h1'">{{ bot.name }}</component>
      <p class="detail-tagline">{{ bot.tagline }}</p>
      <p class="bot-meta">
        <span class="bz-tag category-tag" :style="categoryStyle(bot.category)">{{ bot.category }}</span>
        <span v-if="!bot.external" class="bz-tag source-tag">作者投稿</span>
        <span class="bot-byline">
          <span v-if="preview">by {{ bot.author.name }}</span>
          <a v-else data-testid="author-link" :href="bot.author.link" target="_blank" rel="noopener noreferrer">by {{ bot.author.name }}<ExternalHint /></a>
          <span v-if="origin" class="bot-origin">· {{ origin }}</span>
        </span>
        <span>上架 <time :datetime="bot.addedAt">{{ bot.addedAt }}</time></span>
        <BotHeat :slug="bot.slug" />
      </p>
      <p v-if="bot.forkedFrom" data-testid="forked-from">改编自 <a :href="`/bots/${bot.forkedFrom}`" :target="preview ? '_blank' : undefined" :rel="preview ? 'noopener noreferrer' : undefined">{{ bot.forkedFromName }}<ExternalHint v-if="preview" /></a></p>
      <BotActions :bot="bot" />
      </div>
    </header>
    <section data-testid="section-prereq">
      <h2>导入前准备</h2>
      <ul><li v-for="(item, index) in bot.prerequisites" :key="index">{{ item }}</li></ul>
    </section>
    <!-- 额度：三格强度条 + 一个字。档位的含义不直接显示，放在 title 和读屏文本里。 -->
    <section data-testid="section-quota">
      <h2>额度消耗</h2>
      <p class="quota-meter" data-testid="quota-meter" :data-quota="bot.quotaCost" :title="copy.quota[bot.quotaCost]">
        <span class="quota-bars" aria-hidden="true"><i /><i /><i /></span>
        <span class="quota-level">{{ bot.quotaCost }}</span>
        <span v-if="copy.quota[bot.quotaCost]" class="bz-sr-only">：{{ copy.quota[bot.quotaCost] }}</span>
      </p>
    </section>
    <!-- 权限：一排标签。每项的含义同样在 title 和读屏文本里。 -->
    <section data-testid="section-permissions">
      <h2>会用到的权限</h2>
      <ul v-if="bot.permissions.length" class="permission-list">
        <li v-for="permission in bot.permissions" :key="permission" class="bz-tag" :title="copy.permissions[permission]">{{ permission }}<span v-if="copy.permissions[permission]" class="bz-sr-only">：{{ copy.permissions[permission] }}</span></li>
      </ul>
      <p v-else>不需要额外权限</p>
    </section>
    <!-- 下面几块没有内容就整块不渲染；投稿预览里照旧显示「还缺什么」的提示。 -->
    <section v-if="!bot.external && (preview || bot.screenshots.length)" data-testid="section-screenshots">
      <h2>截图</h2>
      <div class="bot-screenshots">
        <template v-for="(url, index) in bot.screenshots" :key="index">
          <span v-if="preview && !url" class="screenshot-error">截图 {{ index + 1 }}（待放入）</span>
          <BotScreenshot v-else :url="url" :alt="`${bot.name}截图 ${index + 1}`" />
        </template>
      </div>
      <p v-if="!bot.screenshots.length">暂无截图。</p>
    </section>
    <section v-if="!bot.external && (preview || bot.skills.length)" data-testid="section-skills">
      <h2>技能</h2>
      <ul v-if="bot.skills.length" class="skill-list">
        <li v-for="skill in bot.skills" :key="skill.sourceUrl">
          <code>{{ skill.name }}</code>
          <p>{{ skill.description }}</p>
          <span v-if="preview">上架后可查看源码</span>
          <a v-else :href="skill.sourceUrl" target="_blank" rel="noopener noreferrer">查看源码<ExternalHint /></a>
        </li>
      </ul>
      <p v-else>暂无技能说明。</p>
    </section>
    <section v-if="!bot.external && bot.hasRoutines" data-testid="section-routines">
      <h2>定时任务</h2>
      <span v-if="preview">上架后可查看</span>
      <a v-else :href="bot.routinesUrl" target="_blank" rel="noopener noreferrer">查看定时任务<ExternalHint /></a>
    </section>
    <section v-if="!bot.external && (preview || designHtml)" data-testid="section-design">
      <h2>设计说明</h2>
      <!-- 仅插入 paths 加载器安全渲染的 HTML，绝不编译投稿内容。 -->
      <div v-if="designHtml" class="vp-doc design-body" v-html="designHtml" />
      <p v-else>暂无设计说明。</p>
    </section>
  </component>
</template>
