import { expect, it } from 'vitest'
import { authorKey, authorPagePath, authorAvatarPath, buildAuthors } from '../../scripts/lib/authors.mjs'

const item = (slug, github = 'Ada', addedAt = '2026-01-01') => ({ slug, addedAt, author: { github, name: slug } })
const build = (bots = [], squads = []) => buildAuthors({ bots, squads })
for (const fn of [authorKey, authorPagePath, authorAvatarPath]) {
  it(`${fn.name} 无账号时返回 null`, () => {
    for (const value of ['', undefined, null]) expect(fn(value)).toBeNull()
  })
}
const invalid = [12345, true, ['a'], { a: 1 }, '']
it('非字符串和空字符串不能生成作者键或路径', () => {
  for (const github of invalid) {
    for (const fn of [authorKey, authorPagePath, authorAvatarPath]) expect(fn(github)).toBeNull()
  }
})
it('作者集合跳过非字符串和空字符串', () => {
  const rows = invalid.map((github, i) => item(`bad-${i}`, github))
  expect(build(rows, rows)).toEqual([])
})
it('路径使用小写键', () => {
  expect([authorKey('Ada'), authorPagePath('Ada'), authorAvatarPath('Ada')]).toEqual(['ada', '/authors/ada', '/api/avatar/ada'])
})
it('合并大小写不同的登录名', () => expect(build([item('x'), item('y', 'ADA')])).toHaveLength(1))
it('以最近的小队决定昵称和原始登录名', () => {
  expect(build([item('x')], [item('y', 'ADA', '2026-03-01')])[0]).toMatchObject({ name: 'y', login: 'ADA', github: 'https://github.com/ADA' })
})
it('同日 Bot 优先于小队', () => expect(build([item('z')], [item('a')])[0].name).toBe('z'))
it('同日同类按 slug 取昵称', () => expect(build([item('b'), item('a')])[0].name).toBe('a'))
it('忽略无 GitHub 的条目', () => expect(build([item('bot', null)], [item('squad', '')])).toEqual([]))
it('作者可以只有小队', () => {
  const squad = item('solo')
  expect(build([], [squad])).toEqual([{ key: 'ada', login: 'Ada', name: 'solo', page: '/authors/ada', avatar: '/api/avatar/ada', github: 'https://github.com/Ada', bots: [], squads: [squad] }])
})
it('按 key 返回作者', () => expect(build([item('a', 'Zed'), item('b', 'Bo')]).map(a => a.key)).toEqual(['bo', 'zed']))
it('两组作品分别排序，保留原摘要', () => {
  const rows = [item('c'), item('a'), item('x', 'Ada', '2026-02-01')]
  const [a] = build(rows, rows)
  for (const list of [a.bots, a.squads]) [2, 1, 0].forEach((n, i) => expect(list[i]).toBe(rows[n]))
})

it('作者页标题和描述：中英文之间有空格，顿号后没有空格', async () => {
  const { AUTHOR_COPY } = await import('../../site/.vitepress/meta.mjs')
  const a = (bots, squads) => ({ name: '铁柱AGI', login: 'RongleCat', bots: Array(bots).fill({}), squads: Array(squads).fill({}) })
  expect(AUTHOR_COPY.pageTitle(a(5, 0))).toBe('铁柱AGI 的 Bot')
  expect(AUTHOR_COPY.pageTitle(a(5, 1))).toBe('铁柱AGI 的 Bot 和小队')
  expect(AUTHOR_COPY.pageTitle(a(0, 1))).toBe('铁柱AGI 的小队')
  expect(AUTHOR_COPY.description(a(5, 1))).toBe('铁柱AGI（@RongleCat）在 Bot 直聘上架的 5 个 Bot、1 支小队。')
  expect(AUTHOR_COPY.description(a(0, 2))).toBe('铁柱AGI（@RongleCat）在 Bot 直聘上架的 2 支小队。')
})
