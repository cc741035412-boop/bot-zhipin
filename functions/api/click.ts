import type { PagesFunction } from '@cloudflare/workers-types'
import { recordClick } from '../_lib/clicks'
import { ApiError } from '../_lib/errors'
import { clientIp, handleApi, json, methodNotAllowed, readClickBody, validateClickHeaders } from '../_lib/http'
import { loadSlugs } from '../_lib/slugs'
import type { Env } from '../_lib/types'

export const onRequestPost: PagesFunction<Env> = (context) => handleApi(context, async (now) => {
  validateClickHeaders(context.request)
  if (!context.env.IP_SALT) throw new ApiError(500, 'server_error')
  const { slug, kind } = await readClickBody(context.request)
  const slugs = await loadSlugs(context.env.ASSETS, context.request.url, now)
  return json(await recordClick({
    db: context.env.DB,
    salt: context.env.IP_SALT,
    slugs,
    ip: clientIp(context.request, context.env),
    slug,
    kind,
    now,
  }))
})

export const onRequest: PagesFunction<Env> = (context) => handleApi(context, () => methodNotAllowed('POST'))
