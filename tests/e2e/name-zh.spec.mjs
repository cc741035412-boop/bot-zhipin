// 中文叫法：写了 nameZh 的 Bot，界面上以中文叫法为主，原名小一号、淡一档跟在后面；没写的照旧。规格见 INTERACTION.md §3.4。
// 示例数据里只有 demo-external 带中文叫法（name: Demo External Helper，nameZh: 示例·外部收录），另外两个名字本来就是中文。
import { test, expect } from '@playwright/test'
import { makeWebSubmissionLink } from '../../scripts/make-submission-link.mjs'
import { encode, pack, unpack } from '../../scripts/submission/bundle.mjs'

const external = 'demo-external'
const reviewer = 'demo-prd-reviewer'
const weekly = 'demo-weekly-digest'
const zh = '示例·外部收录'
const original = 'Demo External Helper'
const both = `${zh} ${original}`
const card = (page, slug) => page.locator(`[data-testid="bot-card"][data-slug="${slug}"]`)
const featured = (page, slug) => page.locator(`[data-testid="featured-card"][data-slug="${slug}"]`)
const overflow = (page) => page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
const px = (locator, property) => locator.evaluate((node, name) => parseFloat(getComputedStyle(node)[name]), property)
/** 名字这一层的实测：一行高不高、中文叫法和原名各自有没有被截、原名还露不露着。 */
const measure = (name) => name.evaluate((node) => {
  const zhNode = node.querySelector('.bz-name-zh'), origNode = node.querySelector('.bz-name-orig')
  const box = node.getBoundingClientRect(), origBox = origNode.getBoundingClientRect()
  return {
    height: box.height,
    lineHeight: parseFloat(getComputedStyle(node).lineHeight),
    zhCut: zhNode.scrollWidth > zhNode.clientWidth,
    // 放不下时原名落到第二行，被这一层裁掉
    origShown: origBox.top < box.bottom - 1,
    origCut: origNode.scrollWidth > origNode.clientWidth,
  }
})

test.beforeEach(async ({ context, page }) => {
  await context.route('https://x.ai/**', (route) => route.fulfill({ contentType: 'text/html', body: '<p>模拟导入页面</p>' }))
  await page.route('**/api/stats', (route) => route.fulfill({ json: { ok: true, heat: {}, byKind: {} } }))
  await page.route('**/api/click', (route) => route.fulfill({ json: { ok: true, counted: true, heat: 1 } }))
})

test.describe('首页', () => {
  test('列表卡：中文叫法在前、原名跟在后面，原名小一号、淡一档；全称在 title 里；读屏按中文叫法叫它', async ({ page }) => {
    await page.goto('/')
    const item = card(page, external)
    const link = item.getByTestId('detail-link')
    await expect(link).toHaveText(both)
    await expect(link).toHaveAttribute('href', `/bots/${external}`)
    const name = link.locator('.bz-name')
    await expect(name.locator('.bz-name-zh')).toHaveText(zh)
    await expect(name.locator('.bz-name-orig')).toHaveText(original)
    await expect(name).toHaveAttribute('title', original)
    // 主次：中文叫法 16px/600 墨色，原名 13px/400 三级灰。
    expect(await px(name.locator('.bz-name-zh'), 'fontSize')).toBe(16)
    expect(await px(name.locator('.bz-name-orig'), 'fontSize')).toBe(13)
    expect(await px(name.locator('.bz-name-zh'), 'fontWeight')).toBe(600)
    expect(await px(name.locator('.bz-name-orig'), 'fontWeight')).toBe(400)
    const colors = await name.evaluate((node) => [getComputedStyle(node.querySelector('.bz-name-zh')).color, getComputedStyle(node.querySelector('.bz-name-orig')).color, getComputedStyle(node.closest('.bot-head').querySelector('.bot-byline')).color])
    expect(colors[1]).not.toBe(colors[0])
    expect(colors[1]).toBe(colors[2])
    // 宽屏上两个名字都写全，只占一行。
    const state = await measure(name)
    expect(state).toMatchObject({ zhCut: false, origShown: true, origCut: false })
    expect(state.height).toBeLessThanOrEqual(state.lineHeight + 0.5)
    await expect(item.getByTestId('avatar')).toHaveAttribute('aria-label', `听听${zh}的自荐`)
    // 卡片里仍然只有一个指向详情的链接。
    await expect(item.locator(`a[href="/bots/${external}"]`)).toHaveCount(1)
  })

  test('没写中文叫法的 Bot 照旧：名字就是一段文字，没有多出来的元素', async ({ page }) => {
    await page.goto('/')
    for (const [slug, text] of [[reviewer, '示例·PRD 评审员'], [weekly, '示例·周报整理员']]) {
      const link = card(page, slug).getByTestId('detail-link')
      await expect(link).toHaveText(text)
      await expect(link.locator('.bz-name')).toHaveCount(0)
      await expect(link.locator('*')).toHaveCount(0)
    }
  })

  test('主推卡和列表卡同一套写法', async ({ page }) => {
    await page.goto('/')
    const name = featured(page, external).locator('.bot-name a .bz-name')
    await expect(name).toHaveText(both)
    await expect(name).toHaveAttribute('title', original)
    expect(await px(name.locator('.bz-name-orig'), 'fontSize')).toBe(13)
    await expect(featured(page, reviewer).locator('.bot-name a')).toHaveText('示例·PRD 评审员')
    await expect(featured(page, reviewer).locator('.bz-name')).toHaveCount(0)
  })

  test('点原名也进详情（它在链接里面）', async ({ page }) => {
    await page.goto('/')
    await card(page, external).locator('.bz-name-orig').click()
    await expect(page).toHaveURL(new RegExp(`/bots/${external}$`))
  })

  for (const width of [1440, 900, 680, 390, 360, 320]) {
    test(`${width} 宽：名字只占一行，中文叫法不被截，「导入」还在卡片里，页面不横向滚动`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 })
      await page.goto('/')
      for (const item of [card(page, external), featured(page, external)]) {
        await item.scrollIntoViewIfNeeded()
        const state = await measure(item.locator('.bz-name'))
        expect(state.zhCut).toBe(false)
        expect(state.height).toBeLessThanOrEqual(state.lineHeight + 0.5)
        const boxes = await item.evaluate((node) => {
          const rect = (el) => { const box = el.getBoundingClientRect(); return { left: box.left, right: box.right, top: box.top, bottom: box.bottom, width: box.width } }
          return { card: rect(node), button: rect(node.querySelector('[data-testid="btn-import"], [data-testid="featured-import"]')), head: rect(node.querySelector('.bot-head')), scroll: node.scrollWidth - node.clientWidth }
        })
        // 按钮整个在卡片里，没被名字挤窄、挤出去；名字那一格也没伸到卡片外面。
        expect(boxes.button.left).toBeGreaterThanOrEqual(boxes.card.left + 8)
        expect(boxes.button.right).toBeLessThanOrEqual(boxes.card.right - 8)
        expect(boxes.button.bottom).toBeLessThanOrEqual(boxes.card.bottom - 8)
        expect(boxes.button.width).toBeGreaterThanOrEqual(60)
        expect(boxes.head.right).toBeLessThanOrEqual(boxes.card.right - 8)
        expect(boxes.scroll).toBeLessThanOrEqual(1)
      }
      // 两个名字并排也只占名字那一格的一行高：和没有中文叫法、名字只有一行的卡片一样高。
      // （没有中文叫法的长名字在窄处照旧会换成两行，那是原来的行为，这里不比它的实际高度，比它的行高。）
      const rows = await page.evaluate(([a, b]) => {
        const name = (slug) => document.querySelector(`[data-testid="bot-card"][data-slug="${slug}"] .bot-name`)
        return { pair: name(a).getBoundingClientRect().height, line: parseFloat(getComputedStyle(name(b)).lineHeight) }
      }, [external, reviewer])
      expect(Math.abs(rows.pair - rows.line)).toBeLessThanOrEqual(0.5)
      expect(await overflow(page)).toBeLessThanOrEqual(0)
    })
  }

  test('越来越窄：先截原名，再整个不显示原名，中文叫法始终写全；全称一直在 title 里', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 900 })
    await page.goto('/')
    const item = card(page, external)
    await item.scrollIntoViewIfNeeded()
    const name = item.locator('.bz-name')
    // 把卡片一点点收窄，记下原名经过的三种样子。
    const seen = []
    for (let width = 360; width >= 200; width -= 10) {
      await item.evaluate((node, value) => { node.style.width = `${value}px` }, width)
      const state = await measure(name)
      expect(state.height, `卡片 ${width}px`).toBeLessThanOrEqual(state.lineHeight + 0.5)
      const kind = !state.origShown ? '不显示' : state.origCut ? '截断' : '写全'
      if (seen.at(-1)?.kind !== kind) seen.push({ kind, width, zhCut: state.zhCut })
      // 原名一露出来，至少有 4 个字宽（12px 一个字，留 1px 的取整余量），不会只剩一小截。
      if (state.origShown && state.origCut) expect(await name.locator('.bz-name-orig').evaluate((node) => node.getBoundingClientRect().width), `卡片 ${width}px`).toBeGreaterThanOrEqual(4 * 13 - 1)
    }
    expect(seen.map((step) => step.kind)).toEqual(['写全', '截断', '不显示'])
    // 原名还在的时候中文叫法不让位。
    expect(seen.filter((step) => step.kind !== '不显示').every((step) => !step.zhCut)).toBe(true)
    await expect(name).toHaveAttribute('title', original)
    await expect(name.locator('.bz-name-orig')).toHaveText(original)
  })
})

test.describe('详情页', () => {
  test('标题是中文叫法 + 原名（原名用 h3 档、三级灰）；网页标题带上两个名字；读屏和侧栏按中文叫法叫它', async ({ page }) => {
    await page.goto(`/bots/${external}`)
    const heading = page.getByTestId('bot-detail').locator('h1')
    await expect(heading).toHaveText(both)
    // 标题里原名始终是全的，不用再放一份到 title 里。
    await expect(heading.locator('.bz-name')).not.toHaveAttribute('title')
    expect(await px(heading.locator('.bz-name-zh'), 'fontSize')).toBe(32)
    expect(await px(heading.locator('.bz-name-orig'), 'fontSize')).toBe(20)
    const colors = await heading.evaluate((node) => [getComputedStyle(node.querySelector('.bz-name-zh')).color, getComputedStyle(node.querySelector('.bz-name-orig')).color])
    expect(colors[1]).not.toBe(colors[0])
    await expect(page).toHaveTitle(/^示例·外部收录（Demo External Helper）/)
    await expect(page.getByTestId('detail-rail')).toHaveAttribute('aria-label', `${zh} 的导入和基本信息`)
    await expect(page.getByTestId('avatar')).toHaveAttribute('aria-label', `听听${zh}的自荐`)
  })

  test('没写中文叫法的详情页照旧', async ({ page }) => {
    await page.goto(`/bots/${weekly}`)
    const heading = page.getByTestId('bot-detail').locator('h1')
    await expect(heading).toHaveText('示例·周报整理员')
    await expect(heading.locator('.bz-name')).toHaveCount(0)
    await expect(page).toHaveTitle('示例·周报整理员怎么用、值不值得装 | Bot 直聘')
    await expect(page.getByTestId('forked-from').locator('a')).toHaveText('示例·PRD 评审员')
  })

  for (const width of [390, 320]) {
    test(`${width} 宽：标题可以换行，中文叫法不从中间断开，原名不截断，页面不横向滚动`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 })
      await page.goto(`/bots/${external}`)
      const heading = page.getByTestId('bot-detail').locator('h1')
      const state = await heading.evaluate((node) => {
        const zhNode = node.querySelector('.bz-name-zh'), origNode = node.querySelector('.bz-name-orig')
        return {
          zhLines: Math.round(zhNode.getBoundingClientRect().height / parseFloat(getComputedStyle(zhNode).lineHeight)),
          origCut: origNode.scrollWidth > origNode.clientWidth + 1,
          right: Math.max(zhNode.getBoundingClientRect().right, origNode.getBoundingClientRect().right),
        }
      })
      expect(state.zhLines).toBe(1)
      expect(state.origCut).toBe(false)
      expect(state.right).toBeLessThanOrEqual(width - 16 + 0.5)
      expect(await overflow(page)).toBeLessThanOrEqual(0)
    })
  }
})

test.describe('搜索面板', () => {
  const open = async (page) => {
    await page.goto('/')
    await page.getByTestId('search-trigger').click()
    await expect(page.getByTestId('search-input')).toBeFocused()
  }
  const hit = (page) => page.locator(`[data-testid="search-item"][data-slug="${external}"]`)

  test('条目里中文叫法在前、原名在后（12px）', async ({ page }) => {
    await open(page)
    const name = hit(page).locator('[data-part="name"]')
    await expect(name).toHaveText(both)
    await expect(name.locator('.bz-name')).toHaveAttribute('title', original)
    expect(await px(name.locator('.bz-name-zh'), 'fontSize')).toBe(14)
    expect(await px(name.locator('.bz-name-orig'), 'fontSize')).toBe(12)
    await expect(page.locator(`[data-testid="search-item"][data-slug="${reviewer}"] [data-part="name"]`)).toHaveText('示例·PRD 评审员')
  })

  for (const query of ['外部收录', '示例·外', 'demo external', 'HELPER']) {
    test(`搜「${query}」能找到：中文叫法和原名都能搜`, async ({ page }) => {
      await open(page)
      await page.getByTestId('search-input').fill(query)
      await expect(hit(page)).toBeVisible()
      await expect(page.getByTestId('search-item').first()).toHaveAttribute('data-slug', external)
    })
  }

  test('回车进它的详情页', async ({ page }) => {
    await open(page)
    await page.getByTestId('search-input').fill('external helper')
    await expect(page.getByTestId('search-item')).toHaveCount(1)
    await page.keyboard.press('Enter')
    await expect(page).toHaveURL(new RegExp(`/bots/${external}$`))
    await expect(page.getByTestId('bot-detail').locator('h1')).toHaveText(both)
  })
})

test.describe('小队页', () => {
  const member = (page, slug) => page.locator(`[data-testid="squad-member"][data-slug="${slug}"]`)
  const setup = (page, slug) => page.locator(`[data-testid="setup-member"][data-slug="${slug}"]`)

  test('阵容和导入清单：中文叫法 + 原名；清单、读屏文本只用中文叫法', async ({ page }) => {
    await page.goto('/squads/demo-squad')
    const row = member(page, external)
    await expect(row.getByTestId('member-link')).toHaveText(both)
    await expect(row.locator('.bz-name')).toHaveAttribute('title', original)
    expect(await px(row.locator('.bz-name-orig'), 'fontSize')).toBe(13)
    await expect(row.getByTestId('member-import')).toContainText(`${zh}（在新标签页打开）`)
    await expect(member(page, reviewer).getByTestId('member-link')).toHaveText('示例·PRD 评审员')
    await expect(member(page, reviewer).locator('.bz-name')).toHaveCount(0)

    // 导入清单：就在「导入」按钮旁边，带着原名，方便和 x.ai 模板页对上。
    const item = setup(page, external)
    await expect(item.locator('.setup-member-name')).toHaveText(both)
    expect(await px(item.locator('.bz-name-orig'), 'fontSize')).toBe(12)
    await expect(item.getByTestId('member-check')).toHaveAttribute('aria-label', `${zh} 已导入`)

    // 额度清单里是第二次出现：只写中文叫法，原名在 title 里。
    const quota = page.getByTestId('squad-quota').locator('.cost-row').nth(2)
    await expect(quota.locator('.cost-name')).toHaveText(zh)
    await expect(quota.locator('.cost-name [title]')).toHaveAttribute('title', original)
    await expect(quota.locator('.bz-name')).toHaveCount(0)
  })

  test('宽屏：名字和岗位标签在同一行，标签不往下掉；手机上不横向滚动', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto('/squads/demo-squad')
    const tops = await member(page, external).locator('.roster-who').evaluate((node) => [...node.children].map((child) => Math.round(child.getBoundingClientRect().top + child.getBoundingClientRect().height / 2)))
    expect(Math.max(...tops) - Math.min(...tops)).toBeLessThanOrEqual(2)
    for (const width of [390, 320]) {
      await page.setViewportSize({ width, height: 900 })
      await expect(member(page, external).getByTestId('member-link')).toHaveText(both)
      expect(await overflow(page)).toBeLessThanOrEqual(0)
    }
  })

  test('搜成员的原名或中文叫法，都能把小队搜出来', async ({ page }) => {
    await page.goto('/')
    for (const query of ['external helper', '外部收录']) {
      await page.getByTestId('search-trigger').click()
      await page.getByTestId('search-input').fill(query)
      await expect(page.locator('[data-testid="search-squad"][data-slug="demo-squad"]')).toBeVisible()
      await page.keyboard.press('Escape')
    }
  })
})

test.describe('投稿预览（/submit）', () => {
  // 和 CLI 同一份投稿包，只把名字换成真实货架上最长的那一对；只写 CLI 自己的临时副本，fixtures 不动。
  const slug = 'demo-prd-reviewer'
  const longZh = 'Grok Bot 入门教练', longOriginal = 'Grok Bot Tutorial'
  const token = (() => {
    const bundle = unpack(makeWebSubmissionLink(`tests/fixtures/bots/${slug}`).bundle)
    const path = `bots/${slug}/bot.yaml`
    bundle.files[path] = bundle.files[path].replace(/^name:.*$/m, `name: ${longOriginal}\nnameZh: ${longZh}`)
    return encode(pack(bundle))
  })()
  const open = async (page) => {
    await page.context().route('**/*', (route) => new URL(route.request().url()).hostname === '127.0.0.1' ? route.continue() : route.abort())
    await page.route('**/api/auth/me', (route) => route.fulfill({ status: 401, json: { error: 'unauthenticated' } }))
    await page.goto(`/submit#${token}`)
    await expect(page.getByTestId('validation-ok')).toBeVisible()
  }

  for (const width of [1440, 390]) {
    test(`${width} 宽：窄卡片里名字只占一行，中文叫法写全，「导入」没被挤走；详情预览的标题两个名字都在`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 })
      await open(page)
      if (await page.getByTestId('preview-toggle').getAttribute('aria-expanded') === 'false') await page.getByTestId('preview-toggle').click()
      const item = page.getByTestId('preview-card').getByTestId('bot-card')
      await expect(item.getByTestId('detail-link')).toHaveText(`${longZh} ${longOriginal}`)
      await item.scrollIntoViewIfNeeded()
      const state = await measure(item.locator('.bz-name'))
      expect(state.zhCut).toBe(false)
      expect(state.height).toBeLessThanOrEqual(state.lineHeight + 0.5)
      const boxes = await item.evaluate((node) => {
        const rect = (el) => { const box = el.getBoundingClientRect(); return { left: box.left, right: box.right, bottom: box.bottom, width: box.width } }
        return { card: rect(node), button: rect(node.querySelector('[data-testid="btn-import"]')), head: rect(node.querySelector('.bot-head')), scroll: node.scrollWidth - node.clientWidth }
      })
      // 预览栏只有 380px 左右：卡片走窄版式，「导入」在最下面一行撑开。
      expect(boxes.card.width).toBeLessThan(400)
      expect(boxes.button.left).toBeGreaterThanOrEqual(boxes.card.left + 8)
      expect(boxes.button.right).toBeLessThanOrEqual(boxes.card.right - 8)
      expect(boxes.button.bottom).toBeLessThanOrEqual(boxes.card.bottom - 8)
      expect(boxes.button.width).toBeGreaterThanOrEqual(120)
      expect(boxes.head.right).toBeLessThanOrEqual(boxes.card.right - 8)
      expect(boxes.scroll).toBeLessThanOrEqual(1)

      await page.getByTestId('preview-tab-detail').click()
      const heading = page.getByTestId('preview-detail').locator('.detail-info > h2')
      await expect(heading).toHaveText(`${longZh} ${longOriginal}`)
      const title = await heading.evaluate((node) => {
        const origNode = node.querySelector('.bz-name-orig'), area = node.closest('.submit-preview-inner')
        return { origCut: origNode.scrollWidth > origNode.clientWidth + 1, right: Math.max(origNode.getBoundingClientRect().right, node.querySelector('.bz-name-zh').getBoundingClientRect().right), areaRight: area.getBoundingClientRect().right }
      })
      // 只看名字本身：原名没被截，两个名字都没伸到预览栏外面。
      // （预览栏整体的横向溢出不在这里量：390 宽时「收起预览」按钮本来就比预览栏宽出 8px，和名字无关。）
      expect(title.origCut).toBe(false)
      expect(title.right).toBeLessThanOrEqual(title.areaRight + 0.5)
      expect(await overflow(page)).toBeLessThanOrEqual(0)
    })
  }
})
