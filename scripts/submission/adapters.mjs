// 特权操作仅在这里；投稿内容不进入 shell，不执行其文件、模板或脚本。
import { execFileSync } from 'node:child_process'
import { lstatSync, mkdirSync, readFileSync, readdirSync, realpathSync, rmSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { validateBots } from '../lib/validate/index.mjs'
import { fetchTemplateMeta } from '../lib/template-meta.mjs'
import { assertFileSet, assertPath, assertSlug } from './bundle.mjs'
import { COMMENT_MARKER, fail, SubmissionError } from './errors.mjs'
import { checkOwnership, parseBotMetadata } from './issue.mjs'
import { downloadImage } from './screenshots.mjs'

function assertRepo(repo) {
  if (typeof repo !== 'string' || !/^[A-Za-z0-9][A-Za-z0-9_.-]*\/[A-Za-z0-9][A-Za-z0-9_.-]*$/.test(repo) || repo.includes('..')) throw new Error('仓库无效')
}
function assertBranch(branch) {
  if (typeof branch !== 'string' || !/^[A-Za-z0-9][A-Za-z0-9_./-]*$/.test(branch) || branch.includes('..') ||
      branch.split('/').some((part) => !part || part.startsWith('.') || part.endsWith('.') || part.endsWith('.lock'))) throw new Error('分支无效')
}
function assertSubmissionBranch(branch) {
  if (!/^submission\/issue-[1-9]\d*$/.test(branch)) throw new Error('投稿分支无效')
}
function assertNumber(value) {
  if (!/^[1-9]\d*$/.test(String(value)) || !Number.isSafeInteger(Number(value))) throw new Error('编号无效')
}

function assertTree(path) {
  const stat = lstatSync(path, { throwIfNoEntry: false })
  if (!stat) return
  if (stat.isSymbolicLink() || (!stat.isFile() && !stat.isDirectory())) {
    fail('bots/', '文件类型', '不允许符号链接或特殊文件。', '请维护者检查现有目录；投稿只能使用普通文件和目录。')
  }
  if (stat.isDirectory()) for (const name of readdirSync(path)) assertTree(join(path, name))
}

export function scopeErrors(paths, slug) {
  assertSlug(slug)
  return paths.filter((path) => !path.startsWith(`bots/${slug}/`) || path.split('/').includes('..')).map((path) => ({
    file: JSON.stringify(path), where: '投稿范围', problem: '越界文件：本次只能修改一个 bots/<slug>/ 目录。',
    fix: '删除其他目录的改动；不要修改模板、网站、工作流或其他作者的 Bot。',
  }))
}

/** run 可替换，所有 git/gh 调用都是固定命令 + 参数数组；绝不打印内部命令输出。 */
export function createAdapters({ root, repo, defaultBranch, run, fetchImpl = fetch }) {
  assertRepo(repo)
  assertBranch(defaultBranch)
  root = realpathSync(root)
  const execute = run || ((file, args, options) => execFileSync(file, args, options))
  const command = (file, args, options = {}) => execute(file, args, {
    cwd: root, encoding: 'utf8', timeout: 60_000, maxBuffer: 8 * 1024 * 1024,
    stdio: ['pipe', 'pipe', 'pipe'], ...options,
  }).trimEnd()
  const git = (...args) => command('git', args)
  const gh = (...args) => command('gh', args)
  const json = (...args) => JSON.parse(gh(...args))
  const botsDir = join(root, 'bots')
  let baseCommit
  const botDir = (slug) => {
    assertSlug(slug)
    const bots = lstatSync(botsDir, { throwIfNoEntry: false })
    if (!bots?.isDirectory() || bots.isSymbolicLink()) throw new Error('bots 不是普通目录')
    const dir = join(botsDir, slug)
    assertTree(dir)
    return dir
  }
  const readExisting = (slug) => {
    const dir = botDir(slug)
    if (!lstatSync(dir, { throwIfNoEntry: false })) return null
    const yaml = join(dir, 'bot.yaml')
    if (!lstatSync(yaml, { throwIfNoEntry: false })?.isFile()) return {}
    return parseBotMetadata(readFileSync(yaml, 'utf8'), slug)
  }
  const checkScope = (slug) => {
    const tracked = git('diff', '--name-only', '-z', '--no-renames', baseCommit, '--').split('\0').filter(Boolean)
    const untracked = git('ls-files', '--others', '--exclude-standard', '-z').split('\0').filter(Boolean)
    return scopeErrors([...tracked, ...untracked], slug)
  }
  return {
    context: { repo, defaultBranch, template: readFileSync(join(root, '.github/pull_request_template.md'), 'utf8') },
    templateMeta: id => fetchTemplateMeta(id, { fetch: fetchImpl }),
    assertClean() {
      if (git('status', '--porcelain=v1', '-z', '--untracked-files=all')) throw new Error('签出目录不干净')
      baseCommit = git('rev-parse', '--verify', 'HEAD')
      if (!/^[a-f0-9]{40,64}$/.test(baseCommit)) throw new Error('默认分支提交无效')
    },
    readExisting,
    download: (url) => downloadImage(url, { fetchImpl }),
    writeFiles(plan, { update, submission }) {
      const dir = botDir(plan.slug)
      // 在删除之前再次校验身份与 addedAt，绝不删除别人占用的目录。
      const actualUpdate = checkOwnership(submission, readExisting(plan.slug))
      if (actualUpdate !== update) throw new Error('目录状态已变化')
      assertFileSet(Object.keys(plan.files))
      for (const path of Object.keys(plan.files)) assertPath(path, plan.slug)
      if (update) rmSync(dir, { recursive: true })
      mkdirSync(dir, { recursive: true })
      for (const [path, contents] of Object.entries(plan.files)) {
        const target = join(root, path)
        mkdirSync(dirname(target), { recursive: true })
        writeFileSync(target, contents, { flag: 'wx', mode: 0o644 })
      }
    },
    validate: () => validateBots({ botsDir }),
    checkScope,
    publish(plan, details) {
      assertSlug(plan.slug)
      assertSubmissionBranch(details.branch)
      if (details.base !== defaultBranch || !baseCommit) throw new Error('提交基线无效')
      const errors = checkScope(plan.slug)
      if (errors.length) throw new SubmissionError(errors)
      git('checkout', '-B', details.branch, baseCommit)
      // 允许的文本名可能命中根 .gitignore（如技能内 node_modules）；只强制加入这个已校验目录。
      git('add', '--force', '--', `bots/${plan.slug}/`)
      const env = {
        ...process.env,
        GIT_AUTHOR_NAME: details.author.name, GIT_AUTHOR_EMAIL: details.author.email,
        GIT_COMMITTER_NAME: details.committer.name, GIT_COMMITTER_EMAIL: details.committer.email,
      }
      command('git', ['-c', 'core.hooksPath=/dev/null', '-c', 'commit.gpgsign=false', 'commit', '--allow-empty', '-m', details.message], { env })
      git('push', '--force', 'origin', `HEAD:refs/heads/${details.branch}`)
      // gh pr list 的 --head 不支持 owner:branch；额外核对非 fork 来源，避免同名分支冒充。
      const prs = json('pr', 'list', '--repo', repo, '--head', details.branch, '--base', defaultBranch, '--state', 'open', '--limit', '100', '--json', 'number,url,isCrossRepository,headRefName')
      const previous = prs.find((pr) => pr.isCrossRepository === false && pr.headRefName === details.branch)
      let url
      if (previous) {
        assertNumber(previous.number)
        url = previous.url
        gh('pr', 'edit', String(previous.number), '--repo', repo, '--title', details.title, '--body', details.body)
      } else {
        url = gh('pr', 'create', '--repo', repo, '--base', defaultBranch, '--head', details.branch, '--title', details.title, '--body', details.body)
      }
      if (!url.startsWith(`https://github.com/${repo}/pull/`) || !/\/pull\/[1-9]\d*$/.test(url)) throw new Error('PR 地址无效')
      return url
    },
    dispatch(branch) {
      assertSubmissionBranch(branch)
      gh('workflow', 'run', 'ci.yml', '--repo', repo, '--ref', branch)
    },
    comment(number, body) {
      assertNumber(number)
      const endpoint = `repos/${repo}/issues/${number}/comments`
      const pages = json('api', '--paginate', '--slurp', `${endpoint}?per_page=100`)
      // 隐藏标记不是身份凭据；只编辑本工作流账号此前发的标记评论。
      const previous = pages.flat().find((comment) => comment.user?.login === 'github-actions[bot]' && comment.user?.type === 'Bot' && comment.body?.startsWith(COMMENT_MARKER))
      if (previous) assertNumber(previous.id)
      command('gh', ['api', '--method', previous ? 'PATCH' : 'POST', previous ? `repos/${repo}/issues/comments/${previous.id}` : endpoint, '--input', '-'], { input: JSON.stringify({ body }) })
    },
  }
}
