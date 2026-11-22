import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import { execFileSync, spawnSync } from 'node:child_process'
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const script = fileURLToPath(new URL('../../scripts/check-pr-scope.mjs', import.meta.url))
const file = 'bots/old-bot/bot.yaml'
const yaml = (author = 'Alice') => `slug: old-bot\naddedAt: 2026-11-01\nauthor:\n  github: ${author}\n`
let directory
const git = (...args) => execFileSync('git', args, {
  cwd: directory, encoding: 'utf8', timeout: 10_000,
  env: { ...process.env, GIT_AUTHOR_NAME: 'Scope Test', GIT_AUTHOR_EMAIL: 'scope@example.invalid', GIT_COMMITTER_NAME: 'Scope Test', GIT_COMMITTER_EMAIL: 'scope@example.invalid' },
})
function put(path, text) {
  mkdirSync(dirname(join(directory, path)), { recursive: true })
  writeFileSync(join(directory, path), text)
}
function commit() {
  git('add', '.')
  git('-c', 'commit.gpgsign=false', 'commit', '-qm', 'test snapshot')
}
function check(association = 'CONTRIBUTOR', base = 'HEAD^1', head = 'HEAD', ...args) {
  return spawnSync(process.execPath, [script, '--base', base, '--head', head, '--association', association, ...args], {
    cwd: directory, encoding: 'utf8', timeout: 10_000,
  })
}
beforeEach(() => {
  directory = mkdtempSync(join(tmpdir(), 'bot-scope-author-'))
  git('init', '-q')
  put(file, yaml())
  commit()
})
afterEach(() => rmSync(directory, { recursive: true, force: true }))

it('修改作者报错，不能以修改 name 等其他字段掩盖', () => {
  put(file, yaml('Bob') + 'name: 新名字\n')
  commit()
  const result = check()
  expect(result.status).toBe(1)
  expect(result.stderr).toContain(`${file}：author.github 是投稿人的 GitHub 账号，不能修改；请保留 base 中的账号。`)
})

it('作者只改大小写放行，成功文案说明作者未改动', () => {
  put(file, yaml('aLiCe'))
  commit()
  const result = check()
  expect(result.status).toBe(0)
  expect(result.stdout).toContain('作者未改动')
})

it('新增 bot.yaml 不比较作者', () => {
  put('bots/new-bot/bot.yaml', yaml('Bob').replace('old-bot', 'new-bot'))
  commit()
  expect(check().status).toBe(0)
})

it('删除 bot.yaml 放行', () => {
  rmSync(join(directory, file))
  commit()
  expect(check().status).toBe(0)
})

it.each(['OWNER', 'MEMBER', 'COLLABORATOR'])('%s 可改作者，并且不解析提交参数', (association) => {
  put(file, yaml('Bob'))
  put('outside.md', '维护者改动')
  commit()
  expect(check(association).status).toBe(0)
  expect(check(association, 'absent', 'absent').status).toBe(0)
})

it('两边都缺失 author.github 视为没变', () => {
  put(file, 'slug: old-bot\naddedAt: 2026-11-01\n')
  commit()
  put(file, 'slug: old-bot\naddedAt: 2026-11-01\nauthor:\n  name: Alice\n')
  commit()
  expect(check().status).toBe(0)
})

it('已有文件新增或删除 author.github 都是修改作者', () => {
  put(file, 'slug: old-bot\naddedAt: 2026-11-01\n')
  commit()
  expect(check().stderr).toContain('author.github 是投稿人的 GitHub 账号，不能修改')
  put(file, yaml())
  commit()
  expect(check().stderr).toContain('author.github 是投稿人的 GitHub 账号，不能修改')
})

it.each(['author: [坏 YAML', '[]', 'addedAt: 2026-11-01\nauthor: {github: 123}\n'])('坏 YAML 或非法账号类型报无法比较：%s', (text) => {
  put(file, text)
  commit()
  const result = check()
  expect(result.status).toBe(1)
  expect(result.stderr).toContain(`${file}：无法比较 author.github`)
})

it('base YAML 读不出来也报错，不接受合法 head 覆盖', () => {
  put(file, 'author: [坏 YAML')
  commit()
  put(file, yaml())
  commit()
  expect(check().stderr).toContain('无法比较 author.github')
})

it('只读提交，工作区中的作者改动不影响比较', () => {
  put(file, yaml() + 'name: 新名字\n')
  commit()
  put(file, yaml('Bob'))
  expect(check().status).toBe(0)
})

// 新投稿核对的是 PR 作者，不是 git 提交的 author，也不读未提交的修改。
const newBot = 'bots/new-bot/bot.yaml'
const newSquad = 'squads/new-squad/squad.yaml'
const appBots = 'bot-zhipin-submit[bot],github-actions[bot]'
const by = (github) => `author:\n  name: 展示名\n${github ? `  github: ${github}\n` : ''}`
function checkAs(login, association = 'CONTRIBUTOR', bots) {
  const args = ['--pr-author', login]
  if (bots !== undefined) args.push('--app-bots', bots)
  return check(association, 'HEAD^1', 'HEAD', ...args)
}

it.each(['alice', 'aLiCe'])('新 Bot 署自己的账号 %s，不警告', (github) => {
  put(newBot, by(github))
  commit()
  const result = checkAs('alice')
  expect(result.status).toBe(0)
  expect(result.stdout).not.toContain('⚠')
})

it('新 Bot 冒名报错，不能套用小队的 origin 或以工作区的作者覆盖 head', () => {
  put(newBot, by('RongleCat') + 'origin: 原作者成套\n')
  commit()
  put(newBot, by('alice'))
  const result = checkAs('alice')
  expect(result.status).toBe(1)
  expect(result.stderr).toContain(`${newBot}：author.github 是 RongleCat，但这个 PR 是 alice 提的。新投的 Bot 只能署你自己的 GitHub 账号`)
})

it('新 Bot 只填昵称、没填 github 时放行', () => {
  put(newBot, by())
  commit()
  expect(checkAs('alice').status).toBe(0)
})

it.each(['社区投稿', '本站编队'])('新增%s小队署了别人的账号，报错并提示改法', (origin) => {
  put(newSquad, `origin: ${origin}\n` + by('RongleCat'))
  commit()
  const result = checkAs('alice')
  expect(result.status).toBe(1)
  expect(result.stderr).toContain(`${newSquad}：author.github 是 RongleCat，但这个 PR 是 alice 提的。新投的小队请署你自己的 GitHub 账号`)
})

it('原作者成套的小队异名放行，标准输出有一行核对警告和成功提示', () => {
  put(newSquad, 'origin: 原作者成套\n' + by('RongleCat'))
  commit()
  const result = checkAs('alice')
  expect(result.status).toBe(0)
  expect(result.stdout.split('\n').filter(line => line.startsWith('⚠'))).toEqual([
    `⚠ ${newSquad}：作者 RongleCat 不是 PR 作者 alice，维护者要核对这确实是 RongleCat 成套发布的小队；合并后它会出现在 RongleCat 的作者主页上。`,
  ])
  expect(result.stdout).toContain('✓ PR 范围检查通过')
  expect(result.stderr).toBe('')
})

it.each(['true', undefined])('GITHUB_ACTIONS=%s：只在 Actions 输出单行转义注释', (actions) => {
  vi.stubEnv('GITHUB_ACTIONS', actions)
  try {
    put(newSquad, 'origin: 原作者成套\n' + by(JSON.stringify('Cat%\r\nDog')))
    commit()
    const result = checkAs('alice')
    expect(result.status).toBe(0)
    const stdout = result.stdout.split('\n')
    const lines = stdout.filter(line => line.startsWith('::warning'))
    const author = 'Cat%25\\r\\nDog'
    expect(lines).toEqual(actions ? [
      `::warning file=${newSquad},title=小队作者不是 PR 作者::${newSquad}：作者 ${author} 不是 PR 作者 alice，维护者要核对这确实是 ${author} 成套发布的小队；合并后它会出现在 ${author} 的作者主页上。`,
    ] : [])
    if (actions) {
      const [annotation] = lines
      const decoded = annotation.slice(annotation.indexOf('::', 2) + 2)
        .replaceAll('%0A', '\n').replaceAll('%0D', '\r').replaceAll('%25', '%')
      expect(decoded).toBe(stdout.find(line => line.startsWith('⚠ '))?.slice(2))
    }
  } finally { vi.unstubAllEnvs() }
})

it('维护者可收录其他作者的新 Bot', () => {
  put(newBot, by('RongleCat'))
  commit()
  expect(checkAs('alice', 'MEMBER').status).toBe(0)
})

it.each([
  ['Bot-Zhipin-Submit[bot]', 'CONTRIBUTOR'],
  ['github-actions[bot]', 'NONE'],
])('白名单内的 %s 可代投稿人署名', (bot, association) => {
  put(newBot, by('alice'))
  commit()
  expect(checkAs(bot, association, appBots).status).toBe(0)
})

it('账号只是白名单机器人的前缀时仍核对新增署名', () => {
  put(newBot, by('alice'))
  commit()
  const result = checkAs('bot-zhipin-submit', 'NONE', appBots)
  expect(result.status).toBe(1)
  expect(result.stderr).toContain(`${newBot}：author.github 是 alice`)
})

it('机器人只跳过新增署名检查，越界、修改原日期与账号仍报错', () => {
  put(newBot, by('alice'))
  put('outside.md', '越界')
  put(file, yaml('Bob').replace('2026-11-01', '2026-11-02'))
  commit()
  const result = checkAs('github-actions[bot]', 'NONE', appBots)
  expect(result.status).toBe(1)
  expect(result.stderr).toContain('越界文件："outside.md"')
  expect(result.stderr).toContain(`${file}：addedAt 是上架日期，不能修改`)
  expect(result.stderr).toContain(`${file}：author.github 是投稿人的 GitHub 账号，不能修改`)
  expect(result.stderr).not.toContain(newBot)
})

it.each([
  ['未传', []],
  ['空串', ['--pr-author', '']],
])('--pr-author %s：不核对新小队的作者', (_, args) => {
  put(newSquad, 'origin: 社区投稿\n' + by('RongleCat'))
  commit()
  expect(check('CONTRIBUTOR', 'HEAD^1', 'HEAD', '--app-bots', appBots, ...args).status).toBe(0)
})

it('修改已有 Bot 时不要求 PR 作者就是条目作者', () => {
  put(file, yaml() + 'tagline: 新介绍\n')
  commit()
  expect(checkAs('bob').status).toBe(0)
})

it.each([
  ['语法错误', newBot, 'author: ['],
  ['顶层不是映射', newSquad, '- Alice\n'],
  ['账号不是字符串', newBot, 'author: {github: 123}\n'],
])('新增 YAML %s：报告文件、无法核对的字段和改法', (_, path, text) => {
  put(path, text)
  commit()
  const result = checkAs('alice')
  expect(result.status).toBe(1)
  expect(result.stderr).toContain(`${path}：无法核对 author.github；请使用合法的 YAML 映射`)
})

it('一个 PR 新增多个条目时只报冒名的那个', () => {
  put(newBot, by('alice'))
  const wrong = 'bots/other-bot/bot.yaml'
  put(wrong, by('RongleCat'))
  put(newSquad, 'origin: 社区投稿\n' + by('ALICE'))
  commit()
  const result = checkAs('alice')
  expect(result.status).toBe(1)
  expect(result.stderr.trim().split('\n')).toEqual([
    '✗ PR 范围检查未通过：', expect.stringContaining(`${wrong}：author.github 是 RongleCat，但这个 PR 是 alice 提的`),
  ])
})
