import { expect, it, vi } from 'vitest'
import { QUERY_EVENTS } from '../../functions/_lib/events.ts'
import { scheduleEventCleanup } from '../../functions/_lib/events-store.ts'

// UTC 还是 24 日，北京已是 25 日。
const now = Date.parse('2026-11-24T16:00:00Z')
function fixture() {
  const db = {
    prepare: vi.fn(sql => ({ bind: (...args) => ({ sql, args }) })),
    batch: vi.fn(async () => []),
  }
  const jobs = []
  const run = (random = 0) => {
    scheduleEventCleanup(db, now, p => jobs.push(p), () => random)
    return Promise.all(jobs)
  }
  return { db, jobs, run }
}

it('抽中时同批删除过期事件、清理过期搜索词，按北京日期严格小于截止日', async () => {
  const { db, jobs, run } = fixture()
  await run()
  expect(jobs).toHaveLength(1)
  expect(db.batch).toHaveBeenCalledTimes(1)
  const [statements] = db.batch.mock.calls[0]
  expect(statements).toHaveLength(2)
  const [del, update] = statements
  expect(del).toEqual({ sql: 'DELETE FROM events WHERE day < ?', args: ['2025-10-21'] })
  expect(update.sql).toContain("UPDATE events SET props = json_remove(props, '$.q')")
  expect(update.sql).toContain('WHERE day < ?1')
  expect(update.sql).toContain("json_extract(props, '$.q') IS NOT NULL")
  expect(update.args[0]).toBe('2026-08-27')
})

it('用 QUERY_EVENTS 绑定更新范围', async () => {
  const { db, run } = fixture()
  await run()
  const update = db.batch.mock.calls[0][0][1]
  expect(update.sql).toContain(`name IN (${QUERY_EVENTS.map((_, i) => `?${i + 2}`).join(', ')})`)
  expect(update.args.slice(1)).toEqual(QUERY_EVENTS)
})

it('随机数达到 1/200 时不调度、不访问数据库', async () => {
  const { db, jobs, run } = fixture()
  await run(1 / 200)
  expect(jobs).toHaveLength(0)
  expect(db.prepare).not.toHaveBeenCalled()
  expect(db.batch).not.toHaveBeenCalled()
})

it('准备语句时同步出错也不会中断请求', async () => {
  const { db, run } = fixture()
  db.prepare.mockImplementationOnce(() => { throw new Error('无法准备语句') })
  await expect(run()).resolves.toHaveLength(1)
  expect(db.batch).not.toHaveBeenCalled()
})

it('数据库拒绝 batch 时后台任务正常结束', async () => {
  const { db, run } = fixture()
  db.batch.mockRejectedValueOnce(new Error('数据库不可用'))
  await expect(run()).resolves.toHaveLength(1)
  expect(db.batch).toHaveBeenCalledOnce()
})
