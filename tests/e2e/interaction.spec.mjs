import { test, expect } from '@playwright/test'
import { installPrompt } from '../../site/.vitepress/meta.mjs'

const reviewer = 'demo-prd-reviewer'
const weekly = 'demo-weekly-digest'
const card = (page, slug = reviewer) => page.locator(`[data-testid="bot-card"][data-slug="${slug}"]`)
const opened = (page) => page.locator('[data-testid="pitch-bubble"][data-open="true"]')
const longPitch = [...'这句台词正好有三十个字，专门用来检查气泡最多两行而且不会压住头像。'].slice(0, 30).join('')
async function stub(page) {
  await page.route('**/api/stats', (route) => route.fulfill({ json: { ok: true, heat: { [reviewer]: 3 }, byKind: {} } }))
  await page.route('**/api/click', (route) => route.fulfill({ json: { ok: true, counted: true, heat: 4 } }))
}
test.beforeEach(async ({ page }) => { await stub(page) })

for (const width of [1280, 1100, 1024, 900, 680, 390, 320]) {
  test(`${width}px：30 字两行气泡留在卡片内、不压头像和导入按钮，网格断点及无横向溢出`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 })
    await page.goto('/')
    const bot = card(page)
    // 卡片排在精选区下面，不在首屏：先滚到卡片再悬停。
    await bot.scrollIntoViewIfNeeded()
    await bot.getByTestId('avatar').hover()
    await expect(opened(page)).toHaveCount(1)
    // 等打字完成后再替换排版样本，避免活体打字覆盖测试文本。
    const bubble = bot.getByTestId('pitch-bubble')
    await expect(bubble.locator('span')).toHaveText(await bubble.getAttribute('data-text'))
    await bubble.locator('span').evaluate((el, text) => { el.textContent = text }, longPitch)
    await page.waitForTimeout(650)
    const geometry = await bot.evaluate((el) => {
      const rect = (selector) => el.querySelector(selector).getBoundingClientRect()
      const b = rect('[role="tooltip"]'), a = rect('[data-testid="avatar"]'), i = rect('[data-testid="btn-import"]'), t = rect('.bot-tagline'), c = el.getBoundingClientRect()
      const css = getComputedStyle(el.querySelector('[role="tooltip"]'))
      const hit = (p, q) => !(p.right <= q.left || q.right <= p.left || p.bottom <= q.top || q.bottom <= p.top)
      return {
        lines: (b.height - parseFloat(css.paddingTop) - parseFloat(css.paddingBottom) - parseFloat(css.borderTopWidth) - parseFloat(css.borderBottomWidth)) / parseFloat(css.lineHeight),
        left: b.left - c.left, right: c.right - b.right, top: b.top - c.top, bottom: c.bottom - b.bottom,
        overAvatar: hit(b, a), overImport: hit(b, i),
        // 气泡盖在介绍那一块上：顶边对齐，且在头像下面。
        onTagline: Math.abs(b.top - t.top), belowAvatar: b.top - a.bottom,
        taglineOpacity: getComputedStyle(el.querySelector('.bot-tagline')).opacity,
      }
    })
    expect(geometry.lines).toBeLessThanOrEqual(2.1)
    for (const side of ['left', 'right', 'top', 'bottom']) expect(geometry[side], `气泡${side}边在卡片内`).toBeGreaterThanOrEqual(0)
    expect(geometry.overAvatar, '气泡不压头像').toBe(false)
    expect(geometry.overImport, '气泡不压导入按钮').toBe(false)
    expect(geometry.onTagline).toBeLessThanOrEqual(1)
    expect(geometry.taglineOpacity, '气泡出现时介绍淡出').toBe('0')
    // 气泡稳定后重播同一句，逐帧检查跳起、拉伸与弹性超调：头像始终不碰气泡，朝上的尖角（约 11px）有地方放。
    const minimumGap = await bot.evaluate((el) => {
      const avatar = el.querySelector('[data-testid="avatar"]'), bubble = el.querySelector('[role="tooltip"]')
      avatar.classList.remove('is-speaking')
      void avatar.offsetWidth
      avatar.classList.add('is-speaking')
      const animation = avatar.getAnimations()[0]
      animation.pause()
      let minimum = Infinity
      for (let time = 0; time <= 560; time += 4) {
        animation.currentTime = time
        minimum = Math.min(minimum, bubble.getBoundingClientRect().top - avatar.getBoundingClientRect().bottom)
      }
      animation.finish()
      return minimum
    })
    expect(minimumGap).toBeGreaterThanOrEqual(13)
    const columns = await page.locator('.bot-grid').evaluate((el) => getComputedStyle(el).gridTemplateColumns.split(' ').length)
    expect(columns).toBe(width >= 900 ? 2 : 1)
    const cardBox = await bot.boundingBox()
    if (width >= 1280) expect(cardBox.width).toBeCloseTo(562, 0)
    if (width < 900) expect(cardBox.width, '单列时卡片撑满内容区').toBeGreaterThanOrEqual(width - 64 - 1)
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width)
    await page.goto(`/bots/${reviewer}`)
    await page.getByTestId('avatar').hover()
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width)
  })
}

test('鼠标、Tab、Enter、空格、Esc、失焦、单开和跳动重播', async ({ page }) => {
  await page.goto('/')
  await expect(opened(page)).toHaveCount(0)
  const a = card(page).getByTestId('avatar'), b = card(page, weekly).getByTestId('avatar')
  await expect(a).toHaveAttribute('aria-label', '听听示例·PRD 评审员的自荐')
  await a.hover()
  expect(await a.evaluate((el) => el.getAnimations().length)).toBeGreaterThan(0)
  await expect(a).toHaveAttribute('aria-describedby', `pitch-${reviewer}`)
  await expect(card(page).getByTestId('pitch-bubble')).toHaveAttribute('role', 'tooltip')
  await expect(card(page).getByTestId('pitch-bubble')).not.toHaveAttribute('aria-live')
  await b.hover()
  await expect(opened(page)).toHaveCount(1)
  await expect(a).not.toHaveAttribute('aria-describedby')
  await page.mouse.move(0, 0)
  await expect(opened(page)).toHaveCount(0)
  // 真正从前一个按钮 Tab 到头像，不只调用 focus()。工具栏只有排序和分类筛选，卡片前的最后一个控件是最后一枚分类按钮。
  await page.getByTestId('filter-category').last().focus()
  await page.keyboard.press('Tab')
  await expect(a).toBeFocused()
  await expect(opened(page)).toHaveCount(1)
  await b.focus()
  let previous = await card(page, weekly).getByTestId('pitch-bubble').getAttribute('data-text')
  for (const key of ['Enter', 'Space']) {
    await page.waitForTimeout(600)
    await page.keyboard.press(key)
    expect(await card(page, weekly).getByTestId('pitch-bubble').getAttribute('data-text')).not.toBe(previous)
    previous = await card(page, weekly).getByTestId('pitch-bubble').getAttribute('data-text')
    expect(await b.evaluate((el) => el.getAnimations().length)).toBeGreaterThan(0)
  }
  await page.keyboard.press('Escape')
  await expect(opened(page)).toHaveCount(0)
  await page.keyboard.press('Enter')
  await expect(opened(page)).toHaveCount(1)
  await page.keyboard.press('Tab')
  await expect(opened(page)).toHaveCount(0)
  await b.click()
  const beforeClick = await card(page, weekly).getByTestId('pitch-bubble').getAttribute('data-text')
  await b.click()
  expect(await card(page, weekly).getByTestId('pitch-bubble').getAttribute('data-text')).not.toBe(beforeClick)
})

test('触摸重说与 4 秒计时、点外部关闭、触摸后键盘仍工作', async ({ browser, baseURL }) => {
  const context = await browser.newContext({ baseURL, viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true })
  try {
    const page = await context.newPage()
    await stub(page)
    await page.goto('/')
    const avatar = card(page, weekly).getByTestId('avatar')
    await avatar.tap()
    await expect(opened(page)).toHaveCount(1)
    const previous = await opened(page).getAttribute('data-text')
    await avatar.tap()
    expect(await opened(page).getAttribute('data-text')).not.toBe(previous)
    await page.waitForTimeout(3300)
    await expect(opened(page)).toHaveCount(1)
    await expect(opened(page)).toHaveCount(0, { timeout: 1800 })
    await avatar.tap()
    await page.touchscreen.tap(8, 120)
    await expect(opened(page)).toHaveCount(0)
    await page.getByTestId('filter-category').last().focus()
    await page.keyboard.press('Tab')
    await expect(opened(page)).toHaveCount(1)
    await page.keyboard.press('Enter')
    await expect(opened(page)).toHaveCount(1)
    for (const button of await page.locator('.shelf-page .bz-btn, .shelf-page .bz-seg, .shelf-page .filter-chip').all()) expect((await button.boundingBox()).height).toBeGreaterThanOrEqual(44)
  } finally { await context.close() }
})

test('减少动效保留 120ms 淡入、没有跳动/上浮/网格动画', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')
  await card(page).getByTestId('avatar').hover()
  await expect(opened(page)).toHaveCount(1)
  expect(await card(page).getByTestId('avatar').evaluate((el) => el.getAnimations().length)).toBe(0)
  const motion = await opened(page).evaluate((el) => {
    const css = getComputedStyle(el)
    return { property: css.transitionProperty, duration: css.transitionDuration }
  })
  expect(motion.property).toContain('opacity')
  expect(motion.duration).toContain('0.12s')
  expect(await card(page).evaluate((el) => getComputedStyle(el).transform)).toBe('none')
  expect(await page.locator('.bot-grid').evaluate((el) => getComputedStyle(el).animationName)).toBe('none')
  expect(await card(page).locator('.avatar-stage').evaluate((el) => el.getAnimations().length)).toBe(0)
})

async function contrast(locator) {
  return locator.evaluateAll((els) => els.map((el) => {
    const lum = (color) => {
      const rgb = color.match(/[\d.]+/g).slice(0, 3).map(Number).map((v) => { v /= 255; return v <= .04045 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4 })
      return rgb[0] * .2126 + rgb[1] * .7152 + rgb[2] * .0722
    }
    let ancestor = el, background = 'rgb(255, 255, 255)'
    while (ancestor) {
      const color = getComputedStyle(ancestor).backgroundColor
      if (color !== 'transparent' && color !== 'rgba(0, 0, 0, 0)') { background = color; break }
      ancestor = ancestor.parentElement
    }
    const a = lum(getComputedStyle(el).color), b = lum(background)
    return (Math.max(a, b) + .05) / (Math.min(a, b) + .05)
  }))
}
for (const dark of [false, true]) {
  test(`${dark ? '深' : '浅'}色：作者/日期/热度对比度、外链语义、键盘焦点和按钮尺寸`, async ({ page }) => {
    for (const path of ['/', `/bots/${reviewer}`, `/bots/${weekly}`]) {
      await page.goto(path)
      await page.evaluate((dark) => document.documentElement.classList.toggle('dark', dark), dark)
      // 列表卡只在热度大于 0 时显示热度；详情页始终显示。
      if (path === '/') await expect(card(page).getByTestId('heat')).toHaveText('热度 3')
      else await expect(page.getByTestId('heat').first()).not.toContainText('…')
      const ratios = await contrast(page.locator('.shelf-page [data-testid="author-link"], .shelf-page time, .shelf-page [data-testid="heat"]'))
      for (const ratio of ratios) expect(ratio).toBeGreaterThanOrEqual(4.5)
      for (const link of await page.locator('.shelf-page a[target="_blank"]').all()) {
        await expect(link).toHaveAttribute('rel', 'noopener noreferrer')
        await expect(link).toContainText('（在新标签页打开）')
        await expect(link.locator('.external-icon[aria-hidden="true"]')).toHaveText('↗')
      }
      await page.keyboard.press('Tab')
      for (const control of await page.locator('.shelf-page a, .shelf-page button').all()) {
        await control.focus()
        const css = await control.evaluate((el) => ({ style: getComputedStyle(el).outlineStyle, width: parseFloat(getComputedStyle(el).outlineWidth) }))
        expect(css.style).toBe('solid')
        expect(css.width).toBeGreaterThanOrEqual(2)
      }
      for (const button of await page.locator('.shelf-page .bz-btn').all()) expect((await button.boundingBox()).height).toBeGreaterThanOrEqual(32)
    }
  })
}

for (const dark of [false, true]) {
  test(`${dark ? '深' : '浅'}色：Raycast 质感 token、中性玻璃按钮、漫画气泡和卡片悬停`, async ({ page }) => {
    await page.goto('/')
    await page.evaluate((dark) => document.documentElement.classList.toggle('dark', dark), dark)
    const ink = dark ? 'rgb(255, 255, 255)' : 'rgb(20, 20, 24)'
    const paper = dark ? 'rgb(12, 13, 15)' : 'rgb(255, 255, 255)'
    const background = dark ? 'rgb(7, 8, 10)' : 'rgb(246, 245, 241)'
    const surface = dark ? 'rgba(255, 255, 255, 0.04)' : 'rgba(20, 20, 24, 0.03)'
    const hairline = dark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(20, 20, 24, 0.08)'
    await expect(page.locator('body')).toHaveCSS('background-color', background)
    // 「我要投稿」挪到页尾，是一枚中性的次级按钮：圆角 8、高 36、墨色字，不是胶囊。
    const contribute = page.getByTestId('contribute-link')
    await expect(page.locator('.shelf-intro').getByTestId('contribute-link')).toHaveCount(0)
    await expect(page.locator('.shelf-footer').getByTestId('contribute-link')).toHaveCount(1)
    await expect(contribute).toHaveCSS('border-radius', '8px')
    await expect(contribute).toHaveCSS('color', ink)
    expect((await contribute.boundingBox()).height).toBe(36)
    await expect(page.getByTestId('search-trigger')).toHaveCSS('background-color', paper)
    // 全页只有分段控件是胶囊；按钮、筛选都是圆角 8。
    for (const control of await page.locator('.shelf-page .bz-btn, .shelf-page .filter-chip').all()) await expect(control).toHaveCSS('border-radius', '8px')
    // 导入按钮是 Bot 色淡染的玻璃，不是 Bot 色实底：字始终是墨色，白色、灰色的 Bot 也不会像禁用。
    for (const button of [...await page.getByTestId('btn-import').all(), ...await page.getByTestId('featured-import').all()]) {
      await expect(button).toHaveCSS('color', ink)
      await expect(button).toHaveText(/^导入/)
      expect((await button.boundingBox()).height).toBe(32)
      const alpha = await button.evaluate((el) => {
        const ctx = document.createElement('canvas').getContext('2d')
        ctx.fillStyle = getComputedStyle(el).backgroundColor; ctx.fillRect(0, 0, 1, 1)
        return ctx.getImageData(0, 0, 1, 1).data[3] / 255
      })
      expect(alpha, '按钮底是淡染，不是实色').toBeLessThan(.3)
    }
    // 分段控件：玻璃轨道 + 亮一档的选中滑块，选中文字用墨色。
    const selected = await page.getByTestId('sort-hot').evaluate((el) => ({ color: getComputedStyle(el).color, background: getComputedStyle(el.parentElement, '::after').backgroundColor, track: getComputedStyle(el.parentElement).backgroundColor, height: el.parentElement.getBoundingClientRect().height }))
    expect(selected).toEqual({ color: ink, background: dark ? 'rgba(255, 255, 255, 0.1)' : 'rgb(255, 255, 255)', track: surface, height: 40 })
    const bot = card(page)
    await bot.scrollIntoViewIfNeeded()
    await page.mouse.move(4, 4)
    await expect(bot).toHaveCSS('border-radius', '12px')
    // 深色下卡片底色透明，浅色下是卡片白；细边 + 内高光。
    await expect(bot).toHaveCSS('background-color', dark ? 'rgba(0, 0, 0, 0)' : paper)
    await expect(bot).toHaveCSS('background-image', 'none')
    await expect(bot).toHaveCSS('border-top-color', hairline)
    expect(await bot.evaluate((el) => getComputedStyle(el).boxShadow)).toContain('inset')
    // 48 的砖、比例圆角 24%，Bot 占砖内框（去掉 1px 细边）的 68%。
    const stage = await bot.locator('.avatar-stage').boundingBox(), avatar = await bot.getByTestId('avatar').boundingBox()
    expect([stage.width, stage.height]).toEqual([48, 48])
    expect(avatar.width / (stage.width - 2)).toBeCloseTo(.68, 2)
    expect(avatar.height / (stage.height - 2)).toBeCloseTo(.68, 2)
    await expect(bot.locator('.avatar-stage')).toHaveCSS('border-radius', '24%')
    // 介绍固定两行高，下面不再给气泡留空带：整张卡不超过 190。
    expect((await bot.locator('.bot-tagline').boundingBox()).height).toBe(48)
    expect((await bot.boundingBox()).height).toBeLessThanOrEqual(190)
    const glow = () => bot.evaluate((el) => { const css = getComputedStyle(el, '::after'); return { opacity: css.opacity, image: css.backgroundImage, duration: css.transitionDuration } })
    expect(await glow()).toMatchObject({ opacity: '0', duration: '0.15s' })
    expect((await glow()).image).toContain('radial-gradient')
    await bot.getByTestId('avatar').hover()
    // 悬停：淡入一层 Bot 色光晕、细边染色；卡片本身不位移、不缩放。
    await expect.poll(async () => (await glow()).opacity).toBe('1')
    await expect(bot).not.toHaveCSS('border-top-color', hairline)
    await expect(bot).toHaveCSS('transform', 'none')
    const bubble = bot.getByTestId('pitch-bubble')
    await expect(bubble).toHaveCSS('position', 'absolute')
    await expect(bubble).toHaveCSS('background-color', paper)
    await expect(bubble).toHaveCSS('border-top-width', '2px')
    await expect(bubble).toHaveCSS('border-top-color', ink)
    await expect(bubble).toHaveCSS('border-radius', '12px')
    await expect(bubble).toHaveCSS('box-shadow', 'rgb(138, 138, 147) 3px 3px 0px 0px')
    const tip = await bubble.evaluate((el) => {
      const css = getComputedStyle(el, '::after')
      return { width: css.width, height: css.height, border: css.borderBottomWidth, color: css.borderBottomColor, background: css.backgroundColor }
    })
    expect(tip).toEqual({ width: '12px', height: '12px', border: '2px', color: ink, background: paper })
    await expect(bot.locator('.avatar-stage')).toHaveCSS('--bz-bot-color', '#8a8a93')
    await bot.getByTestId('btn-import').hover()
    await expect(bot.getByTestId('btn-import')).toHaveCSS('color', ink)
  })
}

test('同一个排序指示块滑动、头像玻璃砖静止不漂移、正热度火苗', async ({ page }) => {
  await page.goto('/')
  const controls = page.locator('.bz-seg')
  const indicator = () => controls.evaluate((el) => {
    const css = getComputedStyle(el, '::after')
    return { x: new DOMMatrix(css.transform).m41, width: parseFloat(css.width), duration: css.transitionDuration }
  })
  expect((await indicator()).x).toBe(0)
  expect((await indicator()).duration).toBe('0.28s')
  await page.getByTestId('sort-new').click()
  // 固定动画时钟，避免并行浏览器负载把 CSS 首帧推迟到 click 返回之后。
  await controls.evaluate((el) => {
    getComputedStyle(el, '::after').transform
    for (const animation of el.getAnimations({ subtree: true })) {
      animation.pause()
      animation.currentTime = 300
    }
  })
  const moved = await indicator()
  expect(moved.x).toBeCloseTo(moved.width, 1)
  // 旧版的大舞台有 18 秒的光斑漂移；新版头像站在一块静止的玻璃砖里，Bot 色柔光画在伪元素上。
  const stage = card(page).locator('.avatar-stage')
  expect(await stage.evaluate((el) => {
    const css = getComputedStyle(el), glow = getComputedStyle(el, '::before')
    return { animation: css.animationName, image: css.backgroundImage, glowAnimation: glow.animationName, glow: glow.backgroundImage.includes('radial-gradient') }
  })).toEqual({ animation: 'none', image: 'none', glowAnimation: 'none', glow: true })
  // 首屏唯一一直在流动的是 Hero 背后的极光。
  expect(await page.locator('.hero-aurora > i').first().evaluate((el) => { const css = getComputedStyle(el); return [css.animationIterationCount, css.animationDirection] })).toEqual(['infinite', 'alternate'])
  await expect(card(page).getByTestId('heat').locator('svg')).toHaveClass('is-hot')
  // 没有热度的卡片不显示热度这一项，也不占位。
  await expect(card(page, weekly).getByTestId('heat')).toHaveCount(0)
})

test('复制成功单一播报区、1.8 秒恢复；失败 dialog 全选/焦点/遮罩/Esc', async ({ page }) => {
  await page.addInitScript(() => {
    window.denyClipboard = false
    Object.defineProperty(navigator, 'clipboard', { value: { writeText: () => window.denyClipboard ? Promise.reject(new Error('拒绝')) : Promise.resolve() } })
  })
  await page.goto('/')
  const copy = card(page, weekly).getByTestId('btn-prompt')
  await copy.click()
  await expect(copy).toHaveText('已复制 ✓')
  await expect(page.locator('.shelf-page [aria-live]')).toHaveCount(1)
  await expect(page.locator('.shelf-page [aria-live]')).toHaveText('已复制安装提示词')
  await page.waitForTimeout(1400)
  await expect(copy).toHaveText('已复制 ✓')
  await expect(copy).toHaveText('复制安装提示词', { timeout: 1000 })
  await page.evaluate(() => { window.denyClipboard = true })
  for (const method of ['Escape', 'backdrop', 'button']) {
    await copy.click()
    const dialog = page.getByTestId('prompt-fallback')
    await expect(dialog).toBeVisible()
    expect(await dialog.evaluate((el) => el.tagName)).toBe('DIALOG')
    const textarea = dialog.locator('textarea')
    await expect(textarea).toBeFocused()
    await expect(textarea).toHaveValue(installPrompt(weekly))
    expect(await textarea.evaluate((el) => el.selectionEnd - el.selectionStart)).toBe(installPrompt(weekly).length)
    if (method === 'Escape') await page.keyboard.press('Escape')
    else if (method === 'backdrop') await page.mouse.click(4, 4)
    else await dialog.getByRole('button', { name: '关闭' }).click()
    await expect(dialog).toHaveCount(0)
    await expect(copy).toBeFocused()
  }
})

test('自定义头像失败回退 SVG，截图失败保留占位尺寸', async ({ page }) => {
  await page.route('**/bot-assets/**/avatar.png', (route) => route.abort())
  await page.goto('/')
  await expect(card(page).getByTestId('avatar').locator('svg')).toBeVisible()
  await expect(card(page).getByTestId('avatar').locator('img')).toHaveCount(0)
  await page.route('**/bot-assets/**/digest*.png', (route) => route.abort())
  await page.goto(`/bots/${weekly}`)
  await page.getByTestId('section-screenshots').scrollIntoViewIfNeeded()
  await expect(page.locator('.screenshot-error')).toHaveCount(2)
  const box = await page.locator('.screenshot-error').first().boundingBox()
  expect(box.width / box.height).toBeCloseTo(1.6, 1)
})
