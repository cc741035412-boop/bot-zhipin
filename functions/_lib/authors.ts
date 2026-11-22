import { loadSlugs } from './slugs'
import type { Env } from './types'

export function isLogin(value: unknown): value is string {
  return typeof value === 'string' && value.length <= 39 && /^[a-z0-9]+(?:-[a-z0-9]+)*$/i.test(value)
}

export function loadAuthors(assets: Env['ASSETS'], url: string) {
  return loadSlugs(assets, url, Date.now(), '/api-data/authors.json', isLogin)
}
