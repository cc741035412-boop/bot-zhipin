import { test, expect } from '@playwright/test'
import { mkdir } from 'node:fs/promises'
import { join } from 'node:path'
import { db, fixturePrompts, categories, matching, body, summary, skill, pathFor } from './library-data.mjs'
import { exerciseEdges, withLibraryServer } from './library-edges.mjs'

const fixtureTest = test.extend({
  fixtureURL: async ({}, use) => withLibraryServer('tests/fixtures', use),
})

const search = (p) => p.locator('#library-search')
const catButton = (p, c) => p.locator(`[data-cat="${c}"]`)
const card = (p, i) => p.locator(`.entry[data-slug="${i.slug}"]`)
const counts = (p) => p.locator('.ix-heading [role=status]')
async function rows(p, items) {
  await expect(counts(p)).toHaveText(`共 ${items.length} 条`)
  expect(await p.locator('.entry:visible').evaluateAll((es) => es.map((e) => e.dataset.slug))).toEqual(
    items.map((i) => i.slug),
  )
}
const normText = (p, sel) => p.locator(sel).evaluateAll((es) => es.map((e) => e.textContent))
async function external(link, url) {
  await expect(link).toHaveAttribute('href', url)
  await expect(link).toHaveAttribute('target', '_blank')
  await expect(link).toHaveAttribute('rel', 'noopener noreferrer')
  await expect(link.locator('[data-icon="arrow-up-right"]')).toHaveCount(1)
}
async function copy(p, button, key, value) {
  await button.focus()
  await button.press(key)
  await expect(button).toHaveText('已复制')
  expect(await p.evaluate(() => navigator.clipboard.readText())).toBe(value)
  await expect(button).toBeFocused()
}
async function fulltextShot(p, info, name) {
  const dir = process.env.FT_SHOTS_DIR || info.outputPath('shots')
  await mkdir(dir, { recursive: true })
  await p.screenshot({ path: join(dir, `${name}.png`), fullPage: true, animations: 'disabled' })
}
const noOverflow = async (p) =>
  expect(await p.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
const box = (p, sel) => p.locator(sel).first().boundingBox()
const close = (x, y) => expect(Math.abs(x - y)).toBeLessThanOrEqual(1)
for (const width of [1280, 390])
  test.describe(`${width}px`, () => {
    const mobile = width === 390,
      height = mobile ? 844 : 900
    test.use({
      viewport: { width, height },
      hasTouch: mobile,
      deviceScaleFactor: 1,
      colorScheme: 'dark',
      permissions: ['clipboard-read', 'clipboard-write'],
    })
    test('NAV-01 模块链接、当前路由与裸列表', async ({ page: p }) => {
      for (const [path, active] of [
        ['/prompts/', 'Prompt'],
        [pathFor(body), 'Prompt'],
        ['/skills/', 'Skills'],
        [pathFor(skill), 'Skills'],
        ['/submit', null],
      ]) {
        await p.goto(path)
        expect(
          await p
            .locator('.module-nav a')
            .evaluateAll((es) => es.map((e) => [e.textContent, e.getAttribute('href')])),
        ).toEqual([
          ['Bot', '/'],
          ['Prompt', '/prompts/'],
          ['Skills', '/skills/'],
        ])
        await expect(p.locator('.module-nav [aria-current=page]')).toHaveText(active ? [active] : [])
      }
      await p.locator('.module-nav a').first().click()
      await expect(p).toHaveURL(/\/$/)
      await expect(p.locator('.module-nav [aria-current]')).toHaveText('Bot')
    })
    test('NAV-02 窄屏菜单、关闭与还焦', async ({ page: p }) => {
      await p.goto('/prompts/')
      const hamburger = p.locator('.VPNavBarHamburger')
      const bar = await box(p, '.VPNavBar')
      for (const link of await p.locator('.module-nav a').all()) {
        const b = await link.boundingBox()
        expect(b.x).toBeGreaterThanOrEqual(bar.x)
        expect(b.x + b.width).toBeLessThanOrEqual(bar.x + bar.width)
      }
      if (!mobile) {
        await expect(hamburger).toBeHidden()
        await expect(p.locator('.VPNavBar .VPSwitch:visible')).toBeVisible()
      } else {
        await expect(hamburger).toHaveAttribute('aria-expanded', 'false')
        await hamburger.click()
        await hamburger.press('Tab')
        await p.keyboard.press('Tab')
        await expect(p.locator('.VPNavScreen .VPSwitch')).toBeFocused()
        await p.keyboard.press('/')
        await expect(search(p)).not.toBeFocused()
        await expect(p.getByRole('dialog')).toHaveCount(0)
        await p.keyboard.press('Escape')
        await expect(hamburger).toBeFocused()
        await expect(p.locator('.VPNavScreen')).toHaveCount(0)
        await hamburger.click()
        await p.mouse.click(8, 350)
        await expect(hamburger).toHaveAttribute('aria-expanded', 'false')
        await hamburger.click()
        await p.setViewportSize({ width: 900, height })
        await expect(hamburger).toHaveAttribute('aria-expanded', 'false')
      }
      await p.setViewportSize({ width: 320, height })
      await noOverflow(p)
      await expect(p.locator('.VPNavBarTitle a')).toHaveAccessibleName('Bot 直聘')
      await expect(p.locator('.module-nav a').last()).toBeInViewport()
    })
    test('LIST-01 真实字段、全量顺序、详情入口和 Enter', async ({ page: p }) => {
      for (const [dir, title] of [
        ['prompts', 'Prompt'],
        ['skills', 'Skills'],
      ]) {
        await p.goto(`/${dir}/`)
        await expect(p.getByRole('heading', { level: 1 })).toHaveText(title)
        await rows(p, db[dir])
        if (dir === 'prompts') await expect(counts(p)).toHaveText('共 70 条')
        const all = await p
          .locator('.entry')
          .evaluateAll((es) =>
            es.map((e) =>
              [
                '.entry-link', 'h2 code', '.bz-sr-only', 'p', '.ix-row-by',
              ].map((s) => e.querySelector(s)?.textContent || ''),
            ),
          )
        expect(all).toEqual(
          db[dir].map((i) => [
            i.title,
            i.name || '', i.category, i.purpose,
            i.author.name,
          ]),
        )
        const i = db[dir].find((i) => i.body || i.name),
          c = card(p, i)
        await expect(c.locator('p')).toHaveCSS('-webkit-line-clamp', 'none')
        if (i.name) await expect(c.locator('h2 code')).toHaveCSS('text-overflow', 'ellipsis')
        await c.click({ position: { x: 7, y: 7 } })
        if (dir === 'prompts') {
          await expect(p).toHaveURL(/\/prompts\/$/)
          await c.locator('.entry-link').click()
        }
        await expect(p).toHaveURL(new RegExp(pathFor(i) + '$'))
        await p.goBack()
        await c.locator('a').first().press('Enter')
        await expect(p.getByRole('heading', { level: 1 })).toHaveText(i.title)
      }
    })
    test('LIST-02 分类顺序、查询后零项仍可选', async ({ page: p }) => {
      for (const dir of Object.keys(db)) {
        await p.goto(`/${dir}/`)
        // 静态列表在 Vue 挂载前也能填值，此时 input 事件不会更新分类计数。
        await p.waitForFunction(() => !!document.querySelector('#app').__vue_app__)
        const cats = ['', ...categories(dir)]
        expect(await p.locator('[data-cat]').evaluateAll((es) => es.map((e) => e.dataset.cat))).toEqual(cats)
        const i = db[dir][0]
        await search(p).fill(i.title)
        const other = cats.find((c) => c && !matching(dir, i.title, c).length)
        await catButton(p, other).click()
        await expect(p.locator('[data-cat][aria-pressed=true]')).toHaveCount(1)
        for (const c of cats)
          await expect(catButton(p, c)).toHaveText(`${c || '全部'}${matching(dir, i.title, c).length}`)
        await rows(p, [])
      }
    })
    test('LIST-03 跨字段、NFKC、场景、正文与命令的搜索边界及 IME', async ({ page: p }) => {
      for (const dir of Object.keys(db)) {
        await p.goto(`/${dir}/`)
        const i = db[dir][0],
          input = search(p)
        const longQuery = (dir === 'prompts' ? body.body : skill.install[0].command).trim().replace(/\s+/g, ' ')
        for (const q of [
          `${i.category}   ${i.author.name}`,
          i.scenarios[0],
          ...(dir === 'skills' ? ['ｃｏｄｅｘ'] : []),
          longQuery,
        ]) {
          await input.fill(q)
          await rows(p, matching(dir, q))
          if (q === longQuery) {
            if (dir === 'prompts') await expect(card(p, body)).toBeVisible()
            else await rows(p, [])
          }
        }
        await input.fill('')
        await input.dispatchEvent('compositionstart')
        await input.evaluate((e, q) => {
          e.value = q
          e.dispatchEvent(new InputEvent('input', { bubbles: true, isComposing: true }))
        }, i.title)
        await rows(p, db[dir])
        await input.dispatchEvent('compositionend')
        await rows(p, matching(dir, i.title))
      }
    })
    test('LIST-04 多类查询与分类取交集，固定顺序', async ({ page: p }) => {
      for (const dir of Object.keys(db)) {
        await p.goto(`/${dir}/`)
        const q = [...db[dir].map((i) => i.author.name), '的'].find(
          (q) => new Set(matching(dir, q).map((i) => i.category)).size > 1,
        )
        const c = matching(dir, q)[0].category
        await search(p).fill(q)
        await rows(p, matching(dir, q))
        await catButton(p, c).click()
        await rows(p, matching(dir, q, c))
        await expect(search(p)).toHaveValue(q)
        await search(p).fill('')
        await rows(p, matching(dir, '', c))
        await expect(catButton(p, c)).toHaveAttribute('aria-pressed', 'true')
        await expect(catButton(p, '')).toHaveText(`全部${db[dir].length}`)
      }
    })
    test('LIST-05 直达、刷新、历史、返回链接与非法参数', async ({ page: p }) => {
      const i = body,
        params = new URLSearchParams({ q: i.category, cat: i.category })
      await p.goto(`/prompts/?${params}&sort=title`)
      await p.reload()
      await expect(search(p)).toHaveValue(i.category)
      await expect(catButton(p, i.category)).toHaveAttribute('aria-pressed', 'true')
      const len = await p.evaluate(() => history.length)
      await search(p).fill(i.title.slice(0, 1))
      await search(p).fill(i.title)
      expect(await p.evaluate(() => history.length)).toBe(len)
      params.set('q', i.title)
      const suffix = '?' + params
      await expect(p.locator('link[rel=canonical]')).toHaveAttribute('href', /\/prompts\/$/)
      await card(p, i).locator('.entry-link').click()
      await expect(p.locator('.ix-back')).toHaveAttribute('href', '/prompts/' + suffix)
      await p.locator('.ix-back').click()
      await rows(p, matching('prompts', i.title, i.category))
      await p.goBack()
      await expect(p.locator('.ix-back')).toBeVisible()
      await p.goForward()
      await expect(search(p)).toHaveValue(i.title)
      await p.locator('.module-nav a[href="/prompts/"]').click()
      await rows(p, db.prompts)
      await p.goto(pathFor(i))
      await expect(p.locator('.ix-back')).toHaveAttribute('href', '/prompts/')
      await p.goto('/skills/?cat=invalid&sort=unknown')
      await rows(p, db.skills)
      await expect(p).toHaveURL(/\/skills\/$/)
    })
    test('LIST-06 空结果与还焦重置', async ({ page: p }) => {
      await p.goto('/prompts/')
      await catButton(p, body.category).click()
      await search(p).fill('不存在__')
      await rows(p, [])
      await expect(p.locator('.entries')).toBeHidden()
      await expect(p.getByRole('heading', { name: '没有找到' })).toBeVisible()
      await p.getByRole('button', { name: '看看全部' }).click()
      await rows(p, db.prompts)
      await expect(search(p)).toBeFocused()
      await expect(p).toHaveURL(/\/prompts\/$/)
    })
    fixtureTest('媒体分类、缩略图及署名', async ({ page: p, fixtureURL }, info) => {
      const shotDir = process.env.MEDIA_SHOTS_DIR || info.outputPath('shots')
      await mkdir(shotDir, { recursive: true })
      const shot = (name, target = p) => target.screenshot({ path: join(shotDir, `media-${name}.png`), animations: 'disabled' })
      await p.goto(pathFor(body))
      await expect(p.getByRole('heading', { name: '效果图' })).toHaveCount(0)
      await p.emulateMedia({ colorScheme: 'light' })
      await p.goto(fixtureURL + '/prompts/')
      await p.waitForFunction(() => !!document.querySelector('#app').__vue_app__)
      await catButton(p, '视频').click()
      await rows(p, fixturePrompts.filter(i => i.category === '视频'))
      await expect(p.locator('.entry .ix-thumb,.entry .ix-preview')).toHaveCount(0)
      await catButton(p, '出图').click()
      const imagePrompt = fixturePrompts.find(i => i.category === '出图')
      await rows(p, [imagePrompt])
      const thumb = p.locator('.ix-thumb img')
      await expect(thumb).toHaveAttribute('alt', imagePrompt.images[0].alt)
      await expect(thumb).toHaveAttribute('loading', 'lazy')
      await expect(thumb).toHaveAttribute('width', '960')
      await expect(thumb).toHaveAttribute('height', '480')
      await expect.poll(() => thumb.evaluate(img => img.naturalWidth)).toBe(960)
      await noOverflow(p)
      await shot(`list-${width}-light`)
      if (!mobile) {
        await shot('cats-1280-light', p.locator('.ix-cats'))
        await p.emulateMedia({ colorScheme: 'dark' })
        await expect(p.locator('html')).toHaveClass(/dark/)
        await shot('list-1280-dark')
        await p.emulateMedia({ colorScheme: 'light' })
      }
      await thumb.click()
      await expect(p.locator('h1')).toHaveText(imagePrompt.title)
      await expect(p.locator('.ix-sec h2').nth(0)).toHaveText('效果图')
      await expect(p.locator('.ix-sec h2').nth(1)).toHaveText('正文')
      await expect(p.locator('figcaption')).toHaveText(imagePrompt.images.map(i => i.credit))
      await expect(p.locator('.ix-meta div').first()).toHaveText('能用在GPT Image、即梦')
      for (const [n, image] of imagePrompt.images.entries()) {
        const el = p.getByAltText(image.alt)
        await expect(el).toHaveAttribute('width', String([960, 800][n]))
        await expect(el).toHaveAttribute('height', String([480, 400][n]))
        await expect(el).toHaveAttribute('loading', 'lazy')
        await expect(el.locator('..')).toHaveAttribute('target', '_blank')
        await expect(el.locator('..')).toHaveAttribute('href', `/media/prompts/${image.file}`)
      }
      await noOverflow(p)
      if (!mobile) await shot('detail-1280-light')
    })
    fixtureTest('LIST-07 仅摘要标签及独立外链命中', async ({ page: p, fixtureURL }) => {
      for (const dir of Object.keys(db)) {
        await p.goto(`/${dir}/`)
        expect(
          await p.locator('.entry:has(h2 .bz-tag.outline)').evaluateAll((es) => es.map((e) => e.dataset.slug)),
        ).toEqual(db[dir].filter((i) => dir === 'prompts' && !i.body).map((i) => i.slug))
      }
      await p.goto(fixtureURL + '/prompts/')
      const c = card(p, summary),
        link = c.locator('.source-link')
      await expect(c.locator('.ix-snip, .copy')).toHaveCount(0)
      await external(link, summary.source.url)
      await c.locator('.entry-link').focus()
      await p.keyboard.press('Tab')
      await expect(link).toBeFocused()
      await link.scrollIntoViewIfNeeded()
      expect(
        await link.evaluate((e) => {
          const r = e.getBoundingClientRect()
          return e.contains(document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2))
        }),
      ).toBe(true)
    })
    test('GLOW 选分类才显示色光', async ({ page: p }) => {
      await p.emulateMedia({ reducedMotion: 'reduce' })
      await p.goto('/prompts/')
      const glow = () => p.locator('.ix').evaluate(e => getComputedStyle(e, '::before').backgroundImage)
      await expect(p.locator('.ix')).toHaveCSS('--lib-ambient', 'rgba(0, 0, 0, 0)')
      const off = await glow()
      await catButton(p, body.category).click()
      await expect.poll(glow).not.toBe(off)
      expect(await glow()).toContain('radial-gradient')
      await catButton(p, '').click()
      await expect.poll(glow).toBe(off)
    })
    test('RIGHTS 许可证下的版权行与 YAML 一致', async ({ page: p }) => {
      const i = db.prompts.find(i => i.copyright)
      await p.goto(pathFor(i))
      const small = p.locator('dt:text-is("许可证") + dd small')
      await expect(small).toBeVisible()
      expect(await small.textContent()).toBe(i.copyright)
    })
    fixtureTest('双语正文优先显示和复制中文，展开可复制英文', async ({ page: p, fixtureURL }, info) => {
      const i = fixturePrompts.find(i => i.lang === 'en' && i.bodyZh)
      await p.emulateMedia({ colorScheme: 'light', reducedMotion: 'reduce' })
      await p.goto(fixtureURL + pathFor(i))
      const section = p.locator('.ix-sec').filter({ has: p.getByRole('heading', { name: '正文' }) })
      const zh = section.locator('.ix-sheet[lang=zh]'), en = section.locator('.ix-sheet[lang=en]')
      const details = section.locator('details')
      await expect(zh).toBeVisible()
      expect(await zh.textContent()).toBe(i.bodyZh)
      await expect(details).toHaveJSProperty('open', false)
      await expect(en).toBeHidden()
      await fulltextShot(p, info, `bilingual-${width}-closed`)
      await copy(p, p.locator('.ix-actions .primary'), 'Enter', i.bodyZh)
      await copy(p, section.locator('header .copy'), 'Enter', i.bodyZh)
      await details.getByText('英文原文', { exact: true }).click()
      await expect(en).toBeVisible()
      expect(await en.textContent()).toBe(i.body)
      if (!mobile) await fulltextShot(p, info, 'bilingual-1280-open')
      await copy(p, details.locator('.copy'), 'Enter', i.body)
    })
    fixtureTest('保留所有权利的正文仍可复制并显示版权行', async ({ page: p, fixtureURL }, info) => {
      const i = fixturePrompts.find(i => i.license === '保留所有权利' && i.body)
      await p.emulateMedia({ colorScheme: 'light', reducedMotion: 'reduce' })
      await p.goto(fixtureURL + pathFor(i))
      await expect(p.locator('#body')).toBeVisible()
      expect(await p.locator('#body').textContent()).toBe(i.body)
      await expect(p.locator('.ix-meta small')).toHaveText(i.copyright)
      if (!mobile) await fulltextShot(p, info, 'reserved-1280')
      await copy(p, p.locator('.ix-actions .primary'), 'Enter', i.body)
    })
    for (const [slug, field] of [['khazix-socratic-questions', 'body'], ['campaign-brief-sketch', 'bodyZh']]) {
      test(`正式库 ${slug} 首屏正文与一键复制`, async ({ page: p }, info) => {
        const i = db.prompts.find(i => i.slug === slug)
        await p.emulateMedia({ colorScheme: 'light', reducedMotion: 'reduce' })
        await p.goto(pathFor(i))
        await expect(p.locator('#body')).toBeInViewport()
        expect(await p.locator('#body').textContent()).toBe(i[field])
        if (field === 'bodyZh') await expect(p.locator('.ix-original')).toHaveJSProperty('open', false)
        if (!mobile || field === 'body') await fulltextShot(p, info, `${slug}-${width}`)
        await copy(p, p.locator('.ix-actions .primary'), 'Enter', i[field])
      })
    }
    test('正式库 Karpathy 长文保留到最后一字', async ({ page: p }) => {
      const i = db.prompts.find(i => i.slug === 'karpathy-personal-wiki')
      await p.goto(pathFor(i))
      expect(await p.locator('#body').textContent()).toBe(i.bodyZh)
      await p.getByText('英文原文', { exact: true }).click()
      const en = p.locator('#body-en')
      await expect(en).toBeVisible()
      await expect(en).toContainText(i.body.slice(-20))
      expect(await en.textContent()).toBe(i.body)
    })
    test('DETAIL-01 有正文 Prompt 阅读次序、完整原文', async ({ page: p }) => {
      await p.goto(pathFor(body))
      expect(await normText(p, '.ix-body h2')).toEqual(['正文', ...(body.usage ? ['怎么用'] : []), ...(body.summary ? ['摘要'] : []), '适用场景', '来源'])
      await expect(p.locator('.ix-lead')).toHaveText(body.purpose)
      expect(await p.locator('#body').textContent()).toBe(body.body)
      expect(await p.locator('#body').evaluate((e) => e.scrollHeight <= e.clientHeight + 1)).toBe(true)
      await expect(p.locator('.ix-body button')).toHaveCount(1)
      expect(await normText(p, '.ix-body li')).toEqual(body.scenarios)
    })
    fixtureTest('DETAIL-02 仅摘要首末来源、无正文与复制', async ({ page: p, fixtureURL }) => {
      await p.goto(fixtureURL + pathFor(summary))
      await expect(p.locator('.ix-title h1')).toHaveText(summary.title)
      expect(await normText(p, '.ix-body h2')).toEqual(['摘要', '适用场景', ...(summary.usage ? ['怎么用'] : [])])
      await expect(p.locator('.ix-title .outline')).toBeVisible()
      await expect(p.locator('.ix-actions .primary')).toBeInViewport()
      await external(p.locator('.ix-actions .primary'), summary.source.url)
      await expect(p.locator('.is-summary')).toHaveCSS('border-style', 'dashed')
      await external(p.locator('.is-summary a'), summary.source.url)
      await expect(p.locator('.copy,#body')).toHaveCount(0)
    })
    test('DETAIL-03 Skill 安装顺序、说明和可选依赖', async ({ page: p }) => {
      for (const i of new Set([skill, db.skills.find((i) => !i.requires?.length)].filter(Boolean))) {
        await p.goto(pathFor(i))
        expect(await normText(p, '.ix-body h2')).toEqual(['安装', ...(i.requires?.length ? ['运行依赖'] : []), '摘要', '适用场景', '来源'])
        expect(await normText(p, '.ix-term header > span')).toEqual(i.install.map((s) => s.agent))
        expect(await normText(p, '.ix-term code')).toEqual(i.install.map((s) => s.command))
        expect(await normText(p, '.ix-term p')).toEqual(i.install.flatMap((s) => (s.note ? [s.note] : [])))
        await expect(p.locator('.ix-body pre')).toHaveCount(i.install.length)
      }
    })
    fixtureTest('DETAIL-04 属性、可选外链与侧栏布局', async ({ page: p, fixtureURL }) => {
      for (const i of [summary, skill]) {
        await p.goto((i === summary ? fixtureURL : '') + pathFor(i))
        await expect(p.locator('.ix-title h1')).toHaveText(i.title)
        expect(await normText(p, '.lib-page dt')).toEqual([
          ...(i.agents ? ['能用在'] : []), '作者', '许可证', '收录',
        ])
        expect(await normText(p, '.lib-page dd')).toEqual([
          ...(i.agents ? [i.agents.join('、')] : []), i.author.name, i.license + (i.copyright || ''), i.addedAt,
        ])
        for (const [n, url] of [i.author.url, i.licenseUrl].entries()) {
          const a = p.locator('.lib-page dd').nth(n + Number(!!i.agents)).locator('a')
          if (url) await external(a, url)
          else await expect(a).toHaveCount(0)
        }
        const source = p.locator('.ix-body .ix-link')
        if (i.name) await expect(source).toHaveText(i.source.name)
        else await expect(p.locator('.is-summary footer')).toContainText(i.source.name)
        await external(source, i.source.url)
        const meta = await box(p, '.ix-meta'), read = await box(p, '.ix-body')
        if (mobile) expect(meta.y).toBeGreaterThan(read.y + read.height)
        else {
          expect(meta.x + meta.width).toBeLessThan(read.x)
          await expect(p.locator('.ix-mast')).toHaveCSS('position', 'sticky')
        }
      }
    })
    test('COPY-01 键盘复制原字段并保留焦点', async ({ page: p }) => {
      await p.goto(pathFor(body))
      for (const button of await p.locator('.copy').all()) await copy(p, button, 'Enter', body.body)
      await p.goto(pathFor(skill))
      for (const [n, s] of skill.install.entries()) await copy(p, p.locator('.copy').nth(n), 'Space', s.command)
    })
    test('COPY-02 独立计时、成功与拒绝反馈', async ({ page: p }) => {
      await p.goto(pathFor(body))
      await p.clock.install()
      await p.clock.pauseAt(new Date(Date.now() + 2000))
      const b = p.locator('.ix-body .copy')
      await b.press('Enter')
      await expect(b.locator('[role=status]')).toHaveText('已复制')
      await expect(b.locator('svg')).toHaveAttribute('data-icon', 'check')
      await p.clock.runFor(1500)
      await expect(b).toHaveText('已复制')
      await p.evaluate(() => navigator.clipboard.writeText(''))
      await b.press('Space')
      await expect.poll(() => p.evaluate(() => navigator.clipboard.readText())).toBe(body.body)
      await p.clock.runFor(1500)
      await expect(b).toHaveText('已复制')
      await p.clock.runFor(400)
      await expect(b).toHaveText('复制')
      await p.evaluate(() => {
        navigator.clipboard.writeText = () => Promise.reject(new Error('denied'))
      })
      await b.press('Enter')
      await expect(b.locator('[role=status]')).toHaveText('未复制')
      await expect(b.locator('svg')).toHaveAttribute('data-icon', 'x')
      expect(await p.evaluate(() => getSelection().getRangeAt(0).toString())).toBe(body.body)
      await p.clock.runFor(1900)
      await expect(b).toHaveText('复制')
    })
    test('KEY-01 斜线、Esc、Tab 顺序与焦点描边', async ({ page: p }) => {
      await p.goto('/prompts/')
      await catButton(p, summary.category).click()
      await p.keyboard.press('/')
      await expect(search(p)).toBeFocused()
      await search(p).fill('文字')
      await search(p).press('Escape')
      await expect(search(p)).toHaveValue('')
      await expect(search(p)).toBeFocused()
      await expect(catButton(p, summary.category)).toHaveAttribute('aria-pressed', 'true')
      await p.keyboard.press('/')
      await expect(search(p)).toHaveValue('/')
      await search(p).press('Escape')
      for (const b of await p.locator('[data-cat]').all()) {
        await p.keyboard.press('Tab')
        await expect(b).toBeFocused()
        await expect(b).toBeInViewport()
        await expect(b).toHaveCSS('outline-width', '2px')
      }
      await p.keyboard.press('Tab')
      const link = p.locator('.entry-link').first()
      await expect(link).toBeFocused()
      expect(await link.evaluate((e) => getComputedStyle(e, '::after').outlineWidth)).toBe('2px')
      await p.goto(pathFor(body))
      await p.locator('.ix-back').focus()
      await p.keyboard.press('Tab')
      await expect(p.locator('.ix-actions .copy')).toBeFocused()
      await expect(p.locator('.ix-actions .copy')).toHaveCSS('outline-width', '2px')
      await p.keyboard.press('/')
      await expect(p.getByTestId('search-palette')).toBeVisible()
    })
    test('KEY-01+ 首页与库列表快捷键分流，⌘K 全站不变', async ({ page: p }) => {
      for (const path of ['/prompts/', '/skills/', '/']) {
        await p.goto(path)
        await p.waitForFunction(() => document.querySelector('#app').__vue_app__)
        await p.keyboard.press('/')
        const panel = p.getByTestId('search-palette')
        if (path === '/') await expect(panel).toBeVisible()
        else {
          await expect(search(p)).toBeFocused()
          await expect(panel).toBeHidden()
          await p.keyboard.press('Meta+k')
          await expect(panel).toBeVisible()
        }
      }
    })
    test('VIS-01 几何、触摸、超长标题原名命令', async ({ page: p }) => {
      await p.goto('/skills/')
      const bar = await box(p, '.VPNavBar'),
        header = await box(p, '.ix-heading'),
        s = await box(p, '.bz-search'),
        f = await box(p, '.ix-cats'),
        e = await box(p, '.entry')
      close(bar.x, mobile ? 16 : 38)
      close(bar.y, 16)
      close(bar.height, mobile ? 56 : 64)
      close(bar.width, mobile ? 358 : 1204)
      // AB/skills.html，getBoundingClientRect，DPR=1。不断言内容驱动的行高。
      close(header.x, mobile ? 24 : 70)
      close(header.y, mobile ? 128 : 160)
      close(header.width, mobile ? 342 : 280)
      close(s.x, header.x)
      close(s.y, mobile ? 206.1875 : 316.15625)
      close(s.width, header.width)
      close(s.height, 48)
      close(f.x, mobile ? 0 : 62)
      close(f.width, mobile ? 390 : 296)
      close(f.y, mobile ? 270.1875 : 396.15625)
      close(f.height, mobile ? 52 : (1 + categories('skills').length) * 46 - 2)
      if (mobile) await expect(p.locator('.bz-search kbd')).toBeHidden()
      else await expect(p.locator('.bz-search kbd')).toBeVisible()
      close(e.x, mobile ? 12 : 426)
      close(e.y, mobile ? 346.1875 : 170)
      close(e.width, mobile ? 366 : 808)
      const tile = await box(p, '.entry .bz-tile')
      close(tile.x, mobile ? 24 : 450)
      close(tile.width, mobile ? 40 : 48)
      close(tile.y, mobile ? 372.1875 : 202)
      close((await box(p, '.entry h2')).x, mobile ? 80 : 522)
      const next = await p.locator('.entry').nth(1).boundingBox()
      close(next.y, e.y + e.height)
      if (mobile) {
        const b = await box(p, '[data-cat]')
        expect(Math.min(b.width, b.height)).toBeGreaterThanOrEqual(44)
        expect(await p.locator('.ix-cats').evaluate((e) => e.scrollWidth > e.clientWidth)).toBe(true)
      }
      await p
        .locator('.entry')
        .first()
        .evaluate((e) => {
          for (const sel of ['h2 a', 'h2 code']) e.querySelector(sel).textContent = 'W'.repeat(2000)
        })
      await noOverflow(p)
      await p.goto(pathFor(skill))
      for (const sel of ['.ix-title h1', '.ix-orig', '.ix-term code'])
        await p
          .locator(sel)
          .first()
          .evaluate((e) => (e.textContent = 'W'.repeat(2000)))
      await noOverflow(p)
      expect(
        await p
          .locator('.ix-term pre')
          .first()
          .evaluate((e) => e.scrollWidth <= e.clientWidth),
      ).toBe(true)
    })
    fixtureTest('VIS-02 深浅 token 与控件状态、减少动效', async ({ page: p, fixtureURL }) => {
      for (const scheme of ['dark', 'light']) {
        await p.emulateMedia({ colorScheme: scheme })
        await p.goto(fixtureURL + pathFor(summary))
        await expect(p.locator('.ix-actions .primary')).toBeVisible()
        const colors = await p.evaluate(() => {
          const e = document.querySelector('.ix-actions .primary'),
            probe = document.createElement('span')
          document.body.append(probe)
          const color = (t) => {
            probe.style.color = `var(--bz-${t})`
            return getComputedStyle(probe).color
          }
          const values = [color('page'), color('ink'), color('primary-fg')]
          probe.remove()
          return [
            getComputedStyle(document.body).backgroundColor,
            getComputedStyle(document.querySelector('.lib-page')).color,
            getComputedStyle(e).color,
            ...values,
          ]
        })
        expect(colors.slice(0, 3)).toEqual(colors.slice(3))
      }
      const primary = p.locator('.ix-actions .primary'),
        bg = await primary.evaluate((e) => getComputedStyle(e).backgroundColor)
      await primary.hover()
      await expect(primary).not.toHaveCSS('background-color', bg)
      await p.mouse.down()
      await expect(primary).not.toHaveCSS('transform', 'none')
      await p.mouse.move(0, 0)
      await p.mouse.up()
      await p.goto('/skills/')
      await expect(catButton(p, '')).not.toHaveCSS('background-color', 'rgba(0, 0, 0, 0)')
      await p.emulateMedia({ reducedMotion: 'reduce' })
      await expect(catButton(p, '')).toHaveCSS('transition-duration', '0s')
      await p.goto(fixtureURL + pathFor(summary))
      await primary.hover()
      await p.mouse.down()
      await expect(primary).toHaveCSS('transform', 'none')
      await expect(primary).toHaveCSS('transition-duration', '0s')
      await p.mouse.up()
    })
    test('LIST-06 DETAIL-01/02/03/04 COPY-01/02 空库、缺省字段、授权边界与连续两条命令', async ({ page: p }) => {
      await exerciseEdges(p, copy)
    })
    fixtureTest('VIS-03 六页全页截图', async ({ page: p, fixtureURL }, info) => {
      // 默认从数据挑；对照样稿时允许指定它拍摄的同一条记录。
      const pick = (items, slug, fallback) => items.find(i => i.slug === slug) || fallback
      const shotCategory = categories('prompts').find(c => c === process.env.SHOT_CATEGORY) || body.category
      const emptyCategory = categories('prompts').find(c => c === process.env.SHOT_EMPTY_CATEGORY) || body.category
      const dir = process.env.LIBRARY_SHOTS || info.outputPath('shots')
      await mkdir(dir, { recursive: true })
      for (const scheme of mobile ? ['dark'] : ['dark', 'light']) {
        await p.emulateMedia({ colorScheme: scheme, reducedMotion: 'reduce' })
        for (const [name, path] of Object.entries({
          prompts: '/prompts/',
          skills: '/skills/',
          'prompt-detail': pathFor(pick(db.prompts.filter(i => i.body), process.env.SHOT_BODY, body)),
          'prompt-detail-summary-only': fixtureURL + pathFor(pick(fixturePrompts.filter(i => !i.body), process.env.SHOT_SUMMARY, summary)),
          'skill-detail': pathFor(pick(db.skills, process.env.SHOT_SKILL, skill)),
          empty: '/prompts/?' + new URLSearchParams({ cat: emptyCategory, q: '不会有这个词的' }),
          ...(!mobile && scheme === 'dark' ? { 'prompts-cat': '/prompts/?cat=' + encodeURIComponent(shotCategory) } : {}),
        })) {
          await p.goto(path)
          if (name === 'empty') await expect(p.locator('.lib-empty')).toBeVisible()
          else await expect(p.locator('.lib-page h1')).toBeVisible()
          expect(await p.locator('html').evaluate((e) => e.classList.contains('dark'))).toBe(scheme === 'dark')
          await p.screenshot({
            path: join(dir, `${name}-${width}-${scheme}.png`),
            fullPage: name !== 'prompts-cat',
            animations: 'disabled',
          })
        }
      }
    })
  })
