import type { PagesFunction } from '@cloudflare/workers-types'
import { toBase64Url } from '../../_lib/bytes'
import { hashIp } from '../../_lib/clicks'
import { clientIp } from '../../_lib/http'
import { hit, RATE_LIMITS } from '../../_lib/ratelimit'
import { fail, handleSubmitApi, submitMethodNotAllowed } from '../../_lib/respond'
import { oauthSetCookie } from '../../_lib/session'
import { assertSubmitEnabled, authorizationUrl } from '../../_lib/submit-config'
import type { Env } from '../../_lib/types'

export const onRequestGet: PagesFunction<Env> = (context) => handleSubmitApi(context, async (now) => {
  const { env, request } = context
  assertSubmitEnabled(env)
  const mode = request.headers.get('Sec-Fetch-Mode')
  if (mode !== null && mode !== 'navigate') fail('bad_request')
  const key = await hashIp(env.IP_SALT, clientIp(request, { ALLOW_TEST_IP: env.ALLOW_TEST_ENDPOINTS }), 'login')
  const limit = await hit(env.DB, { bucket: 'login', key, ...RATE_LIMITS.login }, now)
  if (!limit.ok) {
    return new Response(null, { status: 302, headers: { Location: `/submit?login=failed&retry=${limit.retryAfter}` } })
  }
  const state = toBase64Url(crypto.getRandomValues(new Uint8Array(32)))
  const verifier = toBase64Url(crypto.getRandomValues(new Uint8Array(32)))
  const challenge = toBase64Url(new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(verifier))))
  const url = authorizationUrl(env)
  url.searchParams.set('client_id', env.OAUTH_CLIENT_ID!)
  url.searchParams.set('redirect_uri', `${new URL(request.url).origin}/api/auth/callback`)
  url.searchParams.set('state', state)
  url.searchParams.set('code_challenge', challenge)
  url.searchParams.set('code_challenge_method', 'S256')
  url.searchParams.set('allow_signup', 'true')
  return new Response(null, { status: 302, headers: { Location: url.toString(), 'Set-Cookie': await oauthSetCookie(env, state, verifier, now) } })
})

export const onRequest: PagesFunction<Env> = (context) => handleSubmitApi(context, () => submitMethodNotAllowed('GET'))
