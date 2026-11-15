<script setup lang="ts">
import { SITE } from '../../meta.mjs'
import SubmitCopyButton from './SubmitCopyButton.vue'
import ExternalHint from './ExternalHint.vue'
import SubmitIcon from './SubmitIcon.vue'
import SubmitStepMark from './SubmitStepMark.vue'
defineProps<{ s: any; update: boolean; blockers: any[]; errorCopy: any; countdown: string; pageLink: string }>()
defineEmits<{ submit: []; retry: []; focus: [selector: string] }>()
function reload() { location.reload() }
</script>
<template>
  <section class="submit-step submit-authorization" data-testid="step-submit" :data-state="s.error ? 'error' : 'current'" :inert="s.phase === 'submitting'">
    <header class="submit-step-heading"><SubmitStepMark :mark="s.error ? '!' : '3'" /><h2 class="bz-h3">授权并提交</h2></header>
    <label class="submit-license"><input v-model="s.license" type="checkbox" data-testid="license-checkbox" aria-describedby="submit-license-help" /><span>我同意以 CC BY 4.0 授权这次投稿，并确认内容是我有权公开的。</span></label>
    <p id="submit-license-help" data-testid="license-help" class="submit-muted">意思是：别人可以在注明你是作者的前提下复制、改编、使用这个 Bot。 <a class="submit-link" :href="`${SITE.repo}/blob/${SITE.branch}/bots/LICENSE`" target="_blank" rel="noopener noreferrer">授权全文<ExternalHint /></a></p>
    <div v-if="s.error" class="submit-notice danger" data-testid="submit-error" :data-code="s.error.error">
      <p v-if="s.error.error === 'invalid'">服务器检查发现了问题，见上面第 ① 步。</p>
      <template v-else>
        <h3 id="submit-error-title" tabindex="-1"><SubmitIcon name="alert" />{{ errorCopy.message }}</h3>
        <p v-if="s.error.error === 'rate_limited'" data-testid="retry-countdown">{{ countdown }}</p>
        <p v-if="s.error.requestId" data-testid="request-id" class="submit-request-id">错误编号：{{ s.error.requestId }}</p>
        <div class="submit-button-row">
          <SubmitCopyButton v-if="errorCopy.action === 'copy-ai'" id="submit-error-copy" :text="errorCopy.aiText" />
          <SubmitCopyButton v-if="errorCopy.action === 'copy-link'" id="submit-error-link" :text="pageLink" label="复制本页链接" />
          <button v-if="errorCopy.action === 'reload'" type="button" class="bz-btn" @click="reload"><SubmitIcon name="refresh" />刷新页面</button>
          <button v-if="errorCopy.action === 'retry'" type="button" class="bz-btn" @click="$emit('retry')"><SubmitIcon name="refresh" />再试一次</button>
          <button v-if="errorCopy.action === 'license-checkbox'" type="button" class="bz-btn" @click="$emit('focus', '[data-testid=license-checkbox]')"><SubmitIcon name="check" />勾选授权</button>
        </div>
        <ul v-if="s.error.pulls" class="submit-pulls"><li v-for="pull in s.error.pulls" :key="pull.number"><a class="submit-link" :href="pull.url" target="_blank" rel="noopener noreferrer">{{ pull.slug }} · PR #{{ pull.number }}<ExternalHint /></a></li></ul>
        <!-- 备用通道自成一组，和上面的「再试一次」用细线隔开。按钮式的外链和货架的「导入」一样：前面一个右上箭头，读屏另有一句。
             这里同时留着旧类名 shelf-button：tests/e2e/submit.spec.mjs 量点按高度时按 a.shelf-button 找链接按钮。 -->
        <div v-if="s.fallback" class="submit-fallback">
          <p v-if="s.fallback.needsPaste">打开的页面里，把投稿包粘进「投稿包」一栏</p>
          <textarea v-if="s.fallback.needsPaste" readonly rows="6" aria-label="备用投稿包" :value="s.plaintext" />
          <SubmitCopyButton v-if="s.fallback.needsPaste" id="issue-fallback-paste" :text="s.plaintext" label="复制投稿包" />
          <a data-testid="issue-fallback" class="bz-btn shelf-button" :href="s.fallback.url" target="_blank" rel="noopener noreferrer"><SubmitIcon name="arrow-up-right" />改用 GitHub Issue 投稿<span class="bz-sr-only">（在新标签页打开）</span></a>
        </div>
      </template>
    </div>
    <button type="button" data-testid="submit-button" class="bz-btn primary submit-send" :aria-disabled="blockers.length > 0 || s.phase === 'submitting'" :aria-busy="s.phase === 'submitting'" @click="$emit('submit')"><SubmitIcon name="arrow-up" />{{ s.phase === 'submitting' ? '正在提交…' : update ? '提交更新' : '提交投稿' }}</button>
    <p v-if="s.phase === 'submitting'" class="submit-muted submit-sending">{{ s.submitLong ? '正在创建 PR（合并请求）' : '正在检查投稿' }}</p>
    <ul v-else-if="blockers.length" data-testid="submit-blockers" class="submit-blockers"><li v-for="blocker in blockers" :key="blocker.text">{{ blocker.text }}</li></ul>
  </section>
</template>
