import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest'
import { copyFile, mkdtemp, readdir, readFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { getPlatformProxy, unstable_splitSqlQuery } from 'wrangler'
import { assertReadOnly, buildReport, renderReport } from '../../scripts/lib/report.mjs'
import { beijingToday, parseArgs, runReport, wranglerQuery } from '../../scripts/report.mjs'

const root = fileURLToPath(new URL('../../', import.meta.url))
const today = '2026-11-22'
const days = 3
let directory, proxy, emptyProxy, data
const runner = (db) => (sql) => db.prepare(sql).all().then((r) => r.results)

function seed(db) {
  const statement = db.prepare('INSERT INTO events (at, day, name, page, path, slug, sid, vid, device, country, props) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)')
  const event = (name, page, props = {}, { day = today, sid = 'a', slug = null, path = `/${page}/` } = {}) => {
    const device = { a: 'mobile', b: 'desktop', c: 'unknown' }[sid] ?? 'mobile'
    const country = { a: 'CN', b: 'US', c: null }[sid] ?? null
    return statement.bind(0, day, name, page, path, slug, sid, `visitor-${sid}`, device, country, JSON.stringify(props))
  }
  return db.batch([
    event('page_view', 'home', { landing: true, ref: 'github.com', utm_source: 'newsletter' }),
    event('page_view', 'bot', { landing: true, ref: 'github.com' }, { slug: 'alpha' }),
    event('page_view', 'bot', {}, { slug: 'idle', day: '2026-11-20' }),
    event('page_view', 'bot', {}, { slug: 'idle' }),
    event('page_view', 'author', {}, { slug: 'jakob', day: '2026-11-21' }),
    event('page_view', 'prompts', { landing: true, ref: '', utm_source: 'newsletter' }, { sid: 'b' }),
    event('page_view', 'prompt', {}, { sid: 'b', slug: 'alpha' }),
    event('page_view', 'prompt', { landing: false, ref: 'ignored.example', utm_source: 'ignored' }, { sid: 'b', slug: 'idle' }),
    event('page_view', 'skills', { landing: true }, { sid: 'c' }),
    event('page_view', 'skill', {}, { sid: 'c', slug: 'unused' }),
    event('page_view', '404', {}, { sid: 'd', path: '/missing/' }),
    event('page_view', '404', {}, { sid: 'd', path: '/missing/' }),
    event('page_view', '404', {}, { sid: 'd', path: '/gone/' }),
    event('bot_import', 'bot', { direct: true, trial: 'copied' }, { slug: 'alpha' }),
    event('bot_import', 'home', { direct: true, trial: 'failed' }, { slug: 'alpha' }),
    event('bot_import', 'squad', { direct: false }, { slug: 'alpha' }),
    event('bot_no_app', 'bot', {}, { slug: 'alpha' }),
    event('bot_copy_prompt', 'author', { ok: false }, { slug: 'alpha' }),
    event('bot_copy_prompt', 'bot', { ok: true }, { slug: 'alpha' }),
    event('bot_copy_starter', 'bot', { ok: false }, { slug: 'alpha' }),
    event('squad_copy', 'squad', { ok: true }, { slug: 'crew', sid: 'b' }),
    event('prompt_copy', 'prompts', { ok: true }, { sid: 'b', slug: 'writer' }),
    event('skill_copy', 'skills', { ok: false }, { sid: 'c' }),
    event('search', 'prompts', { q: '周报', results: 0 }),
    event('search', 'home', { q: '周报', results: 2 }),
    event('library_search', 'prompts', { q: '周报', results: 0 }),
    event('library_search', 'prompts', { q: '周报', results: 0 }),
    event('library_search', 'skills', { q: '排版', results: 5 }),
    event('library_search', 'skills', { q: '未找到', results: 0 }),
    event('filter', 'home', { where: 'shelf_role', value: '内容', results: 2 }),
    event('filter', 'home', { where: 'shelf_role', value: '内容', results: 0 }),
    ...['A', 'B', 'C', 'D', 'E'].map((value) => event('filter', 'home', { where: 'shelf_role', value, results: value === 'E' ? 0 : 2 })),
    event('filter', 'skills', { where: 'library_cat', value: '写作', results: 0 }),
    event('submit_step', 'submit', { step: 'view' }),
    event('submit_step', 'submit', { step: 'view' }),
    event('submit_step', 'submit', { step: 'view' }, { sid: 'b' }),
    event('submit_step', 'submit', { step: 'read' }),
    event('submit_step', 'submit', { step: 'submit_fail', code: 'unavailable' }),
    event('submit_step', 'submit', { step: 'submit_fail', code: 'unavailable' }),
    event('submit_step', 'submit', { step: 'submit_fail', code: 'invalid' }, { sid: 'b' }),
    event('submit_step', 'submit', { step: 'bundle_error', code: 'invalid' }),
    event('page_view', 'home', {}, { day: '2026-11-19' }),
    event('page_view', 'bot', {}, { day: '2026-11-19', sid: 'b', slug: 'idle' }),
    event('bot_import', 'bot', {}, { day: '2026-11-19', sid: 'b', slug: 'idle' }),
    event('page_view', 'home', {}, { day: '2026-11-17', sid: 'c' }),
    event('page_view', 'home', {}, { day: '2026-11-17', sid: 'd' }),
    event('page_view', 'home', {}, { day: '2026-11-16', sid: 'e' }),
    event('page_view', 'home', {}, { day: '2026-11-23', sid: 'e' }),
  ])
}

beforeAll(async () => {
  directory = await mkdtemp(join(tmpdir(), 'bot-report-unit-'))
  const configPath = join(directory, 'wrangler.toml')
  await copyFile(join(root, 'wrangler.toml'), configPath)
  const createProxy = () => getPlatformProxy({ configPath, envFiles: [], persist: false, remoteBindings: false })
  proxy = await createProxy()
  emptyProxy = await createProxy()
  const migrationDir = join(root, 'migrations')
  const db = proxy.env.DB
  for (const file of (await readdir(migrationDir)).filter((f) => f.endsWith('.sql')).sort()) {
    const sql = await readFile(join(migrationDir, file), 'utf8')
    await db.batch(unstable_splitSqlQuery(sql).map((statement) => db.prepare(statement)))
  }
  await seed(db)
  data = await buildReport({ runSql: runner(db), today, days })
}, 30_000)

afterAll(async () => {
  await Promise.all([proxy?.dispose(), emptyProxy?.dispose()])
  if (directory) await rm(directory, { recursive: true, force: true })
})

it('概览六项：跨日访客累加、会话去重，环比按未舍入值计算', () => {
  expect(data.overview).toEqual({
    visitors: { current: 6, previous: 4, change: '↑50%' },
    sessions: { current: 4, previous: 4, change: '持平' },
    pageViews: { current: 13, previous: 4, change: '↑225%' },
    takes: { current: 9, previous: 1, change: '↑800%' },
    takeSessions: { current: 3, previous: 1, change: '↑200%' },
    takeRate: { current: 0.75, previous: 0.25, change: '↑200%' },
  })
})

it('区间包含今天和第 N-1 天，第 N 天归上期，两端以外排除', async () => {
  expect(data.periods).toEqual({ current: { start: '2026-11-20', end: today }, previous: { start: '2026-11-17', end: '2026-11-19' } })
  const daily = await Promise.all(['2026-11-20', today].map((date) => buildReport({ runSql: runner(proxy.env.DB), today: date, days: 1 })))
  expect(daily.map((r) => r.overview.pageViews)).toEqual([
    { current: 1, previous: 2, change: '↓50%' }, { current: 11, previous: 1, change: '↑1000%' },
  ])
})

it('来源只看落地浏览；国家和设备按会话去重', () => {
  expect(data.sources).toEqual({
    referrers: [{ label: '直接打开或无来源', count: 2 }, { label: 'github.com', count: 2 }],
    utm: [{ label: 'newsletter', count: 2 }],
    countries: ['国内', '海外', '未知'].map((label) => ({ label, sessions: 1, rate: 1 / 3 })),
    devices: ['mobile', 'desktop', 'unknown'].map((label) => ({ label, sessions: 1, rate: 1 / 3 })),
  })
})

it('三个模块按事件页面归属，作者页归 Bot', () => {
  expect(data.modules).toEqual([
    { module: 'Bot', pageViews: 5, viewSessions: 1, takes: 7, takeSessions: 2, takeRate: 2 },
    { module: 'Prompt', pageViews: 3, viewSessions: 1, takes: 1, takeSessions: 1, takeRate: 1 },
    { module: 'Skills', pageViews: 2, viewSessions: 1, takes: 1, takeSessions: 1, takeRate: 1 },
  ])
})

it('条目按 slug 和事件分组，跳过 NULL slug', () => {
  expect(data.items.topTakes).toEqual([
    { slug: 'alpha', name: 'bot_import', count: 3 }, { slug: 'alpha', name: 'bot_copy_prompt', count: 2 },
    { slug: 'alpha', name: 'bot_copy_starter', count: 1 }, { slug: 'crew', name: 'squad_copy', count: 1 },
    { slug: 'writer', name: 'prompt_copy', count: 1 },
  ])
})

it('看的多没人拿按详情类型和 slug 分组，排除本期跨模块拿走', () => {
  expect(data.items.untaken).toEqual([
    { page: 'bot', slug: 'idle', count: 2 }, { page: 'prompt', slug: 'idle', count: 1 }, { page: 'skill', slug: 'unused', count: 1 },
  ])
})

it('搜索按来源和关键词分组，无结果只统计零结果事件', () => {
  const prompt = { source: 'Prompt 列表', q: '周报', count: 2 }
  expect(data.search).toEqual({
    top: [prompt, { source: '全站面板', q: '周报', count: 2 }, { source: 'Skills 列表', q: '排版', count: 1 }, { source: 'Skills 列表', q: '未找到', count: 1 }],
    empty: [prompt, { source: 'Skills 列表', q: '未找到', count: 1 }, { source: '全站面板', q: '周报', count: 1 }],
  })
})

it('筛选每个位置取前五，无结果榜不受限制', () => {
  const shelf = (value, count = 1) => ({ where: 'shelf_role', value, count })
  const library = { where: 'library_cat', value: '写作', count: 1 }
  expect(data.filters).toEqual({
    top: [library, shelf('内容', 2), ...['A', 'B', 'C', 'D'].map((value) => shelf(value))],
    empty: [library, shelf('E'), shelf('内容')],
  })
})

it('导入：协议唤起、缺字段归 none、疑似没装 App', () => {
  expect(data.importing).toEqual({ total: 3, direct: 2, directRate: 2 / 3, noApp: 1, noAppRate: 1 / 3,
    trials: [{ trial: 'none', count: 1 }, { trial: 'copied', count: 1 }, { trial: 'failed', count: 1 }],
  })
})

it('投稿按步骤定义排序、会话去重、缺步补零；错误码按次数排名', () => {
  expect(data.submission.steps.map((r) => [r.step, r.sessions])).toEqual([
    ['view', 2], ['copy_prompt', 0], ['read', 1], ['bundle_error', 1], ['checked', 0], ['login_click', 0],
    ['login_back', 0], ['submit_click', 0], ['submitted', 0], ['submit_fail', 2], ['progress', 0], ['issue_fallback', 0], ['inapp', 0],
  ])
  expect(data.submission.failures).toEqual([
    { step: 'bundle_error', code: 'invalid', count: 1 }, { step: 'submit_fail', code: 'unavailable', count: 2 },
    { step: 'submit_fail', code: 'invalid', count: 1 },
  ])
})

it('健康：五种复制失败占比和 404 路径排行', () => {
  expect(data.health).toEqual({ copy: [
    { name: 'bot_copy_prompt', total: 2, failed: 1, rate: 0.5 }, { name: 'bot_copy_starter', total: 1, failed: 1, rate: 1 },
    { name: 'squad_copy', total: 1, failed: 0, rate: 0 }, { name: 'prompt_copy', total: 1, failed: 0, rate: 0 },
    { name: 'skill_copy', total: 1, failed: 1, rate: 1 },
  ], notFound: [{ path: '/missing/', count: 2 }, { path: '/gone/', count: 1 }] })
})

const headings = ['概览', '来源', '三个模块', '条目', '搜索', '筛选', '导入', '投稿漏斗', '健康']
it('Markdown 包含区间、库名、九个标题及一位小数的百分数', () => {
  const report = renderReport({ ...data, database: 'local' })
  expect(report).toContain('数据库：本地库')
  expect(report).toContain('本期（北京时间）：2026-11-20 至 2026-11-22')
  expect(report.match(/^## .+$/gm)).toEqual(headings.map((s) => `## ${s}`))
  expect(report).toContain('| 拿走率 | 75.0% | 25.0% | ↑200% |')
  expect(report).toContain('| 协议唤起 | 2 | 66.7% |')
})

it('无会话时拿走率未定义，空报告输出九段且退出 0', async () => {
  const runSql = runner(proxy.env.DB)
  const empty = await buildReport({ runSql, today: '2026-12-01', days })
  expect(empty.overview.takeRate).toEqual({ current: null, previous: null, change: '—' })
  const print = vi.fn()
  expect(await runReport(['--local'], { runSql, today: '2026-12-01', print })).toBe(0)
  expect(print.mock.calls[0][0].match(/本期没有数据/g)).toHaveLength(9)
  const withEvents = await buildReport({ runSql, today: '2026-11-20', days: 1 })
  expect(renderReport(withEvents)).toContain('| Prompt | 0 | 0 | — |')
  expect(renderReport(withEvents)).toContain('### UTM 来源\n\n无')
  const noPrevious = await buildReport({ runSql, today: '2026-11-16', days: 1 })
  expect(noPrevious.overview.sessions).toEqual({ current: 1, previous: 0, change: '—' })
})

it('只读护栏拒绝不符合前缀或带分号的语句', () => {
  for (const sql of ['DELETE FROM events', 'select 1; drop table events', '  update events', 'selecting 1']) {
    expect(() => assertReadOnly(sql)).toThrow('只读')
  }
  expect(() => assertReadOnly('  with x as (select 1) select * from x')).not.toThrow()
})

it('格式错误或不存在的日期不会送进 SQL', async () => {
  const runSql = vi.fn()
  for (const date of ["2026-11-22'", '2026-02-31']) {
    await expect(buildReport({ runSql, today: date, days })).rejects.toThrow('日期')
  }
  expect(runSql).not.toHaveBeenCalled()
})

describe('命令行', () => {
  it('解析默认值、三个参数和帮助', () => {
    expect(parseArgs([])).toEqual({ days: 7, local: false, json: false, help: false })
    expect(parseArgs(['--local', '--days', '90', '--json', '--help'])).toEqual({ days: 90, local: true, json: true, help: true })
    expect(parseArgs(['--days', '1']).days).toBe(1)
  })
  it('拒绝越界、小数、指数、漏值和未知参数，退出 2', async () => {
    const runSql = vi.fn()
    for (const args of [['--days'], ['--days', '0'], ['--days', '-1'], ['--days', '91'], ['--days', '1.5'], ['--days', '1e1'], ['--days', '--local'], ['--bad']]) {
      const error = vi.fn()
      expect(await runReport(args, { runSql, error })).toBe(2)
      expect(error.mock.calls[0][0]).toMatch(/必须指定|不认识的参数/)
    }
    expect(runSql).not.toHaveBeenCalled()
  })
  it('UTC 16 点切换北京时间日期', () => {
    expect(beijingToday(Date.parse('2026-11-21T15:59:59Z'))).toBe('2026-11-21')
    expect(beijingToday(Date.parse('2026-11-21T16:00:00Z'))).toBe(today)
  })
  it('空库缺表给出迁移提示并退出 1', async () => {
    const error = vi.fn()
    expect(await runReport(['--local'], { today, runSql: runner(emptyProxy.env.DB), error })).toBe(1)
    expect(error).toHaveBeenCalledWith('events 表不存在：库里还没应用迁移 0005，见 docs/dev/TRACKING.md 第 8 节')
  })
  it('一般查询错误只显示 stderr 的前 20 行', async () => {
    const lines = Array.from({ length: 22 }, (_, i) => `第 ${i + 1} 行`)
    const runSql = async () => { throw Object.assign(new Error('模拟故障'), { stderr: lines.join('\n') }) }
    const error = vi.fn()
    expect(await runReport(['--local'], { today, runSql, error })).toBe(1)
    expect(error).toHaveBeenCalledWith(`查询失败\n${lines.slice(0, 20).join('\n')}`)
  })
  it('wrangler 调用不经过 shell，SQL 是独立参数', async () => {
    const execute = vi.fn(async () => ({ stdout: '[{"results":[{"n":1}]}]', stderr: '' }))
    await expect(wranglerQuery('SELECT 1 AS n', true, execute)).resolves.toEqual([{ n: 1 }])
    expect(execute).toHaveBeenCalledWith('npx', ['wrangler', 'd1', 'execute', 'bot-zhipin', '--local', '--json', '--command', 'SELECT 1 AS n'], expect.objectContaining({ encoding: 'utf8' }))
  })
  it('JSON 输出可解析并标明本地库', async () => {
    const print = vi.fn()
    const runSql = vi.fn(runner(proxy.env.DB))
    expect(await runReport(['--local', '--days', '3', '--json'], { today, runSql, print })).toBe(0)
    expect(JSON.parse(print.mock.calls[0][0])).toEqual({ ...data, database: 'local' })
    expect(runSql.mock.calls.every(([, local]) => local)).toBe(true)
  })
  it('从测试库生成完整报告供排版检查', () => {
    if (process.env.SHOW_REPORT_FIXTURE === '1') console.log(renderReport({ ...data, database: 'local' }).trimEnd())
    expect(renderReport({ ...data, database: 'local' })).not.toContain('本期没有数据')
  })
})
