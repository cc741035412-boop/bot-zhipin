<script setup lang="ts">
import { ref } from 'vue'
import { SITE, submitPrompt } from '../../meta.mjs'
import ExternalHint from './ExternalHint.vue'
import SubmitCopyButton from './SubmitCopyButton.vue'
import SubmitIcon from './SubmitIcon.vue'
defineProps<{ open: boolean }>()
const emit = defineEmits<{ read: [input: string] }>()
const input = ref('')
const steps = [
  { title: '复制提示词', text: '点下面的按钮，把提示词发给你的 AI：Grok Bot、Codex、Claude Code 都行', icon: 'copy' },
  { title: '回答几个问题', text: 'AI 自己能查到的不会问你，查不到的一次问清，最后给你一个投稿链接', icon: 'message' },
  { title: '打开链接提交', text: '看预览、用 GitHub 登录、点提交。维护者审核通过就上线', icon: 'upload' },
] as const
</script>
<template>
  <section data-testid="guide" class="submit-guide">
    <div data-testid="guide-steps" class="submit-guide-steps">
      <article v-for="(step, i) in steps" :key="i">
        <span class="submit-guide-icon" aria-hidden="true"><SubmitIcon :name="step.icon" :size="20" /></span>
        <h2 class="bz-title">{{ i + 1 }} · {{ step.title }}</h2><p>{{ step.text }}</p>
      </article>
    </div>
    <!-- 提示词和它的复制按钮收进同一张卡：读完就在手边复制 -->
    <div class="submit-prompt-card">
      <div data-testid="submit-prompt" class="submit-prompt">{{ submitPrompt() }}</div>
      <SubmitCopyButton id="copy-submit-prompt" :text="submitPrompt()" label="复制投稿提示词" spoken="已复制投稿提示词" primary />
    </div>
    <details data-testid="paste-box" class="submit-paste" :open="open">
      <summary><SubmitIcon name="chevron-right" />已经有投稿包了？</summary>
      <p id="paste-help">把 AI 给你的投稿链接，或者 BZB1: 开头的一长串、BOT-ZHIPIN-BUNDLE v1 开头的整段文字，粘贴到下面。</p>
      <textarea v-model="input" data-testid="paste-input" aria-label="投稿链接或投稿包" aria-describedby="paste-help" rows="6" spellcheck="false" />
      <button type="button" class="bz-btn" data-testid="paste-submit" :aria-disabled="!input.trim()" @click="input.trim() && emit('read', input)"><SubmitIcon name="arrow-right" />读取</button>
    </details>
    <footer class="submit-guide-notes"><p>已经上架、想更新？流程一样，用同一个 GitHub 账号提交就会更新原来那个。</p>
      <p><a data-testid="contributing-link" class="submit-link" :href="`${SITE.repo}/blob/${SITE.branch}/CONTRIBUTING.md`" target="_blank" rel="noopener noreferrer">熟悉 git？也可以照 CONTRIBUTING.md 自己提 PR（合并请求）<ExternalHint /></a></p>
    </footer>
  </section>
</template>
