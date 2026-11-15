#!/usr/bin/env node
// Disposable localhost-only GitHub double. Never log credentials, headers or OAuth queries.
import { createServer } from 'node:http'
import { appendFileSync } from 'node:fs'
import { createHash, randomBytes } from 'node:crypto'

const log = process.argv[2]
if (!log) throw new Error('Provide a temporary JSON-lines log path')
const main = '1'.repeat(40), root = '2'.repeat(40), inner = '3'.repeat(40), outer = '4'.repeat(40), commit = '5'.repeat(40)
const repo = '/repos/owner/repo'
let branch, pull
const refs = new Map()
const server = createServer(async (request, response) => {
  const url = new URL(request.url, 'http://127.0.0.1:8799')
  const method = request.method, path = url.pathname
  const reply = (data, status = 200) => { response.writeHead(status, { 'Content-Type': 'application/json' }); response.end(JSON.stringify(data)) }
  try {
    let text = ''
    for await (const chunk of request) {
      text += chunk
      if (text.length > 3 * 1024 * 1024) return reply({}, 413)
    }
    const body = text ? JSON.parse(text) : null
    // Only repository write payloads are needed for structural assertions. OAuth,
    // installation and GraphQL logs contain no secret-bearing request metadata.
    const safeBody = path.startsWith(`${repo}/git/`) || (path.startsWith(`${repo}/pulls`) && method !== 'GET')
      ? body : path === '/graphql' ? { query: body?.query, variables: body?.variables } : undefined
    if (path !== '/health') appendFileSync(log, JSON.stringify({ method, path, ...(safeBody ? { body: safeBody } : {}) }) + '\n')
    if (path === '/health') return reply({ ok: true })
    if (path === '/login/oauth/authorize' && method === 'GET') {
      const redirect = new URL(url.searchParams.get('redirect_uri'))
      if (redirect.origin !== 'http://127.0.0.1:8788' || redirect.pathname !== '/api/auth/callback') return reply({}, 400)
      redirect.searchParams.set('code', 'local-one-time-code')
      redirect.searchParams.set('state', url.searchParams.get('state'))
      response.writeHead(302, { Location: redirect.toString() }); return response.end()
    }
    if (path === '/login/oauth/access_token' && method === 'POST') return reply({ access_token: randomBytes(24).toString('hex'), token_type: 'bearer' })
    if (path === '/user') return reply({ id: 123, login: 'Alice', type: 'User' })
    if (/^\/applications\/[^/]+\/token$/.test(path) && method === 'DELETE') { response.writeHead(204); return response.end() }
    if (/^\/app\/installations\/\d+\/access_tokens$/.test(path)) return reply({ token: randomBytes(24).toString('hex'), expires_at: new Date(Date.now() + 3600000).toISOString() }, 201)
    if (path === `${repo}/git/blobs` && method === 'POST') {
      const bytes = Buffer.from(body.content, 'base64')
      return reply({ sha: createHash('sha1').update(`blob ${bytes.length}\0`).update(bytes).digest('hex') }, 201)
    }
    if (path === `${repo}/git/ref/heads/main`) return reply({ object: { sha: main } })
    if (path === `${repo}/git/commits/${main}`) return reply({ sha: main, tree: { sha: root } })
    if (path.startsWith(`${repo}/contents/`)) return reply({}, 404)
    if (path === `${repo}/git/trees` && method === 'POST') {
      if (!body.tree.every((entry) => ['100644', '040000'].includes(entry.mode))) return reply({}, 422)
      return reply({ sha: body.base_tree ? outer : inner }, 201)
    }
    if (path === `${repo}/git/commits` && method === 'POST') return reply({ sha: commit }, 201)
    if (path.startsWith(`${repo}/git/ref/heads/submission/`)) {
      const sha = refs.get(path.slice(`${repo}/git/ref/heads/`.length))
      return reply(sha ? { object: { sha } } : {}, sha ? 200 : 404)
    }
    if (path === `${repo}/git/refs` && method === 'POST') {
      branch = body.ref.replace(/^refs\/heads\//, ''); refs.set(branch, body.sha)
      return reply({ ref: body.ref, object: { sha: body.sha } }, 201)
    }
    if (path.startsWith(`${repo}/git/refs/heads/`) && method === 'PATCH') {
      branch = path.slice(`${repo}/git/refs/heads/`.length); refs.set(branch, body.sha)
      return reply({ object: { sha: body.sha } })
    }
    if (path === `${repo}/pulls` && method === 'GET') return reply(pull ? [pull] : [])
    if ((path === `${repo}/pulls` && method === 'POST') || (path === `${repo}/pulls/7` && method === 'PATCH')) {
      pull = { number: 7, node_id: 'PR_local7', html_url: 'http://127.0.0.1:8799/owner/repo/pull/7', state: 'open', merged: false, head: { ref: branch, sha: commit } }
      return reply(pull, method === 'POST' ? 201 : 200)
    }
    if (path === `${repo}/pulls/7` && method === 'GET') return reply(pull)
    if (path === `${repo}/commits/${commit}/check-runs`) return reply({ check_runs: [{ name: 'validate-and-build', status: 'completed', conclusion: 'success' }] })
    if (path === `${repo}/pulls/7/reviews`) return reply([])
    if (path === '/graphql') return reply({ data: { enablePullRequestAutoMerge: { pullRequest: { id: 'PR_local7' } } } })
    return reply({}, 404)
  } catch { return reply({}, 500) }
})
server.listen(8799, '127.0.0.1')
for (const event of ['SIGTERM', 'SIGINT']) process.on(event, () => server.close(() => process.exit(0)))
