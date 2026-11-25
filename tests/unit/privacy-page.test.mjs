import { readFileSync } from 'node:fs'
import { expect, test } from 'vitest'
import { DAY_MS } from '../../functions/_lib/clicks.ts'
import { EVENTS, EVENT_RETENTION_DAYS, QUERY_RETENTION_DAYS } from '../../functions/_lib/events.ts'
import { OAUTH_MS, SESSION_MS } from '../../functions/_lib/session.ts'
import { loadEnums } from '../../scripts/lib/load-bots.mjs'
import { SITE } from '../../site/.vitepress/meta.mjs'
import { SESSION_IDLE_MS } from '../../site/.vitepress/theme/track.ts'

const page = readFileSync(new URL('../../site/privacy.md', import.meta.url), 'utf8')

const documentedValues = [
  `访问记录保存 ${EVENT_RETENTION_DAYS} 天`,
  `原文保存 ${QUERY_RETENTION_DAYS} 天，之后`,
  `搜索词原文保存 ${QUERY_RETENTION_DAYS} 天。`,
  `搜索词最多存 ${EVENTS.search.q.max} 个字`,
  `${SESSION_MS / 3_600_000} 小时后失效`,
  `${OAUTH_MS / 60_000} 分钟就失效的临时 cookie`,
  `闲置 ${SESSION_IDLE_MS / 60_000} 分钟`,
  `${DAY_MS / 3_600_000} 小时内对同一个 Bot 重复点`,
  `过了 ${DAY_MS / 3_600_000} 小时就清掉`,
  ...loadEnums().permissions,
  `${SITE.repo}/issues`,
]

test.each(documentedValues)('site/privacy.md 写明：%s', (value) => {
  expect(page).toContain(value)
})

test('两处搜索的搜索词字数上限一致', () => {
  expect(EVENTS.library_search.q.max).toBe(EVENTS.search.q.max)
})

test('埋点的文本字段与已核对的隐私清单一致', () => {
  const expected = new Set(['ref', 'utm_source', 'utm_medium', 'utm_campaign', 'squad', 'agent', 'host', 'to', 'value', 'q', 'cat', 'code'])
  const actual = new Set(Object.values(EVENTS).flatMap(fields =>
    Object.entries(fields).filter(([, spec]) => spec.type === 'str').map(([name]) => name),
  ))
  const added = [...actual].filter(name => !expected.has(name))
  expect(added, added.map(name => `新增了文本字段 ${name}：确认它不是访客自己输入的内容，再同步更新 site/privacy.md 和这份清单`).join('\n')).toEqual([])
  expect(actual, '埋点文本字段已删除：请同步核对 site/privacy.md 和这份清单').toEqual(expected)
})
