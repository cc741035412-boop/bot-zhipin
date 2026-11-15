<script setup lang="ts">
import { copyForAi } from '../submit/errors'
import SubmitCopyButton from './SubmitCopyButton.vue'
import SubmitIcon from './SubmitIcon.vue'
import SubmitStepMark from './SubmitStepMark.vue'
defineProps<{ s: any; name: any; taken: boolean; update: boolean; existing: boolean; slugCopy: any }>()
defineEmits<{ reset: [paste: boolean] }>()
</script>
<template>
  <section class="submit-step submit-check" data-testid="step-check" :data-state="s.phase === 'bundle-error' || s.errors.length || taken ? 'error' : s.plaintext ? 'done' : 'current'" :inert="s.phase === 'submitting'">
    <div v-if="s.resume || s.updated" data-testid="resume-notice" class="submit-notice submit-resume">
      <span>{{ s.updated ? '投稿包已更新。' : '接着上次的投稿：' + name }}</span>
      <button type="button" class="bz-btn ghost sm submit-text-button" data-testid="bundle-reset" @click="$emit('reset', false)"><SubmitIcon name="swap" />换一个投稿包</button>
    </div>
    <header class="submit-step-heading"><SubmitStepMark :mark="s.errors.length || s.phase === 'bundle-error' || taken ? '!' : s.plaintext ? '✓' : '1'" /><h2 class="bz-h3">检查投稿包</h2><span class="submit-step-status">{{ s.phase === 'bundle-error' ? '读取失败' : s.errors.length || taken ? '要修改' : s.plaintext ? '已通过' : '读取中' }}</span></header>
    <p v-if="s.loadingVisible" data-testid="bundle-loading" class="submit-loading" aria-busy="true">正在读取投稿包<span class="submit-dots">…</span></p>
    <div v-if="s.phase === 'bundle-error'" class="submit-notice danger" data-testid="bundle-error">
      <h3 id="bundle-error-title" tabindex="-1"><SubmitIcon name="alert" />这个投稿包打不开</h3>
      <p data-testid="bundle-error-reason">{{ s.bundleError.reason }}</p><p>把下面这段发给你的 AI，让它重新生成。</p>
      <div class="submit-button-row"><SubmitCopyButton id="bundle-error-copy" :text="s.bundleError.aiText" /><button type="button" class="bz-btn" @click="$emit('reset', true)"><SubmitIcon name="refresh" />重新粘贴</button></div>
    </div>
    <div v-else-if="s.errors.length" data-testid="validation-errors" class="submit-errors">
      <h3 id="check-summary" class="submit-danger" tabindex="-1"><SubmitIcon name="alert" />还有 {{ s.errors.length }} 处要改</h3>
      <p>这些问题要让 AI 改。点「复制给 AI」，把复制的内容整段发给它，它改好会给你一个新链接。</p>
      <div v-for="(error, i) in s.errors" :key="i" class="submit-diagnostic" data-testid="validation-error-item">
        <code><SubmitIcon name="file" :size="14" />{{ error.file }}</code><dl><template v-for="(label, key) in { where: '位置', problem: '问题', fix: '改法' }" :key="key"><dt>{{ label }}</dt><dd>{{ error[key] }}</dd></template></dl>
      </div>
      <SubmitCopyButton id="copy-errors" :text="copyForAi(s.errors)" primary />
    </div>
    <p v-else-if="s.plaintext" data-testid="validation-ok" class="submit-success"><SubmitIcon name="check" /><span>检查通过：{{ name }}</span> <code>slug：{{ s.slug }}</code></p>
    <div v-if="s.warnings.length" class="submit-warnings" data-testid="validation-warnings"><h3>提醒（不影响提交）</h3><p v-for="(warning, i) in s.warnings" :key="i">! {{ warning.problem }} {{ warning.fix }}</p></div>
    <div v-if="existing && s.plaintext" data-testid="slug-notice" class="submit-notice" :class="{ danger: taken }">
      <h3 v-if="taken" :id="s.errors.length ? 'slug-summary' : 'check-summary'" tabindex="-1"><SubmitIcon name="alert" />{{ slugCopy.message }}</h3>
      <p v-else>{{ update ? '这是对你已上架 Bot 的更新。' : `货架上已经有一个叫 ${s.slug} 的 Bot。如果是你的，登录后会作为更新提交；不是的话，请让 AI 换个英文短名。` }}</p>
      <SubmitCopyButton v-if="taken" id="copy-slug-error" :text="slugCopy.aiText" />
    </div>
    <p v-if="s.contextUnavailable && s.plaintext" data-testid="context-unavailable" class="submit-notice">有几项检查要等提交时由服务器来做。</p>
  </section>
</template>
