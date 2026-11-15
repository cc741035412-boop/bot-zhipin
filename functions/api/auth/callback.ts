import type { PagesFunction } from '@cloudflare/workers-types'
import { createGitHub } from '../../_lib/github'
import { handleSubmitApi, submitMethodNotAllowed } from '../../_lib/respond'
import { clearCookie, cookieNames, isSessionUser, parseCookies, sessionSetCookie, verify } from '../../_lib/session'
import { assertSubmitEnabled } from '../../_lib/submit-config'
import type { Env } from '../../_lib/types'

export const onRequestGet: PagesFunction<Env> = (context) => handleSubmitApi(context, async (now) => {
  const { request, env } = context
  assertSubmitEnabled(env)
  const url = new URL(request.url)
  // No other query parameters are read; all redirects below are fixed local paths.
  const code = url.searchParams.get('code')
  const state = url.searchParams.get('state')
  const error = url.searchParams.get('error')
  const headers = new Headers({ 'Set-Cookie': clearCookie(env, cookieNames(env).oauth) })
  let result: 'ok' | 'cancelled' | 'expired' | 'failed' = 'failed'
  if (error === 'access_denied') {
    result = 'cancelled'
  } else if (error === null) {
    const token = parseCookies(request.headers.get('Cookie'))[cookieNames(env).oauth]
    const oauth = await verify([env.SESSION_SECRET, env.SESSION_SECRET_PREV], token, now)
    if (!oauth || oauth.t !== 'o' || typeof oauth.state !== 'string' || !/^[A-Za-z0-9_-]{43}$/.test(oauth.state)
      || typeof oauth.verifier !== 'string' || !/^[A-Za-z0-9_-]{43}$/.test(oauth.verifier)
      || oauth.state !== state) {
      result = 'expired'
    } else if (code) {
      try {
        const gh = createGitHub(env)
        const accessToken = await gh.exchangeCode({ code, redirectUri: `${url.origin}/api/auth/callback`, verifier: oauth.verifier })
        let user
        try {
          user = await gh.getUser(accessToken)
        } finally {
          // Even a failed /user lookup or a non-human account must not leave a token behind.
          try {
            await gh.revokeToken(accessToken)
          } catch {
            console.warn('GitHub 授权撤销未完成')
          }
        }
        if (user?.type === 'User' && isSessionUser(user)) {
          headers.append('Set-Cookie', await sessionSetCookie(env, { id: user.id, login: user.login }, Date.now()))
          result = 'ok'
        }
      } catch {
        result = 'failed'
      }
    }
  }
  headers.set('Location', `/submit?login=${result}`)
  return new Response(null, { status: 302, headers })
})

export const onRequest: PagesFunction<Env> = (context) => handleSubmitApi(context, () => submitMethodNotAllowed('GET'))
