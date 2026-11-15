import { ApiError } from './errors'
import type { Env } from './types'

const disabled = (): never => { throw new ApiError(503, 'submit_disabled') }
export function isTestHost(hostname: string): boolean {
  return ['127.0.0.1', 'localhost', '[::1]'].includes(hostname) || hostname.endsWith('.test')
}

// Fail closed before cookies, counters or credentials. No production fallback in test mode.
export function assertTestEndpoints(env: Env, request?: Pick<Request, 'url'>): void {
  if (env.ALLOW_TEST_ENDPOINTS !== '1') return
  try {
    if (request && !isTestHost(new URL(request.url).hostname)) disabled()
    for (const base of [env.GITHUB_API_BASE, env.GITHUB_OAUTH_BASE]) {
      const url = new URL(base || '')
      if (!isTestHost(url.hostname)) disabled()
      // Keep the existing protocol/credentials/path checks in the URL consumers.
    }
  } catch { disabled() }
}

export function assertSubmitEnabled(env: Env): void {
  assertTestEndpoints(env)
  // Test bases remain optional in production, required only with the test switch.
  const required = [
    env.SUBMIT_REPO, env.GITHUB_APP_ID, env.GITHUB_APP_INSTALLATION_ID, env.GITHUB_APP_BOT_LOGIN,
    env.GITHUB_APP_PRIVATE_KEY, env.OAUTH_CLIENT_ID, env.OAUTH_CLIENT_SECRET, env.SESSION_SECRET, env.IP_SALT,
  ]
  if (required.some((value) => !value?.trim()) || new TextEncoder().encode(env.SESSION_SECRET).length < 32) {
    disabled()
  }
}

export function authorizationUrl(env: Env): URL {
  assertTestEndpoints(env)
  const base = env.ALLOW_TEST_ENDPOINTS === '1' && env.GITHUB_OAUTH_BASE ? env.GITHUB_OAUTH_BASE : 'https://github.com'
  const url = new URL(base)
  if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password
    || url.pathname !== '/' || url.search || url.hash) disabled()
  return new URL('/login/oauth/authorize', url.origin)
}
