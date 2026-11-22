import { EVENTS, TAKE_EVENTS } from '../../functions/_lib/events.ts'

const dayMs = 86_400_000
const dayPattern = /^\d{4}-\d{2}-\d{2}$/
const take = `name IN (${TAKE_EVENTS.map((name) => `'${name}'`).join(', ')})`
const copyEvents = TAKE_EVENTS.filter((name) => name !== 'bot_import')
const steps = EVENTS.submit_step.step.values
const trials = EVENTS.bot_import.trial.values
const ratio = (n, d) => d ? n / d : null

export function assertReadOnly(sql) {
  if (!/^(SELECT|WITH)\b/i.test(sql.trim()) || sql.includes(';')) {
    throw new Error('报告只允许执行单条只读查询')
  }
}

function checkDay(day) {
  if (typeof day !== 'string' || !dayPattern.test(day)) throw new Error('日期必须为 YYYY-MM-DD')
  return day
}

function dateRanges(today, days) {
  if (!Number.isInteger(days) || days < 1 || days > 90) throw new Error('天数必须是 1～90 的整数')
  const time = Date.parse(checkDay(today) + 'T00:00:00Z')
  const ago = (n) => checkDay(new Date(time - n * dayMs).toISOString().slice(0, 10))
  if (!Number.isFinite(time) || ago(0) !== today) throw new Error('日期无效')
  return {
    current: { start: ago(days - 1), end: today },
    previous: { start: ago(2 * days - 1), end: ago(days) },
  }
}

function change(current, previous) {
  if (!previous || current === null) return '—'
  if (current === previous) return '持平'
  return `${current > previous ? '↑' : '↓'}${Math.round(Math.abs(current - previous) / previous * 100)}%`
}

function percentagePointChange(current, previous) {
  if (current === null || previous === null) return '—'
  if (current === previous) return '持平'
  return `${current > previous ? '↑' : '↓'}${(Math.abs(current - previous) * 100).toFixed(1)} 个百分点`
}

const overviewLabels = {
  visitors: '访客', sessions: '会话', pageViews: '浏览量', takes: '拿走次数',
  takeSessions: '拿走会话', takeRate: '拿走率',
}

export async function buildReport({ runSql, today, days }) {
  const periods = dateRanges(today, days)
  async function query(sql) {
    assertReadOnly(sql)
    return runSql(sql)
  }
  const windowSql = ({ start, end }) => `SELECT * FROM events WHERE day BETWEEN '${checkDay(start)}' AND '${checkDay(end)}'`
  const current = windowSql(periods.current)
  const inPeriod = (sql) => query(`WITH period AS (${current}) ${sql}`)
  async function summarize(period) {
    const [row] = await query(`WITH period AS (${windowSql(period)})
      SELECT COUNT(*) AS events,
        (SELECT COALESCE(SUM(n), 0) FROM (SELECT COUNT(DISTINCT vid) AS n FROM period GROUP BY day)) AS visitors,
        COUNT(DISTINCT sid) AS sessions,
        COUNT(*) FILTER (WHERE name = 'page_view') AS pageViews,
        COUNT(*) FILTER (WHERE ${take}) AS takes,
        COUNT(DISTINCT sid) FILTER (WHERE ${take}) AS takeSessions
      FROM period`)
    return { ...row, takeRate: ratio(row.takeSessions, row.sessions) }
  }
  const now = await summarize(periods.current)
  const last = await summarize(periods.previous)
  const overview = Object.fromEntries(Object.keys(overviewLabels).map((key) => [key, {
    current: now[key], previous: last[key],
    change: (key === 'takeRate' ? percentagePointChange : change)(now[key], last[key]),
  }]))
  if (!now.events) return { periods, empty: true, overview }

  const landingSql = `WITH period AS (${current}), landing AS (
    SELECT *, NULLIF(json_extract(props, '$.ref'), '') AS ref,
      NULLIF(json_extract(props, '$.utm_source'), '') AS utm
    FROM period WHERE name = 'page_view' AND json_extract(props, '$.landing') = 1
  )`
  const sourceRows = await query(`${landingSql}
    SELECT 'ref' AS kind, * FROM (
      SELECT ref AS label, COUNT(*) AS count FROM landing WHERE ref IS NOT NULL
      GROUP BY ref ORDER BY count DESC, ref LIMIT 10
    )
    UNION ALL SELECT 'direct', '直接打开或无来源', COUNT(*) FROM landing WHERE ref IS NULL HAVING COUNT(*) > 0
    UNION ALL SELECT 'utm', * FROM (
      SELECT utm AS label, COUNT(*) AS count FROM landing WHERE utm IS NOT NULL
      GROUP BY utm ORDER BY count DESC, utm LIMIT 10
    )
    ORDER BY kind, count DESC, label`)
  const [landingCounts] = await query(`${landingSql}
    SELECT COUNT(DISTINCT sid) AS total,
      COUNT(DISTINCT sid) FILTER (WHERE country = 'CN') AS cn,
      COUNT(DISTINCT sid) FILTER (WHERE country <> 'CN' AND country <> '') AS overseas,
      COUNT(DISTINCT sid) FILTER (WHERE country IS NULL) AS unknown,
      COUNT(DISTINCT sid) FILTER (WHERE device = 'mobile') AS mobile,
      COUNT(DISTINCT sid) FILTER (WHERE device = 'desktop') AS desktop,
      COUNT(DISTINCT sid) FILTER (WHERE device = 'unknown') AS unknownDevice
    FROM landing`)
  const sourceGroup = (pairs) => pairs.map(([label, key]) => ({
    label, sessions: landingCounts[key], rate: ratio(landingCounts[key], landingCounts.total),
  }))
  const sourceList = (...kinds) => sourceRows.filter(({ kind }) => kinds.includes(kind))
    .map(({ label, count }) => ({ label, count }))
  const sources = {
    referrers: sourceList('ref', 'direct').sort((a, b) => b.count - a.count), utm: sourceList('utm'),
    countries: sourceGroup([['国内', 'cn'], ['海外', 'overseas'], ['未知', 'unknown']]),
    devices: sourceGroup([['mobile', 'mobile'], ['desktop', 'desktop'], ['unknown', 'unknownDevice']]),
  }

  const moduleRows = await inPeriod(`, tagged AS (
    SELECT *, CASE
      WHEN page IN ('home', 'bot', 'squad', 'author') THEN 'Bot'
      WHEN page IN ('prompts', 'prompt') THEN 'Prompt'
      WHEN page IN ('skills', 'skill') THEN 'Skills' END AS module
    FROM period
  )
    SELECT module, COUNT(*) FILTER (WHERE name = 'page_view') AS pageViews,
      COUNT(*) FILTER (WHERE ${take}) AS takes,
      COUNT(DISTINCT sid) FILTER (WHERE name = 'page_view') AS viewSessions,
      COUNT(DISTINCT sid) FILTER (WHERE ${take} AND EXISTS (
        SELECT 1 FROM tagged AS viewed
        WHERE viewed.module = tagged.module AND viewed.sid = tagged.sid AND viewed.name = 'page_view'
      )) AS takeSessions
    FROM tagged WHERE module IS NOT NULL GROUP BY module`)
  const modules = ['Bot', 'Prompt', 'Skills'].map((module) => {
    const row = moduleRows.find((r) => r.module === module)
      ?? { module, pageViews: 0, takes: 0, viewSessions: 0, takeSessions: 0 }
    return { ...row, takeRate: ratio(row.takeSessions, row.viewSessions) }
  })

  const topTakes = await inPeriod(`SELECT slug, name, COUNT(*) AS count FROM period
    WHERE slug IS NOT NULL AND ${take} GROUP BY slug, name ORDER BY count DESC, slug, name LIMIT 10`)
  const untaken = await inPeriod(`, taken AS (SELECT DISTINCT slug FROM period WHERE slug IS NOT NULL AND ${take})
    SELECT page, slug, COUNT(*) AS count FROM period
    WHERE name = 'page_view' AND page IN ('bot', 'squad', 'prompt', 'skill') AND slug IS NOT NULL
      AND slug NOT IN (SELECT slug FROM taken)
    GROUP BY page, slug ORDER BY count DESC, page, slug LIMIT 10`)

  const searches = `, searches AS (
    SELECT CASE WHEN name = 'library_search' AND page = 'prompts' THEN 'Prompt 列表'
      WHEN name = 'library_search' AND page = 'skills' THEN 'Skills 列表' ELSE '全站面板' END AS source,
      json_extract(props, '$.q') AS q, json_extract(props, '$.results') AS results
    FROM period WHERE name IN ('search', 'library_search')
  )`
  const topSearches = await inPeriod(`${searches} SELECT source, q, COUNT(*) AS count FROM searches
    WHERE q IS NOT NULL GROUP BY source, q ORDER BY count DESC, source, q LIMIT 20`)
  const emptySearches = await inPeriod(`${searches} SELECT source, q, COUNT(*) AS count FROM searches
    WHERE q IS NOT NULL AND results = 0 GROUP BY source, q ORDER BY count DESC, source, q`)

  const filters = `, filters AS (
    SELECT json_extract(props, '$.where') AS category, json_extract(props, '$.value') AS value,
      json_extract(props, '$.results') AS results FROM period WHERE name = 'filter'
  )`
  const topFilters = await inPeriod(`${filters}, ranked AS (
    SELECT category AS "where", value, COUNT(*) AS count,
      ROW_NUMBER() OVER (PARTITION BY category ORDER BY COUNT(*) DESC, value) AS rank
    FROM filters WHERE category IS NOT NULL AND value IS NOT NULL GROUP BY category, value
  ) SELECT "where", value, count FROM ranked WHERE rank <= 5 ORDER BY "where", rank`)
  const emptyFilters = await inPeriod(`${filters} SELECT category AS "where", value, COUNT(*) AS count FROM filters
    WHERE category IS NOT NULL AND value IS NOT NULL AND results = 0
    GROUP BY category, value ORDER BY count DESC, category, value`)

  const [imports] = await inPeriod(`SELECT COUNT(*) FILTER (WHERE name = 'bot_import') AS total,
      COUNT(*) FILTER (WHERE name = 'bot_import' AND json_extract(props, '$.direct') = 1) AS direct,
      COUNT(*) FILTER (WHERE name = 'bot_no_app') AS noApp FROM period`)
  const trialRows = await inPeriod(`SELECT COALESCE(json_extract(props, '$.trial'), 'none') AS trial, COUNT(*) AS count
    FROM period WHERE name = 'bot_import' GROUP BY trial`)
  const importing = { ...imports, directRate: ratio(imports.direct, imports.total), noAppRate: ratio(imports.noApp, imports.total),
    trials: trials.map((trial) => ({ trial, count: trialRows.find((r) => r.trial === trial)?.count ?? 0 })),
  }

  const stepRows = await inPeriod(`SELECT json_extract(props, '$.step') AS step, COUNT(DISTINCT sid) AS sessions
    FROM period WHERE name = 'submit_step' GROUP BY step`)
  const codes = await inPeriod(`, failures AS (
    SELECT json_extract(props, '$.step') AS step, json_extract(props, '$.code') AS code
    FROM period WHERE name = 'submit_step'
  ) SELECT step, code, COUNT(*) AS count FROM failures
    WHERE step IN ('submit_fail', 'bundle_error') AND code IS NOT NULL
    GROUP BY step, code ORDER BY step, count DESC, code`)
  const submission = {
    steps: steps.map((step) => ({ step, sessions: stepRows.find((r) => r.step === step)?.sessions ?? 0 })),
    failures: codes,
  }

  const copyRows = await inPeriod(`SELECT name, COUNT(*) AS total,
    COUNT(*) FILTER (WHERE json_extract(props, '$.ok') = 0) AS failed
    FROM period WHERE ${take} AND name <> 'bot_import' GROUP BY name`)
  const copy = copyEvents.map((name) => {
    const row = copyRows.find((r) => r.name === name) ?? { name, total: 0, failed: 0 }
    return { ...row, rate: ratio(row.failed, row.total) }
  })
  const notFound = await inPeriod(`SELECT path, COUNT(*) AS count FROM period WHERE page = '404' AND name = 'page_view'
    GROUP BY path ORDER BY count DESC, path LIMIT 10`)
  return { periods, empty: false, overview, sources, modules, items: { topTakes, untaken },
    search: { top: topSearches, empty: emptySearches }, filters: { top: topFilters, empty: emptyFilters },
    importing, submission, health: { copy, notFound },
  }
}

const percent = (value) => value === null ? '—' : `${(value * 100).toFixed(1)}%`
// 以字符实体保留搜索词等原文，避免把库中的内容当成 Markdown、HTML 或终端控制符。
const cell = (value) => String(value).replace(/[\p{Cc}\p{Cf}\u2028\u2029]/gu, ' ')
  .replace(/[<>&|\\`*\[\]~]|(?<![\p{L}\p{N}])_|_(?![\p{L}\p{N}])/gu, (c) => `&#${c.codePointAt(0)};`)
function table(columns, rows) {
  if (!rows.length) return '无'
  const line = (values) => `| ${values.join(' | ')} |`
  return [line(columns), line(columns.map(() => '---')), ...rows.map(line)].join('\n')
}

export function renderReport(data) {
  const { periods, empty } = data
  const lines = ['# 埋点报告', `数据库：${data.database === 'local' ? '本地库' : '线上库'}`,
    `本期（北京时间）：${periods.current.start} 至 ${periods.current.end}\n上期：${periods.previous.start} 至 ${periods.previous.end}`]
  function section(title, render) {
    lines.push(`## ${title}`, empty ? '本期没有数据' : render())
  }
  function sub(title, content) { return `### ${title}\n\n${content}` }
  const group = (...parts) => parts.join('\n\n')
  section('概览', () => table(['指标', '本期', '上期', '环比'], Object.entries(overviewLabels).map(([key, label]) => {
    const { current, previous, change } = data.overview[key]
    return [label, key === 'takeRate' ? percent(current) : current, key === 'takeRate' ? percent(previous) : previous, change]
  })))
  section('来源', () => {
    const { referrers, utm, countries, devices } = data.sources
    const counts = (rows, label) => table([label, '次数'], rows.map((r) => [cell(r.label), r.count]))
    const sessions = (rows, label) => table([label, '会话数', '占比'], rows.map((r) => [r.label, r.sessions, percent(r.rate)]))
    return group(sub('外站来源', counts(referrers, '来源')), sub('UTM 来源', counts(utm, 'utm_source')),
      sub('国家', sessions(countries, '地区')), sub('设备', sessions(devices, '设备')))
  })
  section('三个模块', () => table(['模块', '浏览量', '拿走次数', '拿走率'],
    data.modules.map((r) => [r.module, r.pageViews, r.takes, percent(r.takeRate)])))
  section('条目', () => group(
    sub('拿走次数前 10', table(['条目', '事件', '次数'], data.items.topTakes.map((r) => [cell(r.slug), r.name, r.count]))),
    sub('看的多没人拿', table(['页面', '条目', '浏览量'], data.items.untaken.map((r) => [cell(r.page), cell(r.slug), r.count])))))
  section('搜索', () => {
    const show = (rows) => table(['来源', '搜索词', '次数'], rows.map((r) => [r.source, cell(r.q), r.count]))
    return group(sub('搜索词前 20', show(data.search.top)), sub('无结果搜索词', show(data.search.empty)))
  })
  section('筛选', () => {
    const show = (rows) => table(['位置', '筛选值', '次数'], rows.map((r) => [cell(r.where), cell(r.value), r.count]))
    return group(sub('每个位置前 5', show(data.filters.top)), sub('无结果筛选', show(data.filters.empty)))
  })
  section('导入', () => {
    const r = data.importing
    return group(table(['指标', '次数', '占导入比例'], [
      ['协议唤起', r.direct, percent(r.directRate)], ['疑似没装 App', r.noApp, percent(r.noAppRate)],
    ]), sub('试跑句复制结果', table(['结果', '次数'], r.trials.map((row) => [row.trial, row.count]))))
  })
  section('投稿漏斗', () => group(
    table(['步骤', '会话数'], data.submission.steps.map((r) => [r.step, r.sessions])),
    ...['submit_fail', 'bundle_error'].map((step) => sub(`${step} 错误码排行`, table(['错误码', '次数'],
      data.submission.failures.filter((r) => r.step === step).map((r) => [cell(r.code), r.count]))))))
  section('健康', () => group(sub('复制失败', table(['事件', '失败次数', '复制次数', '失败占比'],
    data.health.copy.map((r) => [r.name, r.failed, r.total, percent(r.rate)]))),
  sub('404 路径前 10', table(['路径', '次数'], data.health.notFound.map((r) => [cell(r.path), r.count])))))
  return lines.join('\n\n') + '\n'
}
