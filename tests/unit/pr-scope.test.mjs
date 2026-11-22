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
  expect(scope).toMatchObject({
    env: {
      ASSOCIATION: "${{ github.event_name == 'pull_request' && github.event.pull_request.author_association || 'CONTRIBUTOR' }}",
      PR_AUTHOR: "${{ github.event_name == 'pull_request' && github.event.pull_request.user.login || '' }}",
      APP_BOTS: "${{ vars.SUBMIT_APP_BOT_LOGIN || 'bot-zhipin-submit[bot]' }},github-actions[bot]",
    },
    run: 'node scripts/check-pr-scope.mjs --base HEAD^1 --head HEAD --association "$ASSOCIATION" --pr-author "$PR_AUTHOR" --app-bots "$APP_BOTS"',
  })
  expect(steps.indexOf(scope)).toBeLessThan(steps.findIndex((step) => step.run === 'npm run validate'))
})

it.each(['prompts/my-prompt.yaml', 'skills/my-skill.yaml'])('%s 新增、修改、删除只有维护者放行', (file) => {
  for (const text of ['slug: test', 'slug: test\n', null]) {
    if (text === null) rmSync(join(directory, file))
    else put(file, text)
    commit()
    const result = check()
    expect(result.status).toBe(1)
    expect(result.stderr).toContain(`${JSON.stringify(file)}；prompts/、skills/ 只由维护者修改`)
    expect(check('MEMBER').status).toBe(0)
  }
})

// ---- V5：小队投稿范围。贡献者只能新增或修改 squads/<slug>/squad.yaml 这一个文件；curation/ 只有维护者能动。 ----
const squadYaml = (extra = '') => `slug: my-squad\naddedAt: 2026-11-10\nauthor:\n  name: Alice\n  github: Alice\n${extra}`

it('新增小队、修改已有小队的正文都放行', () => {
  put('squads/old-squad/squad.yaml', squadYaml().replace('my-squad', 'old-squad'))
  commit()
  put('squads/my-squad/squad.yaml', squadYaml())
  put('squads/old-squad/squad.yaml', squadYaml('name: 改了名字\n').replace('my-squad', 'old-squad'))
  commit()
  const result = check()
  expect(result.status).toBe(0)
  expect(result.stdout).toContain('PR 范围检查通过')
  expect(result.stdout).toContain('Bot 目录和小队文件内')
})

it('小队和 Bot 可以放在同一个 PR 里', () => {
  put('squads/my-squad/squad.yaml', squadYaml())
  put('bots/new-bot/bot.yaml', 'slug: new-bot\naddedAt: 2026-11-14\n')
  commit()
  expect(check().status).toBe(0)
})

it.each([
  'squads/my-squad/README.md',
  'squads/my-squad/assets/cover.png',
  'squads/my-squad/squad.yml',
  'squads/my-squad/nested/squad.yaml',
  'squads/squad.yaml',
  'squads/README.md',
  'squads/_template/squad.yaml',
  'squads/My_Squad/squad.yaml',
  'squads/a/squad.yaml',
  `squads/${'a'.repeat(41)}/squad.yaml`,
])('小队文件夹里只认 squad.yaml：%s 被拦下', (file) => {
  put('squads/my-squad/squad.yaml', squadYaml())
  put(file, '多余的东西')
  commit()
  const result = check()
  expect(result.status).toBe(1)
  expect(result.stderr).toContain(JSON.stringify(file))
  expect(result.stderr).toContain('投稿小队只能新增或修改 squads/<slug>/squad.yaml 这一个文件')
  expect(result.stderr).not.toContain('"squads/my-squad/squad.yaml"')
})

it('策展文件只有维护者能动：贡献者新增、修改、删除都被拦下，维护者放行', () => {
  put('curation/shelf.yaml', 'picks: []\n')
  commit()
  put('curation/shelf.yaml', 'picks: [old-bot]\n')
  put('curation/extra.yaml', '新文件')
  commit()
  const changed = check()
  expect(changed.status).toBe(1)
  expect(changed.stderr).toContain('"curation/shelf.yaml"')
  expect(changed.stderr).toContain('"curation/extra.yaml"')
  expect(changed.stderr).toContain('不能修改 bots/_template/、bots/LICENSE、curation/ 或其他文件')
  expect(check('OWNER').status).toBe(0)
  rmSync(join(directory, 'curation/shelf.yaml'))
  commit()
  expect(check().stderr).toContain('"curation/shelf.yaml"')
})

it('已有小队的 addedAt 不能改；日期没变只改写法放行', () => {
  put('squads/my-squad/squad.yaml', squadYaml())
  commit()
  put('squads/my-squad/squad.yaml', squadYaml().replace('addedAt: 2026-11-10', 'addedAt: "2026-11-10" # 原日期'))
  commit()
  expect(check().status).toBe(0)
  put('squads/my-squad/squad.yaml', squadYaml().replace('2026-11-10', '2026-11-14'))
  commit()
  const result = check()
  expect(result.status).toBe(1)
  expect(result.stderr).toContain('squads/my-squad/squad.yaml：addedAt 是上架日期，不能修改；请保留 base 中的日期。')
})

it('已有小队的 author.github 不能改、不能删、不能后补；只改大小写放行', () => {
  put('squads/my-squad/squad.yaml', squadYaml())
  commit()
  put('squads/my-squad/squad.yaml', squadYaml().replace('github: Alice', 'github: aLiCe'))
  commit()
  expect(check().status).toBe(0)
  put('squads/my-squad/squad.yaml', squadYaml().replace('github: Alice', 'github: Bob'))
  commit()
  expect(check().stderr).toContain('squads/my-squad/squad.yaml：author.github 是投稿人的 GitHub 账号，不能修改；请保留 base 中的账号。')
  put('squads/my-squad/squad.yaml', squadYaml().replace('  github: Alice\n', ''))
  commit()
  expect(check().stderr).toContain('squads/my-squad/squad.yaml：author.github 是投稿人的 GitHub 账号，不能修改')
  put('squads/my-squad/squad.yaml', squadYaml())
  commit()
  expect(check().stderr).toContain('squads/my-squad/squad.yaml：author.github 是投稿人的 GitHub 账号，不能修改')
})

it.each(['slug: my-squad\n', 'addedAt: [坏 YAML'])('删掉 addedAt 或写坏 YAML 不能绕过小队的日期保护', (text) => {
  put('squads/my-squad/squad.yaml', squadYaml())
  commit()
  put('squads/my-squad/squad.yaml', text)
  commit()
  const result = check()
  expect(result.status).toBe(1)
  expect(result.stderr).toContain('squads/my-squad/squad.yaml：无法比较 addedAt')
})

it('删除已有小队放行；把小队文件改名挪到别处，新旧路径都检查', () => {
  put('squads/my-squad/squad.yaml', squadYaml())
  commit()
  renameSync(join(directory, 'squads/my-squad/squad.yaml'), join(directory, 'squads/my-squad/team.yaml'))
  commit()
  const moved = check()
  expect(moved.status).toBe(1)
  expect(moved.stderr).toContain('"squads/my-squad/team.yaml"')
  rmSync(join(directory, 'squads'), { recursive: true })
  commit()
  expect(check('CONTRIBUTOR', 'HEAD~2').status).toBe(0)
})

it.each(['OWNER', 'MEMBER', 'COLLABORATOR'])('%s 改小队日期、作者、放别的文件都不受限', (association) => {
  put('squads/my-squad/squad.yaml', squadYaml())
  commit()
  put('squads/my-squad/squad.yaml', squadYaml().replace('2026-11-10', '2026-11-14').replace('github: Alice', 'github: Bob'))
  put('squads/my-squad/cover.png', '图')
  commit()
  expect(check(association).status).toBe(0)
})
