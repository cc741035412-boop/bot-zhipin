// 标签页小图标：随机一只 Bot，隔几秒变成另一只。规格见 docs/dev/INTERACTION.md「标签页图标」。
// 无头浏览器没有标签栏，这里验的是页面交给浏览器的那张图：地址、内容、何时变、怎么变。
import { test, expect } from '@playwright/test'
import { HERO_MASCOTS } from '../../site/.vitepress/meta.mjs'

const COLORS = HERO_MASCOTS.map((mascot) => mascot.color)
const SHAPES = ['blob', 'pebble', 'bean', 'egg', 'squircle', 'tablet', 'hex', 'gem', 'shield',
  'dome', 'arch', 'cloud', 'leaf', 'clover', 'flower', 'heart', 'house', 'star']
const SWAP_MAX = 7000
const icon = (page) => page.locator('head link[data-bz-favicon]')
const read = (page) => icon(page).evaluate((link) => ({
  shape: link.getAttribute('data-shape'),
  color: link.getAttribute('data-color'),
  href: link.getAttribute('href'),
  svg: decodeURIComponent(link.getAttribute('href').replace('data:image/svg+xml,', '')),
}))
const bodyFill = (svg) => svg.match(/<use href="#p" fill="([^"]+)"/)[1]
/** 两只眼睛的中心相对图标中心的偏移（图标坐标，整张图约 230 宽）。 */
const eyeOffset = (svg) => {
  const [left, top, side] = svg.match(/viewBox="([^"]+)"/)[1].split(' ').map(Number)
  const eyes = [...svg.matchAll(/transform="matrix\(([^)]+)\)"/g)].map((match) => match[1].split(',').map(Number))
  return {
    x: (eyes[0][4] + eyes[1][4]) / 2 - (left + side / 2),
    y: (eyes[0][5] + eyes[1][5]) / 2 - (top + side / 2),
  }
}
/** 眼睛的竖向开合度：变换矩阵里竖直方向那一项的绝对值（睁开约 1，闭上约 0.06）。 */
const lidOf = (svg) => Math.abs(Number(svg.match(/transform="matrix\(([^)]+)\)"/)[1].split(',')[3]))

test.beforeEach(async ({ page }) => {
  await page.route('**/api/stats', (route) => route.fulfill({ json: { ok: true, heat: {}, byKind: {} } }))
  // 记下图标每一次换图：时间、图、当时标注的形状和颜色。
  await page.addInitScript(() => {
    window.__favicon = []
    new MutationObserver((records) => {
      for (const record of records) {
        const link = record.target
        if (record.type !== 'attributes' || !link.matches?.('link[data-bz-favicon]')) continue
        window.__favicon.push({
          at: performance.now(), href: link.getAttribute('href'),
          shape: link.getAttribute('data-shape'), color: link.getAttribute('data-color'),
        })
      }
    }).observe(document, { subtree: true, attributes: true, attributeFilter: ['href'] })
  })
})

test('静态图标随站点发布；页面源码里声明了三个', async ({ request }) => {
  // 看文件头而不是 Content-Type：本地预览服务不认识 .ico，返回的类型是空的。
  for (const [path, signature] of [['/favicon.ico', '00000100'], ['/favicon.svg', '3c737667'], ['/apple-touch-icon.png', '89504e47']]) {
    const response = await request.get(path)
    expect(response.status(), path).toBe(200)
    expect((await response.body()).subarray(0, 4).toString('hex'), path).toBe(signature)
  }
  const html = await (await request.get('/')).text()
  expect(html).toContain('<link rel="icon" href="/favicon.ico" sizes="32x32">')
  expect(html).toContain('<link rel="icon" href="/favicon.svg" type="image/svg+xml">')
  expect(html).toContain('<link rel="apple-touch-icon" href="/apple-touch-icon.png">')
})

test('脚本起来后只剩一个图标：一只名单里的随机 Bot，画出来身体是它的颜色、眼睛是深色', async ({ page }) => {
  await page.goto('/')
  await expect(icon(page)).toHaveCount(1)
  await expect(page.locator('head link[rel~="icon"]')).toHaveCount(1)
  await expect(page.locator('head link[rel="apple-touch-icon"]')).toHaveCount(1)
  await expect(icon(page)).toHaveAttribute('type', 'image/svg+xml')
  const first = await read(page)
  expect(SHAPES).toContain(first.shape)
  expect(COLORS).toContain(first.color)
  expect(first.href.startsWith('data:image/svg+xml,')).toBe(true)
  expect(bodyFill(first.svg)).toBe(first.color)
  expect(lidOf(first.svg)).toBeGreaterThan(0.9)
  // 按标签页的真实尺寸（16px，两倍屏 32 个像素）画出来：中间是身体色，四角透明，眼睛位置是深色。
  const pixels = await page.evaluate(async (href) => {
    const image = new Image()
    image.src = href
    await image.decode()
    const canvas = document.createElement('canvas')
    canvas.width = canvas.height = 32
    const context = canvas.getContext('2d')
    context.drawImage(image, 0, 0, 32, 32)
    const data = context.getImageData(0, 0, 32, 32).data
    const at = (x, y) => [...data.slice((y * 32 + x) * 4, (y * 32 + x) * 4 + 4)]
    let dark = 0, solid = 0
    for (let i = 0; i < data.length; i += 4) {
      if (data[i + 3] > 200) solid++
      if (data[i + 3] > 200 && data[i] < 60 && data[i + 1] < 60 && data[i + 2] < 60) dark++
    }
    return { corner: at(0, 0), dark, solid }
  }, first.href)
  expect(pixels.corner[3]).toBe(0)
  expect(pixels.solid).toBeGreaterThan(32 * 32 * 0.3) // 身体至少占三成画面
  expect(pixels.dark).toBeGreaterThanOrEqual(8)        // 两只眼睛，至少 8 个深色像素
  expect(pixels.dark).toBeLessThan(32 * 32 * 0.15)
})

test('每次打开不一定是同一只', async ({ page }) => {
  const seen = new Set()
  for (let i = 0; i < 6; i++) {
    await page.goto('/')
    await expect(icon(page)).toHaveCount(1)
    const { shape, color } = await read(page)
    seen.add(`${shape}/${color}`)
  }
  expect(seen.size).toBeGreaterThan(1)
})

test('开着的时候隔几秒变成另一只：形状和颜色都换，中间有过渡帧、眨一下眼，最后停在睁眼的新 Bot 上', async ({ page }) => {
  test.setTimeout(40_000)
  await page.goto('/')
  await expect(icon(page)).toHaveCount(1)
  const first = await read(page)
  await expect(icon(page)).not.toHaveAttribute('data-shape', first.shape, { timeout: SWAP_MAX + 2000 })
  await page.waitForTimeout(900) // 等过渡走完
  const second = await read(page)
  expect(second.shape).not.toBe(first.shape)
  expect(second.color).not.toBe(first.color)
  expect(SHAPES).toContain(second.shape)
  expect(COLORS).toContain(second.color)
  expect(bodyFill(second.svg)).toBe(second.color)
  expect(lidOf(second.svg)).toBeGreaterThan(0.9)

  const frames = (await page.evaluate(() => window.__favicon))
    .map((frame) => ({ ...frame, svg: decodeURIComponent(frame.href.replace('data:image/svg+xml,', '')) }))
  // 变身那一段：标注已经是新 Bot 的那些帧。
  const morph = frames.filter((frame) => frame.shape === second.shape)
  expect(morph.length).toBeGreaterThanOrEqual(5)
  expect(new Set(morph.map((frame) => frame.href)).size).toBeGreaterThanOrEqual(5)
  expect(morph.at(-1).href).toBe(second.href)
  // 过渡在 1 秒内走完，帧间隔不小于 50ms（不刷得比需要的更密）。
  expect(morph.at(-1).at - morph[0].at).toBeLessThan(1000)
  for (let i = 1; i < morph.length; i++) expect(morph[i].at - morph[i - 1].at).toBeGreaterThan(45)
  // 中途出现过渡色（既不是旧色也不是新色），并且闭过眼。
  const between = morph.filter((frame) => ![first.color, second.color].includes(bodyFill(frame.svg)))
  expect(between.length).toBeGreaterThanOrEqual(3)
  expect(Math.min(...morph.map((frame) => lidOf(frame.svg)))).toBeLessThan(0.5)
  // 变身之前的停留期里，只允许有眨眼帧：颜色、身体都不变。
  const before = frames.filter((frame) => frame.shape === first.shape)
  for (const frame of before) expect(bodyFill(frame.svg)).toBe(first.color)
  // 停留期不空转：变身前最多一次眨眼（4 帧）。
  expect(before.length).toBeLessThanOrEqual(4)
})

test('站内跳转后图标还在、还是那一个，静态图标不会回来', async ({ page }) => {
  await page.goto('/')
  await expect(icon(page)).toHaveCount(1)
  await icon(page).evaluate((link) => { link.dataset.sameElement = 'yes' })
  await page.locator('[data-testid="bot-card"]').first().getByTestId('detail-link').click()
  await expect(page.getByTestId('bot-detail')).toBeVisible()
  await expect(page.locator('head link[rel~="icon"]')).toHaveCount(1)
  await expect(icon(page)).toHaveAttribute('data-same-element', 'yes')
  await page.goBack()
  await expect(page.locator('[data-testid="bot-card"]').first()).toBeVisible()
  await expect(page.locator('head link[rel~="icon"]')).toHaveCount(1)
  await expect(icon(page)).toHaveAttribute('data-same-element', 'yes')
  // 外来的静态图标一出现就被请走。
  await page.evaluate(() => {
    const stray = document.createElement('link')
    stray.rel = 'icon'
    stray.href = '/favicon.svg'
    document.head.append(stray)
  })
  await expect(page.locator('head link[rel~="icon"]')).toHaveCount(1)
  await expect(icon(page)).toHaveCount(1)
})

test('直接打开详情页、投稿页、不存在的页面，图标同样生效', async ({ page }) => {
  for (const path of ['/bots/demo-weekly-digest', '/submit', '/no-such-page']) {
    await page.goto(path)
    await expect(icon(page), path).toHaveCount(1)
    await expect(page.locator('head link[rel~="icon"]'), path).toHaveCount(1)
    expect(SHAPES, path).toContain((await read(page)).shape)
  }
})

test('标签页在后台时照样换，但一步到位，不放过渡帧', async ({ page }) => {
  test.setTimeout(40_000)
  await page.addInitScript(() => {
    Object.defineProperty(Document.prototype, 'hidden', { configurable: true, get: () => true })
    Object.defineProperty(Document.prototype, 'visibilityState', { configurable: true, get: () => 'hidden' })
  })
  await page.goto('/')
  await expect(icon(page)).toHaveCount(1)
  const first = await read(page)
  await expect(icon(page)).not.toHaveAttribute('data-shape', first.shape, { timeout: SWAP_MAX + 2000 })
  const second = await read(page)
  expect(bodyFill(second.svg)).toBe(second.color)
  expect(lidOf(second.svg)).toBeGreaterThan(0.9)
  const frames = await page.evaluate(() => window.__favicon)
  expect(frames.filter((frame) => frame.shape === second.shape)).toHaveLength(1)
  expect(frames.filter((frame) => frame.shape === first.shape)).toHaveLength(0) // 后台不眨眼
})

test('减少动效：打开时随机一只，之后不再变；关掉减少动效后恢复变化', async ({ page }) => {
  test.setTimeout(50_000)
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')
  await expect(icon(page)).toHaveCount(1)
  const first = await read(page)
  expect(SHAPES).toContain(first.shape)
  await page.waitForTimeout(SWAP_MAX + 1500)
  expect(await read(page)).toEqual(first)
  expect(await page.evaluate(() => window.__favicon.length)).toBe(0)
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await expect(icon(page)).not.toHaveAttribute('data-shape', first.shape, { timeout: SWAP_MAX + 2000 })
})

test('眼睛跟着鼠标看：左右上下都跟，同一片区域里挪动不换图，停住 4 秒后回正', async ({ page }) => {
  test.setTimeout(40_000)
  await page.setViewportSize({ width: 1200, height: 800 })
  await page.goto('/')
  await expect(icon(page)).toHaveCount(1)
  await expect(icon(page)).toHaveAttribute('data-follow', 'rest')
  const offsetAfterMove = async (x, y, check) => {
    await page.mouse.move(x, y, { steps: 4 })
    await expect(icon(page)).toHaveAttribute('data-follow', 'pointer')
    // 变身过渡中视线由下一帧带上，所以等到条件成立为止。
    await expect.poll(async () => check(eyeOffset((await read(page)).svg)), { timeout: 3000 }).toBe(true)
    return eyeOffset((await read(page)).svg)
  }
  const right = await offsetAfterMove(1190, 400, (o) => o.x > 15)
  const left = await offsetAfterMove(10, 400, (o) => o.x < -15)
  expect(right.x - left.x).toBeGreaterThan(40)
  const bottom = await offsetAfterMove(600, 790, (o) => o.y > 5)
  const top = await offsetAfterMove(600, 10, (o) => o.y < bottom.y - 15)
  expect(bottom.y - top.y).toBeGreaterThan(15)
  // 同一格里小幅挪动：不换图。
  await page.waitForTimeout(300)
  const before = await page.evaluate(() => window.__favicon.length)
  const shape = (await read(page)).shape
  for (let i = 0; i < 10; i++) await page.mouse.move(600 + i * 3, 10 + i)
  await page.waitForTimeout(200)
  const frames = await page.evaluate(() => window.__favicon)
  // 这 200 多毫秒里如果正好赶上变身或眨眼就不比了；否则应当一张都没换。
  if ((await read(page)).shape === shape && frames.slice(before).every((frame) => frame.shape === shape)) {
    expect(frames.length - before).toBeLessThanOrEqual(3) // 最多一次眨眼的 3 帧
  }
  // 鼠标不动 4 秒：视线回正。
  await expect(icon(page)).toHaveAttribute('data-follow', 'rest', { timeout: 6000 })
  await expect.poll(async () => Math.abs(eyeOffset((await read(page)).svg).x), { timeout: 3000 }).toBeLessThan(12)
})

test('鼠标移出窗口，视线马上回正；减少动效时不跟', async ({ page }) => {
  await page.setViewportSize({ width: 1200, height: 800 })
  await page.goto('/')
  await expect(icon(page)).toHaveCount(1)
  await page.mouse.move(1190, 400, { steps: 3 })
  await expect(icon(page)).toHaveAttribute('data-follow', 'pointer')
  await page.evaluate(() => document.dispatchEvent(new PointerEvent('pointerout', { bubbles: true, relatedTarget: null })))
  await expect(icon(page)).toHaveAttribute('data-follow', 'rest')
  await page.emulateMedia({ reducedMotion: 'reduce' })
  const still = await read(page)
  await page.mouse.move(10, 400, { steps: 3 })
  await page.waitForTimeout(400)
  await expect(icon(page)).toHaveAttribute('data-follow', 'rest')
  expect((await read(page)).href).toBe(still.href)
})
