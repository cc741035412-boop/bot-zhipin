import type { PagesFunction } from '@cloudflare/workers-types'
import { ApiError } from '../_lib/errors'
import { ingestEvents, readEventBatch, scheduleEventCleanup } from '../_lib/events-store'
import { clientIp, handleApi, methodNotAllowed, validateClickHeaders } from '../_lib/http'
import type { Env } from '../_lib/types'

const crawler = /bot|crawl|spider|slurp|headless|lighthouse|preview|facebookexternalhit|curl|wget|python|httpclient|go-http/i
const empty = () => new Response(null, { status: 204, headers: { 'Cache-Control': 'no-store' } })

export const onRequestPost: PagesFunction<Env> = (context) => handleApi(context, async (now) => {
  const { request, env } = context
  validateClickHeaders(request)
  if (!env.IP_SALT) throw new ApiError(500, 'server_error')
  const ua = request.headers.get('User-Agent') || ''
  if (env.ALLOW_TEST_IP !== '1' && (!ua || crawler.test(ua))) return empty()
  const batch = await readEventBatch(request)
  await ingestEvents({ db: env.DB, salt: env.IP_SALT, ip: clientIp(request, env), ua, country: request.cf?.country, batch, now })
  scheduleEventCleanup(env.DB, now, (p) => context.waitUntil(p))
  return empty()
})

export const onRequest: PagesFunction<Env> = (context) => handleApi(context, () => methodNotAllowed('POST'))
