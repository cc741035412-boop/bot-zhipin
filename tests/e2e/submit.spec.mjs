import { test, expect } from '@playwright/test'
import { readFileSync, mkdirSync } from 'node:fs'
import { randomBytes } from 'node:crypto'
import { makeWebSubmissionLink } from '../../scripts/make-submission-link.mjs'
import { encode, pack, unpack } from '../../scripts/submission/bundle.mjs'
import { submitPrompt, SITE } from '../../site/.vitepress/meta.mjs'

// 与 CLI 完全同一份包；只写 CLI 自己的 mktemp 副本，fixtures 不修改。
const source = makeWebSubmissionLink('tests/fixtures/bots/demo-prd-reviewer')
const slug = 'demo-prd-reviewer'
const png = readFileSync('tests/fixtures/bots/demo-prd-reviewer/screenshots/review-result.png')
const contextData = JSON.parse(readFileSync('site/public/api-data/submit-context.json', 'utf8'))
const context = { ...contextData, index: [] }
const shot = (name = 'shot.png', size = 100 * 1024) => ({ name, mimeType: 'image/png', buffer: Buffer.concat([png, Buffer.alloc(Math.max(0, size - png.length))]) })
const gif = { name: 'large.gif', mimeType: 'image/gif', buffer: Buffer.concat([Buffer.from('GIF89a'), Buffer.alloc(3 * 1024 * 1024)]) }
const badType = { name: 'photo.heic', mimeType: 'image/heic', buffer: Buffer.from('not an accepted image') }
const goodResult = { ok: true, slug, update: false, pr: { number: 7, url: `${SITE.repo}/pull/7` }, liveUrl: `/bots/${slug}`, warnings: [] }
const errors = [
  { file: `bots/${slug}/bot.yaml`, where: 'quotaCost', problem: '缺少额度消耗', fix: '补上真实额度消耗。' },
  { file: `bots/${slug}/DESIGN.md`, where: '正文', problem: '正文不足', fix: '补上真实使用情况。' },
]
function bundle(change) { const b = unpack(source.bundle); change(b); return pack(b) }
const invalid = bundle((b) => { b.files[`bots/${slug}/bot.yaml`] = b.files[`bots/${slug}/bot.yaml`].replace(/^quotaCost:.*\n/m, '') })
const four = bundle((b) => { b.screenshots = ['review-result.png', 'second.png', 'third.png', 'fourth.png'] })
const slot = (page, i = 0) => page.getByTestId('slot').nth(i)
const upload = async (page, i = 0, file = shot()) => { await slot(page, i).getByTestId('slot-input').setInputFiles(file); await expect(slot(page, i)).toHaveAttribute('data-state', 'done') }
const clipboard = (page) => page.evaluate(() => navigator.clipboard.readText())

async function mock(page, options = {}) {
  const control = { user: options.loggedOut ? null : { id: 1, login: 'demo' }, state: 'waiting_review', submitError: null, shotError: null, shotDelay: 0, holdSubmit: false, stale: false, ...options }
  const hits = { shots: [], submissions: [], statuses: 0, click: 0, stats: 0 }
  // 拒绝一切非本地请求（包括头像、外链、真实 GitHub）。
  await page.context().route('**/*', (r) => new URL(r.request().url()).hostname === '127.0.0.1' ? r.continue() : r.abort())
  await page.route('**/api-data/submit-context.json', (r) => control.noContext ? r.fulfill({ status: 503, body: '' }) : r.fulfill({ json: control.context || context }))
  await page.route('**/api/**', async (r) => {
    const path = new URL(r.request().url()).pathname
    if (path === '/api/auth/me') return r.fulfill(control.user ? { json: { ok: true, ...control.user } } : { status: 401, json: { error: 'unauthenticated' } })
    if (path === '/api/auth/start') return r.fulfill({ contentType: 'text/html', body: '<p>模拟登录页</p>' })
    if (path === '/api/auth/logout') { control.user = null; return r.fulfill({ status: 204 }) }
    if (path === '/api/click') { hits.click++; return r.fulfill({ json: { ok: true } }) }
    if (path === '/api/stats') { hits.stats++; return r.fulfill({ json: { ok: true, heat: {} } }) }
    if (path === '/api/submit/screenshot') {
      hits.shots.push({ bytes: r.request().postDataBuffer().length, type: r.request().headers()['content-type'] })
      if (control.holdShots?.includes(hits.shots.length)) return // route 不返回，真实 XHR 仍在等待
      if (control.shotDelay) await new Promise((resolve) => setTimeout(resolve, control.shotDelay))
      if (control.shotError) return r.fulfill(control.shotError)
      const format = r.request().headers()['content-type'].split('/')[1]
      return r.fulfill({ json: { ok: true, receipt: `receipt-${hits.shots.length}`, exp: Date.now() + 86400e3, sha: 'b'.repeat(40), size: r.request().postDataBuffer().length, format } })
    }
    if (path === '/api/submit/status') {
      hits.statuses++
      if (control.stale) return r.abort()
      return r.fulfill({ json: { ok: true, state: control.state, slug, url: goodResult.pr.url, liveUrl: control.state === 'live' ? goodResult.liveUrl : null } })
    }
    if (path === '/api/submit') {
      hits.submissions.push(r.request().postDataJSON())
      if (control.holdSubmit) return
      if (control.submitError === 'network') return r.abort()
      if (control.submitError) return r.fulfill(control.submitError)
      return r.fulfill({ json: goodResult })
    }
    return r.fulfill({ status: 404, json: { error: 'not_found' } })
  })
  return { control, hits }
}
async function open(page, input = source.token, suffix = '') {
  await page.goto(`/submit${suffix}#${input.startsWith('BZB1:') ? input : encode(input)}`)
  await expect(page.getByTestId(input === invalid ? 'validation-errors' : 'validation-ok')).toBeVisible()
}
async function ready(page) { await open(page); await upload(page); await page.getByTestId('license-checkbox').check() }
async function paste(page, text) { await page.goto('/submit'); await page.getByTestId('paste-box').locator('summary').click(); await page.getByTestId('paste-input').fill(text); await page.getByTestId('paste-submit').click() }
const apiError = (error, extra = {}, status = 400) => ({ status, json: { error, message: '不应直接显示的服务器原文', ...extra } })

// §16.1–5：指南 / 剪贴板 / 入口 / 焦点。
test('01 指南：提示词逐字一致、一个 h1、空输入不可读', async ({ page }) => {
  await mock(page); await page.goto('/submit')
  await expect(page.getByTestId('guide')).toBeVisible(); await expect(page.getByTestId('submit-prompt')).toHaveText(submitPrompt()); await expect(page.locator('h1')).toHaveCount(1)
  await page.getByTestId('paste-box').locator('summary').click(); await expect(page.getByTestId('paste-submit')).toHaveAttribute('aria-disabled', 'true')
})
test('02a 复制成功 1.8 秒恢复、单一播报', async ({ page, context, baseURL }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write'], { origin: baseURL }); await mock(page); await page.goto('/submit')
  await page.getByTestId('copy-submit-prompt').click(); expect(await clipboard(page)).toBe(submitPrompt()); await expect(page.getByTestId('copy-submit-prompt')).toHaveText('已复制 ✓')
  await expect(page.locator('.submit-page [aria-live]')).toHaveCount(1); await expect(page.locator('.submit-page [aria-live]')).toHaveText('已复制投稿提示词')
  await expect(page.getByTestId('copy-submit-prompt')).toHaveText('复制投稿提示词', { timeout: 2500 })
})
test('02b 剪贴板被拒：全选、Esc / 遮罩关闭与还焦点', async ({ page }) => {
  await mock(page); await page.addInitScript(() => Object.defineProperty(navigator, 'clipboard', { value: { writeText: () => Promise.reject(new Error('拒绝')) } })); await page.goto('/submit')
  for (const method of ['escape', 'backdrop']) {
    await page.getByTestId('copy-submit-prompt').click(); const dialog = page.getByTestId('submit-prompt-fallback'); const input = dialog.locator('textarea')
    await expect(input).toHaveValue(submitPrompt()); await expect(input).toBeFocused(); expect(await input.evaluate((el) => el.selectionEnd - el.selectionStart)).toBe(submitPrompt().length)
    if (method === 'escape') await page.keyboard.press('Escape'); else await page.mouse.click(3, 3)
    await expect(dialog).toHaveCount(0); await expect(page.getByTestId('copy-submit-prompt')).toBeFocused()
  }
})
test('03 令牌 1 秒内读出、清 hash、刷新恢复与重置', async ({ page }) => {
  await mock(page); await page.goto(`/submit#${source.token}`); await expect(page.getByTestId('validation-ok')).toContainText('示例·PRD 评审员', { timeout: 1000 }); expect(await page.evaluate(() => location.hash)).toBe('')
  await page.reload(); await expect(page.getByTestId('validation-ok')).toBeVisible(); await expect(page.getByTestId('resume-notice')).toBeVisible(); await page.getByTestId('bundle-reset').click(); await expect(page.getByTestId('guide')).toBeVisible()
})
test('04a 粘贴完整链接和带围栏令牌', async ({ page }) => {
  await mock(page); await paste(page, source.url); await expect(page.getByTestId('validation-ok')).toBeVisible(); await page.reload(); await page.getByTestId('bundle-reset').click()
  await page.getByTestId('paste-box').locator('summary').click(); await page.getByTestId('paste-input').fill('```text\n' + source.token + '\n```'); await page.getByTestId('paste-submit').click(); await expect(page.getByTestId('validation-ok')).toBeVisible()
})
test('04b 坏令牌：原因、AI 复制和重新粘贴焦点', async ({ page, context, baseURL }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write'], { origin: baseURL }); await mock(page); await paste(page, 'BZB1:xxxx')
  await expect(page.getByTestId('bundle-error-reason')).toContainText('没复制完整'); await expect(page.locator('#bundle-error-title')).toBeFocused(); await page.getByTestId('bundle-error-copy').click(); expect(await clipboard(page)).toContain('make-submission-link')
  await expect(page.getByTestId('preview')).toHaveCount(0); await page.getByRole('button', { name: '重新粘贴' }).click(); await expect(page.getByTestId('paste-input')).toBeFocused()
})
test('05 缺 quotaCost：四项诊断、复制 CLI 格式、摘要焦点和截图锁定', async ({ page, context, baseURL }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write'], { origin: baseURL }); await mock(page); await paste(page, invalid)
  await expect(page.locator('#check-summary')).toContainText('处要改'); await expect(page.locator('#check-summary')).toBeFocused()
  for (const label of ['位置', '问题', '改法']) await expect(page.getByTestId('validation-error-item').first()).toContainText(label)
  await page.getByTestId('copy-errors').click(); expect(await clipboard(page)).toMatch(/^投稿页检查没通过/); expect(await clipboard(page)).toContain('✗ bots/'); await expect(page.getByTestId('step-shots')).toHaveAttribute('data-state', 'locked')
})
test('06 预览按钮无 href、无点击和热度请求', async ({ page }) => {
  const { hits } = await mock(page); await open(page)
  for (const id of ['btn-import', 'btn-prompt']) { const button = page.getByTestId('preview-card').getByTestId(id); await expect(button).toHaveAttribute('aria-disabled', 'true'); await expect(button).not.toHaveAttribute('href'); await button.dispatchEvent('click') }
  await expect(page.getByTestId('preview-actions-note')).toHaveText('上架后可用'); expect(hits.click).toBe(0); expect(hits.stats).toBe(0); await expect(page.locator('a[href="https://x.ai/bot/demo-prd-reviewer-000"]')).toHaveCount(0)
})
test('07 详情预览不嵌套 main/h1、源码不链接、未放图有占位', async ({ page }) => {
  await mock(page); await open(page); await page.getByTestId('preview-tab-detail').click(); const detail = page.getByTestId('preview-detail')
  await expect(detail).toBeVisible(); await expect(detail.locator('main, h1')).toHaveCount(0); await expect(detail.getByTestId('section-skills').locator('a')).toHaveCount(0); await expect(detail).toContainText('上架后可查看源码'); await expect(detail).toContainText('截图 1（待放入）'); await expect(page.locator('.submit-page [aria-live]')).toHaveCount(1)
})
for (const dark of [false, true]) test(`预览切换：${dark ? '深' : '浅'}色选中块跟随标签且文字对比度达标`, async ({ page }) => {
  await mock(page); await page.setViewportSize({ width: 1280, height: 900 }); await open(page)
  await page.evaluate((dark) => document.documentElement.classList.toggle('dark', dark), dark)
  for (const tab of ['detail', 'card']) {
    const button = page.getByTestId(`preview-tab-${tab}`)
    const other = page.getByTestId(`preview-tab-${tab === 'detail' ? 'card' : 'detail'}`)
    await button.click()
    await expect(button).toHaveAttribute('aria-pressed', 'true')
    await expect(other).toHaveAttribute('aria-pressed', 'false')
    // ::after 是真实选中块，不能只断言 aria-pressed 或 data-sort。
    // 用计算样式推算滑块中心，并等待滑动和文字颜色过渡完成。
    await expect(async () => {
      const metrics = await button.evaluate((el) => {
        const track = el.closest('.sort-controls'), block = getComputedStyle(track, '::after')
        const trackRect = track.getBoundingClientRect(), buttonRect = el.getBoundingClientRect()
        const transform = new DOMMatrixReadOnly(block.transform === 'none' ? undefined : block.transform)
        const center = trackRect.left + track.clientLeft + parseFloat(block.left) + parseFloat(block.width) / 2 + transform.m41
        const canvas = document.createElement('canvas'), ctx = canvas.getContext('2d')
        const lum = (color) => {
          ctx.clearRect(0, 0, 1, 1); ctx.fillStyle = color; ctx.fillRect(0, 0, 1, 1)
          const c = [...ctx.getImageData(0, 0, 1, 1).data].slice(0, 3).map((x) => { x /= 255; return x <= .04045 ? x / 12.92 : ((x + .055) / 1.055) ** 2.4 })
          return c[0] * .2126 + c[1] * .7152 + c[2] * .0722
        }
        const color = getComputedStyle(el).color, background = block.backgroundColor
        const foregroundLum = lum(color), backgroundLum = lum(background)
        return {
          offset: Math.abs(center - (buttonRect.left + buttonRect.width / 2)),
          contrast: (Math.max(foregroundLum, backgroundLum) + .05) / (Math.min(foregroundLum, backgroundLum) + .05),
          color, background, content: block.content,
        }
      })
      expect(metrics.content).not.toBe('none')
      expect(metrics.offset).toBeLessThanOrEqual(4)
      expect(metrics.contrast).toBeGreaterThanOrEqual(4.5)
      expect(metrics.color).toBe('rgb(255, 255, 255)')
      expect(metrics.background).toBe('rgb(20, 20, 24)')
    }).toPass({ timeout: 5000 })
    await expect(page.getByTestId(`preview-${tab}`)).toBeVisible()
  }
})
test('详情预览桌面溢出显示滚动提示，滚到底隐藏', async ({ page }) => {
  await mock(page); await page.setViewportSize({ width: 1280, height: 900 }); await open(page)
  await page.getByTestId('preview-tab-detail').click()
  const hint = page.getByTestId('preview-scroll-hint')
  const scroll = page.locator('.submit-preview-scroll')
  await expect(hint).toBeVisible()
  await expect(hint).toHaveCSS('pointer-events', 'none')
  await scroll.evaluate(el => { el.scrollTop = el.scrollHeight })
  await expect(hint).not.toBeVisible()
  await scroll.evaluate(el => { el.scrollTop = 0 })
  await expect(hint).toBeVisible()
  await page.setViewportSize({ width: 390, height: 844 })
  await expect(hint).not.toBeVisible()
  await page.setViewportSize({ width: 1280, height: 10000 })
  await expect(hint).not.toBeVisible()
})
test('08 手机折叠、平板展开、桌面 sticky、名字切详情', async ({ page }) => {
  await mock(page); await page.setViewportSize({ width: 390, height: 844 }); await open(page); await expect(page.getByTestId('preview-toggle')).toHaveAttribute('aria-expanded', 'false'); await page.getByTestId('preview-toggle').click(); await expect(page.getByTestId('preview-toggle')).toHaveAttribute('aria-expanded', 'true')
  await page.getByTestId('preview-card').getByTestId('detail-link').click(); await expect(page.getByTestId('preview-detail')).toBeVisible()
  await page.setViewportSize({ width: 768, height: 900 }); await page.reload(); await expect(page.getByTestId('preview-toggle')).toHaveAttribute('aria-expanded', 'true')
  await page.setViewportSize({ width: 1280, height: 900 }); await expect(page.getByTestId('preview-toggle')).not.toBeVisible(); await expect(page.getByTestId('preview')).toHaveCSS('position', 'sticky')
})
test('09 未登录、注册链接、跳转前暂存', async ({ page }) => {
  await mock(page, { loggedOut: true }); await open(page); await expect(page.getByTestId('slots-locked')).toContainText('先登录'); await expect(page.getByTestId('signup-link')).toHaveAttribute('href', 'https://github.com/signup')
  expect(await page.evaluate(() => sessionStorage.getItem('bz-submit'))).toContain('BOT-ZHIPIN-BUNDLE v1'); await page.getByTestId('login-button').click(); await expect(page).toHaveURL(/\/api\/auth\/start$/)
})
test('10 已登录、回跳聚焦③和播报', async ({ page }) => {
  await mock(page); await open(page, source.token, '?login=ok'); await expect(page.getByTestId('user-login')).toHaveText('@demo'); await expect(page.getByTestId('step-login')).toHaveAttribute('data-state', 'done'); await expect(page.getByTestId('slots-locked')).toHaveCount(0); await expect(page.locator('#shots-title')).toBeFocused(); await expect(page.locator('.submit-page [aria-live]')).toHaveText('已登录为 @demo')
})
for (const [kind, text] of [['cancelled', '取消了登录'], ['failed', '没成功'], ['expired', '过期了']]) test(`11 登录 ${kind} 参数被清除`, async ({ page }) => {
  await mock(page, { loggedOut: true }); await open(page, source.token, '?login=' + kind); await expect(page.getByTestId('login-notice')).toHaveAttribute('data-kind', kind); await expect(page.getByTestId('login-notice')).toContainText(text); expect(await page.evaluate(() => location.search)).toBe('')
})
test('12 100KB PNG：真实上传进度到 done', async ({ page }) => {
  await mock(page, { shotDelay: 500 }); await open(page); await slot(page).getByTestId('slot-input').setInputFiles(shot()); await expect(slot(page)).toHaveAttribute('data-state', 'uploading'); await expect(page.getByTestId('slot-progress')).toBeVisible(); await expect(slot(page)).toHaveAttribute('data-state', 'done'); await expect(page.getByTestId('slot-thumb')).toBeVisible(); await expect(page.getByTestId('step-shots').locator('.submit-step-status')).toHaveText('1 / 1 张')
})
test('13a 3MB PNG：真实 canvas 压缩为 ≤2MB JPEG', async ({ page }) => {
  const { hits } = await mock(page)
  await page.addInitScript(() => { const original = HTMLCanvasElement.prototype.toBlob; HTMLCanvasElement.prototype.toBlob = function (...args) { setTimeout(() => original.apply(this, args), 150) } })
  await open(page); await slot(page).getByTestId('slot-input').setInputFiles(shot('large.png', 3 * 1024 * 1024)); await expect(slot(page)).toHaveAttribute('data-state', 'compressing'); await expect(slot(page)).toHaveAttribute('data-state', 'done'); expect(hits.shots[0].type).toBe('image/jpeg'); expect(hits.shots[0].bytes).toBeLessThanOrEqual(2097152)
})
test('13b GIF 超大 / HEIC / MIME 与文件头不符：不上传', async ({ page }) => {
  const { hits } = await mock(page); await open(page)
  for (const [file, state] of [[gif, 'too-large'], [badType, 'unsupported'], [{ name: 'fake.png', mimeType: 'image/png', buffer: Buffer.from('not png') }, 'unsupported']]) { await slot(page).getByTestId('slot-input').setInputFiles(file); await expect(slot(page)).toHaveAttribute('data-state', state) }
  expect(hits.shots).toHaveLength(0)
})
test('14 上传 500 → 重试成功', async ({ page }) => {
  const { control } = await mock(page, { shotError: apiError('github_error', {}, 500) }); await open(page); await slot(page).getByTestId('slot-input').setInputFiles(shot()); await expect(slot(page)).toHaveAttribute('data-state', 'failed'); control.shotError = null; await page.getByTestId('slot-retry').click(); await expect(slot(page)).toHaveAttribute('data-state', 'done')
})
test('15 触摸文案和 44px 目标', async ({ browser, baseURL }) => {
  const ctx = await browser.newContext({ baseURL, isMobile: true, hasTouch: true, viewport: { width: 390, height: 844 } })
  try { const page = await ctx.newPage(); await mock(page); await open(page); await expect(slot(page)).toContainText('点这里选一张图'); await expect(slot(page)).not.toContainText('拖'); await expect(slot(page)).not.toContainText('粘贴'); await targets(page, 44) } finally { await ctx.close() }
})
async function dragFiles(page, count = 3) {
  const dt = await page.evaluateHandle(({ bytes, count }) => { const d = new DataTransfer(); for (let i = 0; i < count; i++) d.items.add(new File([new Uint8Array(bytes)], `shot-${i}.png`, { type: 'image/png' })); return d }, { bytes: [...png], count })
  await slot(page).dispatchEvent('drop', { dataTransfer: dt }); await dt.dispose()
}
test('16 多图拖入自动加选填槽、最多两个并发、队列取消', async ({ page }) => {
  const { hits } = await mock(page, { holdShots: [1, 2] }); await open(page); await dragFiles(page)
  await expect(page.getByTestId('slot')).toHaveCount(3); for (const i of [1, 2]) await expect(slot(page, i)).toHaveAttribute('data-required', 'false')
  await expect(slot(page, 2)).toHaveAttribute('data-state', 'queued'); await expect.poll(() => hits.shots.length).toBe(2); await slot(page, 2).getByTestId('slot-cancel').click(); await expect(slot(page, 2)).toHaveAttribute('data-state', 'empty')
})
test('17 刷新恢复回执/缩略图，不重新上传；同 slug 新包保留图', async ({ page }) => {
  const { hits } = await mock(page); await open(page); await upload(page); await page.reload(); await expect(slot(page)).toHaveAttribute('data-state', 'done'); await expect(page.getByTestId('slot-thumb')).toBeVisible(); expect(hits.shots).toHaveLength(1)
  const revised = bundle((b) => { b.files[`bots/${slug}/DESIGN.md`] += '\n补充：本轮增加了对边界的说明。\n' }); await open(page, revised); await expect(page.getByTestId('resume-notice')).toContainText('投稿包已更新，截图还在。'); await expect(slot(page)).toHaveAttribute('data-state', 'done')
})
test('18 未授权按钮可聚焦、点击定位勾选框', async ({ page }) => {
  await mock(page); await open(page); await upload(page); await expect(page.getByTestId('submit-button')).toHaveAttribute('aria-disabled', 'true'); await expect(page.getByTestId('submit-blockers')).toContainText('还没勾选授权'); await page.getByTestId('submit-button').dispatchEvent('click'); await expect(page.getByTestId('license-checkbox')).toBeFocused()
})
test('19 提交正文、结果焦点、10秒轮询到 live 停止、刷新恢复', async ({ page }) => {
  const { control, hits } = await mock(page); await ready(page); await page.clock.install(); await page.getByTestId('submit-button').click(); await expect(page.getByTestId('submit-result')).toBeVisible(); await expect(page.locator('#result-title')).toBeFocused(); await expect(page.locator('[data-step="pr"]')).toHaveAttribute('data-state', 'done'); await expect(page.getByTestId('pr-link')).toHaveAttribute('href', goodResult.pr.url)
  expect(hits.submissions[0]).toEqual({ bundle: source.bundle, screenshots: ['receipt-1'], license: true }); await page.clock.runFor(10000); await expect.poll(() => hits.statuses).toBe(1); control.state = 'live'; await page.clock.runFor(10000); await expect(page.locator('[data-step="live"]')).toHaveAttribute('data-state', 'done'); await expect(page.getByTestId('live-link')).toHaveAttribute('href', `/bots/${slug}`); await page.clock.runFor(20000); expect(hits.statuses).toBe(2)
  await page.reload(); await expect(page.getByTestId('submit-result')).toBeVisible(); await page.getByTestId('submit-another').click(); await expect(page.getByTestId('guide')).toBeVisible()
})
test('20 服务端 422 两条诊断回①及焦点', async ({ page }) => {
  await mock(page, { submitError: apiError('invalid', { errors }, 422) }); await ready(page); await page.getByTestId('submit-button').click(); await expect(page.getByTestId('step-check')).toHaveAttribute('data-state', 'error'); await expect(page.getByTestId('validation-error-item')).toHaveCount(2); await expect(page.locator('#check-summary')).toBeFocused()
})
test('21 429 Retry-After 90 倒计时到期恢复', async ({ page }) => {
  await mock(page, { submitError: { ...apiError('rate_limited', {}, 429), headers: { 'Retry-After': '90' } } }); await ready(page); await page.clock.install(); await page.getByTestId('submit-button').click(); await expect(page.getByTestId('submit-error')).toHaveAttribute('data-code', 'rate_limited'); await expect(page.getByTestId('retry-countdown')).toContainText('分钟'); await expect(page.getByTestId('submit-button')).toHaveAttribute('aria-disabled', 'true'); await page.clock.runFor(91000); await expect(page.getByTestId('submit-button')).toHaveAttribute('aria-disabled', 'false')
})
for (const code of ['slug_taken', 'pr_limit', 'receipt_invalid', 'github_error', 'submit_disabled']) test(`22 ${code} 文案与下一步`, async ({ page }) => {
  await mock(page, { submitError: apiError(code, { slots: [0], requestId: 'test1234', pulls: [{ number: 9, url: `${SITE.repo}/pull/9`, slug: 'pending-bot' }] }, code === 'submit_disabled' ? 503 : 400) }); await ready(page); await page.getByTestId('submit-button').click(); await expect(page.getByTestId('submit-error')).toHaveAttribute('data-code', code); await expect(page.getByTestId('submit-error')).not.toContainText('不应直接显示的服务器原文')
  if (code === 'receipt_invalid') { await expect(slot(page)).toHaveAttribute('data-state', 'failed'); await expect(slot(page)).toBeFocused() }
  if (code === 'github_error') await expect(page.getByTestId('request-id')).toContainText('test1234')
  if (code === 'pr_limit') await expect(page.getByTestId('submit-error')).toContainText('pending-bot · PR #9')
  if (code === 'submit_disabled') await expect(page.getByTestId('issue-fallback')).toHaveAttribute('href', new RegExp('^' + SITE.repo + '/issues/new\\?template=submit-bot.yml'))
})
test('23 微信复制链接包含令牌，关闭本标签页记忆；飞书不拦', async ({ browser, baseURL }) => {
  for (const ua of ['MicroMessenger', 'Lark Feishu']) {
    const ctx = await browser.newContext({ baseURL, userAgent: ua, permissions: ['clipboard-read', 'clipboard-write'] })
    try { const page = await ctx.newPage(); await mock(page); await open(page); if (ua === 'MicroMessenger') { await expect(page.getByTestId('inapp-warning')).toBeVisible(); await page.getByTestId('inapp-copy-link').click(); expect(await clipboard(page)).toContain('/submit#BZB1:'); await page.getByTestId('inapp-dismiss').click(); await page.reload() } await expect(page.getByTestId('inapp-warning')).toHaveCount(0) } finally { await ctx.close() }
  }
})
for (const width of [1280, 768, 390, 320]) test(`24 ${width}px 所有主要状态无横向滚动`, async ({ page }) => {
  await mock(page); await page.setViewportSize({ width, height: 900 }); await page.goto('/submit'); await overflow(page); await open(page); await overflow(page)
  if (width < 768) await page.getByTestId('preview-toggle').click(); await page.getByTestId('preview-tab-detail').click(); await overflow(page); await upload(page); await page.getByTestId('license-checkbox').check(); await page.getByTestId('submit-button').click(); await expect(page.getByTestId('submit-result')).toBeVisible(); await overflow(page)
})
async function overflow(page) { expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true) }
async function targets(page, minimum) {
  for (const button of await page.locator('.submit-page button, .submit-page a.shelf-button, .submit-page [role="button"]').all()) if (await button.isVisible()) expect(await button.evaluate((el) => (el.closest('.sort-controls, .bz-seg') || el).getBoundingClientRect().height)).toBeGreaterThanOrEqual(minimum) // v5：分段控件整条算一个点按高度，每一项的点按范围撑满整条
}
test('25 桌面可见控件 ≥40px；键盘顺序①→预览→②→③→④', async ({ page }) => {
  await mock(page, { loggedOut: true }); await open(page); await targets(page, 40)
  await page.getByTestId('preview-tab-detail').focus(); await page.keyboard.press('Tab'); await expect(page.getByTestId('preview-card').getByTestId('avatar')).toBeFocused()
  await page.getByTestId('preview-card').getByTestId('btn-prompt').focus(); await page.keyboard.press('Tab'); await expect(page.getByTestId('login-button')).toBeFocused()
  await page.getByTestId('submit-button').dispatchEvent('click'); await expect(page.getByTestId('login-button')).toBeFocused()
})
for (const dark of [false, true]) test(`26 ${dark ? '深' : '浅'}色三级/成功/危险文字对比度`, async ({ page }) => {
  await mock(page); await open(page); await page.evaluate((dark) => document.documentElement.classList.toggle('dark', dark), dark)
  const ratios = await page.getByTestId('submit-page').evaluate((el) => {
    const canvas = document.createElement('canvas'), ctx = canvas.getContext('2d')
    const lum = (color) => { ctx.fillStyle = color; ctx.fillRect(0, 0, 1, 1); const c = [...ctx.getImageData(0, 0, 1, 1).data].slice(0, 3).map((x) => { x /= 255; return x <= .04045 ? x / 12.92 : ((x + .055) / 1.055) ** 2.4 }); return c[0] * .2126 + c[1] * .7152 + c[2] * .0722 }
    return ['--bz-text-3', '--bz-success-text', '--bz-danger'].map((token) => { const probe = document.createElement('span'); probe.style.color = `var(${token})`; probe.style.background = token === '--bz-danger' ? 'color-mix(in srgb, var(--bz-danger) 8%, var(--bz-paper))' : 'var(--bz-paper)'; el.append(probe); const a = lum(getComputedStyle(probe).color), b = lum(getComputedStyle(probe).backgroundColor); probe.remove(); return (Math.max(a, b) + .05) / (Math.min(a, b) + .05) })
  }); for (const ratio of ratios) expect(ratio).toBeGreaterThanOrEqual(4.5)
})
test('27 减少动效：进度不缓动、成功不位移/缩放、头像不跳', async ({ page }) => {
  await mock(page, { shotDelay: 400 }); await page.emulateMedia({ reducedMotion: 'reduce' }); await open(page); await slot(page).getByTestId('slot-input').setInputFiles(shot()); await expect(page.getByTestId('slot-progress')).toBeVisible(); expect(await page.getByTestId('slot-progress').locator('span').evaluate((el) => getComputedStyle(el).transitionProperty)).not.toContain('width'); await expect(slot(page)).toHaveAttribute('data-state', 'done'); await page.getByTestId('license-checkbox').check(); await page.getByTestId('submit-button').click(); await expect(page.getByTestId('submit-result')).toBeVisible(); await page.getByTestId('preview-card').getByTestId('avatar').hover()
  expect(await page.evaluate(() => document.getAnimations().some((a) => a.effect?.getKeyframes().some((f) => f.transform && f.transform !== 'none')))).toBe(false)
})

// 超出 §16 的失效/并发/安全回归。
test('补充：会话过期保留已传图、重登同账号恢复、换账号丢旧回执', async ({ page }) => {
  const { control } = await mock(page); await ready(page); control.submitError = apiError('session_expired', {}, 401); await page.getByTestId('submit-button').click(); await expect(page.getByTestId('login-notice')).toHaveAttribute('data-kind', 'expired'); await expect(slot(page)).toHaveAttribute('data-state', 'done'); await expect(page.getByTestId('slots-locked')).toBeVisible(); await expect(page.getByTestId('login-button')).toBeFocused()
  await page.reload(); await expect(slot(page)).toHaveAttribute('data-state', 'done'); control.user = { id: 2, login: 'other' }; await page.reload(); await expect(page.getByTestId('login-notice')).toHaveAttribute('data-kind', 'switched'); await expect(slot(page)).toHaveAttribute('data-state', 'empty')
})
test('补充：context 不可用仍单包校验；已有 slug 本人更新 / 别人禁止', async ({ page }) => {
  const { control } = await mock(page, { noContext: true }); await open(page); await expect(page.getByTestId('context-unavailable')).toBeVisible()
  control.noContext = false; control.context = { ...context, index: [{ slug, authorGithub: 'DeMo', addedAt: '2026-11-01' }] }; await page.reload(); await expect(page.getByTestId('submit-button')).toHaveText('提交更新'); await page.getByTestId('preview-tab-detail').click(); await expect(page.getByTestId('preview-detail')).toContainText('2026-11-01')
  control.user = { id: 2, login: 'other' }; await page.reload(); await expect(page.getByTestId('slug-notice')).toContainText('已经被别人用了'); await expect(page.getByTestId('submit-button')).toHaveAttribute('aria-disabled', 'true')
})
test('补充：提交中 inert 和2秒提示，30秒超时恢复', async ({ page }) => {
  await mock(page, { holdSubmit: true }); await ready(page); await page.clock.install(); await page.getByTestId('submit-button').click(); await expect(page.getByTestId('step-check')).toHaveAttribute('inert', ''); await expect(page.getByTestId('step-submit')).toHaveAttribute('inert', ''); await expect(page.getByTestId('preview')).not.toHaveAttribute('inert'); await page.clock.runFor(2100); await expect(page.getByTestId('step-submit')).toContainText('正在创建 PR（合并请求）'); await page.clock.runFor(30000); await expect(page.getByTestId('submit-error')).toHaveAttribute('data-code', 'github_error'); await expect(page.getByTestId('step-submit')).not.toHaveAttribute('inert')
})
test('补充：状态可见性、失败保留状态、closed 后停轮询', async ({ page }) => {
  const { control, hits } = await mock(page); await ready(page); await page.clock.install(); await page.getByTestId('submit-button').click(); await expect(page.getByTestId('submit-result')).toBeVisible()
  await page.evaluate(() => { Object.defineProperty(document, 'visibilityState', { configurable: true, value: 'hidden' }); document.dispatchEvent(new Event('visibilitychange')) }); await page.clock.runFor(20000); expect(hits.statuses).toBe(0)
  control.stale = true; await page.evaluate(() => { Object.defineProperty(document, 'visibilityState', { configurable: true, value: 'visible' }); document.dispatchEvent(new Event('visibilitychange')) }); await expect(page.getByTestId('status-stale')).toBeVisible(); await expect(page.locator('[data-step="review"]')).toHaveAttribute('data-state', 'current')
  control.stale = false; control.state = 'closed'; await page.clock.runFor(10000); await expect(page.locator('[data-step="review"]')).toHaveAttribute('data-state', 'failed'); const count = hits.statuses; await page.clock.runFor(30000); expect(hits.statuses).toBe(count)
})
test('补充：网络连续两次失败出 Issue 备用；长链接明文退路', async ({ page }) => {
  const { control } = await mock(page, { submitError: 'network' }); await ready(page); await page.getByTestId('submit-button').click(); await expect(page.getByTestId('submit-error')).toHaveAttribute('data-code', 'network_error'); await expect(page.getByTestId('issue-fallback')).toHaveCount(0); await page.getByTestId('submit-button').click(); await expect(page.getByTestId('issue-fallback')).toBeVisible()
  control.submitError = apiError('submit_disabled', {}, 503)
  const long = bundle((b) => { b.files[`bots/${slug}/ROLE.md`] += '\n' + Array.from({ length: 1400 }, () => randomBytes(8).toString('hex')).join(' ') })
  await open(page, long); await expect(slot(page)).toHaveAttribute('data-state', 'done'); await page.getByTestId('license-checkbox').check(); await page.getByTestId('submit-button').click(); await expect(page.getByTestId('issue-fallback-paste')).toBeVisible(); await expect(page.getByTestId('issue-fallback')).not.toHaveAttribute('href', /bundle=/)
})
test('补充：恶意投稿仅作数据，外链图片不加载、错误字段不做链接', async ({ page }) => {
  await mock(page)
  const evil = bundle((b) => { b.files[`bots/${slug}/DESIGN.md`] += '\n<script>window.__xss=1</script> <img src=x onerror="window.__xss=2"> {{ window.__xss = 3 }} [坏](javascript:alert(1))\n![外图](https://evil.example/track.png)\n# 又一个大标题\n'; b.files[`bots/${slug}/bot.yaml`] = b.files[`bots/${slug}/bot.yaml`].replace('https://x.ai/bot/demo-prd-reviewer-000', 'javascript:alert(1)') })
  await page.goto('/submit#' + encode(evil)); await expect(page.getByTestId('validation-errors')).toBeVisible(); await page.getByTestId('preview-tab-detail').click(); await expect(page.locator('h1')).toHaveCount(1); await expect(page.getByTestId('preview-detail').locator('script, img[onerror], img[src^="https:"]')).toHaveCount(0); await expect(page.locator('a[href^="javascript:"]')).toHaveCount(0); expect(await page.evaluate(() => window.__xss)).toBeUndefined()
})
test('补充：槽位键盘选图、粘贴、选填移除、最多12张', async ({ page }) => {
  await mock(page); await open(page); await slot(page).focus(); const choosing = page.waitForEvent('filechooser'); await page.keyboard.press('Enter'); await (await choosing).setFiles(shot()); await expect(slot(page)).toHaveAttribute('data-state', 'done')
  await page.getByTestId('slot-add').click(); await slot(page, 1).focus(); await page.evaluate((bytes) => { const d = new DataTransfer(); d.items.add(new File([new Uint8Array(bytes)], 'paste.png', { type: 'image/png' })); document.activeElement.dispatchEvent(new ClipboardEvent('paste', { clipboardData: d, bubbles: true })) }, [...png]); await expect(slot(page, 1)).toHaveAttribute('data-state', 'done'); await slot(page, 1).getByTestId('slot-remove').click(); await expect(page.getByTestId('slot')).toHaveCount(1)
  for (let i = 1; i < 12; i++) await page.getByTestId('slot-add').click(); await expect(page.getByTestId('slot-add')).toHaveCount(0); await expect(page.getByTestId('step-shots')).toContainText('最多 12 张')
})

// 72 张存档：真实 UI 状态，route 假后端；不直接修改 Vue 状态或测试专用 UI 开关。
const states = ['guide', 'guide-paste', 'bundle-error', 'invalid', 'valid-logged-out', 'valid-logged-in-empty', 'slot-dragover', 'slots-mixed', 'blockers', 'submitting', 'submitted-review', 'submitted-live', 'error-rate-limited', 'error-disabled', 'preview-detail', 'inapp']
const starred = ['guide', 'invalid', 'valid-logged-out', 'submitted-review']
async function screenshotState(page, state) {
  const { control } = await mock(page, { loggedOut: state === 'valid-logged-out' })
  if (state === 'inapp') await page.addInitScript(() => Object.defineProperty(navigator, 'userAgent', { value: 'MicroMessenger' }))
  if (['guide', 'guide-paste', 'bundle-error', 'invalid'].includes(state)) {
    if (state === 'bundle-error' || state === 'invalid') await paste(page, state === 'invalid' ? invalid : 'BZB1:xxxx')
    else { await page.goto('/submit'); if (state === 'guide-paste') await page.getByTestId('paste-box').locator('summary').click() }
    await expect(page.getByTestId(state === 'bundle-error' ? 'bundle-error' : state === 'invalid' ? 'validation-errors' : 'guide')).toBeVisible(); return
  }
  if (state === 'slots-mixed') {
    // 仅固定浏览器上传事件的进度；请求/回执仍由 page.route，图片压缩和 UI 都是真实代码。
    await page.addInitScript(() => { const send = XMLHttpRequest.prototype.send; XMLHttpRequest.prototype.send = function (body) { if (body?.name === 'slow.png') { const progress = this.upload.onprogress; this.upload.onprogress = () => progress?.call(this.upload, { lengthComputable: true, loaded: 40, total: 100 }); setTimeout(() => this.upload.dispatchEvent(new ProgressEvent('progress', { lengthComputable: true, loaded: 40, total: 100 })), 50) } return send.call(this, body) } })
    await open(page, four); await upload(page)
    control.holdShots = [2]; await slot(page, 1).getByTestId('slot-input').setInputFiles(shot('slow.png')); await expect(slot(page, 1)).toHaveAttribute('data-state', 'uploading')
    control.shotError = apiError('github_error', {}, 500); await slot(page, 2).getByTestId('slot-input').setInputFiles(shot('fail.png')); await expect(slot(page, 2)).toHaveAttribute('data-state', 'failed'); await slot(page, 3).getByTestId('slot-input').setInputFiles(gif); await expect(slot(page, 3)).toHaveAttribute('data-state', 'too-large'); await expect(slot(page, 1).getByTestId('slot-progress')).toHaveAttribute('aria-valuenow', '40'); return
  }
  await open(page)
  if (state === 'slot-dragover') { await slot(page).dispatchEvent('dragover'); return }
  if (state === 'preview-detail') { if (await page.getByTestId('preview-toggle').isVisible() && await page.getByTestId('preview-toggle').getAttribute('aria-expanded') === 'false') await page.getByTestId('preview-toggle').click(); await page.getByTestId('preview-tab-detail').click(); return }
  if (['blockers', 'submitting', 'submitted-review', 'submitted-live', 'error-rate-limited', 'error-disabled'].includes(state)) {
    await upload(page)
    if (state === 'blockers') return
    await page.getByTestId('license-checkbox').check()
    if (state === 'submitting') control.holdSubmit = true
    if (state === 'error-rate-limited') control.submitError = { ...apiError('rate_limited', {}, 429), headers: { 'Retry-After': '90' } }
    if (state === 'error-disabled') control.submitError = apiError('submit_disabled', {}, 503)
    if (state === 'submitted-live') { control.state = 'live'; await page.clock.install() }
    await page.getByTestId('submit-button').click()
    if (state.startsWith('submitted')) { await expect(page.getByTestId('submit-result')).toBeVisible(); if (state === 'submitted-live') { await page.clock.runFor(10000); await expect(page.getByTestId('live-link')).toBeVisible() } }
    else if (state.startsWith('error')) await expect(page.getByTestId('submit-error')).toBeVisible()
    else await expect(page.getByTestId('submit-button')).toHaveText('正在提交…')
  }
}
for (const dark of [false, true]) for (const width of dark ? [1280, 390] : [1280, 768, 390, 320]) for (const state of dark ? starred : states) {
  test(`截图 ${state}-${width}${dark ? '-dark' : ''}`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 }); await page.emulateMedia({ colorScheme: dark ? 'dark' : 'light' }); await screenshotState(page, state)
    await page.evaluate(async () => { await document.fonts.ready; window.scrollTo(0, 0); for (const animation of document.getAnimations()) if (animation.effect?.getComputedTiming().iterations !== Infinity) animation.finish() })
    await page.waitForTimeout(350); await overflow(page); mkdirSync('test-results/submit', { recursive: true }); await page.screenshot({ path: `test-results/submit/${state}-${width}${dark ? '-dark' : ''}.png`, fullPage: true, animations: 'disabled' })
  })
}
