import { fromBase64, toBase64, toBase64Url } from './bytes'
import type { Env } from './types'

export const SUBMISSION_BRANCH_RE = /^submission\/web-[1-9]\d{0,19}-[a-z0-9]+(?:-[a-z0-9]+)*$/

export class GitHubError extends Error {
  constructor(public readonly status: number) {
    // Never accept upstream text, URLs, request bodies, tokens, or a cause.
    super('GitHub request failed')
    this.name = 'GitHubError'
  }
}

interface TokenCache {
  scope: string
  token: string
  createdAt: number
  expiresAt: number
}
const tokens = new Map<string, TokenCache>()
const pendingTokens = new Map<string, { scope: string; promise: Promise<string> }>()

function noRedirectMode(): RequestRedirect {
  // workerd rejects `error` while constructing a Request. Feature detection is
  // local (no fetch); manual + the non-2xx check below has the same no-follow
  // security boundary. Never retry an actual credential-bearing request.
  try {
    new Request('https://redirect-policy.invalid', { redirect: 'error' })
    return 'error'
  } catch {
    return 'manual'
  }
}
const redirectMode = noRedirectMode()

function endpointBase(value: string): string {
  try {
    const url = new URL(value)
    if (!['https:', 'http:'].includes(url.protocol) || url.username || url.password
      || url.pathname !== '/' || url.search || url.hash) throw new GitHubError(400)
    return url.origin
  } catch {
    throw new GitHubError(400)
  }
}

function pathParts(value: string): string {
  if (typeof value !== 'string' || !value || /[\\%?#:\x00-\x1f\x7f]/.test(value)) throw new GitHubError(400)
  const parts = value.split('/')
  if (parts.some((part) => !part || part === '.' || part === '..')) throw new GitHubError(400)
  return parts.map(encodeURIComponent).join('/')
}

function numberPath(value: number): string {
  if (!Number.isSafeInteger(value) || value < 1) throw new GitHubError(400)
  return String(value)
}

function shaOf(value: { sha: string }): string {
  if (!value || typeof value.sha !== 'string' || !/^[0-9a-f]{40}$/i.test(value.sha)) throw new GitHubError(502)
  return value.sha
}

interface Ref { ref: string; object: { sha: string } }
interface Commit { sha: string; tree: { sha: string }; parents: { sha: string }[] }
interface Pull {
  number: number
  html_url: string
  node_id: string
  state: 'open' | 'closed'
  merged: boolean
  merged_at: string | null
  merge_commit_sha: string | null
  head: { ref: string; sha: string }
}
interface TreeEntry { path: string; mode: '100644' | '040000'; type: 'blob' | 'tree'; sha?: string | null; content?: string }
interface Author { name: string; email: string; date?: string }

export function createGitHub(env: Env) {
  const apiBase = endpointBase(env.ALLOW_TEST_ENDPOINTS === '1' && env.GITHUB_API_BASE ? env.GITHUB_API_BASE : 'https://api.github.com')
  const oauthBase = endpointBase(env.ALLOW_TEST_ENDPOINTS === '1' && env.GITHUB_OAUTH_BASE ? env.GITHUB_OAUTH_BASE : 'https://github.com')
  const repo = env.SUBMIT_REPO || ''
  if (!/^[a-z\d](?:[a-z\d-]*[a-z\d])?\/[a-z\d_.-]+$/i.test(repo)
    || ['.', '..'].includes(repo.split('/')[1])) throw new GitHubError(400)
  const repoPrefix = `/repos/${repo}/`
  const installationId = env.GITHUB_APP_INSTALLATION_ID || ''
  const clientId = env.OAUTH_CLIENT_ID || ''
  const installationPath = `/app/installations/${encodeURIComponent(installationId)}/access_tokens`
  const revokePath = `/applications/${encodeURIComponent(clientId)}/token`

  // Called before credentials are acquired/sent, even for URLs built by fixed operations.
  function assertUrl(url: URL, oauth = false): void {
    const base = oauth ? oauthBase : apiBase
    const allowed = oauth ? url.pathname === '/login/oauth/access_token'
      : url.pathname.startsWith(repoPrefix) || url.pathname === installationPath
        || url.pathname === '/user' || url.pathname === revokePath || url.pathname === '/graphql'
    if (url.origin !== base || url.username || url.password || url.hash || !allowed) throw new GitHubError(400)
    // Reject encoded separators and traversal rather than relying on an upstream URL normalizer.
    const decoded = decodeURIComponent(url.pathname)
    if (/[\\\x00-\x1f\x7f]/.test(decoded) || decoded.split('/').some((p) => p === '.' || p === '..')
      || /%2f|%5c|%25/i.test(url.pathname)) throw new GitHubError(400)
  }

  function apiUrl(path: string): URL {
    const url = new URL(`${apiBase}${path}`)
    assertUrl(url)
    // WHATWG URL removes dot segments; never permit that to change the intended operation.
    if (url.pathname !== path) throw new GitHubError(400)
    return url
  }

  async function request<T>(url: URL, { method = 'GET', auth, body, oauth = false }: {
    method?: string; auth?: string; body?: unknown; oauth?: boolean
  } = {}): Promise<T> {
    assertUrl(url, oauth)
    try {
      const response = await globalThis.fetch(url.toString(), {
        method,
        redirect: redirectMode, // Never forward credentials to any redirect target.
        headers: {
          Accept: oauth ? 'application/json' : 'application/vnd.github+json',
          'X-GitHub-Api-Version': '2022-11-28',
          'User-Agent': 'bot-zhipin-submit',
          ...(auth ? { Authorization: auth } : {}),
          ...(body === undefined ? {} : { 'Content-Type': 'application/json' }),
        },
        ...(body === undefined ? {} : { body: JSON.stringify(body) }),
      })
      if (!response.ok) throw new GitHubError(response.status)
      if (response.status === 204) return null as T
      return await response.json() as T
    } catch (error) {
      throw error instanceof GitHubError ? error : new GitHubError(502)
    }
  }

  async function installationToken(): Promise<string> {
    if (!/^[1-9]\d*$/.test(installationId) || !/^[1-9]\d*$/.test(env.GITHUB_APP_ID || '')) throw new GitHubError(400)
    const url = apiUrl(installationPath)
    const scope = `${apiBase}\n${repo}\n${env.GITHUB_APP_ID}`
    const now = Date.now()
    const cached = tokens.get(installationId)
    if (cached?.scope === scope && now >= cached.createdAt && now - cached.createdAt < 50 * 60_000
      && cached.expiresAt - now > 10 * 60_000) return cached.token
    const pending = pendingTokens.get(installationId)
    if (pending?.scope === scope) return pending.promise

    const promise = (async () => {
      try {
        const pem = env.GITHUB_APP_PRIVATE_KEY || ''
        const match = /^-----BEGIN PRIVATE KEY-----\s+([A-Za-z0-9+/=\s]+)\s+-----END PRIVATE KEY-----\s*$/.exec(pem)
        if (!match) throw new GitHubError(500)
        const key = await crypto.subtle.importKey('pkcs8', fromBase64(match[1].replace(/\s/g, '')),
          { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' }, false, ['sign'])
        const encoder = new TextEncoder()
        const header = toBase64Url(encoder.encode(JSON.stringify({ alg: 'RS256', typ: 'JWT' })))
        const payload = toBase64Url(encoder.encode(JSON.stringify({
          iat: Math.floor(now / 1000) - 60,
          exp: Math.floor(now / 1000) + 9 * 60,
          iss: env.GITHUB_APP_ID,
        })))
        const input = `${header}.${payload}`
        const signature = await crypto.subtle.sign('RSASSA-PKCS1-v1_5', key, encoder.encode(input))
        const jwt = `${input}.${toBase64Url(new Uint8Array(signature))}`
        const result = await request<{ token: string; expires_at: string }>(url, {
          method: 'POST', auth: `Bearer ${jwt}`,
          body: { repositories: [repo.split('/')[1]], permissions: { contents: 'write', pull_requests: 'write' } },
        })
        const expiresAt = Date.parse(result?.expires_at)
        if (!result?.token || typeof result.token !== 'string' || !Number.isFinite(expiresAt) || expiresAt <= Date.now()) {
          throw new GitHubError(502)
        }
        tokens.set(installationId, { scope, token: result.token, createdAt: now, expiresAt })
        return result.token
      } catch (error) {
        throw error instanceof GitHubError ? error : new GitHubError(502)
      }
    })()
    pendingTokens.set(installationId, { scope, promise })
    try {
      return await promise
    } finally {
      if (pendingTokens.get(installationId)?.promise === promise) pendingTokens.delete(installationId)
    }
  }

  async function repoRequest<T>(path: string, method = 'GET', body?: unknown, query?: Record<string, string>, allowMissing = false): Promise<T> {
    const url = apiUrl(`${repoPrefix}${path}`)
    for (const [key, value] of Object.entries(query || {})) url.searchParams.set(key, value)
    assertUrl(url)
    // A missing installation is an upstream failure, not a missing file/ref.
    const auth = `Bearer ${await installationToken()}`
    try {
      return await request<T>(url, { method, body, auth })
    } catch (error) {
      if (allowMissing && error instanceof GitHubError && error.status === 404) return null as T
      throw error
    }
  }

  async function getRef(name: string): Promise<Ref> {
    return repoRequest(`git/ref/${pathParts(name)}`)
  }

  return {
    async exchangeCode({ code, redirectUri, verifier }: { code: string; redirectUri: string; verifier: string }): Promise<string> {
      const url = new URL('/login/oauth/access_token', oauthBase)
      assertUrl(url, true)
      const result = await request<{ access_token?: string; token_type?: string }>(url, {
        method: 'POST', oauth: true,
        body: { client_id: clientId, client_secret: env.OAUTH_CLIENT_SECRET, code, redirect_uri: redirectUri, code_verifier: verifier },
      })
      if (!result || typeof result.access_token !== 'string' || !result.access_token
        || (result.token_type && result.token_type.toLowerCase() !== 'bearer')) throw new GitHubError(502)
      return result.access_token
    },
    async getUser(token: string): Promise<{ id: number; login: string; type: string }> {
      return request(apiUrl('/user'), { auth: `Bearer ${token}` })
    },
    async revokeToken(token: string): Promise<void> {
      if (!clientId || !env.OAUTH_CLIENT_SECRET) throw new GitHubError(500)
      const basic = toBase64(new TextEncoder().encode(`${clientId}:${env.OAUTH_CLIENT_SECRET}`))
      await request(apiUrl(revokePath), { method: 'DELETE', auth: `Basic ${basic}`, body: { access_token: token } })
    },
    installationToken,
    async createBlob(bytes: Uint8Array): Promise<string> {
      return shaOf(await repoRequest('git/blobs', 'POST', { encoding: 'base64', content: toBase64(bytes) }))
    },
    getRef,
    async getCommit(sha: string): Promise<Commit> {
      return repoRequest(`git/commits/${pathParts(sha)}`)
    },
    async getContent(path: string, ref: string): Promise<{ text: string; sha: string } | null> {
      // Validate the entire target before minting an installation token.
      const target = `contents/${pathParts(path)}`
      try {
        const data = await repoRequest<{ encoding: string; content: string; sha: string } | null>(target, 'GET', undefined, { ref }, true)
        if (data === null) return null
        if (data?.encoding !== 'base64' || typeof data.content !== 'string') throw new GitHubError(502)
        return { text: new TextDecoder('utf-8', { fatal: true }).decode(fromBase64(data.content.replace(/\s/g, ''))), sha: shaOf(data) }
      } catch (error) {
        throw error instanceof GitHubError ? error : new GitHubError(502)
      }
    },
    async createTree({ entries, baseTree }: { entries: TreeEntry[]; baseTree?: string }): Promise<string> {
      return shaOf(await repoRequest('git/trees', 'POST', { tree: entries, ...(baseTree === undefined ? {} : { base_tree: baseTree }) }))
    },
    async createCommit({ message, tree, parents, author }: { message: string; tree: string; parents: string[]; author: Author }): Promise<string> {
      return shaOf(await repoRequest('git/commits', 'POST', { message, tree, parents, author }))
    },
    async upsertRef(branch: string, sha: string): Promise<Ref> {
      if (!SUBMISSION_BRANCH_RE.test(branch)) throw new GitHubError(400)
      const existing = await repoRequest<Ref | null>(`git/ref/heads/${pathParts(branch)}`, 'GET', undefined, undefined, true)
      return existing !== null
        ? repoRequest(`git/refs/heads/${pathParts(branch)}`, 'PATCH', { sha, force: true })
        : repoRequest('git/refs', 'POST', { ref: `refs/heads/${branch}`, sha })
    },
    async findOpenPr(branch: string): Promise<Pull | null> {
      if (!SUBMISSION_BRANCH_RE.test(branch)) throw new GitHubError(400)
      const pulls = await repoRequest<Pull[]>('pulls', 'GET', undefined, { state: 'open', head: `${repo.split('/')[0]}:${branch}`, base: 'main' })
      if (!Array.isArray(pulls)) throw new GitHubError(502)
      return pulls[0] || null
    },
    async createPr({ title, body, head, base }: { title: string; body: string; head: string; base: string }): Promise<Pull> {
      if (!SUBMISSION_BRANCH_RE.test(head) || base !== 'main') throw new GitHubError(400)
      return repoRequest('pulls', 'POST', { title, body, head, base })
    },
    async updatePr(number: number, { title, body }: { title: string; body: string }): Promise<Pull> {
      return repoRequest(`pulls/${numberPath(number)}`, 'PATCH', { title, body })
    },
    async enableAutoMerge(nodeId: string): Promise<boolean> {
      try {
        const url = apiUrl('/graphql')
        const result = await request<{ errors?: unknown[]; data?: { enablePullRequestAutoMerge?: { pullRequest?: { id: string } } } }>(url, {
          method: 'POST', auth: `Bearer ${await installationToken()}`,
          body: {
            query: 'mutation($id: ID!) { enablePullRequestAutoMerge(input: { pullRequestId: $id, mergeMethod: MERGE }) { pullRequest { id } } }',
            variables: { id: nodeId },
          },
        })
        return !result.errors?.length && Boolean(result.data?.enablePullRequestAutoMerge?.pullRequest?.id)
      } catch {
        return false
      }
    },
    async getPr(number: number): Promise<Pull> {
      return repoRequest(`pulls/${numberPath(number)}`)
    },
    async getChecks(sha: string): Promise<{ total_count: number; check_runs: { name: string; status: string; conclusion: string | null }[] }> {
      return repoRequest(`commits/${pathParts(sha)}/check-runs`, 'GET', undefined, { per_page: '100' })
    },
    async getReviews(number: number): Promise<{ id: number; state: string; user: { login: string }; submitted_at: string }[]> {
      return repoRequest(`pulls/${numberPath(number)}/reviews`, 'GET', undefined, { per_page: '100' })
    },
    async compare(base: string, head: string): Promise<{ status: string }> {
      return repoRequest(`compare/${pathParts(base)}...${pathParts(head)}`)
    },
  }
}
