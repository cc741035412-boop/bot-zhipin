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
  await button.press('Enter')
  await expect(button).toHaveAccessibleName('已复制')
  const i = db.prompts[0]
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(i.bodyZh ?? i.body)
  await page.locator('.entry').nth(1).hover()
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
  await shot(page, info, '390-light')
  await button.click()
  await expect(button.locator('[data-icon="check"]')).toBeVisible()
})
