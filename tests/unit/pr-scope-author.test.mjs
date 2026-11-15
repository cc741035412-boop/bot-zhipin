import { afterEach, beforeEach, expect, it } from 'vitest'
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
function check(association = 'CONTRIBUTOR', base = 'HEAD^1', head = 'HEAD') {
  return spawnSync(process.execPath, [script, '--base', base, '--head', head, '--association', association], {
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
