import { test, expect } from '@playwright/test'
import { mkdir } from 'node:fs/promises'
import { join } from 'node:path'

const brand = '.VPNavBarTitle a'
const modules = '.module-nav'
const tools = '.VPNavBar .content'
const clear = 'rgba(0, 0, 0, 0)'
async function ordered(page) {
  const [a,b,c] = await Promise.all([brand,modules,tools].map(sel => page.locator(sel).boundingBox()))
  expect(a.x + a.width).toBeLessThanOrEqual(b.x)
  expect(b.x + b.width).toBeLessThanOrEqual(c.x)
}
async function scroll(page, y) {
  await page.evaluate(y => window.scrollTo({ top: y, behavior: 'instant' }), y)
  await expect.poll(() => page.evaluate(() => scrollY)).toBe(y)
}
const brandGlass = `${brand} > .nav-island-glass`
const toolsGlass = `${tools} .content-body > .nav-island-glass`
async function glassColor(page) {
  return page.evaluate(() => {
    const probe = document.createElement('span')
    probe.style.backgroundColor = 'var(--bz-nav-bg)'
    document.body.append(probe)
    const color = getComputedStyle(probe).backgroundColor
    probe.remove()
    return color
  })
}
async function covers(glass, controls, padding = 0) {
  const box = await glass.boundingBox()
  expect(box.width).toBeGreaterThan(0)
  expect(box.height).toBeGreaterThan(0)
  for (const control of controls) {
    const rect = await control.boundingBox()
    expect(box.x + padding).toBeLessThanOrEqual(rect.x + 1)
    expect(box.y).toBeLessThanOrEqual(rect.y + 1)
    expect(box.x + box.width - padding).toBeGreaterThanOrEqual(rect.x + rect.width - 1)
    expect(box.y + box.height).toBeGreaterThanOrEqual(rect.y + rect.height - 1)
  }
}
for (const width of [1280,390]) for (const colorScheme of ['light','dark']) test.describe(`${width}px ${colorScheme} 玻璃底`, () => {
  test.use({ viewport:{width,height:844}, colorScheme })
  test('滚动时盖住控件，回顶透明', async ({page}) => {
    await page.goto('/skills/')
    await expect(page.locator('.module-slider')).toBeVisible()
    await expect.poll(() => page.locator('html').evaluate(el => el.classList.contains('dark'))).toBe(colorScheme === 'dark')
    const islands = [[page.locator(brandGlass), [page.locator(brand)], 0]]
    if (width === 1280) islands.push([page.locator(toolsGlass), ['.VPNavBarMenuLink','.VPSwitch','.VPSocialLink'].map(s => page.locator(`${tools} ${s}:visible`)), 6])
    await scroll(page,400)
    const color = await glassColor(page)
    expect(color).not.toBe(clear)
    for (const [glass, controls, padding] of islands) {
      await expect(glass).toHaveCSS('background-color',color)
      await expect(glass).toHaveCSS('backdrop-filter',/blur\(16px\)/)
      await covers(glass, controls, padding)
    }
    await scroll(page,0)
    for (const [glass] of islands) await expect(glass).toHaveCSS('background-color',clear)
  })
})
async function shot(page, info, name) {
  if (name.includes('-scrolled-')) {
    await expect(page.locator(toolsGlass)).toHaveCSS('background-color', await glassColor(page))
  }
  if (name.startsWith('home-') && name.includes('-top-')) {
    await expect(page.locator('.pit-haze.is-on:not(.is-dim)')).toHaveCount(1, { timeout: 30000 })
  }
  const dir = process.env.HD_SHOTS_DIR || info.outputPath('shots')
  await mkdir(dir, {recursive:true})
  await page.screenshot({path:join(dir, `${name}.png`), animations:'disabled'})
}

test('作者页归属 Bot 模块，显示活动滑块', async ({ page }) => {
  await page.route('**/api/avatar/**', route => route.fulfill({ status: 404, body: '' }))
  await page.goto('/authors/example-user')
  await expect(page.locator('.module-nav [aria-current="page"]')).toHaveAttribute('href', '/')
  await expect(page.locator('.module-slider')).toBeVisible()
})

test.describe('桌面三岛', () => {
  test.use({ viewport:{width:1280,height:900}, colorScheme:'light' })
  test('透明外框、滑块、滚动和键盘顺序', async ({page}) => {
    await page.goto('/')
    const bar = page.locator('.VPNavBar')
    await expect(bar).toHaveCSS('background-color',clear)
    for (const side of ['top','left','bottom','right']) await expect(bar).toHaveCSS(`border-${side}-width`,'0px')
    await ordered(page)
    await page.keyboard.press('Tab') // 跳到主要内容
    await page.keyboard.press('Tab')
    await expect(page.locator(brand)).toBeFocused()
    for (const link of [...await page.locator('.module-nav a').all(), page.locator('.VPNavBarMenuLink'),page.locator('.VPNavBar .VPSwitch:visible'),page.locator('.VPNavBar .VPSocialLink:visible')]) {
      await page.keyboard.press('Tab'); await expect(link).toBeFocused()
    }
    for (const y of [400,0]) {
      await scroll(page,y)
      for (const sel of [brandGlass,toolsGlass]) await expect(page.locator(sel)).toHaveCSS('background-color', y ? await glassColor(page) : clear)
    }
    for (const path of ['/','/prompts/','/skills/']) {
      if(path !== '/') await page.locator(`.module-nav a[href="${path}"]`).click()
      const active = page.locator('.module-nav [aria-current=page]')
      await expect(active).toHaveAttribute('href',path)
      await expect.poll(async () => {
        const a = await active.boundingBox(), b = await page.locator('.module-slider').boundingBox()
        return b ? Math.max(Math.abs(a.x-b.x),Math.abs(a.x+a.width-b.x-b.width)) : Infinity
      }).toBeLessThanOrEqual(1)
    }
    await page.goto('/submit'); await expect(page.locator('.module-slider')).toHaveCount(0)
  })
  test('桌面截图', async ({page}, info) => {
    await page.goto('/'); await expect(page.locator('.module-slider')).toBeVisible()
    await shot(page,info,'home-1280-top-light'); await scroll(page,400); await shot(page,info,'home-1280-scrolled-light')
    await page.emulateMedia({colorScheme:'dark'}); await page.goto('/prompts/'); await expect(page.locator('html')).toHaveClass(/dark/)
    await shot(page,info,'prompts-1280-top-dark'); await page.goto('/skills/')
    await expect(page.locator('.module-slider')).toBeVisible()
    await scroll(page,400); await shot(page,info,'skills-1280-scrolled-dark')
  })
})
for (const width of [320,360,390]) test.describe(`${width}px 三岛`, () => {
  test.use({ viewport:{width,height:844}, hasTouch:true, colorScheme:'light' })
  test('窄屏几何和菜单', async ({page}, info) => {
    await page.goto('/'); await expect(page.locator('.module-slider')).toBeVisible(); await ordered(page)
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
    if(width !== 360) await shot(page,info,`home-${width}-top-light`)
    if(width === 390) {
      await page.locator('.VPNavBarHamburger').tap()
      await expect(page.locator('.VPNavScreen').getByText('我要投稿')).toBeVisible()
      await expect(page.locator('.VPNavScreen')).not.toHaveClass(/fade-enter/)
      await shot(page,info,'menu-390-open')
      await page.keyboard.press('Escape'); await expect(page.locator('.VPNavScreen')).toBeHidden()
      await page.goto('/prompts/'); await expect(page.locator('.module-slider')).toBeVisible()
      await scroll(page,400); await shot(page,info,'prompts-390-scrolled-light')
    }
  })
})
