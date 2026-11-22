// 搜索面板里的 Prompt、Skills（决策 71）。
// 交互用例在 4192 的样例站上跑：样例 Bot + tests/fixtures 的 Prompt、Skill（复制到临时目录，好测热更新）；
// 「不进首屏」用默认的构建预览站（真实收录库）。
import { test, expect } from '@playwright/test'
import { cp, mkdtemp, rm, writeFile } from 'node:fs/promises'
import { join, resolve } from 'node:path'
import { tmpdir } from 'node:os'
import { withLibraryServer } from './library-edges.mjs'
import { db } from './library-data.mjs'
import { libraryMarks, allMark } from '../../site/.vitepress/theme/library-marks.ts'

const palette = (page) => page.getByTestId('search-palette')
const input = (page) => page.getByTestId('search-input')
const prompts = (page) => page.getByTestId('search-prompt')
const skills = (page) => page.getByTestId('search-skill')
const selected = (page) => page.locator('[data-testid="search-panel"] [aria-selected="true"]')
const isLibraryData = (url) => new URL(url).pathname.includes('library-search.data')

async function openPalette(page, url) {
  await page.goto(url)
  await page.waitForFunction(() => document.querySelector('#app')?.__vue_app__)
  await page.getByTestId('search-trigger').click()
  await expect(input(page)).toBeFocused()
}

/** 样例站：把 tests/fixtures 的 prompts、skills 复制到临时目录，dev server 只读那里。 */
async function withFixtureLibrary(use) {
  const root = await mkdtemp(join(tmpdir(), 'search-library-'))
  try {
    for (const dir of ['prompts', 'skills']) await cp(resolve('tests/fixtures', dir), join(root, dir), { recursive: true })
    await withLibraryServer(root, (base) => use(base, root))
  } finally {
    await rm(root, { recursive: true, force: true })
  }
}

test.describe('样例站', () => {
  test.setTimeout(120_000)

  test('分组、上下键、回车、空查询、数据晚到、390 手机、热更新', async ({ page }) => {
    await withFixtureLibrary(async (base, root) => {
      await test.step('预热：dev server 第一次编译时 Vite 可能预构建依赖并整页刷新，先把首页和面板数据走一遍', async () => {
        await page.goto(base + '/')
        await page.waitForLoadState('networkidle')
        await page.evaluate(() => window.dispatchEvent(new CustomEvent('bz-search-open')))
        await page.waitForLoadState('networkidle')
        await page.waitForTimeout(500)
      })

      await test.step('输入 Prompt 里的词出现 Prompt 组；空查询没有 Prompt、Skills', async () => {
        await openPalette(page, base + '/')
        await expect(palette(page)).toHaveAttribute('aria-label', '搜索 Bot、Prompt 和 Skills')
        await input(page).fill('会议议程')
        await expect(prompts(page)).toHaveCount(1)
        await expect(prompts(page)).toHaveAttribute('data-slug', 'demo-meeting-agenda')
        await expect(prompts(page).locator('[data-part="name"]')).toHaveText('示例·会议议程')
        await expect(prompts(page).locator('[data-part="tagline"]')).toHaveText('把散乱的会议话题整理成有时间安排的议程')
        await expect(prompts(page).locator('.sp-tag')).toHaveText('效率')
        await expect(prompts(page).locator('.bz-tile svg')).toHaveCount(1)
        await expect(page.locator('.sp-group[data-group="prompt"] > .sp-heading')).toHaveText('Prompt')
        await expect(page.locator('.sp-sr')).toHaveText('找到 1 条 Prompt')
        // 数据已经到了，清空后两组照样不出现。
        await input(page).fill('')
        await expect(page.getByTestId('search-item')).toHaveCount(3)
        await expect(prompts(page)).toHaveCount(0)
        await expect(skills(page)).toHaveCount(0)
        await expect(page.locator('.sp-group[data-group="prompt"], .sp-group[data-group="skill"]')).toHaveCount(0)
        await expect(page.locator('.sp-group .sp-heading')).toHaveText(['全部 Bot', '小队'])
        await expect(page.locator('.sp-sr')).toHaveText('共 3 个 Bot，1 支小队')
      })

      await test.step('分组顺序 Bot → 小队 → Prompt（≤4）→ Skills；上下键走完全部，回车进 Skill 详情', async () => {
        await input(page).fill('示例')
        await expect(skills(page)).toHaveCount(3)
        await expect(page.getByTestId('search-item')).toHaveCount(3)
        await expect(page.getByTestId('search-squad')).toHaveCount(1)
        await expect(prompts(page)).toHaveCount(4)
        await expect(page.locator('.sp-sr')).toHaveText('找到 3 个 Bot，1 支小队，5 条 Prompt（列出前 4 条），3 个 Skill')
        const order = await page.locator('[data-testid="search-panel"] [role="option"]').evaluateAll((nodes) => nodes.map((node) => node.dataset.testid))
        expect(order).toEqual([
          ...Array(3).fill('search-item'), 'search-squad', ...Array(4).fill('search-prompt'), ...Array(3).fill('search-skill'),
        ])
        await expect(page.locator('.sp-group .sp-heading')).toHaveText(['Bot', '小队', 'Prompt', 'Skills'])
        expect(await page.locator('.sp-group').evaluateAll((groups) => groups.map((g) => `${g.getAttribute('role')}:${g.getAttribute('aria-label')}`)))
          .toEqual(['group:Bot', 'group:小队', 'group:Prompt', 'group:Skills'])

        await expect(page.getByTestId('search-item').first()).toHaveAttribute('aria-selected', 'true')
        for (let i = 0; i < 4; i++) await page.keyboard.press('ArrowDown')
        await expect(prompts(page).first()).toHaveAttribute('aria-selected', 'true')
        await expect(input(page)).toHaveAttribute('aria-activedescendant', 'bz-search-prompt-demo-code-review-checklist')
        await expect(prompts(page).first().locator('.sp-enter')).toBeVisible()
        for (let i = 0; i < 4; i++) await page.keyboard.press('ArrowDown')
        await expect(skills(page).first()).toHaveAttribute('aria-selected', 'true')
        await expect(selected(page)).toHaveCount(1)
        // 从最后一条往下绕回第一个 Bot，再往上绕回最后一个 Skill。
        await page.keyboard.press('ArrowDown')
        await page.keyboard.press('ArrowDown')
        await page.keyboard.press('ArrowDown')
        await expect(page.getByTestId('search-item').first()).toHaveAttribute('aria-selected', 'true')
        await page.keyboard.press('ArrowUp')
        await expect(skills(page).last()).toHaveAttribute('aria-selected', 'true')
        await expect(skills(page).last()).toBeInViewport()

        await page.keyboard.press('ArrowUp')
        await page.keyboard.press('ArrowUp')
        await expect(skills(page).first()).toHaveAttribute('data-slug', 'demo-frontend-design')
        await expect(skills(page).first()).toHaveAttribute('aria-selected', 'true')
        await page.keyboard.press('Enter')
        await expect(page).toHaveURL(new RegExp('/skills/demo-frontend-design$'))
        await expect(palette(page)).toHaveCount(0)
        await expect(page.locator('.ix-title h1')).toHaveText('示例·前端界面设计')
      })

      await test.step('列表滚动时顶上是当前那组的组名，键盘选中的条目不被组名挡住', async () => {
        await page.setViewportSize({ width: 1280, height: 560 })
        await openPalette(page, base + '/')
        await input(page).fill('示例')
        await expect(skills(page)).toHaveCount(3)
        const look = () => page.evaluate(() => {
          const scroller = document.querySelector('.sp-scroll').getBoundingClientRect()
          const at = (y) => document.elementFromPoint(scroller.left + 40, y)
          const head = at(scroller.top + 16)?.closest('.sp-heading')
          const row = document.querySelector('[data-testid="search-panel"] [aria-selected="true"]').getBoundingClientRect()
          const stuck = head?.getBoundingClientRect()
          // 组名那一条的各处（头像列、名字列、标签列，上中下几个高度）都要点到组名本身，不能是滚到它底下的条目。
          const columns = [scroller.left + 40, ...['[data-part="name"]', '.sp-tag'].map((part) => document.querySelector(`[data-testid="search-panel"] ${part}`).getBoundingClientRect().left + 8)]
          const leaks = columns.flatMap((x) => [6, 14, 22, 30].map((dy) => document.elementFromPoint(x, scroller.top + dy)))
            .filter((el) => !el?.closest('.sp-heading')).map((el) => el?.className?.baseVal ?? el?.className)
          return {
            scrolled: document.querySelector('.sp-scroll').scrollTop > 0,
            leaks,
            head: head?.textContent.trim(),
            // 组名正下方那一行属于哪一组
            group: at(scroller.top + 40)?.closest('.sp-group')?.getAttribute('aria-label'),
            covered: Boolean(stuck) && row.top < stuck.bottom - 0.5,
            clipped: row.bottom > scroller.bottom + 0.5,
          }
        })
        const total = await page.locator('[data-testid="search-panel"] [role="option"]').count()
        let scrolledOnce = false
        for (let i = 0; i < total; i++) {
          if (i) await page.keyboard.press('ArrowDown')
          const state = await look()
          scrolledOnce ||= state.scrolled
          expect(state.head, `第 ${i + 1} 条`).toBe(state.group)
          expect(state.leaks, `第 ${i + 1} 条：组名上露出了条目`).toEqual([])
          expect(state.covered, `第 ${i + 1} 条被组名挡住`).toBe(false)
          expect(state.clipped, `第 ${i + 1} 条被切掉`).toBe(false)
        }
        expect(scrolledOnce).toBe(true)
        // 再一路往上翻回第一条：组名跟着换回来。
        for (let i = total - 1; i > 0; i--) {
          await page.keyboard.press('ArrowUp')
          const state = await look()
          expect(state.head, `往上第 ${i} 条`).toBe(state.group)
          expect(state.leaks, `往上第 ${i} 条：组名上露出了条目`).toEqual([])
          expect(state.covered, `往上第 ${i} 条被组名挡住`).toBe(false)
        }
        await expect(page.getByTestId('search-item').first()).toHaveAttribute('aria-selected', 'true')
        await page.setViewportSize({ width: 1280, height: 720 })
        await page.keyboard.press('Escape')
      })

      await test.step('回车、点击都进 Prompt 详情', async () => {
        await page.keyboard.press('ControlOrMeta+k')
        await expect(input(page)).toBeFocused()
        await input(page).fill('会议议程')
        await expect(prompts(page)).toHaveAttribute('aria-selected', 'true')
        await page.keyboard.press('Enter')
        await expect(page).toHaveURL(new RegExp('/prompts/demo-meeting-agenda$'))
        await expect(page.locator('.ix-title h1')).toHaveText('示例·会议议程')
        await page.keyboard.press('ControlOrMeta+k')
        await input(page).fill('追问式家教')
        await expect(prompts(page)).toHaveCount(1)
        await prompts(page).click()
        await expect(page).toHaveURL(new RegExp('/prompts/demo-socratic-tutor$'))
      })

      await test.step('数据还没到：不出「没找到」，选中项不跳；到了补在最后', async () => {
        let release
        const held = new Promise((done) => { release = done })
        const page2 = await page.context().newPage()
        await page2.route((url) => isLibraryData(url.href), async (route) => { await held; await route.continue() })
        await openPalette(page2, base + '/')
        // 只有 Prompt 能命中的词：没数据时既不列结果，也不下「没找到」的结论。
        await input(page2).fill('会议议程')
        await page2.waitForTimeout(400)
        await expect(page2.getByTestId('search-empty')).toHaveCount(0)
        await expect(prompts(page2)).toHaveCount(0)
        // Bot 和小队照常能选；选中小队后数据到了，选中的还是小队。
        await input(page2).fill('示例')
        await expect(page2.getByTestId('search-squad')).toHaveCount(1)
        for (let i = 0; i < 3; i++) await page2.keyboard.press('ArrowDown')
        await expect(page2.getByTestId('search-squad')).toHaveAttribute('aria-selected', 'true')
        const before = await page2.getByTestId('search-squad').boundingBox()
        release()
        await expect(skills(page2)).toHaveCount(3)
        await expect(page2.getByTestId('search-squad')).toHaveAttribute('aria-selected', 'true')
        await expect(selected(page2)).toHaveCount(1)
        expect((await page2.getByTestId('search-squad').boundingBox()).y).toBe(before.y)
        await page2.close()
      })

      await test.step('390 手机：不横向溢出，条目不超出面板', async () => {
        await page.setViewportSize({ width: 390, height: 844 })
        await openPalette(page, base + '/')
        await input(page).fill('示例')
        await expect(skills(page)).toHaveCount(3)
        const facts = await page.evaluate(() => {
          const panel = document.querySelector('[data-testid="search-panel"]').getBoundingClientRect()
          const rows = [...document.querySelectorAll('[data-testid="search-panel"] [role="option"]')]
          return {
            page: document.documentElement.scrollWidth - window.innerWidth,
            spill: rows.filter((row) => row.scrollWidth > row.clientWidth + 1 || row.getBoundingClientRect().right > panel.right + 0.5).length,
            parts: rows.flatMap((row) => [...row.children].filter((child) => child.getBoundingClientRect().right > row.getBoundingClientRect().right + 0.5)).length,
            // 面板打开时有 160ms 的缩放，这里只看它没出视口（两侧各留 16px）。
            inside: panel.left >= 15.5 && panel.right <= window.innerWidth - 15.5,
          }
        })
        expect(facts).toEqual({ page: 0, spill: 0, parts: 0, inside: true })
        // 超长标题、超长原名的条目也是一行省略号。
        await input(page).fill('做事方法')
        const name = skills(page).locator('[data-part="name"]')
        await expect(name).toHaveCSS('text-overflow', 'ellipsis')
        expect(await name.evaluate((el) => el.scrollWidth > el.clientWidth)).toBe(true)
        await page.setViewportSize({ width: 1280, height: 720 })
      })

      await test.step('开发时热更新：新加一条 Prompt，重新打开面板就能搜到', async () => {
        const slug = 'demo-hot-reload'
        await writeFile(join(root, 'prompts', `${slug}.yaml`), [
          `slug: ${slug}`, 'title: 示例·热更新探针', 'category: 效率', 'purpose: 只在测试里出现', 'scenarios: [测试]',
          'source: { name: 示例, url: "https://example.com/hot" }', 'author: { name: 示例作者 }', 'license: 未声明', 'addedAt: 2026-11-15', '',
        ].join('\n'))
        await expect(async () => {
          await openPalette(page, base + '/')
          await input(page).fill('热更新探针')
          await expect(prompts(page)).toHaveAttribute('data-slug', slug, { timeout: 2000 })
        }).toPass({ timeout: 20_000 })
      })
    })
  })
})

test('真实收录库：数据第一次打开面板时才加载，不进首屏；再开不重复加载', async ({ page }) => {
  await page.route('**/api/stats', (route) => route.fulfill({ json: { ok: true, heat: {}, byKind: {}, squads: {} } }))
  const loads = []
  page.on('request', (request) => { if (isLibraryData(request.url())) loads.push(request.url()) })
  const html = await (await page.request.get('/')).text()
  expect(html).not.toContain('library-search')
  await page.goto('/')
  await page.waitForFunction(() => document.querySelector('#app')?.__vue_app__)
  await page.waitForLoadState('networkidle')
  expect(loads).toEqual([])

  const prompt = db.prompts[0]
  const skill = db.skills[0]
  await page.getByTestId('search-trigger').click()
  await expect.poll(() => loads.length).toBe(1)
  await input(page).fill(prompt.title)
  await expect(page.locator(`[data-testid="search-prompt"][data-slug="${prompt.slug}"]`)).toBeVisible()
  await input(page).fill(skill.title)
  await expect(page.locator(`[data-testid="search-skill"][data-slug="${skill.slug}"]`)).toBeVisible()
  await page.keyboard.press('Escape')
  await page.keyboard.press('ControlOrMeta+k')
  await input(page).fill(prompt.title)
  await expect(page.locator(`[data-testid="search-prompt"][data-slug="${prompt.slug}"]`)).toBeVisible()
  expect(loads).toHaveLength(1)
})

test.describe('构建站：数据块拿不到时的退路', () => {
  const prompt = db.prompts[0]
  const skill = db.skills[0]
  const index = {
    items: [
      { kind: 'bot', slug: 'probe-bot', title: '退路探针 Bot', detailUrl: 'https://bot.jiachengbo.com/bots/probe-bot' },
      { kind: 'prompt', slug: prompt.slug, title: '退路探针提示词', titleOriginal: 'Fallback Probe', category: '写作', purpose: '只在测试里出现', scenarios: ['测试'], tags: ['探针'], author: '测试作者', detailUrl: `https://bot.jiachengbo.com/prompts/${prompt.slug}` },
      { kind: 'skill', slug: skill.slug, title: '退路探针技能', name: 'probe-skill', agents: ['Claude Code'], category: '工具', purpose: '只在测试里出现', scenarios: [], tags: [], author: '测试作者', detailUrl: `https://bot.jiachengbo.com/skills/${skill.slug}` },
    ],
  }
  test.beforeEach(async ({ page }) => {
    await page.route('**/api/stats', (route) => route.fulfill({ json: { ok: true, heat: {}, byKind: {}, squads: {} } }))
    // 部署后旧标签页：带 hash 的数据块 404。
    await page.route((url) => isLibraryData(url.href), (route) => route.fulfill({ status: 404, body: 'gone' }))
  })

  test('退回 /data/index.json：只取 Prompt、Skill，绝对地址转成站内路径，回车进详情', async ({ page }) => {
    let hits = 0
    await page.route('**/data/index.json', (route) => { hits++; return route.fulfill({ json: index }) })
    await openPalette(page, '/')
    await input(page).fill('退路探针')
    await expect(prompts(page)).toHaveCount(1)
    await expect(skills(page)).toHaveCount(1)
    await expect(page.getByTestId('search-item')).toHaveCount(0)
    await expect(prompts(page)).toHaveAttribute('data-slug', prompt.slug)
    await expect(prompts(page).locator('.sp-tag')).toHaveText('写作')
    await expect(page.locator('.sp-sr')).toHaveText('找到 1 条 Prompt，1 个 Skill')
    // 原名只按词头命中：probe-skill 的 probe 能搜到
    await input(page).fill('probe')
    await expect(skills(page)).toHaveAttribute('data-slug', skill.slug)
    await input(page).fill('退路探针提示词')
    await page.keyboard.press('Enter')
    await expect(page).toHaveURL(new RegExp(`^${new URL(page.url()).origin}/prompts/${prompt.slug}$`))
    expect(hits).toBe(1)
  })

  test('两样都失败后重开面板：重试期间不出「没找到」，到了再补上', async ({ page }) => {
    let calls = 0
    let release
    const held = new Promise((done) => { release = done })
    await page.route('**/data/index.json', async (route) => {
      calls++
      if (calls === 1) return route.fulfill({ status: 500, body: 'down' })
      await held
      return route.fulfill({ json: index })
    })
    await openPalette(page, '/')
    await input(page).fill('退路探针')
    // 第一次：数据块 404、清单 500，真的失败了，照旧显示「没找到」。
    await expect(page.getByTestId('search-empty')).toBeVisible()
    await page.keyboard.press('Escape')
    await page.keyboard.press('ControlOrMeta+k')
    await expect(input(page)).toBeFocused()
    await input(page).fill('退路探针')
    await expect.poll(() => calls).toBe(2)
    await page.waitForTimeout(400)
    await expect(page.getByTestId('search-empty')).toHaveCount(0)
    await expect(page.locator('.sp-sr')).toHaveText('')
    release()
    await expect(prompts(page)).toHaveCount(1)
    await expect(page.getByTestId('search-empty')).toHaveCount(0)
  })
})

// WCAG 对比度：把标签的字色、标签底、行底、面板底逐层叠起来算。
const CASES = [
  ...Object.entries(libraryMarks.prompt).map(([category, mark]) => ['Prompt', category, mark.color]),
  ...Object.entries(libraryMarks.skill).map(([category, mark]) => ['Skill', category, mark.color]),
  ['未配色', '（灰色兜底）', allMark.color],
]
for (const scheme of ['light', 'dark']) {
  test(`${scheme === 'light' ? '浅' : '深'}色：每个分类的标签在选中、不选中时对比度都 ≥ 4.5`, async ({ page }) => {
    await page.emulateMedia({ colorScheme: scheme, reducedMotion: 'reduce' })
    await page.route('**/api/stats', (route) => route.fulfill({ json: { ok: true, heat: {}, byKind: {}, squads: {} } }))
    await openPalette(page, '/')
    await input(page).fill(db.prompts[0].title)
    const item = page.locator(`[data-testid="search-prompt"][data-slug="${db.prompts[0].slug}"]`)
    await expect(item).toBeVisible()
    const rows = await item.evaluate((el, cases) => {
      const parse = (value) => {
        const srgb = value.match(/color\(srgb ([\d.e-]+) ([\d.e-]+) ([\d.e-]+)(?: \/ ([\d.e-]+))?\)/)
        if (srgb) return { rgb: srgb.slice(1, 4).map(Number), a: srgb[4] === undefined ? 1 : Number(srgb[4]) }
        const rgb = value.match(/rgba?\(([\d.]+), ([\d.]+), ([\d.]+)(?:, ([\d.]+))?\)/)
        if (rgb) return { rgb: rgb.slice(1, 4).map((n) => Number(n) / 255), a: rgb[4] === undefined ? 1 : Number(rgb[4]) }
        throw new Error(`读不懂的颜色：${value}`)
      }
      const over = (top, bottom) => ({ rgb: top.rgb.map((c, i) => c * top.a + bottom.rgb[i] * (1 - top.a)), a: 1 })
      const lum = ({ rgb }) => rgb.map((c) => c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4).reduce((sum, c, i) => sum + c * [0.2126, 0.7152, 0.0722][i], 0)
      const ratio = (a, b) => { const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x); return (hi + 0.05) / (lo + 0.05) }
      const panel = parse(getComputedStyle(el.closest('[data-testid="search-panel"]')).backgroundColor)
      const tag = el.querySelector('.sp-tag')
      const before = el.getAttribute('aria-selected')
      const out = []
      for (const [kind, category, color] of cases) {
        el.style.setProperty('--sp-tint-light', color)
        el.style.setProperty('--sp-tint-dark', color)
        for (const selected of ['false', 'true']) {
          el.setAttribute('aria-selected', selected)
          const row = over(parse(getComputedStyle(el).backgroundColor), panel)
          const back = over(parse(getComputedStyle(tag).backgroundColor), row)
          const text = over(parse(getComputedStyle(tag).color), back)
          out.push({ kind, category, color, selected: selected === 'true', ratio: Math.round(ratio(text, back) * 100) / 100 })
        }
      }
      el.setAttribute('aria-selected', before)
      return out
    }, CASES)
    console.log(`[对比度 ${scheme}] ` + rows.map((r) => `${r.kind}/${r.category} ${r.selected ? '选中' : '未选'} ${r.ratio}`).join('；'))
    for (const row of rows) expect(row.ratio, `${row.kind}/${row.category}（${row.color}）${row.selected ? '选中' : '未选中'}`).toBeGreaterThanOrEqual(4.5)
  })
}
