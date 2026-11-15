import { computed, nextTick, onBeforeUnmount, onMounted, reactive, toRaw, watch } from 'vue'
import { SITE } from '../../meta.mjs'
import { encodeToken } from '../../../../scripts/lib/bundle-web.mjs'
import { readBundleInput, readLocationBundle } from './bundle'
import { loadContext, type SubmitContext } from './context'
import { previewModel } from './preview'
import { checkBundle } from './validate'
import * as api from './api'
import { createStore } from './store'
import { issueFallbackUrl } from './issue-fallback'
import { bundleErrorCopy, explainError, countdownText, type Diagnostic } from './errors'
import { createShots, busyShot, failedShot } from './shots'
import { announce } from '../announce'

export function useSubmit() {
  const store = createStore()
  const s = reactive({
    phase: 'guide', plaintext: '', token: '', slug: '', bundleError: { reason: '', aiText: '' }, loadingVisible: false,
    errors: [] as Diagnostic[], warnings: [] as Diagnostic[], context: null as SubmitContext | null, contextUnavailable: false,
    user: null as { id: number; login: string } | null, auth: 'checking', authVisible: false, loginKind: '', loginRetryAt: 0,
    license: false, resume: false, updated: false, pasteOpen: false, inapp: '',
    error: null as any, failureStage: 'submit' as 'submit' | 'login' | 'upload', failures: 0, retryAt: 0, now: Date.now(),
    result: null as any, progress: 'waiting_review', stale: false, statusError: null as any, submitLong: false,
    fallback: null as null | { url: string; needsPaste: boolean },
  })
  let alive = true, version = 0, polling = false
  let pollTimer: ReturnType<typeof setTimeout> | undefined, tickTimer: ReturnType<typeof setTimeout> | undefined
  let longTimer: ReturnType<typeof setTimeout> | undefined
  const focus = async (selector: string) => { await nextTick(); if (alive) document.querySelector<HTMLElement>(selector)?.focus() }
  const existing = computed(() => s.context?.index.find((bot) => bot.slug === s.slug))
  const update = computed(() => Boolean(s.user && !existing.value?.external && existing.value?.authorGithub?.toLowerCase() === s.user.login.toLowerCase()))
  const taken = computed(() => Boolean(s.user && existing.value && !update.value))
  const valid = computed(() => Boolean(s.plaintext && !s.errors.length && !taken.value))
  const unlocked = () => valid.value && !!s.user && s.phase !== 'submitting'
  function save() {
    if (!s.plaintext) return
    store.saveDraft({ plaintext: s.plaintext, token: s.token, license: s.license, result: s.result,
      interrupted: shots.slots.flatMap((shot, i) => busyShot(shot) || shot.interrupted || (shot.state === 'failed' && !shot.file) ? [i] : []) })
  }
  const shots = createShots({ store, user: () => s.user, slug: () => s.slug, unlocked, changed: save,
    onError: (error) => { if (['unauthenticated', 'session_expired'].includes(error.error)) expire(); else if (['submit_disabled', 'forbidden_origin', 'bad_request', 'github_error', 'network_error', 'timeout'].includes(error.error)) void showError(error, 'upload') } })
  const preview = computed(() => s.plaintext ? previewModel(s.plaintext, {
    login: s.user?.login, addedAt: update.value ? existing.value?.addedAt : undefined,
    names: new Map(s.context?.index.map((bot) => [bot.slug, bot.name || bot.slug]) || []),
    namesZh: new Map(s.context?.index.flatMap((bot) => bot.nameZh ? [[bot.slug, bot.nameZh]] : []) || []),
    images: shots.slots.map((shot) => ({ url: shot.url, thumb: shot.thumb, size: shot.size, format: shot.format })),
  }) : null)
  const blockers = computed(() => {
    const list: { text: string; target: string }[] = []
    if (!valid.value) list.push({ text: '投稿包还没通过检查', target: '#check-summary' })
    if (!s.user) list.push({ text: '还没登录', target: '[data-testid="login-button"]' })
    shots.slots.forEach((shot, i) => { if (shot.required && ['empty', 'dragover'].includes(shot.state)) list.push({ text: `截图 ${i + 1} 还空着`, target: `[data-testid="slot"][data-index="${i}"]` }) })
    if (shots.slots.some(busyShot)) list.push({ text: '还有截图在传', target: `[data-testid="slot"][data-index="${shots.slots.findIndex(busyShot)}"]` })
    if (shots.slots.some(failedShot)) list.push({ text: '还有截图没传上去', target: `[data-testid="slot"][data-index="${shots.slots.findIndex(failedShot)}"]` })
    if (!s.license) list.push({ text: '还没勾选授权', target: '[data-testid="license-checkbox"]' })
    if (s.retryAt > s.now) list.push({ text: '请等倒计时结束', target: '#submit-error-title' })
    return list
  })
  const countdown = computed(() => countdownText((s.retryAt - s.now) / 1000))
  const errorCopy = computed(() => s.error ? explainError(s.error.error, { ...s.error, slug: s.slug, stage: s.failureStage, failures: s.failures, countdown: countdown.value }) : null)
  const pageLink = computed(() => `${SITE.url}/submit${s.token ? '#' + s.token : ''}`)
  const slugCopy = computed(() => explainError('slug_taken', { slug: s.slug }))

  function validate(move = true) {
    if (!s.plaintext || s.phase === 'submitting' || s.error?.error === 'invalid') return
    const checked = checkBundle(s.plaintext, { context: s.context, login: s.user?.login })
    s.errors = checked.errors; s.warnings = checked.warnings
    s.phase = s.errors.length ? 'invalid' : 'valid'
    if (move && s.errors.length) void focus('#check-summary')
    if (move) void announce(s.errors.length ? `投稿包还有 ${s.errors.length} 处要改` : '投稿包检查通过')
  }
  async function read(input?: string, fromLocation = false, restore = false) {
    const run = ++version
    const previous = store.loadDraft()
    clearTimeout(pollTimer); clearTimeout(longTimer)
    s.phase = 'decoding'; s.loadingVisible = false; s.bundleError = { reason: '', aiText: '' }
    s.plaintext = ''; s.result = null; s.error = null; s.fallback = null; s.retryAt = 0; s.failures = 0
    const timer = setTimeout(() => { if (alive && run === version) s.loadingVisible = true }, 300)
    try {
      const decoded = fromLocation ? await readLocationBundle() : await readBundleInput(input || '')
      if (!alive || run !== version || !decoded) return
      s.plaintext = decoded.plaintext; s.slug = decoded.bundle.slug
      s.token = fromLocation ? String(store.loadDraft()?.token || '') : ''
      s.phase = 'validating'
      shots.initialize(decoded.bundle)
      s.license = restore && previous?.license === true
      s.result = restore ? previous?.result || null : null
      s.resume = restore; s.updated = false
      if (!restore && previous?.plaintext && previous.plaintext !== s.plaintext) {
        try { s.updated = (await readBundleInput(previous.plaintext)).bundle.slug === s.slug } catch { /* 旧暂存损坏 */ }
      }
      // 单 Bot 检查无需等网络；context 返回后再补跨 Bot / 模板检查。
      validate()
      if (!s.token) s.token = await encodeToken(s.plaintext)
      if (!alive || run !== version) return
      if (s.user) shots.restore(restore && Array.isArray(previous?.interrupted) ? previous.interrupted as number[] : [])
      if (s.result) { s.phase = 'submitted'; s.progress = 'waiting_review'; void refreshStatus() }
      save()
    } catch (error) {
      if (!alive || run !== version) return
      s.phase = 'bundle-error'; s.plaintext = ''; s.result = null
      s.bundleError = bundleErrorCopy(error)
      void focus('#bundle-error-title')
    } finally { clearTimeout(timer); if (run === version) s.loadingVisible = false }
  }
  function reset(paste = false) {
    version++; clearTimeout(pollTimer); shots.clear(); store.clearDraft()
    Object.assign(s, { phase: 'guide', plaintext: '', token: '', slug: '', result: null, error: null, fallback: null, license: false, resume: false, updated: false, pasteOpen: paste, retryAt: 0, failures: 0 })
    void focus(paste ? '[data-testid="paste-input"]' : '#submit-title')
  }
  function expire() {
    s.user = null; s.auth = 'logged-out'; s.loginKind = 'expired'
    shots.pause()
    void focus('[data-testid="login-button"]')
    void announce('登录过期了')
  }
  async function auth(returned = '') {
    const timer = setTimeout(() => { if (alive) s.authVisible = true }, 300)
    try {
      const user = await api.me()
      if (!alive) return
      s.user = user; s.auth = 'logged-in'
      const previousAccount = store.switchAccount(user.id)
      const removedReceipts = store.clearShotsExcept(user.id)
      const switched = previousAccount || removedReceipts
      if (switched) { s.loginKind = 'switched'; shots.clear(); if (s.plaintext) shots.initialize((await readBundleInput(s.plaintext)).bundle) }
      if (s.plaintext) {
        if (!s.result) validate(false)
        const draft = store.loadDraft()
        shots.restore(Array.isArray(draft?.interrupted) ? draft.interrupted as number[] : [])
      }
      if (returned === 'ok') { await focus('#shots-title'); void announce(`已登录为 @${user.login}`) }
    } catch (error: any) {
      if (!alive) return
      s.auth = 'logged-out'
      if (!['unauthenticated', 'session_expired'].includes(error.error)) await showError(error, 'login')
    } finally { clearTimeout(timer); s.authVisible = false }
  }
  function login() {
    if (s.auth === 'redirecting' || s.loginRetryAt > s.now) return
    save(); shots.pause(); s.auth = 'redirecting'; api.startLogin()
  }
  async function logout() {
    try { await api.logout(); if (!alive) return; shots.pause(); s.user = null; s.auth = 'logged-out'; s.loginKind = ''; validate(false) }
    catch (error) { await showError(error, 'login') }
  }
  async function showError(error: any, stage: 'login' | 'upload' | 'submit' = 'submit') {
    if (!alive) return
    s.error = error; s.failureStage = stage; s.fallback = null
    if (['network_error', 'timeout'].includes(error.error)) s.failures++
    else s.failures = 0
    if (error.error === 'rate_limited') s.retryAt = Date.now() + Math.max(0, error.retryAfter || 0) * 1000
    if (errorCopy.value?.fallback && s.plaintext) {
      const run = version
      const fallback = await issueFallbackUrl(s.plaintext, { name: String(preview.value?.summary.name || s.slug) })
      if (alive && run === version && toRaw(s.error) === error) s.fallback = fallback
    }
  }
  async function submit() {
    if (s.phase === 'submitting') return
    if (blockers.value.length) { const first = blockers.value[0]; void focus(first.target); void announce('还差：' + first.text); return }
    const run = version
    s.phase = 'submitting'; s.error = null; s.submitLong = false
    const timer = longTimer = setTimeout(() => { if (alive && run === version) s.submitLong = true }, 2000)
    void announce('正在提交')
    try {
      const result = await api.submit({ plaintext: s.plaintext, receipts: shots.slots.filter((shot) => shot.state === 'done').map((shot) => shot.receipt!), license: s.license })
      if (!alive || run !== version) return
      s.result = result; s.phase = 'submitted'; s.progress = 'waiting_review'; s.stale = false
      store.clearShots(s.user!.id, s.slug); save()
      await focus('#result-title')
      void announce(`投稿提交好了，PR #${result.pr.number}`)
      schedulePoll()
    } catch (error: any) {
      if (!alive || run !== version) return
      s.phase = 'valid'
      // 提交的 30 秒无响应按 §10.1 走 GitHub 不可用退路；上传超时仍用网络提示。
      if (error.error === 'timeout') error = { ...error, error: 'github_error' }
      await showError(error)
      if (error.error === 'invalid') { s.errors = error.errors || []; s.warnings = error.warnings || []; s.phase = 'invalid'; await focus('#check-summary'); void announce(`投稿包还有 ${s.errors.length} 处要改`) }
      else if (['unauthenticated', 'session_expired'].includes(error.error)) expire()
      else if (error.error === 'license_required') { s.license = false; await focus('[data-testid="license-checkbox"]') }
      else if (error.error === 'receipt_invalid') { const i = shots.invalidate(error.slots || []); await focus(`[data-testid="slot"][data-index="${i}"]`) }
      else await focus('#submit-error-title')
    } finally { clearTimeout(timer) }
  }
  function schedulePoll() {
    clearTimeout(pollTimer)
    if (alive && s.result && !['live', 'closed'].includes(s.progress) && document.visibilityState === 'visible') pollTimer = setTimeout(refreshStatus, 10_000)
  }
  async function refreshStatus() {
    if (!alive || polling || !s.result || document.visibilityState !== 'visible' || ['live', 'closed'].includes(s.progress)) return
    const result = s.result
    polling = true
    try {
      const response = await api.status(result.pr.number)
      if (!alive || s.result !== result) return
      s.stale = false; s.statusError = null
      if (response.state !== s.progress) {
        s.progress = response.state
        const titles = { checking: '已创建 PR（合并请求）', waiting_review: '等待维护者审核', approved: '已上线', merged: '已上线', failed: '自动检查出了点问题', closed: '这个投稿被关闭了' }
        void announce(response.state === 'live' ? '你的 Bot 上线了' : '状态变成：' + titles[response.state as keyof typeof titles])
      }
    } catch (error: any) {
      if (!alive || s.result !== result) return
      s.stale = true; s.statusError = error
      if (['unauthenticated', 'session_expired'].includes(error.error)) expire()
    } finally { polling = false; schedulePoll() }
  }
  function visibility() { clearTimeout(pollTimer); if (document.visibilityState === 'visible') void refreshStatus() }
  function hashChanged() { if (location.hash.startsWith('#BZB1:')) void read(undefined, true) }
  function paste(event: ClipboardEvent) {
    if (!unlocked() || (event.target as HTMLElement)?.closest('textarea, input')) return
    const files = Array.from(event.clipboardData?.files || [])
    if (!files.length) return
    const slot = (event.target as HTMLElement)?.closest<HTMLElement>('[data-testid="slot"]')
    let index = slot ? Number(slot.dataset.index) : shots.slots.findIndex((s) => s.state === 'empty')
    if (index < 0) { index = shots.slots.length; shots.add() }
    event.preventDefault(); shots.receive(index, files)
  }
  watch(() => s.license, save)
  onMounted(async () => {
    const url = new URL(location.href), returned = url.searchParams.get('login') || ''
    if (['cancelled', 'failed', 'expired'].includes(returned)) s.loginKind = returned
    const retry = Number(url.searchParams.get('retry'))
    if (retry > 0 && Number.isFinite(retry)) s.loginRetryAt = Date.now() + retry * 1000
    url.searchParams.delete('login'); url.searchParams.delete('retry')
    history.replaceState(history.state, '', url.pathname + url.search + url.hash)
    const ua = navigator.userAgent
    s.inapp = store.inappDismissed() ? '' : [['MicroMessenger', '微信'], [' QQ/', 'QQ'], ['Weibo', '微博'], ['DingTalk', '钉钉'], ['AlipayClient', '支付宝']].find(([match]) => ua.includes(match))?.[1] || ''
    const tick = () => { s.now = Date.now(); tickTimer = setTimeout(tick, 1000) }; tick()
    document.addEventListener('visibilitychange', visibility)
    document.addEventListener('paste', paste)
    window.addEventListener('hashchange', hashChanged)
    // 先启动并行请求；任何一个失败都不妨碍读取包。
    const context = loadContext().then((value) => { if (alive) { s.context = value; if (s.plaintext && !s.result) validate() } }).catch(() => { if (alive) s.contextUnavailable = true })
    const draft = store.loadDraft()
    if (location.hash) await read(undefined, true)
    else if (typeof draft?.plaintext === 'string') await read(draft.plaintext, false, true)
    void auth(returned)
    await context
  })
  onBeforeUnmount(() => { alive = false; version++; clearTimeout(pollTimer); clearTimeout(tickTimer); clearTimeout(longTimer); shots.dispose(); document.removeEventListener('visibilitychange', visibility); document.removeEventListener('paste', paste); window.removeEventListener('hashchange', hashChanged) })
  return { s, shots, preview, update, taken, valid, blockers, countdown, errorCopy, slugCopy, pageLink, read, reset, login, logout, submit, focus,
    dismissInapp() { s.inapp = ''; store.dismissInapp() },
    retryError() { if (s.failureStage === 'login') void auth(); else if (s.failureStage === 'upload') { shots.slots.forEach((shot, i) => { if (shot.state === 'failed') shots.retry(i) }) } else void submit() },
  }
}
