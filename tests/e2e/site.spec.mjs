import { test, expect } from '@playwright/test'
import { mkdir } from 'node:fs/promises'
import { join } from 'node:path'
import { CONTRIBUTE_URL, DEFAULT_PITCHES, installPrompt } from '../../site/.vitepress/meta.mjs'
import { renderDesigns } from '../../site/.vitepress/data/design-renderer.mjs'

const weekly = 'demo-weekly-digest'
const reviewer = 'demo-prd-reviewer'
const external = 'demo-external'
const card = (page, slug) => page.locator(`[data-testid="bot-card"][data-slug="${slug}"]`)
const order = (page) => page.getByTestId('bot-card').evaluateAll((nodes) => nodes.map((node) => node.dataset.slug))
const stats = { ok: true, heat: { [external]: 5, [reviewer]: 2 }, byKind: {} }

async function mockStats(page, data = stats) {
  await page.route('**/api/stats', (route) => route.fulfill({ json: data }))
}

test.beforeEach(async ({ context, page }) => {
  await context.route('https://x.ai/**', (route) => route.fulfill({ contentType: 'text/html', body: '<p>模拟导入页面</p>' }))
  await page.route('**/api/click', (route) => route.fulfill({ json: { ok: true, counted: true, heat: 99 } }))
})

test('接口失败：最新排序、热度占位、链接与外部收录按钮', async ({ page }) => {
  await page.route('**/api/stats', (route) => route.abort())
  await page.goto('/')
  await expect(page.getByTestId('sort-new')).toHaveAttribute('aria-pressed', 'true')
  expect(await order(page)).toEqual([weekly, reviewer, external])
  await expect(card(page, weekly).getByTestId('heat')).toHaveText('热度 —')
  await expect(page.getByTestId('contribute-link')).toHaveAttribute('href', CONTRIBUTE_URL)
  await expect(card(page, reviewer).getByTestId('author-link')).toHaveAttribute('href', 'https://github.com/example-user')
  await expect(card(page, external).getByTestId('author-link')).toHaveAttribute('href', 'https://x.ai/bot/demo-external-000')
  await expect(card(page, external).getByTestId('btn-prompt')).toHaveCount(0)
  await expect(card(page, weekly).getByTestId('detail-link')).toHaveAttribute('href', `/bots/${weekly}`)
})

test('延迟失败不覆盖用户手动排序；HTTP / JSON 失败均可降级', async ({ page }) => {
  let release
  const gate = new Promise((resolve) => { release = resolve })
  await page.route('**/api/stats', async (route) => {
    await gate
    await route.fulfill({ status: 500, json: { ok: false } })
  })
  await page.goto('/')
  await page.getByTestId('sort-hot').click()
  const response = page.waitForResponse('**/api/stats')
  release()
  await response
  await expect(page.getByTestId('sort-hot')).toHaveAttribute('aria-pressed', 'true')
  await expect(card(page, weekly).getByTestId('heat')).toHaveText('热度 —')
  await page.unroute('**/api/stats')
  await page.route('**/api/stats', (route) => route.fulfill({ contentType: 'text/html', body: '<h1>没有后端</h1>' }))
  await page.reload()
  await expect(page.getByTestId('sort-new')).toHaveAttribute('aria-pressed', 'true')
})

test('热度更新不跳位、切换后重排、复制反馈与导入上报', async ({ page, context, baseURL }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write'], { origin: baseURL })
  await mockStats(page)
  const clicks = []
  await page.route('**/api/click', (route) => {
    clicks.push(route.request().postDataJSON())
    return route.fulfill({ json: { ok: true, counted: true, heat: 99 } })
  })
  await page.goto('/')
  await expect(card(page, external).getByTestId('heat')).toHaveText('热度 5')
  expect(await order(page)).toEqual([external, reviewer, weekly])
  await expect(card(page, weekly).getByTestId('heat')).toHaveText('热度 0')
  await card(page, weekly).getByTestId('btn-prompt').click()
  await expect(card(page, weekly).getByTestId('btn-prompt')).toHaveText('已复制')
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(installPrompt(weekly))
  await expect(card(page, weekly).getByTestId('heat')).toHaveText('热度 99')
  expect(await order(page)).toEqual([external, reviewer, weekly])
  expect(clicks).toContainEqual({ slug: weekly, kind: 'prompt' })
  await page.getByTestId('sort-new').click()
  await page.getByTestId('sort-hot').click()
  expect(await order(page)).toEqual([weekly, external, reviewer])
  const link = card(page, reviewer).getByTestId('btn-import')
  await expect(link).toHaveAttribute('target', '_blank')
  await expect(link).toHaveAttribute('rel', 'noopener noreferrer')
  const popupPromise = context.waitForEvent('page')
  await link.click()
  const popup = await popupPromise
  await popup.waitForLoadState()
  await popup.close()
  await expect.poll(() => clicks).toContainEqual({ slug: reviewer, kind: 'import' })
  await expect(card(page, weekly).getByTestId('btn-prompt')).toHaveText('复制安装提示词')
})

test('剪贴板和上报失败时仍可手动复制，不报页面错误', async ({ page }) => {
  await mockStats(page)
  const errors = []
  page.on('pageerror', (error) => errors.push(error.message))
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'clipboard', { value: { writeText: () => Promise.reject(new Error('模拟拒绝')) } })
  })
  await page.route('**/api/click', (route) => route.abort())
  await page.goto('/')
  await card(page, weekly).getByTestId('btn-prompt').click()
  const fallback = page.getByTestId('prompt-fallback')
  await expect(fallback).toBeVisible()
  await expect(fallback).toHaveValue(installPrompt(weekly))
  await expect(fallback).toBeFocused()
  await fallback.press('Escape')
  await expect(fallback).toHaveCount(0)
  await expect(card(page, weekly).getByTestId('btn-prompt')).toBeFocused()
  expect(errors).toEqual([])
})

test('头像台词：悬停、键盘、互斥、默认台词不连续重复', async ({ page }) => {
  await mockStats(page)
  await page.goto('/')
  const first = card(page, reviewer)
  const second = card(page, weekly)
  await first.getByTestId('avatar').hover()
  await expect(first.getByTestId('pitch-bubble')).toHaveText('评审会上被问住之前，先让我问你一遍。')
  await second.getByTestId('avatar').hover()
  await expect(page.locator('[data-testid="pitch-bubble"][data-open="true"]')).toHaveCount(1)
  const previous = await second.getByTestId('pitch-bubble').innerText()
  expect(DEFAULT_PITCHES).toContain(previous)
  await page.mouse.move(0, 0)
  await expect(second.getByTestId('pitch-bubble')).toHaveAttribute('data-open', 'false')
  await second.getByTestId('avatar').focus()
  await expect(second.getByTestId('pitch-bubble')).toHaveAttribute('data-open', 'true')
  expect(await second.getByTestId('pitch-bubble').innerText()).not.toBe(previous)
  await page.keyboard.press('Tab')
  await expect(second.getByTestId('pitch-bubble')).toHaveAttribute('data-open', 'false')
})

test('触摸点按头像打开，点别处关闭', async ({ browser, baseURL }) => {
  const context = await browser.newContext({ baseURL, hasTouch: true, viewport: { width: 390, height: 844 } })
  try {
    const page = await context.newPage()
    await mockStats(page)
    await page.goto('/')
    await card(page, weekly).getByTestId('avatar').tap()
    await expect(card(page, weekly).getByTestId('pitch-bubble')).toHaveAttribute('data-open', 'true')
    await card(page, reviewer).getByTestId('avatar').tap()
    await expect(page.locator('[data-testid="pitch-bubble"][data-open="true"]')).toHaveCount(1)
    await page.locator('h1').tap()
    await expect(page.locator('[data-testid="pitch-bubble"][data-open="true"]')).toHaveCount(0)
  } finally { await context.close() }
})

test('详情、SSR 头像一致性、技能和任务源码链接、外部隐藏区块', async ({ page, request }) => {
  await mockStats(page)
  await page.goto('/')
  const avatar = card(page, weekly).getByTestId('avatar').locator('svg')
  const homeSVG = await avatar.innerHTML()
  expect(homeSVG).toContain('<path')
  const rawHome = await (await request.get('/')).text()
  expect(rawHome).toContain('<svg')
  expect(await card(page, reviewer).getByTestId('avatar').locator('img').evaluate((img) => img.complete && img.naturalWidth > 0)).toBe(true)
  await card(page, weekly).getByTestId('detail-link').click()
  await expect(page.getByTestId('bot-detail')).toBeVisible()
  await expect(page).toHaveTitle(/示例·周报整理员/)
  await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', '把一周零散的聊天和笔记整理成一份周报')
  expect(await page.getByTestId('avatar').locator('svg').innerHTML()).toBe(homeSVG)
  await expect(page.getByTestId('forked-from')).toContainText('示例·PRD 评审员')
  await expect(page.getByTestId('section-prereq')).toContainText('无')
  await expect(page.getByTestId('section-quota')).toContainText('偶尔用一下，几乎不占额度')
  await expect(page.getByTestId('section-permissions')).toContainText('会按计划自己运行，不用你每次叫它')
  await expect(page.getByTestId('section-screenshots').locator('img')).toHaveCount(2)
  await expect(page.getByTestId('section-skills').locator('a')).toHaveAttribute('href', /\/bots\/demo-weekly-digest\/skills\/weekly-summary\/SKILL\.md$/)
  await expect(page.getByTestId('section-design')).toContainText('解决谁的什么问题')
  await page.getByTestId('forked-from').locator('a').click()
  await expect(page.getByTestId('section-prereq').locator('li')).toHaveCount(2)
  await expect(page.getByTestId('section-routines').locator('a')).toHaveAttribute('href', /\/bots\/demo-prd-reviewer\/routines\.md$/)
  await expect(page.getByTestId('forked-from')).toHaveCount(0)
  await page.goto(`/bots/${external}`)
  await expect(page.getByTestId('bot-detail')).toContainText('这个 Bot 由原作者在 x.ai 发布，本站只收录链接。')
  for (const id of ['btn-prompt', 'section-skills', 'section-screenshots', 'section-design']) {
    await expect(page.getByTestId(id)).toHaveCount(0)
  }
})

test('设计说明：模板和 HTML 不执行，图片相对路径与引用式图片改写', async ({ page }) => {
  const designs = await renderDesigns([{ slug: weekly, design: `<!-- 私有备注 -->\n# 设计说明\n\n## 正文\n\n{{ 1 + 1 }}\n\n<img src="x" onerror="alert(1)">\n\n<script>alert(2)</script>\n\n![图](./screenshots/digest.png)\n\n![引用][shot]\n\n[shot]: screenshots/digest-2.png\n\n[危险](javascript:alert(1))\n\n![属性](x){onerror="alert(1)"}\n\n<<< /etc/passwd\n` }])
  await page.setContent(designs[weekly])
  await expect(page.locator('body')).toContainText('{{ 1 + 1 }}')
  await expect(page.locator('body')).not.toContainText('私有备注')
  await expect(page.locator('h1, script, img[onerror], a[href^="javascript:"]')).toHaveCount(0)
  await expect(page.locator(`img[src="/bot-assets/${weekly}/digest.png"]`)).toHaveCount(1)
  await expect(page.locator(`img[src="/bot-assets/${weekly}/digest-2.png"]`)).toHaveCount(1)
  await expect(page.locator('body')).toContainText('<<< /etc/passwd')
})

test('手机无横向滚动、深色模式与可选交付截图', async ({ page }) => {
  await mockStats(page)
  const shots = process.env.E2E_SCREENSHOTS
  if (shots) await mkdir(shots, { recursive: true })
  await page.setViewportSize({ width: 1280, height: 900 })
  await page.goto('/')
  await expect(card(page, external).getByTestId('heat')).toHaveText('热度 5')
  if (shots) await page.screenshot({ path: join(shots, 'home-1280.png'), fullPage: true })
  await page.goto(`/bots/${weekly}`)
  await expect(page.getByTestId('section-design')).toBeVisible()
  if (shots) await page.screenshot({ path: join(shots, 'detail-1280.png'), fullPage: true })
  await page.setViewportSize({ width: 390, height: 844 })
  for (const path of ['/', `/bots/${weekly}`]) {
    await page.goto(path)
    await page.waitForLoadState('networkidle')
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390)
    if (shots && path === '/') await page.screenshot({ path: join(shots, 'home-390.png'), fullPage: true })
  }
  await page.evaluate(() => document.documentElement.classList.add('dark'))
  await expect(page.getByTestId('bot-detail')).toBeVisible()
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390)
})
