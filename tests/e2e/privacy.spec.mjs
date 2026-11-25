import { expect, test } from '@playwright/test'

const headings = [
  '逛网站时记什么', '不记什么', '搜索词', '存多久', '投稿时',
  '导入 Bot、安装 Skill 时', '浏览器里存了什么', '有问题找谁',
]

test('从首页页脚打开完整的隐私说明', async ({ page }) => {
  await page.goto('/')
  const link = page.getByTestId('site-footer').getByTestId('footer-privacy')
  await expect(link).toHaveText('隐私说明')
  await expect(link).toHaveAttribute('href', '/privacy')
  await link.click()
  await expect(page).toHaveURL(url => url.pathname === '/privacy')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('隐私说明')
  await expect(page.locator('main').getByRole('heading', { level: 2 })).toHaveText(headings)
})

test('手机宽度下，隐私说明不出现横向滚动', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 700 })
  await page.goto('/privacy')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('隐私说明')
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(320)
})
