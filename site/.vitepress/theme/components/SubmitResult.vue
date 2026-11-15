<script setup lang="ts">
import { computed } from 'vue'
import { explainError } from '../submit/errors'
import ExternalHint from './ExternalHint.vue'
const props = defineProps<{ s: any }>()
defineEmits<{ another: [] }>()
const steps = computed(() => {
  const state = props.s.progress
  const reached = state === 'checking' ? 1 : state === 'waiting_review' ? 2 : state === 'live' ? 4 : ['approved', 'merged'].includes(state) ? 3 : 2
  return ['checked', 'pr', 'review', 'live'].map((step, i) => ({ step, state: i === 2 && ['failed', 'closed'].includes(state) ? 'failed' : i < reached ? 'done' : i === reached ? 'current' : 'pending' }))
})
</script>
<template>
  <section data-testid="submit-result" class="submit-step submit-result">
    <h2 id="result-title" tabindex="-1">投稿提交好了</h2><p>接下来交给维护者审核。审核通过会自动上线，GitHub 会发邮件通知你。现在关掉页面也没关系。</p>
    <ol class="submit-progress"><li v-for="item in steps" :key="item.step" data-testid="progress-step" :data-step="item.step" :data-state="item.state">
      <span class="submit-progress-dot" aria-hidden="true"><span v-if="item.state === 'done'" class="submit-progress-check">✓</span><span v-else-if="item.state === 'failed'">!</span></span>
      <div><h3>{{ { checked: '检查通过', pr: '已创建 PR（合并请求）', review: '等待维护者审核', live: '已上线' }[item.step] }}</h3>
        <p v-if="item.step === 'checked'">格式、权限、密钥都查过了。</p>
        <p v-if="item.step === 'pr'"><a data-testid="pr-link" :href="s.result.pr.url" target="_blank" rel="noopener noreferrer">PR #{{ s.result.pr.number }}<ExternalHint /></a></p>
        <p v-if="item.step === 'review'">{{ s.progress === 'closed' ? '这个投稿被关闭了，原因请看 PR 里的留言。' : s.progress === 'failed' ? '自动检查出了点问题，维护者会在 PR 里留言告诉你怎么改。' : '维护者会核对截图和说明，一般 1–2 天内。有问题会在 PR 里留言。' }}</p>
        <p v-if="item.step === 'live'"><a v-if="s.progress === 'live'" data-testid="live-link" :href="`/bots/${s.slug}`" target="_blank" rel="noopener noreferrer">去看看你的 Bot<ExternalHint /></a><template v-else>审核通过后大约 1 分钟上线。</template></p>
      </div>
    </li></ol>
    <p v-if="s.stale" data-testid="status-stale" class="submit-muted">状态暂时刷新不了，过一会儿会再试。</p>
    <p v-if="s.statusError?.error === 'not_found'" class="submit-notice">{{ explainError('not_found').message }}</p>
    <div class="submit-button-row"><button type="button" class="shelf-button" data-testid="submit-another" @click="$emit('another')">再投一个</button><a class="shelf-button" :href="s.result.pr.url" target="_blank" rel="noopener noreferrer">查看 PR<ExternalHint /></a></div>
  </section>
</template>
