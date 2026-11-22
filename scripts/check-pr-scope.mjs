// 在当前目录的仓库比较两个提交，不读取工作区文件，不执行投稿内容。
import { execFileSync } from 'node:child_process'
import { resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import { parseArgs } from 'node:util'
import YAML from 'yaml'

const trusted = new Set(['OWNER', 'MEMBER', 'COLLABORATOR'])
const botFile = /^bots\/[a-z0-9]+(?:-[a-z0-9]+)*\/.+$/
// 小队只有一个文件：squads/<slug>/squad.yaml。
const squadFile = /^squads\/[a-z0-9]+(?:-[a-z0-9]+)*\/squad\.yaml$/
const git = (...args) => execFileSync('git', args, { encoding: 'utf8', maxBuffer: 16 * 1024 * 1024, stdio: ['ignore', 'pipe', 'pipe'] })

function readEntry(commit, file) {
  const doc = YAML.parseDocument(git('show', `${commit}:${file}`))
  if (doc.errors.length || !YAML.isMap(doc.contents)) throw new Error('不是合法的 YAML 映射')
  return doc.toJS()
}

function addedAt(commit, file) {
  const date = readEntry(commit, file).addedAt
  if (typeof date !== 'string') throw new Error('无法比较 addedAt')
  return date
}

function githubLogin(data) {
  const login = data.author?.github
  if (login != null && typeof login !== 'string') throw new Error('无法读取 author.github')
  return login ?? null
}

function authorGithub(commit, file) {
  return githubLogin(readEntry(commit, file))?.toLowerCase()
}

const escapeMessage = text => text.replaceAll('%', '%25').replaceAll('\r', '%0D').replaceAll('\n', '%0A')
const escapeProperty = text => escapeMessage(text).replaceAll(',', '%2C').replaceAll(':', '%3A')

function checkNewAuthor(commit, file, prAuthor, errors) {
  let entry, login
  try {
    entry = readEntry(commit, file)
    login = githubLogin(entry)
  } catch {
    errors.push(`${file}：无法核对 author.github；请使用合法的 YAML 映射，author.github 应填 GitHub 账号字符串，没有就省略。`)
    return
  }
  if (!login || login.toLowerCase() === prAuthor.toLowerCase()) return
  // 投稿还没过 schema 校验；不要让账号里的换行或控制字符进入 CI 日志。
  const author = JSON.stringify(login).slice(1, -1)
  const isSquad = file.startsWith('squads/')
  if (isSquad && entry.origin === '原作者成套') {
    const message = (name, proposer) => `${file}：作者 ${name} 不是 PR 作者 ${proposer}，维护者要核对这确实是 ${name} 成套发布的小队；合并后它会出现在 ${name} 的作者主页上。`
    const text = message(author, JSON.stringify(prAuthor).slice(1, -1))
    console.log(`⚠ ${text}`)
    if (process.env.GITHUB_ACTIONS === 'true') {
      console.log(`::warning file=${escapeProperty(file)},title=${escapeProperty('小队作者不是 PR 作者')}::${escapeMessage(text)}`)
    }
    return
  }
  const fix = isSquad ? '新投的小队请署你自己的 GitHub 账号；收录别人的小队请联系维护者核对来源。' : '新投的 Bot 只能署你自己的 GitHub 账号；收录别人的 Bot 请联系维护者。'
  errors.push(`${file}：author.github 是 ${author}，但这个 PR 是 ${prAuthor} 提的。${fix}`)
}

export function checkPrScope({ base, head, association, prAuthor = '', appBots = '' }) {
  if (trusted.has(association)) return []
  // 两种代投机器人已在各自的入口绑定投稿人；和无 PR 的手动派发一样，只跳过新增署名核对。
  const botLogins = appBots.toLowerCase().split(',').map(login => login.trim())
  const verifyNewAuthor = prAuthor !== '' && !botLogins.includes(prAuthor.toLowerCase())
  // 先解析为提交哈希，拒绝选项注入；只接受提交而非工作区或任意 diff 参数。
  const baseCommit = git('rev-parse', '--verify', '--end-of-options', `${base}^{commit}`).trim()
  const headCommit = git('rev-parse', '--verify', '--end-of-options', `${head}^{commit}`).trim()
  // 禁用重命名推断：移动越界文件时，旧路径的删除也必须接受范围检查。
  const entries = git('diff', '--name-status', '-z', '--no-renames', baseCommit, headCommit, '--').split('\0')
  const errors = []
  for (let i = 0; i < entries.length - 1; i += 2) {
    const status = entries[i], file = entries[i + 1]
    const slug = file.split('/')[1] || ''
    const validLength = slug.length >= 2 && slug.length <= 40
    if (/^(prompts|skills)\//.test(file)) {
      errors.push(`越界文件：${JSON.stringify(file)}；prompts/、skills/ 只由维护者修改。`)
      continue
    }
    if (file.startsWith('squads/')) {
      if (!squadFile.test(file) || !validLength) {
        errors.push(`越界文件：${JSON.stringify(file)}；投稿小队只能新增或修改 squads/<slug>/squad.yaml 这一个文件，小队文件夹里不能放别的东西。`)
        continue
      }
    } else if (!botFile.test(file) || !validLength) {
      errors.push(`越界文件：${JSON.stringify(file)}；外部投稿只能修改 bots/<slug>/ 和 squads/<slug>/squad.yaml，不能修改 bots/_template/、bots/LICENSE、curation/ 或其他文件。`)
      continue
    }
    if (file !== `bots/${slug}/bot.yaml` && file !== `squads/${slug}/squad.yaml`) continue
    if (status === 'A' && verifyNewAuthor) checkNewAuthor(headCommit, file, prAuthor, errors)
    // 已上架的 Bot 和小队：上架日期和投稿人账号都不能改。
    if (status !== 'A' && status !== 'D') {
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
    const { values } = parseArgs({ options: {
      base: { type: 'string' }, head: { type: 'string' }, association: { type: 'string' },
      'pr-author': { type: 'string' }, 'app-bots': { type: 'string' },
    } })
    const { base, head, association, 'pr-author': prAuthor, 'app-bots': appBots } = values
    if (!base || !head || !association) throw new Error('缺少参数')
    const errors = checkPrScope({ base, head, association, prAuthor, appBots })
    if (errors.length) {
      console.error(`✗ PR 范围检查未通过：\n${errors.join('\n')}`)
      process.exitCode = 1
    } else {
      console.log(`✓ PR 范围检查通过：${trusted.has(association) ? '维护者不受投稿范围限制' : '改动均在允许的 Bot 目录和小队文件内，已有 addedAt 未改动，作者未改动'}。`)
    }
  } catch {
    console.error('✗ 无法检查 PR 范围。请在 git 仓库中运行，确保两个提交可读。\n用法：node scripts/check-pr-scope.mjs --base <ref> --head <ref> --association <GitHub author_association> [--pr-author <login>] [--app-bots <逗号分隔的 login 列表>]')
    process.exitCode = 1
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) main()
