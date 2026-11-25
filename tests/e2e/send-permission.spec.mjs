import { expect, test } from '@playwright/test'

const weekly = 'demo-weekly-digest'
const reviewer = 'demo-prd-reviewer'
const description = '会以你的名义发送消息或发布内容'

test('普通卡和精选卡仅在 Bot 有代发权限时显示标识', async ({ page }) => {
  await page.goto('/')
  for (const [kind, previous] of [['bot-card', 'stat-auto'], ['featured-card', 'stat-quota']]) {
    const mark = page.locator(`[data-testid="${kind}"][data-slug="${weekly}"] .${previous} + .stat-send`)
    await expect(mark).toBeVisible()
    await expect(mark).toHaveText('会代你发消息')
    await expect(mark.locator('svg')).toHaveAttribute('data-icon', 'send')
    const other = page.locator(`[data-testid="${kind}"][data-slug="${reviewer}"]`)
    await expect(other).toBeVisible()
    await expect(other.locator('.stat-send')).toHaveCount(0)
  }
})

test('详情侧栏标明会不会代发，并在 320px 手机宽度下排成一行', async ({ page }) => {
  for (const [slug, allowed] of [[weekly, true], [reviewer, false]]) {
    await page.setViewportSize({ width: 320, height: 800 })
    await page.goto(`/bots/${slug}`)
    const rail = page.getByTestId('detail-rail')
    const send = rail.getByTestId('fact-send')
    await expect(send.locator('svg')).toHaveAttribute('data-icon', 'send')
    if (allowed) {
      await expect(send).toHaveText('会')
      await expect(send).toHaveAttribute('title', description)
      await expect(send).toHaveAccessibleDescription(description)
      await expect(send).not.toHaveClass(/\bnone\b/)
    } else {
      await expect(send).toHaveText('不会')
      await expect(send).toHaveClass(/\bnone\b/)
      await expect(send).not.toHaveAttribute('title')
    }
    await page.evaluate(() => document.fonts.ready)
    const facts = rail.locator('.rail-fact')
    expect(await facts.evaluateAll((els) => new Set(els.map((el) => el.offsetTop)).size)).toBe(1)
    expect(await facts.evaluateAll((els) => els.filter((el) => el.scrollWidth > el.clientWidth + 1).length)).toBe(0)
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(320)
  }
})
