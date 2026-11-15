import type { PagesFunction } from '@cloudflare/workers-types'
import { createGitHub } from '../../_lib/github'
import { json } from '../../_lib/http'
import { assertMediaType, assertSameOrigin, mediaType } from '../../_lib/origin'
import { handleSubmitApi, submitMethodNotAllowed } from '../../_lib/respond'
import { assertSubmitEnabled } from '../../_lib/submit-config'
import { readBytes, requireUser } from '../../_lib/submit-http'
import { uploadScreenshot } from '../../_lib/submit'
import type { Env } from '../../_lib/types'

export const onRequestPost: PagesFunction<Env> = (context) => handleSubmitApi(context, async (now) => {
  const { request, env } = context
  assertSubmitEnabled(env)
  const user = await requireUser(request, env, now)
  assertSameOrigin(request)
  assertMediaType(request, ['image/png', 'image/jpeg', 'image/webp', 'image/gif'])
  const bytes = await readBytes(request, 2097152, true)
  const result = await uploadScreenshot(bytes, mediaType(request)!, user, { github: createGitHub(env), db: env.DB, secrets: env, now })
  const headers: Record<string, string> = {}
  if (env.ALLOW_TEST_ENDPOINTS === '1') headers['X-Base64-Impl'] = typeof (bytes as Uint8Array & { toBase64?: unknown }).toBase64 === 'function' ? 'native' : 'buffer'
  return json(result, 200, headers)
})

export const onRequest: PagesFunction<Env> = (context) => handleSubmitApi(context, () => submitMethodNotAllowed('POST'))
