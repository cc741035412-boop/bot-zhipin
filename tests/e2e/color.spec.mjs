import { test, expect } from '@playwright/test'
import { HERO_MASCOTS } from '../../site/.vitepress/meta.mjs'
import { CATEGORY_COLORS } from '../../site/.vitepress/theme/color.ts'

const weekly = 'demo-weekly-digest'
test.beforeEach(async ({ page }) => {
  await page.route('**/api/stats', (route) => route.fulfill({ json: { ok: true, heat: {}, byKind: {} } }))
  await page.emulateMedia({ reducedMotion: 'reduce' })
})

for (const scheme of ['light', 'dark']) {
  test(`${scheme}：招牌固定配置、黑眼睛、正脸与 SSR 静态首帧一致`, async ({ page, request }) => {
    await page.emulateMedia({ colorScheme: scheme })
    const warnings = []
    page.on('console', (message) => { if (/hydration/i.test(message.text())) warnings.push(message.text()) })
    page.on('pageerror', (error) => warnings.push(error.message))
    await page.goto('/')
    const raw = await (await request.get('/')).text()
    const frames = await page.evaluate((html) => {
      const capture = (root) => [...root.querySelectorAll('[data-testid="live-bot"]')].map((svg) => ({
        shape: svg.dataset.shape, viewBox: svg.getAttribute('viewBox'),
        body: svg.querySelector('[data-part="body"]').getAttribute('d'),
        eyes: [...svg.querySelectorAll('[data-part="eye"]')].map((e) => [e.getAttribute('d'), e.getAttribute('transform')]),
      }))
      return { ssr: capture(new DOMParser().parseFromString(html, 'text/html')), client: capture(document) }
    }, raw)
    expect(frames.client).toEqual(frames.ssr)
    for (const frame of frames.client) expect(frame.viewBox).toBe('-112 -112 224 224')
    const heroes = page.locator('.hero-portrait')
    await expect(heroes).toHaveCount(9)
    await expect(page.locator('.hero-portraits')).toHaveAttribute('aria-hidden', 'true')
    for (const [i, mascot] of HERO_MASCOTS.entries()) {
      const svg = heroes.nth(i).getByTestId('live-bot')
      await expect(svg).toHaveAttribute('data-shape', mascot.shape)
      const rgb = `rgb(${[1, 3, 5].map((n) => parseInt(mascot.color.slice(n, n + 2), 16)).join(', ')})`
      await expect(svg.locator('[data-part="fill"]')).toHaveCSS('fill', rgb)
    }
    for (const svg of await page.getByTestId('live-bot').all()) {
      await expect(svg.locator('[data-part="body"]')).toHaveCSS('fill', 'rgb(22, 22, 27)')
      await expect(svg).toHaveCSS('overflow', 'visible')
      // 视口收紧，但变身用的 mask / fill 画布不跟着裁小。
      await expect(svg.locator('[data-part="fill"]')).toHaveAttribute('width', '316')
      const { ratio, x } = await svg.evaluate((el) => {
        const body = el.querySelector('[data-part="body"]').getBoundingClientRect()
        const eyes = [...el.querySelectorAll('[data-part="eye"]')]
        return {
          ratio: Math.max(body.width, body.height) / el.getBoundingClientRect().width,
          x: eyes.reduce((sum, e) => sum + new DOMMatrix(e.getAttribute('transform')).m41, 0) / eyes.length,
        }
      })
      expect(ratio).toBeGreaterThanOrEqual(.8)
      expect(Math.abs(x)).toBeLessThanOrEqual(30)
    }
    expect(warnings).toEqual([])
  })

  test(`${scheme}：各岗位标签实际 CSS 对比度 ≥4.5，首页/详情一致、外部标签中性`, async ({ page }) => {
    await page.emulateMedia({ colorScheme: scheme })
    await page.goto('/')
    const homeColor = await page.locator(`[data-slug="${weekly}"] .category-tag`).evaluate((el) => [getComputedStyle(el).color, getComputedStyle(el).backgroundColor])
    await page.goto(`/bots/${weekly}`)
    expect(await page.locator('.category-tag').evaluate((el) => [getComputedStyle(el).color, getComputedStyle(el).backgroundColor])).toEqual(homeColor)
    await page.goto('/')
    const colors = await page.locator('.category-tag').first().evaluate((el, palette) => {
      const ctx = document.createElement('canvas').getContext('2d')
      const rgb = (css) => {
        ctx.clearRect(0, 0, 1, 1); ctx.fillStyle = css; ctx.fillRect(0, 0, 1, 1)
        return [...ctx.getImageData(0, 0, 1, 1).data].slice(0, 3)
      }
      const luminance = (rgb) => rgb.map((v) => v / 255).map((v) => v <= .04045 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4).reduce((sum, v, i) => sum + v * [.2126, .7152, .0722][i], 0)
      const sample = (node) => {
        const style = getComputedStyle(node), fg = rgb(style.color), bg = rgb(style.backgroundColor)
        const a = luminance(fg), b = luminance(bg)
        return { fg, bg, ratio: (Math.max(a, b) + .05) / (Math.min(a, b) + .05) }
      }
      const categories = Object.entries(palette).map(([name, color]) => {
        const clone = el.cloneNode(true)
        clone.textContent = name
        clone.style.setProperty('--bz-category-color', color)
        el.parentElement.append(clone)
        const result = { name, ...sample(clone) }
        clone.remove()
        return result
      })
      return { categories, external: [...document.querySelectorAll('.external-tag')].map(sample) }
    }, CATEGORY_COLORS)
    expect(new Set(colors.categories.map((c) => c.bg.join(','))).size).toBe(Object.keys(CATEGORY_COLORS).length)
    expect(Object.keys(CATEGORY_COLORS)).toHaveLength(7)
    for (const color of [...colors.categories, ...colors.external]) {
      expect(color.ratio, `${color.name ?? '外部收录'} ${color.fg} / ${color.bg}`).toBeGreaterThanOrEqual(4.5)
    }
    expect(colors.external.length).toBeGreaterThan(0)
    for (const color of colors.external) expect(Math.max(...color.bg) - Math.min(...color.bg)).toBeLessThan(10)
  })
}

test('招牌九块砖（上五下四）按断点缩放，排序不换脸、各断点无横滚', async ({ page }) => {
  await page.goto('/')
  for (const width of [1280, 1100, 1024, 900, 680, 679, 400, 390, 320]) {
    await page.setViewportSize({ width, height: 900 })
    const tiles = await page.locator('.hero-portrait').evaluateAll((els) => els.map((el) => { const r = el.getBoundingClientRect(); return { x: r.x, y: r.y, w: r.width, h: r.height } }))
    // 所有宽度都显示 9 块；≥1100 是 124，680–1099 是 96，再窄按视口缩到 ≤60。
    const size = width >= 1100 ? 124 : width >= 680 ? 96 : Math.min(60, (width - 72) / 5)
    expect(tiles).toHaveLength(9)
    for (const tile of tiles) { expect(tile.w).toBeCloseTo(size, 0); expect(tile.h).toBeCloseTo(size, 0) }
    const top = tiles.slice(0, 5), bottom = tiles.slice(5)
    for (const tile of top) expect(tile.y).toBeCloseTo(top[0].y, 0)
    for (const tile of bottom) expect(tile.y).toBeCloseTo(bottom[0].y, 0)
    expect(bottom[0].y).toBeGreaterThan(top[0].y + size)
    // 下排相对上排错开半格：下排第一块的中心落在上排第一、二块中心的正中间。
    expect(bottom[0].x + bottom[0].w / 2).toBeCloseTo((top[0].x + top[1].x + top[0].w) / 2, 0)
    for (const tile of tiles) { expect(tile.x).toBeGreaterThanOrEqual(0); expect(tile.x + tile.w).toBeLessThanOrEqual(width) }
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width)
  }
  await page.getByTestId('sort-new').click()
  expect(await page.locator('.hero-portrait svg').evaluateAll((els) => els.map((el) => el.dataset.shape))).toEqual(HERO_MASCOTS.map((m) => m.shape))
})
