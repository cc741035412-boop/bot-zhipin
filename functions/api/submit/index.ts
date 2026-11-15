import type { PagesFunction } from '@cloudflare/workers-types'
import { loadSubmitContext } from '../../_lib/context'
import { createGitHub } from '../../_lib/github'
import { json } from '../../_lib/http'
import { assertMediaType, assertSameOrigin } from '../../_lib/origin'
import { handleSubmitApi, submitMethodNotAllowed } from '../../_lib/respond'
import { assertSubmitEnabled } from '../../_lib/submit-config'
import { readSubmitBody, requireUser } from '../../_lib/submit-http'
import { submitBot } from '../../_lib/submit'
import type { Env } from '../../_lib/types'

export const onRequestPost: PagesFunction<Env> = (context) => handleSubmitApi(context, async (now) => {
  const { request, env } = context
  assertSubmitEnabled(env)
  const user = await requireUser(request, env, now)
  assertSameOrigin(request)
  assertMediaType(request, ['application/json'])
  const body = await readSubmitBody(request)
  return json(await submitBot(body, user, {
    github: createGitHub(env), db: env.DB, context: () => loadSubmitContext(env.ASSETS, request.url, now),
    now, secrets: env, dryRunUserIds: env.SUBMIT_DRY_RUN_USER_IDS, origin: new URL(request.url).origin,
  }))
})

export const onRequest: PagesFunction<Env> = (context) => handleSubmitApi(context, () => submitMethodNotAllowed('POST'))
