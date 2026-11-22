import type { D1Database, EventContext, Fetcher } from '@cloudflare/workers-types'

export interface Env {
  DB: D1Database
  ASSETS: Pick<Fetcher, 'fetch'>
  IP_SALT?: string
  ALLOW_TEST_IP?: string
  SUBMIT_REPO?: string
  GITHUB_APP_ID?: string
  GITHUB_APP_INSTALLATION_ID?: string
  GITHUB_APP_BOT_LOGIN?: string
  GITHUB_APP_PRIVATE_KEY?: string
  OAUTH_CLIENT_ID?: string
  OAUTH_CLIENT_SECRET?: string
  SESSION_SECRET?: string
  SESSION_SECRET_PREV?: string
  SUBMIT_DRY_RUN_USER_IDS?: string
  ALLOW_TEST_ENDPOINTS?: string
  GITHUB_AVATAR_BASE?: string
  GITHUB_API_BASE?: string
  GITHUB_OAUTH_BASE?: string
}

export type ApiContext = EventContext<Env, string, unknown>
export const CLICK_KINDS = ['import', 'prompt', 'starter', 'kickoff'] as const
export type ClickKind = typeof CLICK_KINDS[number]
export interface ClickBody {
  slug: string
  kind: ClickKind
}
