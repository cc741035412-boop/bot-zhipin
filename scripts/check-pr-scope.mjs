// 在当前目录的仓库比较两个提交，不读取工作区文件，不执行投稿内容。
import { execFileSync } from 'node:child_process'
import { resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import { parseArgs } from 'node:util'
import YAML from 'yaml'

const trusted = new Set(['OWNER', 'MEMBER', 'COLLABORATOR'])
const botFile = /^bots\/[a-z0-9]+(?:-[a-z0-9]+)*\/.+$/
const git = (...args) => execFileSync('git', args, { encoding: 'utf8', maxBuffer: 16 * 1024 * 1024, stdio: ['ignore', 'pipe', 'pipe'] })

function addedAt(commit, file) {
  const doc = YAML.parseDocument(git('show', `${commit}:${file}`))
  const data = doc.errors.length ? null : doc.toJS()
  if (!data || typeof data !== 'object' || Array.isArray(data) || typeof data.addedAt !== 'string') {
    throw new Error('无法比较 addedAt')
  }
  return data.addedAt
}

function authorGithub(commit, file) {
  const doc = YAML.parseDocument(git('show', `${commit}:${file}`))
  const data = doc.errors.length ? null : doc.toJS()
  if (!data || typeof data !== 'object' || Array.isArray(data)) throw new Error('无法比较 author.github')
  const author = data.author?.github
  if (author == null) return null
  if (typeof author !== 'string') throw new Error('无法比较 author.github')
  return author.toLowerCase()
}

export function checkPrScope({ base, head, association }) {
  if (trusted.has(association)) return []
  // 先解析为提交哈希，拒绝选项注入；只接受提交而非工作区或任意 diff 参数。
  const baseCommit = git('rev-parse', '--verify', '--end-of-options', `${base}^{commit}`).trim()
  const headCommit = git('rev-parse', '--verify', '--end-of-options', `${head}^{commit}`).trim()
  // 禁用重命名推断：移动越界文件时，旧路径的删除也必须接受范围检查。
  const entries = git('diff', '--name-status', '-z', '--no-renames', baseCommit, headCommit, '--').split('\0')
  const errors = []
  for (let i = 0; i < entries.length - 1; i += 2) {
    const status = entries[i], file = entries[i + 1]
    const slug = file.split('/')[1] || ''
    if (!botFile.test(file) || slug.length < 2 || slug.length > 40) {
      errors.push(`越界文件：${JSON.stringify(file)}；外部投稿只能修改 bots/<slug>/，不能修改 bots/_template/、bots/LICENSE 或其他文件。`)
      continue
    }
    if (file === `bots/${slug}/bot.yaml` && status !== 'A' && status !== 'D') {
      try {
        if (addedAt(baseCommit, file) !== addedAt(headCommit, file)) {
          errors.push(`${file}：addedAt 是上架日期，不能修改；请保留 base 中的日期。`)
        }
      } catch {
        errors.push(`${file}：无法比较 addedAt；addedAt 是上架日期，不能修改，请保持合法 YAML 和原日期。`)
      }
      try {
        if (authorGithub(baseCommit, file) !== authorGithub(headCommit, file)) {
          errors.push(`${file}：author.github 是投稿人的 GitHub 账号，不能修改；请保留 base 中的账号。`)
        }
      } catch {
        errors.push(`${file}：无法比较 author.github；author.github 是投稿人的 GitHub 账号，不能修改，请保持合法 YAML 和原账号。`)
      }
    }
  }
  return errors
}

function main() {
  try {
    const { values } = parseArgs({ options: { base: { type: 'string' }, head: { type: 'string' }, association: { type: 'string' } } })
    if (!values.base || !values.head || !values.association) throw new Error('缺少参数')
    const errors = checkPrScope(values)
    if (errors.length) {
      console.error(`✗ PR 范围检查未通过：\n${errors.join('\n')}`)
      process.exitCode = 1
    } else {
      console.log(`✓ PR 范围检查通过：${trusted.has(values.association) ? '维护者不受投稿范围限制' : '改动均在允许的 Bot 目录内，已有 addedAt 未改动，作者未改动'}。`)
    }
  } catch {
    console.error('✗ 无法检查 PR 范围。请在 git 仓库中运行，确保两个提交可读。\n用法：node scripts/check-pr-scope.mjs --base <ref> --head <ref> --association <GitHub author_association>')
    process.exitCode = 1
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) main()
