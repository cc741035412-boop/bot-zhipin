import { afterEach, beforeEach, expect, it } from 'vitest'
import { execFileSync, spawnSync } from 'node:child_process'
import { mkdirSync, mkdtempSync, readFileSync, renameSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import YAML from 'yaml'
import { ROOT } from '../../scripts/lib/load-bots.mjs'

let directory
// 临时测试仓库使用一次性进程环境身份，不依赖 CI 的 git 全局配置，也不修改配置文件。
const git = (...args) => execFileSync('git', args, {
  cwd: directory, encoding: 'utf8', timeout: 10_000,
  env: { ...process.env, GIT_AUTHOR_NAME: 'Scope Test', GIT_AUTHOR_EMAIL: 'scope@example.invalid', GIT_COMMITTER_NAME: 'Scope Test', GIT_COMMITTER_EMAIL: 'scope@example.invalid' },
})
function put(file, text) {
  mkdirSync(dirname(join(directory, file)), { recursive: true })
  writeFileSync(join(directory, file), text)
}
function commit() {
  git('add', '.')
  git('-c', 'commit.gpgsign=false', 'commit', '-qm', 'test snapshot')
}
function check(association = 'CONTRIBUTOR', base = 'HEAD^1', head = 'HEAD') {
  return spawnSync(process.execPath, [join(ROOT, 'scripts/check-pr-scope.mjs'), '--base', base, '--head', head, '--association', association], {
    cwd: directory, encoding: 'utf8', timeout: 10_000,
  })
}
beforeEach(() => {
  directory = mkdtempSync(join(tmpdir(), 'bot-scope-'))
  git('init', '-q')
  put('bots/old-bot/bot.yaml', 'slug: old-bot\naddedAt: 2026-11-01\n')
  put('bots/old-bot/ROLE.md', '原岗位')
  put('bots/_template/bot.yaml', '模板')
  put('bots/LICENSE', '许可')
  put('site/page.md', '页面')
  commit()
})
afterEach(() => rmSync(directory, { recursive: true, force: true }))

it.each(['OWNER', 'MEMBER', 'COLLABORATOR'])('%s 直接通过，不限制改动也不读取提交', (association) => {
  const result = check(association, 'absent', 'absent')
  expect(result.status).toBe(0)
  expect(result.stdout).toContain('维护者不受投稿范围限制')
})

it.each(['CONTRIBUTOR', 'FIRST_TIME_CONTRIBUTOR', 'FIRST_TIMER', 'NONE', 'owner'])('%s 投稿新增和修改正文通过', (association) => {
  put('bots/new-bot/bot.yaml', 'slug: new-bot\naddedAt: 2026-11-14\n')
  put('bots/old-bot/ROLE.md', '新岗位')
  put('bots/old-bot/bot.yaml', 'slug: old-bot\nname: 新名字\naddedAt: 2026-11-01\n')
  commit()
  const result = check(association)
  expect(result.status).toBe(0)
  expect(result.stdout.trim().split('\n')).toHaveLength(1)
  expect(result.stdout).toContain('PR 范围检查通过')
})

it('范围检查在当前仓库比较提交，列出全部越界文件且不漏删改', () => {
  put('site/page.md', '改页面')
  put('.github/workflows/new.yml', '越界')
  put('bots/_template/bot.yaml', '改模板')
  rmSync(join(directory, 'bots/LICENSE'))
  put('bots/root.txt', '不在 Bot 文件夹内')
  commit()
  const result = check()
  expect(result.status).toBe(1)
  for (const file of ['site/page.md', '.github/workflows/new.yml', 'bots/_template/bot.yaml', 'bots/LICENSE', 'bots/root.txt']) {
    expect(result.stderr).toContain(file)
  }
})

it('重命名越界文件为 Bot 文件仍检查旧路径', () => {
  renameSync(join(directory, 'site/page.md'), join(directory, 'bots/old-bot/moved.md'))
  commit()
  expect(check().stderr).toContain('site/page.md')
})

it('修改已有 addedAt 失败，日期相同只改 YAML 格式通过', () => {
  put('bots/old-bot/bot.yaml', 'slug: old-bot\naddedAt: "2026-11-01" # 保持原日期\n')
  commit()
  expect(check().status).toBe(0)
  put('bots/old-bot/bot.yaml', 'slug: old-bot\naddedAt: 2026-11-14\n')
  commit()
  const result = check()
  expect(result.status).toBe(1)
  expect(result.stderr).toContain('addedAt 是上架日期，不能修改')
})

it.each(['slug: old-bot\n', 'addedAt: [坏 YAML'])('删除 addedAt 或破坏 YAML 不能绕过日期保护', (text) => {
  put('bots/old-bot/bot.yaml', text)
  commit()
  expect(check().status).toBe(1)
  expect(check().stderr).toContain('addedAt')
})

it('删除已有 Bot 允许；工作区未提交的越界改动不参与比较', () => {
  rmSync(join(directory, 'bots/old-bot'), { recursive: true })
  commit()
  put('site/page.md', '未提交内容')
  expect(check().status).toBe(0)
})

it('ref 不存在或形似 git 选项时中文失败，不接受工作区替代提交', () => {
  for (const base of ['absent', '--help']) {
    const result = check('CONTRIBUTOR', base)
    expect(result.status).toBe(1)
    expect(result.stderr).toContain('确保两个提交可读')
  }
})

it('CI 只读 PR/手动派发，拉取两层历史并按首父严格检查范围', () => {
  const workflow = YAML.parse(readFileSync(join(ROOT, '.github/workflows/ci.yml'), 'utf8'))
  expect(Object.keys(workflow.on)).toEqual(['pull_request', 'workflow_dispatch'])
  expect(workflow.permissions).toEqual({ contents: 'read' })
  const steps = workflow.jobs['validate-and-build'].steps
  const checkout = steps.find((step) => step.uses?.startsWith('actions/checkout@'))
  expect(checkout.with).toMatchObject({ 'fetch-depth': 2, 'persist-credentials': false })
  const scope = steps.find((step) => step.run?.includes('check-pr-scope.mjs'))
  expect(scope.run).toBe('node scripts/check-pr-scope.mjs --base HEAD^1 --head HEAD --association "${{ github.event_name == \'pull_request\' && github.event.pull_request.author_association || \'CONTRIBUTOR\' }}"')
  expect(steps.indexOf(scope)).toBeLessThan(steps.findIndex((step) => step.run === 'npm run validate'))
})
