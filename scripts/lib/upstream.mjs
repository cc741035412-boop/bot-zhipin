import { lookupVersion } from './template-meta.mjs'

async function scan(items, check) {
  const results = new Array(items.length)
  let next = 0
  async function worker() {
    while (next < items.length) {
      const i = next++
      results[i] = await check(items[i])
    }
  }
  await Promise.all(Array.from({ length: Math.min(4, items.length) }, worker))
  return { total: items.length, findings: results.filter(Boolean) }
}

async function checkBot(data, lookup) {
  const { slug, templateUrl, templateVersion: reviewed = null, permissions = [] } = data
  const base = { slug, templateUrl, name: data.nameZh || data.name, reviewed, permissions,
    sensitive: permissions.some(p => ['浏览器 Cookie', '外部账号', '代我发消息'].includes(p)) }
  const meta = await lookupVersion(templateUrl, lookup)
  if (!meta.ok) return { ...base, kind: meta.kind === 'not_found' ? 'gone' : 'error', message: meta.message }
  const kind = meta.published === false ? 'unpublished' : reviewed === null ? 'missing' : reviewed !== meta.version ? 'changed' : null
  return kind && { ...base, kind, current: meta.version, updatedAt: meta.updatedAt }
}

function skillChecker(github) {
  const cache = new Map()
  function get(path) {
    if (!cache.has(path)) cache.set(path, github(path))
    return cache.get(path)
  }
  return async data => {
    const source = data.source?.url, base = { slug: data.slug, name: data.title || data.name, source }
    const match = /^https:\/\/github\.com\/([\w.-]+\/[\w.-]+)\/tree\/([a-f\d]{40})(?:\/([^?#]*?))?\/?$/i.exec(source)
    if (!match) return { ...base, kind: 'unparsed' }
    const [, repo, reviewed, path = ''] = match
    Object.assign(base, { repo, reviewed, path })
    const root = `/repos/${repo}`
    try {
      const info = await get(root)
      if (info.full_name.toLowerCase() !== repo.toLowerCase()) return { ...base, kind: 'moved', current: info.full_name }
      if (info.archived) return { ...base, kind: 'archived' }
      const branch = info.default_branch
      const diff = await get(`${root}/compare/${reviewed}...${encodeURIComponent(branch)}`)
      const inside = name => typeof name === 'string' && (!path || name === path || name.startsWith(`${path}/`))
      const files = diff.files.filter(f => inside(f.filename) || inside(f.previous_filename)).map(f => inside(f.filename) ? f.filename : f.previous_filename)
      if (diff.files.length >= 300) {
        const since = diff.base_commit.commit.committer.date
        const params = new URLSearchParams({ sha: branch, path, since, per_page: '2' })
        const commits = await get(`${root}/commits?${params}`)
        if (!files.length && !commits.some(c => c.sha !== reviewed)) return null
      } else if (!files.length) return null
      return { ...base, kind: 'changed', files, aheadBy: diff.ahead_by, compareUrl: diff.html_url }
    } catch (e) { return { ...base, kind: e.status === 404 ? 'gone' : 'error', message: e.message } }
  }
}

export async function checkUpstream({ bots, skills, templateMeta, github, checkedAt }) {
  const [b, s] = await Promise.all([scan(bots, data => checkBot(data, templateMeta)), scan(skills, skillChecker(github))])
  const attention = [b, s].some(({ total, findings }) => findings.some(f => f.kind !== 'error') || (total > 0 && findings.length * 2 >= total))
  return { checkedAt, attention, bots: b, skills: s }
}

const headings = ['需要先看', 'Bot 模板改过', '没记审过的版本', 'Skill 上游改过', '核对失败']
export function report(result) {
  const sections = headings.map(() => [])
  for (const type of ['bots', 'skills']) for (const f of result[type].findings) {
    const bot = type === 'bots'
    const section = f.kind === 'error' ? 4 : ['gone', 'unpublished'].includes(f.kind) || (bot && f.kind === 'changed' && f.sensitive) ? 0 : !bot ? 3 : f.kind === 'missing' ? 2 : 1
    const detail = bot ? `${f.reviewed ? `v${f.reviewed}` : '未记录'} → ${f.current ? `v${f.current}` : '未知'}` : f.files?.join('、') || f.current || f.reviewed || ''
    sections[section].push(`- ${f.name}（${f.slug}）：${f.kind}，${detail}${f.message ? `；${f.message}` : ''} · [上游](${f.templateUrl || f.compareUrl || f.source}) · [本站](https://bot.jiachengbo.com/${type}/${f.slug})`)
  }
  const text = sections.flatMap((rows, i) => rows.length ? [`## ${headings[i]}\n\n${rows.join('\n')}`] : []).join('\n\n')
  return (text || `全部和审过的版本一致：${result.bots.total} 个 Bot、${result.skills.total} 个 Skill。`) + '\n\n处理办法见 `docs/dev/MAINTAINING.md` 的「上游核对」一节。'
}

export function findingKeys(result) {
  return ['bots', 'skills'].flatMap(type => result[type].findings.map(f => `${type.slice(0, -1)}:${f.slug}:${f.kind}:${f.current ?? f.reviewed ?? '-'}`)).sort()
}

export function planIssue({ open, attention, body, keys }) {
  if (!attention) return open ? [{ action: 'comment', body: '复核完了，全部和审过的版本一致。' }, { action: 'close' }] : []
  const marked = `${body}\n\n<!-- upstream-watch keys=${JSON.stringify(keys)} -->`
  if (!open) return [{ action: 'create', body: marked }]
  let previous = []
  try { const parsed = JSON.parse(open.body.match(/<!-- upstream-watch keys=(\[[^\n]*\]) -->\s*$/)[1]); if (Array.isArray(parsed)) previous = parsed } catch { /* no valid previous marker */ }
  const added = keys.filter(k => !previous.includes(k))
  return [{ action: 'update', body: marked }, ...(added.length ? [{ action: 'comment', body: `新增待复核项：\n${added.map(k => `- ${k}`).join('\n')}` }] : [])]
}
