<script setup lang="ts">
import { computed } from 'vue'
import { explainError } from '../submit/errors'
import ExternalHint from './ExternalHint.vue'
import SubmitIcon from './SubmitIcon.vue'
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
    <!-- 左边一列 40 宽：上面是成功的对勾，下面是四个进度点；标题、说明、按钮都排在右边同一条左边线上。 -->
    <header class="submit-result-head">
      <span class="submit-result-mark" aria-hidden="true"><SubmitIcon name="check" :size="20" /></span>
      <div><h2 id="result-title" class="bz-h2" tabindex="-1">投稿提交好了</h2><p>接下来交给维护者审核。审核通过会自动上线，GitHub 会发邮件通知你。现在关掉页面也没关系。</p></div>
    </header>
    <ol class="submit-progress"><li v-for="item in steps" :key="item.step" data-testid="progress-step" :data-step="item.step" :data-state="item.state">
      <span class="submit-progress-dot" aria-hidden="true"><span v-if="item.state === 'done'" class="submit-progress-check"><SubmitIcon name="check" :size="12" /></span><SubmitIcon v-else-if="item.state === 'failed'" name="bang" :size="12" /></span>
      <div><h3>{{ { checked: '检查通过', pr: '已创建 PR（合并请求）', review: '等待维护者审核', live: '已上线' }[item.step] }}</h3>
        <p v-if="item.step === 'checked'">格式、权限、密钥都查过了。</p>
        <p v-if="item.step === 'pr'"><a data-testid="pr-link" class="submit-link" :href="s.result.pr.url" target="_blank" rel="noopener noreferrer">PR #{{ s.result.pr.number }}<ExternalHint /></a></p>
        <p v-if="item.step === 'review'">{{ s.progress === 'closed' ? '这个投稿被关闭了，原因请看 PR 里的留言。' : s.progress === 'failed' ? '自动检查出了点问题，维护者会在 PR 里留言告诉你怎么改。' : '维护者会核对截图和说明，一般 1–2 天内。有问题会在 PR 里留言。' }}</p>
        <p v-if="item.step === 'live'"><a v-if="s.progress === 'live'" data-testid="live-link" class="submit-link" :href="`/bots/${s.slug}`" target="_blank" rel="noopener noreferrer">去看看你的 Bot<ExternalHint /></a><template v-else>审核通过后大约 1 分钟上线。</template></p>
      </div>
    </li></ol>
    <p v-if="s.stale" data-testid="status-stale" class="submit-muted submit-result-note">状态暂时刷新不了，过一会儿会再试。</p>
    <p v-if="s.statusError?.error === 'not_found'" class="submit-notice submit-result-note">{{ explainError('not_found').message }}</p>
    <!-- 链接按钮同时留着旧类名 shelf-button：tests/e2e/submit.spec.mjs 量点按高度时按 a.shelf-button 找链接按钮。 -->
    <div class="submit-button-row"><button type="button" class="bz-btn" data-testid="submit-another" @click="$emit('another')"><SubmitIcon name="plus" />再投一个</button><a class="bz-btn shelf-button" :href="s.result.pr.url" target="_blank" rel="noopener noreferrer"><SubmitIcon name="arrow-up-right" />查看 PR<span class="bz-sr-only">（在新标签页打开）</span></a></div>
  </section>
</template>
