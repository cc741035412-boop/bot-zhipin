import { test, expect } from '@playwright/test'
import { join } from 'node:path'
import { db, matching } from './library-data.mjs'

const row = (page, slug) => page.locator(`.entry[data-slug="${slug}"]`)
const yaml = slug => db.prompts.find(i => i.slug === slug)
const socratic = 'khazix-socratic-questions'
const shot = (page, info, name) => page.screenshot({
  path: join(process.env.PL_SHOTS_DIR || info.outputPath('shots'), `list-${name}.png`), animations: 'disabled',
})
test.use({ permissions: ['clipboard-read', 'clipboard-write'], viewport: { width: 1280, height: 900 }, colorScheme: 'light' })
test.beforeEach(async ({ page }) => {
  await page.goto('/prompts/')
  await page.waitForFunction(() => document.querySelector('#app').__vue_app__)
})

test('每条都能直接用；剪贴板保留原文和译文，正文可选词', async ({ page }) => {
  await expect(page.locator('.entry')).toHaveCount(70)
  await expect(page.locator('.entry:has(.ix-snip):has(.copy)')).toHaveCount(70)
  expect(await page.locator('.ix-snip-text').allTextContents()).toEqual(db.prompts.map(i => i.bodyZh ?? i.body))
  for (const [slug, field] of [[socratic, 'body'], ['campaign-brief-sketch', 'bodyZh']]) {
    const button = row(page, slug).getByRole('button', { name: '复制', exact: true })
    await button.click()
    await expect(row(page, slug).getByRole('status')).toHaveText('已复制')
    expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(yaml(slug)[field])
    await expect(page).toHaveURL(/\/prompts\/$/)
  }
  const item = row(page, socratic)
  const placeholder = item.locator('.ix-snip mark').first()
  await expect(placeholder).toHaveText('【尽量具体地描述发生了什么、你怎么理解，以及你卡在哪里】')
  await placeholder.click()
  await expect(page).toHaveURL(/\/prompts\/$/)
  await placeholder.dblclick()
  expect(await page.evaluate(() => getSelection().toString().length)).toBeGreaterThan(0)
  await expect(page).toHaveURL(/\/prompts\/$/)
  await item.locator('.entry-link').click()
  await expect(page).toHaveURL(new RegExp(`/prompts/${socratic}$`))
})

test('含汉字的尖括号占位符高亮，英文标签仍是普通文本', async ({ page }, info) => {
  const dr = row(page, 'khazix-dr-competition')
  await dr.evaluate(el => el.scrollIntoView({ block: 'center' }))
  await expect(dr.locator('mark').filter({ hasText: /^<在线教育>$/ })).toBeInViewport({ ratio: 1 })
  await shot(page, info, '1280-dr')
  const brief = row(page, 'baoyu-article-visual-brief').locator('.ix-snip-text')
  await expect(brief).toContainText('<article>')
  await expect(brief.locator('mark').filter({ hasText: '<article>' })).toHaveCount(0)
  const item = row(page, socratic)
  await item.evaluate(el => el.scrollIntoView({ block: 'center' }))
  await expect(item.locator('mark').first()).toBeInViewport({ ratio: 1 })
  await shot(page, info, '1280-socratic')
})

test('短文无需展开；长文用键盘展开到最后一行，再收起', async ({ page }, info) => {
  await expect(row(page, 'khazix-ask-first-oneliner').locator('.ix-snip-toggle')).toHaveCount(0)
  const slug = 'karpathy-personal-wiki', item = row(page, slug)
  const panel = item.locator('.ix-snip'), toggle = item.locator('.ix-snip-toggle')
  const folded = () => panel.evaluate(el => {
    const s = getComputedStyle(el)
    return el.clientHeight <= 4 * parseFloat(s.lineHeight) + parseFloat(s.paddingTop) + parseFloat(s.paddingBottom) + 1
  })
  await expect(toggle).toHaveAccessibleName('展开')
  await expect(toggle).toHaveAttribute('aria-expanded', 'false')
  expect(await folded()).toBe(true)
  await item.locator('.copy').press('Tab')
  await expect(toggle).toBeFocused()
  await toggle.press('Space')
  await expect(toggle).toHaveAttribute('aria-expanded', 'true')
  await expect(toggle).toHaveAccessibleName('收起')
  const tail = yaml(slug).bodyZh.slice(-20)
  await expect.poll(() => panel.evaluate((el, tail) => {
    const text = el.querySelector('.ix-snip-text')
    return text.textContent.endsWith(tail) && text.getBoundingClientRect().bottom <= el.getBoundingClientRect().bottom
  }, tail)).toBe(true)
  await item.locator('h2').evaluate(el => el.scrollIntoView({ block: 'start' }))
  await page.evaluate(() => scrollBy(0, -140))
  await shot(page, info, '1280-expanded')
  await toggle.press('Enter')
  await expect(toggle).toHaveAttribute('aria-expanded', 'false')
  await expect.poll(folded).toBe(true)
})

test('滚到长文中段仍可复制全文，收起回到行首', async ({ page }, info) => {
  const slug = 'karpathy-personal-wiki', item = row(page, slug)
  const panel = item.locator('.ix-snip'), toolbar = panel.locator('.ix-snip-toolbar')
  const foldedHeight = (await panel.boundingBox()).height
  await expect(toolbar).toHaveCount(0)
  await item.getByRole('button', { name: '展开' }).click()
  const text = panel.locator('.ix-snip-text')
  await expect.poll(() => text.evaluate(el => el.parentElement.clientHeight >= el.clientHeight)).toBe(true)
  await text.evaluate(el => el.scrollIntoView({ block: 'center' }))
  expect(await text.evaluate(el => el.getBoundingClientRect().top < 0 && el.getBoundingClientRect().bottom > innerHeight)).toBe(true)
  const close = toolbar.getByRole('button', { name: '收起' }), copy = toolbar.locator('.copy')
  await expect(copy).toHaveAccessibleName('复制')
  await expect(close).toBeInViewport({ ratio: 1 })
  await expect(copy).toBeInViewport({ ratio: 1 })
  await shot(page, info, '1280-expanded-mid')
  await copy.click()
  await expect(copy).toHaveAccessibleName('已复制')
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(yaml(slug).bodyZh)
  await close.click()
  await expect(toolbar).toHaveCount(0)
  await expect.poll(async () => (await panel.boundingBox()).height).toBe(foldedHeight)
  await expect.poll(() => item.evaluate(el => { const { top } = el.getBoundingClientRect(); return top >= 0 && top < innerHeight })).toBe(true)
})

test('剪贴板不可用时选中本行完整正文', async ({ page }) => {
  await page.evaluate(() => Object.defineProperty(navigator, 'clipboard', { value: undefined }))
  const item = row(page, socratic)
  await item.locator('.copy').click()
  await expect(item.getByRole('status')).toHaveText('未复制')
  expect(await page.evaluate(() => getSelection().getRangeAt(0).toString())).toBe(yaml(socratic).body)
  await expect(item.locator('.copy')).toHaveAccessibleName('复制')
})

test('搜正文保留所有命中项；Skills 不显示正文块', async ({ page }) => {
  const q = '苏格拉底'
  await page.getByRole('textbox', { name: '搜索' }).fill(q)
  await expect(page.locator('.entry .entry-link')).toHaveText(matching('prompts', q).map(i => i.title))
  await expect(row(page, socratic)).toBeVisible()
  await page.goto('/skills/')
  await expect(page.locator('.entry').first()).toBeVisible()
  await expect(page.locator('.ix-snip')).toHaveCount(0)
})

test('首屏键盘复制及深浅主题', async ({ page }, info) => {
  const first = page.locator('.entry').first(), button = first.locator('.copy')
  await shot(page, info, '1280-light')
  await first.locator('.entry-link').press('Tab')
  await expect(button).toBeFocused()
  await expect(button).not.toHaveCSS('outline-style', 'none')
  await button.press('Enter')
  await expect(button).toHaveAccessibleName('已复制')
  const i = db.prompts[0]
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(i.bodyZh ?? i.body)
  await first.locator('p').click()
  await button.click()
  await expect(button).toHaveCSS('outline-style', 'none')
  await expect(button).toHaveAccessibleName('已复制')
  await page.mouse.move(0, 0)
  await shot(page, info, '1280-copied')
  await page.emulateMedia({ colorScheme: 'dark' })
  await page.reload()
  await page.mouse.move(0, 0)
  await expect(page.locator('html')).toHaveClass(/dark/)
  await shot(page, info, '1280-dark')
})

test('390px 首屏露出复制图标，不横滚', async ({ page }, info) => {
  await page.setViewportSize({ width: 390, height: 844 })
  const button = page.locator('.entry').first().locator('.copy')
  await expect(button).toHaveAccessibleName('复制')
  await expect(button).toBeInViewport({ ratio: 1 })
  await expect(button.locator('[data-icon="copy"]')).toBeVisible()
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  const { width, height } = await button.boundingBox()
  expect(width).toBe(height)
  expect(width).toBeGreaterThanOrEqual(36)
  expect(width).toBeLessThanOrEqual(44)
  await shot(page, info, '390-light')
  await button.click()
  await expect(button.locator('[data-icon="check"]')).toBeVisible()
})

test.describe('390px 触屏', () => {
  test.use({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true })

  test('点复制后标题旁没有箭头，标题下不多占一行', async ({ page }, info) => {
    const first = page.locator('.entry').first()
    await first.locator('.copy').tap()
    await expect(first.getByRole('status')).toHaveText('已复制')
    await expect(first.locator('.ix-row-go')).toHaveCSS('display', 'none')
    const title = first.locator('h2')
    const trailingSpace = await title.evaluate(el => {
      const text = document.createRange()
      text.selectNodeContents(el.querySelector('.entry-link').firstChild)
      return (el.getBoundingClientRect().bottom - text.getBoundingClientRect().bottom) / parseFloat(getComputedStyle(el).lineHeight)
    })
    expect(trailingSpace).toBeLessThan(1)
    await shot(page, info, '390-copied')
  })
})
