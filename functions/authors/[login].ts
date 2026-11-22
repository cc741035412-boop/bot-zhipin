import type { PagesFunction } from '@cloudflare/workers-types'
import { loadAuthors } from '../_lib/authors'
import type { Env } from '../_lib/types'

export const onRequestGet: PagesFunction<Env, 'login'> = async (context) => {
  const raw = String(context.params.login || '').replace(/\.html$/, '')
  const key = raw.toLowerCase()
  let authors: ReadonlySet<string>
  try {
    authors = await loadAuthors(context.env.ASSETS, context.request.url)
  } catch {
    return context.next()
  }
  if (authors.has(key)) {
    if (raw === key) return context.next()
    return new Response(null, { status: 308, headers: { Location: `/authors/${key}${new URL(context.request.url).search}` } })
  }
  const page = await context.env.ASSETS.fetch(new URL('/404.html', context.request.url))
  return new Response(page.body, {
    status: 404,
    headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' },
  })
}
