import { fail } from './respond'
import type { Env } from './types'

export function assertSubmitEnabled(env: Env): void {
  // ALLOW_TEST_ENDPOINTS and its bases are local-only switches, never production requirements.
  const required = [
    env.SUBMIT_REPO, env.GITHUB_APP_ID, env.GITHUB_APP_INSTALLATION_ID, env.GITHUB_APP_BOT_LOGIN,
    env.GITHUB_APP_PRIVATE_KEY, env.OAUTH_CLIENT_ID, env.OAUTH_CLIENT_SECRET, env.SESSION_SECRET, env.IP_SALT,
  ]
  if (required.some((value) => !value?.trim()) || new TextEncoder().encode(env.SESSION_SECRET).length < 32) {
    fail('submit_disabled')
  }
}

export function authorizationUrl(env: Env): URL {
  const base = env.ALLOW_TEST_ENDPOINTS === '1' && env.GITHUB_OAUTH_BASE ? env.GITHUB_OAUTH_BASE : 'https://github.com'
  const url = new URL(base)
  if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password
    || url.pathname !== '/' || url.search || url.hash) fail('submit_disabled')
  return new URL('/login/oauth/authorize', url.origin)
}
