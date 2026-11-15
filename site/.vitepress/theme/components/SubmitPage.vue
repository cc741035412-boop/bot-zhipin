<script setup lang="ts">
import { provide } from 'vue'
import { useSubmit } from '../submit/use-submit'
import { useSubmitCopy, submitCopyKey } from '../submit/copy'
import '../submit/submit.css'
import LiveAnnouncer from './LiveAnnouncer.vue'
import SubmitGuide from './SubmitGuide.vue'
import SubmitBundle from './SubmitBundle.vue'
import SubmitPreview from './SubmitPreview.vue'
import SubmitLogin from './SubmitLogin.vue'
import SubmitShots from './SubmitShots.vue'
import SubmitAuthorization from './SubmitAuthorization.vue'
import SubmitResult from './SubmitResult.vue'
import SubmitCopyButton from './SubmitCopyButton.vue'
import SubmitCopyDialog from './SubmitCopyDialog.vue'
const { s, shots, preview, update, taken, valid, blockers, countdown, errorCopy, slugCopy, pageLink, read, reset, login, logout, submit, focus, dismissInapp, retryError } = useSubmit()
provide(submitCopyKey, useSubmitCopy())
</script>
<template>
  <main class="shelf-page submit-page" data-testid="submit-page">
    <LiveAnnouncer />
    <div v-if="s.inapp" data-testid="inapp-warning" class="submit-notice submit-inapp"><p>你现在是在 {{ s.inapp }} 里打开的。GitHub 登录和传图在这里可能不顺，建议点右上角「…」，选「在浏览器打开」。</p><div class="submit-button-row"><SubmitCopyButton id="inapp-copy-link" :text="pageLink" label="复制本页链接" /><button type="button" class="shelf-button" data-testid="inapp-dismiss" @click="dismissInapp">仍然在这里继续</button></div></div>
    <header class="submit-intro"><h1 id="submit-title" tabindex="-1">把你的 Bot 挂上货架</h1><p>不用会 git。让你的 AI 把东西都准备好，你只要看一眼预览、登录、放截图、点提交。</p></header>
    <SubmitGuide v-if="s.phase === 'guide'" :open="s.pasteOpen" @read="read" />
    <div v-else class="submit-grid">
      <SubmitBundle v-if="!s.result" :s="s" :name="preview?.summary.name || s.slug" :taken="taken" :update="update" :existing="!!s.context?.index.some(bot => bot.slug === s.slug)" :slug-copy="slugCopy" @reset="reset" />
      <SubmitResult v-else :s="s" @another="reset(false)" />
      <SubmitPreview v-if="preview" :preview="preview" :copy="s.context?.copy" :update="update" />
      <template v-if="preview && !s.result">
        <SubmitLogin :s="s" @login="login" @logout="logout" />
        <SubmitShots :manager="shots" :valid="valid" :user="s.user" :submitting="s.phase === 'submitting'" :now="s.now" />
        <SubmitAuthorization :s="s" :update="update" :blockers="blockers" :error-copy="errorCopy" :countdown="countdown" :page-link="pageLink" @submit="submit" @focus="focus" @retry="retryError" />
      </template>
    </div>
    <SubmitCopyDialog />
  </main>
</template>
