import type { PagesFunction } from '@cloudflare/workers-types'
import { json } from '../../_lib/http'
import { fail, handleSubmitApi, submitMethodNotAllowed } from '../../_lib/respond'
import { readSession } from '../../_lib/session'
import { assertSubmitEnabled } from '../../_lib/submit-config'
import type { Env } from '../../_lib/types'

export const onRequestGet: PagesFunction<Env> = (context) => handleSubmitApi(context, async (now) => {
  assertSubmitEnabled(context.env)
  const user = await readSession(context.request, context.env, now)
  if (!user) fail('unauthenticated')
  return json({ ok: true, ...user })
})

export const onRequest: PagesFunction<Env> = (context) => handleSubmitApi(context, () => submitMethodNotAllowed('GET'))
