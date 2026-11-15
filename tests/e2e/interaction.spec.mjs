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
  test(`${width}px：30 字两行气泡、网格断点及无横向溢出`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 })
    await page.goto('/')
    const bot = card(page)
    await bot.getByTestId('avatar').hover()
    await expect(opened(page)).toHaveCount(1)
    // 等打字完成后再替换排版样本，避免活体打字覆盖测试文本。
    const bubble = bot.getByTestId('pitch-bubble')
    await expect(bubble.locator('span')).toHaveText(await bubble.getAttribute('data-text'))
    await bubble.locator('span').evaluate((el, text) => { el.textContent = text }, longPitch)
    await page.waitForTimeout(650)
    const geometry = await bot.evaluate((el) => {
      const bubble = el.querySelector('[role="tooltip"]'), avatar = el.querySelector('[data-testid="avatar"]')
      const b = bubble.getBoundingClientRect(), a = avatar.getBoundingClientRect(), c = el.getBoundingClientRect()
      const css = getComputedStyle(bubble)
      return { lines: (b.height - parseFloat(css.paddingTop) - parseFloat(css.paddingBottom) - parseFloat(css.borderTopWidth) - parseFloat(css.borderBottomWidth)) / parseFloat(css.lineHeight), gap: a.top - b.bottom - 7, left: b.left - c.left, right: c.right - b.right, top: b.top - c.top }
    })
    expect(geometry.lines).toBeLessThanOrEqual(2.1)
    expect(geometry.gap).toBeGreaterThanOrEqual(8)
    for (const side of ['left', 'right', 'top']) expect(geometry[side]).toBeGreaterThanOrEqual(0)
    // 气泡稳定后重播同一句，逐帧检查跳起、拉伸与弹性超调，而非只看动画结束。
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
        minimum = Math.min(minimum, avatar.getBoundingClientRect().top - bubble.getBoundingClientRect().bottom - 7)
      }
      animation.finish()
      return minimum
    })
    expect(minimumGap).toBeGreaterThanOrEqual(8)
    const columns = await page.locator('.bot-grid').evaluate((el) => getComputedStyle(el).gridTemplateColumns.split(' ').length)
    expect(columns).toBe(width >= 1100 ? 3 : width >= 680 ? 2 : 1)
    if (width < 680) expect((await bot.boundingBox()).width).toBeLessThanOrEqual(520)
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
  // 真正从前一个按钮 Tab 到头像，不只调用 focus()。
  await page.getByTestId('sort-new').focus()
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
    await page.getByTestId('sort-new').focus()
    await page.keyboard.press('Tab')
    await expect(opened(page)).toHaveCount(1)
    await page.keyboard.press('Enter')
    await expect(opened(page)).toHaveCount(1)
    for (const button of await page.locator('.shelf-button').all()) expect((await button.boundingBox()).height).toBeGreaterThanOrEqual(44)
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
      await expect(page.getByTestId('heat').first()).not.toContainText('…')
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
      for (const button of await page.locator('.shelf-button').all()) expect((await button.boundingBox()).height).toBeGreaterThanOrEqual(40)
    }
  })
}

for (const dark of [false, true]) {
  test(`${dark ? '深' : '浅'}色：彩色 token、Bot 色按钮、漫画气泡和卡片悬停`, async ({ page }) => {
    await page.goto('/')
    await page.evaluate((dark) => document.documentElement.classList.toggle('dark', dark), dark)
    const ink = dark ? 'rgb(244, 244, 245)' : 'rgb(20, 20, 24)'
    const paper = dark ? 'rgb(22, 22, 27)' : 'rgb(255, 255, 255)'
    const background = dark ? 'rgb(12, 12, 15)' : 'rgb(246, 245, 241)'
    const border = dark ? 'rgb(38, 38, 45)' : 'rgb(235, 232, 225)'
    await expect(page.locator('body')).toHaveCSS('background-color', background)
    await expect(page.getByTestId('contribute-link')).toHaveCSS('background-color', ink)
    for (const button of await page.locator('.shelf-button.primary').all()) {
      await expect(button).toHaveCSS('border-radius', '999px')
    }
    for (const button of await page.getByTestId('btn-import').all()) {
      const colors = await button.evaluate((el) => {
        const css = getComputedStyle(el)
        const rgb = (name) => {
          const hex = css.getPropertyValue(name).trim()
          return `rgb(${[1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16)).join(', ')})`
        }
        return { bg: css.backgroundColor, fg: css.color, expectedBg: rgb('--bz-btn-bg'), expectedFg: rgb('--bz-btn-fg') }
      })
      expect(colors.bg).toBe(colors.expectedBg)
      expect(colors.fg).toBe(colors.expectedFg)
    }
    const selected = await page.getByTestId('sort-hot').evaluate((el) => ({ color: getComputedStyle(el).color, background: getComputedStyle(el.parentElement, '::after').backgroundColor }))
    expect(selected).toEqual({ color: paper, background: ink })
    const bot = card(page)
    await expect(bot).toHaveCSS('border-radius', '28px')
    await expect(bot).toHaveCSS('background-color', paper)
    await expect(bot).toHaveCSS('background-image', 'none')
    const restingShadow = await bot.evaluate((el) => getComputedStyle(el).boxShadow)
    expect(restingShadow).not.toBe('none')
    expect(restingShadow.match(/(?:rgba?|color)\(/g)).toHaveLength(2)
    await bot.getByTestId('avatar').hover()
    await expect(bot).toHaveCSS('border-top-color', border)
    await expect(bot).toHaveCSS('transform', 'matrix(1, 0, 0, 1, 0, -4)')
    expect(await bot.evaluate((el) => getComputedStyle(el).boxShadow)).not.toBe(restingShadow)
    const bubble = bot.getByTestId('pitch-bubble')
    await expect(bubble).toHaveCSS('background-color', paper)
    await expect(bubble).toHaveCSS('border-top-width', '2px')
    await expect(bubble).toHaveCSS('border-top-color', ink)
    await expect(bubble).toHaveCSS('box-shadow', 'rgb(138, 138, 147) 3px 3px 0px 0px')
    const tip = await bubble.evaluate((el) => {
      const css = getComputedStyle(el, '::after')
      return { width: css.width, height: css.height, border: css.borderBottomWidth, color: css.borderBottomColor, background: css.backgroundColor }
    })
    expect(tip).toEqual({ width: '12px', height: '12px', border: '2px', color: ink, background: paper })
    await expect(bot.locator('.avatar-stage')).toHaveCSS('--bz-bot-color', '#8a8a93')
    await bot.getByTestId('btn-import').hover()
    await expect(bot.getByTestId('btn-import')).toHaveCSS('background-color', 'rgb(138, 138, 147)')
    await expect(bot.getByTestId('btn-import')).toHaveCSS('color', 'rgb(20, 20, 24)')
  })
}

test('同一个排序指示块滑动、舞台漂移与静止地影、正热度火苗', async ({ page }) => {
  await page.goto('/')
  const controls = page.locator('.sort-controls')
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
  const stage = card(page).locator('.avatar-stage')
  expect(await stage.evaluate((el) => {
    const css = getComputedStyle(el), shadow = getComputedStyle(el, '::before')
    return [css.animationDuration, css.animationTimingFunction, css.animationIterationCount, css.animationDirection, shadow.animationName]
  })).toEqual(['18s', 'ease-in-out', 'infinite', 'alternate', 'none'])
  await expect(card(page).getByTestId('heat').locator('svg')).toHaveClass('is-hot')
  await expect(card(page, weekly).getByTestId('heat').locator('svg')).not.toHaveClass('is-hot')
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
