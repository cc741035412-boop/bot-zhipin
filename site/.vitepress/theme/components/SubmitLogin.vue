<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { explainError } from '../submit/errors'
import ExternalHint from './ExternalHint.vue'
import SubmitIcon from './SubmitIcon.vue'
import SubmitStepMark from './SubmitStepMark.vue'
const props = defineProps<{ s: any }>()
defineEmits<{ login: []; logout: [] }>()
const failedAvatar = ref(false)
watch(() => props.s.user?.id, () => { failedAvatar.value = false })
const notices: Record<string, string> = {
  cancelled: '你取消了登录。想继续投稿，再点一次「用 GitHub 登录」就行。',
  failed: '登录没成功，可能是网络不稳。再试一次；还不行就换个网络，或者过一会儿再来。',
  expired: explainError('session_expired').message,
  switched: '换了账号，截图要重新放一次。',
}
const retry = computed(() => props.s.loginRetryAt > props.s.now ? explainError('rate_limited', { stage: 'login', retryAfter: (props.s.loginRetryAt - props.s.now) / 1000 }).message : '')
</script>
<template>
  <section class="submit-step submit-login" data-testid="step-login" :data-state="s.user ? 'done' : 'current'" :inert="s.phase === 'submitting'">
    <header class="submit-step-heading"><SubmitStepMark :mark="s.user ? '✓' : '2'" /><h2 class="bz-h3">用 GitHub 登录</h2><span class="submit-step-status">{{ s.user ? '已登录' : '未登录' }}</span></header>
    <div v-if="s.loginKind" data-testid="login-notice" :data-kind="s.loginKind" class="submit-notice" :class="{ danger: ['failed', 'expired'].includes(s.loginKind) }">{{ notices[s.loginKind] }}</div>
    <p v-if="retry" class="submit-notice">{{ retry }}</p>
    <div v-if="s.auth === 'checking' && s.authVisible" data-testid="auth-checking" class="submit-muted"><span class="submit-skeleton" aria-hidden="true" />正在确认登录状态…</div>
    <div v-else-if="s.user" data-testid="user-badge" class="submit-user">
      <img v-if="!failedAvatar" :src="`https://avatars.githubusercontent.com/u/${s.user.id}?s=56`" alt="" width="28" height="28" @error="failedAvatar = true" />
      <span v-else class="submit-user-initial" aria-hidden="true">{{ s.user.login[0].toUpperCase() }}</span>
      <span data-testid="user-login">@{{ s.user.login }}</span><button type="button" data-testid="logout-button" class="bz-btn ghost sm submit-text-button" @click="$emit('logout')"><SubmitIcon name="log-out" />不是你？退出</button>
    </div>
    <template v-else-if="s.auth !== 'checking'">
      <!-- 一屏只留一个实心按钮：投稿包还有要改的地方时，实心的是 ① 里的「复制给 AI」，登录退成次级。GitHub 标志是品牌图形，实心，不进线性图标集。 -->
      <button type="button" class="bz-btn" :class="{ primary: !s.errors.length }" data-testid="login-button" :aria-disabled="s.auth === 'redirecting' || !!retry" :aria-busy="s.auth === 'redirecting'" @click="$emit('login')"><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.18-3.37-1.18-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.89 1.53 2.34 1.09 2.91.83.09-.65.35-1.09.64-1.34-2.22-.25-4.56-1.11-4.56-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.03a9.58 9.58 0 0 1 5 0c1.91-1.3 2.75-1.03 2.75-1.03.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.69-4.58 4.94.36.31.68.92.68 1.85v2.59c0 .26.18.58.69.48A10 10 0 0 0 12 2Z" /></svg>{{ s.auth === 'redirecting' ? '正在前往 GitHub…' : '用 GitHub 登录' }}</button>
      <p data-testid="login-why">登录是为了把你记成这个 Bot 的作者和项目贡献者，也防止别人冒用你的名字。我们只读取你的用户名，不会动你的任何仓库。</p>
      <p class="submit-signup"><a data-testid="signup-link" class="submit-link" href="https://github.com/signup" target="_blank" rel="noopener noreferrer">还没有 GitHub 账号？免费注册一个<ExternalHint /></a> <span class="submit-muted">要一个邮箱，大约 2 分钟。注册好回到这里点登录。</span></p>
    </template>
  </section>
</template>
