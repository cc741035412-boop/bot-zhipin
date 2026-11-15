import type { PagesFunction } from '@cloudflare/workers-types'
import { hashIp } from '../../_lib/clicks'
import { createGitHub } from '../../_lib/github'
import { clientIp, json } from '../../_lib/http'
import { fail, handleSubmitApi, submitMethodNotAllowed } from '../../_lib/respond'
import { assertSubmitEnabled } from '../../_lib/submit-config'
import { rate, submissionStatus } from '../../_lib/submit'
import type { Env } from '../../_lib/types'

export const onRequestGet: PagesFunction<Env> = (context) => handleSubmitApi(context, async (now) => {
  const { request, env } = context
  assertSubmitEnabled(env)
  const url = new URL(request.url)
  const pr = url.searchParams.get('pr')
  if (url.searchParams.getAll('pr').length !== 1 || !pr || !/^[1-9]\d{0,8}$/.test(pr)) fail('bad_request')
  const key = await hashIp(env.IP_SALT, clientIp(request, { ALLOW_TEST_IP: env.ALLOW_TEST_ENDPOINTS }), 'status')
  await rate(env.DB, 'status', key, now)
  return json(await submissionStatus(Number(pr), { github: createGitHub(env), origin: url.origin, build: async () => {
    try {
      const response = await env.ASSETS.fetch(new URL('/api-data/build.json', url))
      if (!response.ok) fail('server_error')
      const data = await response.json() as { commit?: unknown; builtAt?: unknown }
      if (typeof data?.commit !== 'string' || !data.commit || typeof data.builtAt !== 'string') fail('server_error')
      return data.commit
    } catch { fail('server_error') }
  } }))
})

export const onRequest: PagesFunction<Env> = (context) => handleSubmitApi(context, () => submitMethodNotAllowed('GET'))
