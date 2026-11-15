<script setup lang="ts">
import { ref } from 'vue'
import { SITE, submitPrompt } from '../../meta.mjs'
import ExternalHint from './ExternalHint.vue'
import SubmitCopyButton from './SubmitCopyButton.vue'
defineProps<{ open: boolean }>()
const emit = defineEmits<{ read: [input: string] }>()
const input = ref('')
const steps = [
  { title: '复制提示词', text: '点下面的按钮，把提示词发给你的 AI：Grok Bot、Codex、Claude Code 都行', path: 'M9 5H5v23h22V5h-4M11 3h10v6H11zM10 15h12M10 21h8' },
  { title: '回答几个问题', text: 'AI 自己能查到的不会问你，查不到的一次问清，最后给你一个投稿链接', path: 'M5 4h22v19H13l-8 6V4ZM10 11h12M10 17h8' },
  { title: '打开链接提交', text: '看预览、用 GitHub 登录、放截图、点提交。维护者审核通过就上线', path: 'M16 23V4M9 11l7-7 7 7M5 22v7h22v-7' },
]
</script>
<template>
  <section data-testid="guide" class="submit-guide">
    <div data-testid="guide-steps" class="submit-guide-steps">
      <article v-for="(step, i) in steps" :key="i">
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path :d="step.path" /></svg>
        <h2>{{ i + 1 }} · {{ step.title }}</h2><p>{{ step.text }}</p>
      </article>
    </div>
    <div data-testid="submit-prompt" class="submit-prompt">{{ submitPrompt() }}</div>
    <SubmitCopyButton id="copy-submit-prompt" :text="submitPrompt()" label="复制投稿提示词" spoken="已复制投稿提示词" primary />
    <details data-testid="paste-box" class="submit-paste" :open="open">
      <summary>已经有投稿包了？</summary>
      <p id="paste-help">把 AI 给你的投稿链接，或者 BZB1: 开头的一长串、BOT-ZHIPIN-BUNDLE v1 开头的整段文字，粘贴到下面。</p>
      <textarea v-model="input" data-testid="paste-input" aria-label="投稿链接或投稿包" aria-describedby="paste-help" rows="6" spellcheck="false" />
      <button type="button" class="shelf-button primary" data-testid="paste-submit" :aria-disabled="!input.trim()" @click="input.trim() && emit('read', input)">读取</button>
    </details>
    <footer class="submit-muted"><p>已经上架、想更新？流程一样，用同一个 GitHub 账号提交就会更新原来那个。</p>
      <p><a data-testid="contributing-link" :href="`${SITE.repo}/blob/${SITE.branch}/CONTRIBUTING.md`" target="_blank" rel="noopener noreferrer">熟悉 git？也可以照 CONTRIBUTING.md 自己提 PR（合并请求）<ExternalHint /></a></p>
    </footer>
  </section>
</template>
