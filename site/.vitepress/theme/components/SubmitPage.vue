<script setup lang="ts">
import { computed, provide } from 'vue'
import { useSubmit } from '../submit/use-submit'
import { useSubmitCopy, submitCopyKey } from '../submit/copy'
import { avatarColor } from '../avatar'
import { botPalette } from '../color'
import '../submit/submit.css'
import LiveAnnouncer from './LiveAnnouncer.vue'
import SubmitGuide from './SubmitGuide.vue'
import SubmitBundle from './SubmitBundle.vue'
import SubmitPreview from './SubmitPreview.vue'
import SubmitLogin from './SubmitLogin.vue'
import SubmitAuthorization from './SubmitAuthorization.vue'
import SubmitResult from './SubmitResult.vue'
import SubmitCopyButton from './SubmitCopyButton.vue'
import SubmitCopyDialog from './SubmitCopyDialog.vue'
import SubmitIcon from './SubmitIcon.vue'
const { s, preview, update, taken, valid, blockers, countdown, errorCopy, slugCopy, pageLink, read, reset, login, logout, submit, focus, dismissInapp, retryError } = useSubmit()
provide(submitCopyKey, useSubmitCopy())
// 界面是中性的，颜色只来自 Bot：把这只 Bot 的颜色（取法和列表卡一样）交给预览面板和结果面板，垫一团柔光。只用于装饰。
const palette = computed(() => preview.value ? botPalette(preview.value.summary.avatar ? '#8a8a93' : avatarColor(preview.value.summary.slug)) : undefined)
</script>
<template>
  <main class="shelf-page submit-page" data-testid="submit-page">
    <LiveAnnouncer />
    <div v-if="s.inapp" data-testid="inapp-warning" class="submit-notice submit-inapp"><p>你现在是在 {{ s.inapp }} 里打开的。GitHub 登录在这里可能不顺，建议点右上角「…」，选「在浏览器打开」。</p><div class="submit-button-row"><SubmitCopyButton id="inapp-copy-link" :text="pageLink" label="复制本页链接" /><button type="button" class="bz-btn" data-testid="inapp-dismiss" @click="dismissInapp"><SubmitIcon name="arrow-right" />仍然在这里继续</button></div></div>
    <header class="submit-intro"><h1 id="submit-title" class="bz-h1" tabindex="-1">把你的 Bot 挂上货架</h1><p>不用会 git。让你的 AI 把东西都准备好，你只要看一眼预览、登录、点提交。</p></header>
    <SubmitGuide v-if="s.phase === 'guide'" :open="s.pasteOpen" @read="read" />
    <div v-else class="submit-grid" :style="palette">
      <SubmitBundle v-if="!s.result" :s="s" :name="preview?.summary.name || s.slug" :taken="taken" :update="update" :existing="!!s.context?.index.some(bot => bot.slug === s.slug)" :slug-copy="slugCopy" @reset="reset" />
      <SubmitResult v-else :s="s" @another="reset(false)" />
      <SubmitPreview v-if="preview" :preview="preview" :copy="s.context?.copy" :update="update" />
      <template v-if="preview && !s.result">
        <SubmitLogin :s="s" @login="login" @logout="logout" />
        <SubmitAuthorization :s="s" :update="update" :blockers="blockers" :error-copy="errorCopy" :countdown="countdown" :page-link="pageLink" @submit="submit" @focus="focus" @retry="retryError" />
      </template>
    </div>
    <SubmitCopyDialog />
  </main>
</template>
