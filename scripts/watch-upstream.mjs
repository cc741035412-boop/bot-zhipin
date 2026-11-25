import * as http from 'node:http'
import { appendFile } from 'node:fs/promises'
import { loadAllBots } from './lib/load-bots.mjs'
import { isPublicBot } from './lib/public-bot.mjs'
import { loadEntries } from './lib/load-prompts-skills.mjs'
import { fetchTemplateMeta } from './lib/template-meta.mjs'
import { checkUpstream, report, findingKeys, findingLines, planIssue } from './lib/upstream.mjs'

const env = process.env
http.setGlobalProxyFromEnv?.()
async function github(path, method = 'GET', data) {
  const headers = { 'User-Agent': 'bot-zhipin-upstream-watch', 'Content-Type': 'application/json' }
  if (env.GH_TOKEN) headers.Authorization = `Bearer ${env.GH_TOKEN}`
  const res = await fetch((env.GITHUB_API_URL || 'https://api.github.com') + path, {
    method, headers, body: data && JSON.stringify(data), signal: AbortSignal.timeout(20000) })
  if (!res.ok) throw Object.assign(new Error(`GitHub HTTP ${res.status}`), { status: res.status })
  return res.json()
}
async function syncIssue(result, body) {
  const repo = env.GITHUB_REPOSITORY
  if (!/^[\w.-]+\/[\w.-]+$/.test(repo)) throw new Error('缺少有效的 GITHUB_REPOSITORY')
  const root = `/repos/${repo}`, issues = root + '/issues', label = 'upstream-watch'
  const open = (await github(`${issues}?labels=${label}&state=open`)).find(item => !item.pull_request)
  const path = `${issues}/${open?.number}`
  for (const step of planIssue({ open, attention: result.attention, body, keys: findingKeys(result), lines: findingLines(result) })) {
    if (step.action === 'create') {
      try { await github(root + '/labels', 'POST', { name: label, color: 'd93f0b', description: '上游核对' }) }
      catch (error) { if (error.status !== 422) throw error }
      await github(issues, 'POST', { title: '上游有变动，待复核', labels: [label], assignees: [repo.split('/')[0]], body: step.body })
    } else if (step.action === 'update') await github(path, 'PATCH', { body: step.body })
    else if (step.action === 'comment') await github(path + '/comments', 'POST', { body: step.body })
    else await github(path, 'PATCH', { state: 'closed', state_reason: 'completed' })
  }
}
async function main(args) {
  if (args.length > 1 || (args.length && !['--json', '--issue'].includes(args[0]))) throw new Error('用法：npm run upstream -- [--json | --issue]')
  const result = await checkUpstream({ checkedAt: new Date().toISOString(), bots: loadAllBots().filter(isPublicBot).map(b => b.data),
    skills: loadEntries('skill').map(s => s.data), github, templateMeta: id => fetchTemplateMeta(id, { fetch }) })
  const body = report(result)
  console.log(args[0] === '--json' ? JSON.stringify(result) : body)
  if (args[0] !== '--issue') return Number(result.attention)
  if (env.GITHUB_STEP_SUMMARY) await appendFile(env.GITHUB_STEP_SUMMARY, body + '\n')
  try { await syncIssue(result, body); return 0 } catch (error) { console.error(error.message); return 1 }
}
try { process.exitCode = await main(process.argv.slice(2)) } catch (error) { console.error(error.message); process.exitCode = 2 }
