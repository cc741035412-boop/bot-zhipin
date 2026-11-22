import { readFileSync } from 'node:fs'
import { expect, it } from 'vitest'
import { EVENTS, PAGE_TYPES } from '../../functions/_lib/events.ts'

const doc = readFileSync(new URL('../../docs/dev/TRACKING.md', import.meta.url), 'utf8')
const section = doc.split('## 3. 事件表')[1].split('## 4.')[0]
const [events, funnel] = section.split('**投稿漏斗的 `step`**')
const row = (table, name) => table.split('\n').find(line => line.startsWith('| `' + name + '` |'))

it('第 3 节的事件表逐行列出每个事件', () => {
  for (const name of Object.keys(EVENTS)) expect(row(events.split('| 事件 |')[1], name), name).toBeDefined()
})
it('每个字段出现在所属事件行或投稿漏斗表', () => {
  for (const [name, specs] of Object.entries(EVENTS)) {
    const text = row(events, name) + (name === 'submit_step' ? funnel.split('**不记的**')[0] : '')
    for (const key of Object.keys(specs)) expect(text).toContain('`' + key + '`')
  }
})
it('页面类型都在 page 行', () => {
  for (const page of PAGE_TYPES) expect(row(events, 'page')).toContain('`' + page + '`')
})
it('每个投稿步骤都有自己的漏斗行', () => {
  for (const step of EVENTS.submit_step.step.values) expect(row(funnel, step), step).toBeDefined()
})
