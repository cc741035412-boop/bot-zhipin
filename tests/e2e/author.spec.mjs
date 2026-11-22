import { expect, test } from '@playwright/test'

const path = '/authors/example-user'
const avatarResponse = state => state === 'image'
  ? { path: 'site/public/apple-touch-icon.png', contentType: 'image/png' }
  : { status: 404, body: '' }

test.beforeEach(async ({ page }) => {
  await page.route('**/api/avatar/**', route => route.fulfill(avatarResponse('fallback')))
})

async function expectAvatar(page, state) {
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('示例作者')
  const avatar = page.getByTestId('author-avatar')
  await expect(avatar).toHaveAttribute('data-state', state)
  await expect(avatar.locator('img')).toHaveCount(state === 'image' ? 1 : 0)
  await expect(avatar).toHaveText('示')
  if (state === 'image') await expect(avatar).toHaveCSS('color', 'rgba(0, 0, 0, 0)')
}

for (const state of ['image', 'fallback']) {
  test(`水合前头像已完成：${state}`, async ({ page }) => {
    let release
    const gate = new Promise(resolve => { release = resolve })
    await page.route('**/assets/**/*.js', async route => { await gate; await route.continue() })
    await page.route('**/api/avatar/**', route => route.fulfill(avatarResponse(state)))
    try {
      expect((await page.goto(path, { waitUntil: 'commit' })).status()).toBe(200)
      await page.waitForFunction(() => document.querySelector('.author-avatar img')?.complete)
      await expect(page.getByTestId('author-avatar')).toHaveAttribute('data-state', 'loading')
    } finally { release() }
    await page.waitForFunction(() => document.querySelector('#app')?.__vue_app__)
    await expectAvatar(page, state)
  })
  test(`水合后头像才返回：${state}`, async ({ page }) => {
    await page.route('**/api/avatar/**', async route => {
      await page.waitForFunction(() => document.querySelector('#app')?.__vue_app__)
      await route.fulfill(avatarResponse(state))
    })
    expect((await page.goto(path)).status()).toBe(200)
    await expectAvatar(page, state)
  })
}

test('四处作者链接均指向站内', async ({ page }) => {
  for (const [url, selector] of [
    ['/', '[data-testid="bot-card"][data-slug="demo-prd-reviewer"] .bot-author'],
    ['/', '[data-testid="featured-card"][data-slug="demo-prd-reviewer"] .bot-author'],
    ['/bots/demo-prd-reviewer', '[data-testid="detail-rail"] [data-testid="author-link"]'],
    ['/squads/demo-squad', '[data-testid="squad-author"]'],
  ]) {
    await page.goto(url)
    const link = page.locator(selector).first()
    await expect(link).toHaveAttribute('href', path)
    for (const attr of ['target', 'rel', 'data-track-kind']) expect(await link.getAttribute(attr)).toBeNull()
    await expect(link.locator('.bz-sr-only')).toHaveCount(0)
  }
})

async function expectExternal(link) {
  await expect(link).toHaveAttribute('target', '_blank')
  await expect(link).toHaveAttribute('rel', /\bnoopener\b/)
  await expect(link).toHaveAttribute('data-track-kind', 'author')
  await expect(link.locator('.external-icon')).toHaveText('↗')
  await expect(link.locator('.bz-sr-only')).toHaveText('（在新标签页打开）')
}

test('没有本站主页的作者在三处都走外链', async ({ page }) => {
  await page.goto('/')
  for (const kind of ['bot-card', 'featured-card']) {
    await expectExternal(page.locator(`[data-testid="${kind}"][data-slug="demo-external"] .bot-author`).first())
  }
  await page.goto('/bots/demo-external')
  await expectExternal(page.getByTestId('detail-rail').getByTestId('author-link'))
})

test('主页 handle 外链，自己卡片的署名是纯文字', async ({ page }) => {
  await page.goto(path)
  await page.waitForFunction(() => document.querySelector('#app')?.__vue_app__)
  const handle = page.locator('.author-handle')
  await expect(handle).toHaveAttribute('href', 'https://github.com/example-user')
  await expectExternal(handle)
  const card = page.getByTestId('bot-card')
  await expect(card.getByTestId('author-link')).toHaveCount(0)
  await expect(card.locator('span.bot-author')).toHaveText('by 示例作者')
})

test('作者页的页面标题、描述和分享元数据', async ({ page }) => {
  await page.goto(path)
  const title = '示例作者 的 Bot 和小队'
  await expect(page).toHaveTitle(`${title} | Bot 直聘`)
  await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', '示例作者（@example-user）在 Bot 直聘上架的 1 个 Bot、1 支小队。')
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `https://bot.jiachengbo.com${path}`)
  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', title)
})

test('直接打开作者页也能看到 Bot 热度', async ({ page }) => {
  await page.route('**/api/stats', route => route.fulfill({ json: { ok: true, heat: { 'demo-prd-reviewer': 7 } } }))
  await page.goto(path)
  const heat = page.locator('[data-testid="bot-card"][data-slug="demo-prd-reviewer"]').getByTestId('heat')
  await expect(heat).toBeVisible()
  await expect(heat).toHaveText('热度 7')
})

test('作品区块以自己的 h2 命名，没有小队就不显示小队区块', async ({ page }) => {
  for (const [url, headings] of [[path, ['Bot', '小队']], ['/authors/another-example', ['Bot']]]) {
    await page.goto(url)
    const main = page.getByTestId('author-page')
    await expect(main.locator('h2')).toHaveText(headings)
    await expect(main.locator('section')).toHaveCount(headings.length)
    for (const section of await main.locator('section').all()) {
      const id = await section.getAttribute('aria-labelledby')
      expect(id).toBeTruthy()
      await expect(page.locator(`#${id}`)).toHaveCount(1)
      await expect(section.locator(`h2#${id}`)).toHaveCount(1)
    }
  }
})

test('未知作者返回 404', async ({ request }) => expect((await request.get('/authors/nobody')).status()).toBe(404))
