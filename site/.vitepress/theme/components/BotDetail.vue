<script setup>
import { onMounted } from 'vue'
import BotAvatar from './BotAvatar.vue'
import BotActions from './BotActions.vue'
import { heatLabel, loadHeat } from '../heat'
defineProps({
  bot: { type: Object, required: true },
  copy: { type: Object, required: true },
  designHtml: { type: String, default: '' },
})
onMounted(loadHeat)
</script>

<template>
  <main class="shelf-page bot-detail" data-testid="bot-detail">
    <a href="/">返回货架</a>
    <header class="detail-header">
      <BotAvatar :bot="bot" />
      <h1>{{ bot.name }}</h1>
      <p>{{ bot.tagline }}</p>
      <p class="bot-meta">
        <a data-testid="author-link" :href="bot.author.link" target="_blank" rel="noopener noreferrer">{{ bot.author.name }}</a>
        <span>{{ bot.category }}</span>
        <span>上架日期：<time :datetime="bot.addedAt">{{ bot.addedAt }}</time></span>
        <span data-testid="heat">{{ heatLabel(bot.slug) }}</span>
      </p>
      <template v-if="bot.external">
        <strong class="external-badge">外部收录</strong>
        <p>这个 Bot 由原作者在 x.ai 发布，本站只收录链接。</p>
      </template>
      <BotActions :bot="bot" />
      <p v-if="bot.forkedFrom" data-testid="forked-from">改编自 <a :href="`/bots/${bot.forkedFrom}`">{{ bot.forkedFromName }}</a></p>
    </header>
    <section data-testid="section-prereq">
      <h2>导入前准备</h2>
      <ul><li v-for="(item, index) in bot.prerequisites" :key="index">{{ item }}</li></ul>
    </section>
    <section data-testid="section-quota">
      <h2>额度消耗</h2>
      <p>{{ bot.quotaCost }}：{{ copy.quota[bot.quotaCost] }}</p>
    </section>
    <section data-testid="section-permissions">
      <h2>会用到的权限</h2>
      <ul v-if="bot.permissions.length">
        <li v-for="permission in bot.permissions" :key="permission">{{ permission }}：{{ copy.permissions[permission] }}</li>
      </ul>
      <p v-else>无</p>
    </section>
    <section v-if="!bot.external" data-testid="section-screenshots">
      <h2>截图</h2>
      <div class="bot-screenshots">
        <img v-for="(url, index) in bot.screenshots" :key="url" :src="url" :alt="`${bot.name}截图 ${index + 1}`" loading="lazy">
      </div>
      <p v-if="!bot.screenshots.length">暂无截图。</p>
    </section>
    <section v-if="!bot.external" data-testid="section-skills">
      <h2>技能列表</h2>
      <ul v-if="bot.skills.length">
        <li v-for="skill in bot.skills" :key="skill.sourceUrl">
          <a :href="skill.sourceUrl" target="_blank" rel="noopener noreferrer">{{ skill.name }}</a>
          <p>{{ skill.description }}</p>
        </li>
      </ul>
      <p v-else>暂无技能说明。</p>
    </section>
    <section v-if="bot.hasRoutines" data-testid="section-routines">
      <h2>定时任务</h2>
      <a :href="bot.routinesUrl" target="_blank" rel="noopener noreferrer">查看定时任务说明（GitHub）</a>
    </section>
    <section v-if="!bot.external" data-testid="section-design">
      <h2>设计说明</h2>
      <!-- 仅插入 paths 加载器安全渲染的 HTML，绝不编译投稿内容。 -->
      <div v-if="designHtml" class="vp-doc design-body" v-html="designHtml" />
      <p v-else>暂无设计说明。</p>
    </section>
  </main>
</template>
