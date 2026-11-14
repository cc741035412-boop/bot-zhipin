import type { D1Database, EventContext, Fetcher } from '@cloudflare/workers-types'

export interface Env {
  DB: D1Database
  ASSETS: Pick<Fetcher, 'fetch'>
  IP_SALT?: string
  ALLOW_TEST_IP?: string
}

export type ApiContext = EventContext<Env, string, unknown>
export type ClickKind = 'import' | 'prompt'
export interface ClickBody {
  slug: string
  kind: ClickKind
}
