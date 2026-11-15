import type { PagesFunction } from '@cloudflare/workers-types'
import { assertSameOrigin } from '../../_lib/origin'
import { handleSubmitApi, submitMethodNotAllowed } from '../../_lib/respond'
import { clearCookie, cookieNames } from '../../_lib/session'
import { assertSubmitEnabled } from '../../_lib/submit-config'
import type { Env } from '../../_lib/types'

export const onRequestPost: PagesFunction<Env> = (context) => handleSubmitApi(context, () => {
  assertSameOrigin(context.request)
  assertSubmitEnabled(context.env)
  const names = cookieNames(context.env)
  const headers = new Headers({ 'Set-Cookie': clearCookie(context.env, names.session) })
  headers.append('Set-Cookie', clearCookie(context.env, names.oauth))
  return new Response(null, { status: 204, headers })
})

export const onRequest: PagesFunction<Env> = (context) => handleSubmitApi(context, () => submitMethodNotAllowed('POST'))
