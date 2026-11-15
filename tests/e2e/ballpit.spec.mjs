// 首屏「球池」：货架上的真 Bot 掉下来堆在地板上；鼠标停住、点一下、键盘走到都会冒出名片，名片点进详情页。
// 用例只从页面上读数（有几只、是谁），名字按 bot.yaml 现算，所以示例货架和真实货架都能跑。
import { test, expect } from '@playwright/test'
import { existsSync, readFileSync } from 'node:fs'
import { parse } from 'yaml'
import { SITE } from '../../site/.vitepress/meta.mjs'

const pit = (page) => page.getByTestId('ballpit')
const bots = (page) => page.getByTestId('pit-bot')
const card = (page) => page.getByTestId('pit-card')
const body = (page, slug) => page.locator(`.pit-body[data-slug="${slug}"]`)
const slugsOf = (page) => page.locator('.pit-body').evaluateAll((els) => els.map((el) => el.dataset.slug))
const places = (page) => page.locator('.pit-body').evaluateAll((els) => els.map((el) => el.style.transform))
// 落定的记号：身后的光晕只在全部落定以后才画出来（被搅动时先暗下去）。
const settled = (page) => expect(pit(page).locator('.pit-haze.is-on:not(.is-dim)'), '球池落定').toHaveCount(1, { timeout: 30_000 })
const noHorizontalScroll = async (page, width) => expect(await page.evaluate(() => document.documentElement.scrollWidth), `${width}px 不横向滚动`).toBeLessThanOrEqual(width)

// 名片上怎么称呼：有中文叫法（nameZh）的以它为主、原名跟在下面；没有的只有原名。和 scripts/lib/bot-name.mjs 是同一条规矩。
function naming(slug) {
  for (const dir of ['tests/fixtures/bots', 'bots']) {
    const file = `${dir}/${slug}/bot.yaml`
    if (!existsSync(file)) continue
    const data = parse(readFileSync(file, 'utf8'))
    const zh = typeof data.nameZh === 'string' && data.nameZh.trim() ? data.nameZh : null
    const original = zh && zh !== data.name ? data.name : null
    return { name: zh ?? data.name, original, full: original ? `${zh}（${original}）` : zh ?? data.name, tagline: data.tagline }
  }
  throw new Error(`找不到 ${slug} 的 bot.yaml`)
}
async function expectCard(page, slug) {
  const expected = naming(slug), open = body(page, slug).getByTestId('pit-card')
  await expect(card(page)).toHaveCount(1)
  await expect(open).toBeVisible()
  await expect(open.locator('.pit-card-name')).toHaveText(expected.name)
  if (expected.original) await expect(open.locator('.pit-card-alias')).toHaveText(expected.original)
  else await expect(open.locator('.pit-card-alias')).toHaveCount(0)
  await expect(open.locator('.pit-card-does')).toHaveText(expected.tagline)
  await expect(open.locator('a')).toHaveAttribute('href', `/bots/${slug}`)
  // 示例货架上的 Bot 都有中文叫法：名片上的大字是中文
  if (slug.startsWith('demo-')) expect(expected.name).toMatch(/\p{Script=Han}/u)
  // 名片整张在视口里
  const box = await open.boundingBox(), width = page.viewportSize().width
  expect(box.x).toBeGreaterThanOrEqual(0)
  expect(box.x + box.width).toBeLessThanOrEqual(width)
}
// 从页面一打开就记下每只 Bot 出现过的位置：会动的时候一只有很多个位置，直接摆好的时候一只只有一个。
const track = (page) => page.addInitScript(() => {
  window.__pit = new Set()
  const tick = () => {
    for (const el of document.querySelectorAll('.pit-body')) if (el.style.transform) window.__pit.add(`${el.dataset.slug}|${el.style.transform}`)
    requestAnimationFrame(tick)
  }
  requestAnimationFrame(tick)
})
const tracked = (page) => page.evaluate(() => window.__pit.size)

test.beforeEach(async ({ page }) => {
  await page.route('**/api/stats', (route) => route.fulfill({ json: { ok: true, heat: {}, byKind: {} } }))
  // 大多数用例看的是落定以后的互动：减少动效下一上来就是落定的那一帧，不用等掉落。
  await page.emulateMedia({ reducedMotion: 'reduce' })
})

test('首屏是球池：站名、搜索框、货架上的真 Bot；服务端只输出站名和搜索框', async ({ page, request }) => {
  const raw = await (await request.get('/')).text()
  expect(raw).toContain('data-testid="ballpit"')
  expect(raw).toContain('data-testid="search-trigger"')
  expect(raw).not.toContain('data-testid="pit-bot"')
  const errors = []
  page.on('console', (message) => { if (/hydration/i.test(message.text())) errors.push(message.text()) })
  page.on('pageerror', (error) => errors.push(error.message))
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/')
  await settled(page)
  await expect(page.locator('h1')).toHaveCount(1)
  await expect(pit(page).locator('h1')).toHaveText(SITE.name)
  await expect(pit(page).locator('h1')).toHaveCSS('font-size', '72px')
  await expect(page.locator('.hero-portrait, .hero-aurora, .shelf-intro')).toHaveCount(0)
  const slugs = await slugsOf(page)
  expect(slugs.length).toBeGreaterThan(0)
  expect(new Set(slugs).size).toBe(slugs.length)
  // 每只都看得见、是活的，站在地板以上，没有压在站名和搜索框的字上
  const floor = await pit(page).evaluate((el) => el.getBoundingClientRect().bottom)
  const search = await page.getByTestId('search-trigger').boundingBox()
  for (const slug of slugs) {
    const bot = body(page, slug).getByTestId('pit-bot')
    await expect(bot).toBeVisible()
    await expect(bot.getByTestId('live-bot')).toHaveCount(1)
    await expect(bot).toHaveAttribute('aria-label', naming(slug).full)
    const box = await bot.boundingBox()
    expect(box.y + box.height).toBeLessThanOrEqual(floor + 2)
    const overlap = Math.min(box.x + box.width, search.x + search.width) - Math.max(box.x, search.x) > 4 && Math.min(box.y + box.height, search.y + search.height) - Math.max(box.y, search.y) > 4
    expect(overlap, `${slug} 没有盖住搜索框`).toBe(false)
  }
  await noHorizontalScroll(page, 1440)
  expect(errors).toEqual([])
})

test('搜索框照常可用：点它、按快捷键都打开搜索面板', async ({ page }) => {
  await page.goto('/')
  await settled(page)
  await page.getByTestId('search-trigger').click()
  await expect(page.getByTestId('search-input')).toBeFocused()
  await page.keyboard.press('Escape')
  await expect(page.getByTestId('search-palette')).toHaveCount(0)
  await expect(page.getByTestId('search-trigger')).toBeFocused()
  await page.keyboard.press('ControlOrMeta+k')
  await expect(page.getByTestId('search-input')).toBeFocused()
})

test('鼠标停在 Bot 上冒出名片：中文叫法为主、一句话介绍；全场只开一张，移开就收', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/')
  await settled(page)
  const slugs = await slugsOf(page)
  await expect(card(page)).toHaveCount(0)
  await body(page, slugs[0]).getByTestId('pit-bot').hover()
  await expectCard(page, slugs[0])
  await expect(body(page, slugs[0]).getByTestId('pit-bot')).toHaveAttribute('aria-expanded', 'true')
  if (slugs.length > 1) {
    await body(page, slugs[1]).getByTestId('pit-bot').hover()
    await expectCard(page, slugs[1])
  }
  // 挪到名片上不收（留着去点）；离开球池才收
  await card(page).hover()
  await page.waitForTimeout(400)
  await expect(card(page)).toHaveCount(1)
  await page.mouse.move(5, 300)
  await expect(card(page)).toHaveCount(0)
})

test('点一下 Bot 立刻出名片；名片整张点进详情页', async ({ page }) => {
  await page.goto('/')
  await settled(page)
  const [slug] = await slugsOf(page)
  await body(page, slug).getByTestId('pit-bot').click()
  await expectCard(page, slug)
  await card(page).locator('a').click()
  await expect(page).toHaveURL(new RegExp(`/bots/${slug}$`))
  await expect(page.locator('.bot-detail')).toBeVisible()
})

test('键盘：整个球池只占一个 Tab 位，走到就出名片并播报；方向键换一只，Esc 收起，再 Tab 到名片进详情', async ({ page }) => {
  await page.goto('/')
  await settled(page)
  const slugs = await slugsOf(page)
  await expect(page.locator('[data-testid="pit-bot"][tabindex="0"]')).toHaveCount(1)
  await page.getByTestId('search-trigger').focus()
  await page.keyboard.press('Tab')
  const focused = () => page.evaluate(() => document.activeElement?.closest('.pit-body')?.dataset.slug ?? null)
  const first = await focused()
  expect(slugs).toContain(first)
  await expect(body(page, first).getByTestId('pit-bot')).toHaveCSS('outline-style', 'solid')
  await expectCard(page, first)
  await expect(page.locator('.bz-sr-only[role="status"]').first()).toContainText(naming(first).full)
  if (slugs.length > 1) {
    // 左右方向键按屏幕上的左右顺序走；排在最右边的往右走不动，就往左走
    await page.keyboard.press('ArrowRight')
    if (await focused() === first) await page.keyboard.press('ArrowLeft')
    const second = await focused()
    expect(second).not.toBe(first)
    expect(slugs).toContain(second)
    await expectCard(page, second)
    await expect(page.locator('[data-testid="pit-bot"][tabindex="0"]')).toHaveCount(1)
  }
  const current = await focused()
  await page.keyboard.press('Escape')
  await expect(card(page)).toHaveCount(0)
  await page.keyboard.press('Enter')
  await expectCard(page, current)
  await page.keyboard.press('Tab')
  await expect(card(page).locator('a')).toBeFocused()
  await page.keyboard.press('Enter')
  await expect(page).toHaveURL(new RegExp(`/bots/${current}$`))
})

test('手机 390 触屏：点一下出名片；在 Bot 上竖着划能滚走页面；不横向滚动', async ({ browser, baseURL }) => {
  const context = await browser.newContext({ baseURL, hasTouch: true, isMobile: true, viewport: { width: 390, height: 844 } })
  try {
    const page = await context.newPage()
    await page.route('**/api/stats', (route) => route.fulfill({ json: { ok: true, heat: {}, byKind: {} } }))
    // 这条要测会动的时候（能拖）：等它自己落定
    await page.goto('/')
    await settled(page)
    await noHorizontalScroll(page, 390)
    const [slug] = await slugsOf(page)
    const bot = body(page, slug).getByTestId('pit-bot')
    await expect(bot).toHaveCSS('touch-action', 'pan-y')
    await bot.tap()
    await expectCard(page, slug)
    await page.locator('h1').tap()
    await expect(card(page)).toHaveCount(0)
    // 手指按在 Bot 身上往上划：页面跟着滚（Bot 不把竖向的滑动吃掉）
    await settled(page)
    const box = await bot.boundingBox()
    const before = await page.evaluate(() => window.scrollY)
    const session = await context.newCDPSession(page)
    await session.send('Input.synthesizeScrollGesture', { x: Math.round(box.x + box.width / 2), y: Math.round(box.y + box.height / 2), yDistance: -320, gestureSourceType: 'touch', speed: 900 })
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(before + 150)
    await noHorizontalScroll(page, 390)
  } finally { await context.close() }
})

test('各宽度不横向滚动；宽屏上 Bot 都收在版心里（和导航条同宽）', async ({ page }) => {
  await page.goto('/')
  await settled(page)
  for (const width of [320, 390, 680, 768, 1024, 1280, 1440, 1920, 2560]) {
    await page.setViewportSize({ width, height: 900 })
    await page.waitForTimeout(400)
    await settled(page)
    await noHorizontalScroll(page, width)
    expect(await bots(page).count()).toBeGreaterThan(0)
    if (width <= 1204) continue
    // 墙在版心两边（各 602）；按钮的框比碰撞用的圆角盒略大一点，留 12px 的余量
    const edges = await bots(page).evaluateAll((els) => els.map((el) => { const box = el.getBoundingClientRect(); return [box.left, box.right] }))
    for (const [left, right] of edges) {
      expect(left).toBeGreaterThanOrEqual(width / 2 - 614)
      expect(right).toBeLessThanOrEqual(width / 2 + 614)
    }
  }
})

test('减少动效：不演掉落，一上来就摆在落定的位置，之后不动', async ({ page }) => {
  await track(page)
  await page.goto('/')
  await settled(page)
  const count = await bots(page).count()
  for (const bot of await bots(page).all()) await expect(bot).toBeVisible()
  await page.waitForTimeout(700)
  // 每只 Bot 从头到尾只出现过一个位置
  expect(await tracked(page)).toBe(count)
  // 点它不会把它弹起来
  await bots(page).first().click()
  await page.waitForTimeout(500)
  expect(await tracked(page)).toBe(count)
})

test('会动的时候：从上面掉下来，落定后停表；滚出视口停表，回来接着走', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await track(page)
  await page.goto('/')
  await settled(page)
  const count = await bots(page).count()
  // 掉落：每只都走过很多个位置
  expect(await tracked(page)).toBeGreaterThan(count * 4)
  // 落定以后不再写位置（鼠标停在一只上：这时候不会有哪只自己蹦一下）
  await bots(page).first().hover()
  const rest = await places(page)
  await page.waitForTimeout(600)
  expect(await places(page)).toEqual(rest)
  // 滚出视口以后戳它一下：表停着，位置不变
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight))
  await page.waitForTimeout(500)
  await page.evaluate(() => document.querySelector('[data-testid="pit-bot"]').dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 1 })))
  await page.waitForTimeout(600)
  expect(await places(page)).toEqual(rest)
  // 滚回来：接着走（被戳的那只蹦起来），然后重新落定
  const before = await tracked(page)
  await page.evaluate(() => window.scrollTo(0, 0))
  await expect.poll(() => tracked(page), { timeout: 15_000 }).toBeGreaterThan(before + 3)
  await page.mouse.move(5, 300)
  await settled(page)
})

test('抓起来能扔：按住拖动时 Bot 跟着走', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/')
  await settled(page)
  const [slug] = await slugsOf(page)
  const bot = body(page, slug).getByTestId('pit-bot')
  const start = await bot.boundingBox()
  const x = start.x + start.width / 2, y = start.y + start.height / 2
  await page.mouse.move(x, y)
  await page.mouse.down()
  await page.mouse.move(x + 40, y - 180, { steps: 12 })
  await expect.poll(async () => (await bot.boundingBox()).y, { timeout: 10_000 }).toBeLessThan(start.y - 100)
  await expect(bot).toHaveClass(/is-held/)
  await page.mouse.up()
  await expect(bot).not.toHaveClass(/is-held/)
  // 松手以后掉回去，重新落定
  await page.mouse.move(5, 300)
  await settled(page)
})

test('从详情页后退回首页：直接摆好，不重演掉落', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await track(page)
  await page.goto('/')
  await settled(page)
  const count = await bots(page).count()
  expect(await tracked(page)).toBeGreaterThan(count * 4)
  const [slug] = await slugsOf(page)
  await body(page, slug).getByTestId('pit-bot').click()
  await card(page).locator('a').click()
  await expect(page.locator('.bot-detail')).toBeVisible()
  await page.evaluate(() => window.__pit.clear())
  await page.goBack()
  await settled(page)
  expect(await bots(page).count()).toBe(count)
  // 回来以后每只只出现过一个位置：没有再掉一遍
  expect(await tracked(page)).toBe(count)
})
