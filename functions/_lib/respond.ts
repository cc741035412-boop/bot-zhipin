import { ApiError } from './errors'
import { GitHubError } from './github'
import { json, scheduleCleanup } from './http'
import { assertTestEndpoints } from './submit-config'
import type { ApiContext } from './types'

export const ERRORS = {
  bad_request: { status: 400, message: '投稿包格式不对，请让你的 AI 重新生成链接。' },
  license_required: { status: 400, message: '请先勾选授权。' },
  receipt_invalid: { status: 400, message: '有截图需要重新上传（带 slots）。' },
  unauthenticated: { status: 401, message: '请先用 GitHub 登录。' },
  session_expired: { status: 401, message: '登录已过期，请重新登录。' },
  forbidden_origin: { status: 403, message: '请在本站页面里提交。' },
  not_found: { status: 404, message: '找不到这个投稿。' },
  slug_taken: { status: 409, message: '这个英文短名已被别人使用，请让 AI 换一个。' },
  pr_limit: { status: 409, message: '你还有 3 个投稿在等待审核，先等它们处理完（带 pulls）。' },
  too_large: { status: 413, message: '文件太大了。' },
  unsupported_type: { status: 415, message: '只支持 PNG、JPG、WEBP、GIF 截图。' },
  invalid: { status: 422, message: '还没通过检查（见 errors）。' },
  rate_limited: { status: 429, message: '操作太频繁，请稍后再试（Retry-After 头 + retryAfter 秒）。' },
  github_error: { status: 502, message: 'GitHub 暂时没响应，请稍后再试（带 requestId）。' },
  submit_disabled: { status: 503, message: '网站投稿暂时关闭，请改用 GitHub Issue 投稿。' },
  server_error: { status: 500, message: '服务暂时不可用，请稍后再试。' },
  method_not_allowed: { status: 405, message: '不支持这个请求方法。' },
} as const

export function fail(code: keyof typeof ERRORS, extra: Record<string, unknown> = {}): never {
  throw new ApiError(ERRORS[code].status, code, extra)
}

function secure(response: Response): Response {
  // Rebuild immutable redirect responses, preserving separate Set-Cookie headers.
  const headers = new Headers(response.headers)
  headers.set('Cache-Control', 'no-store')
  headers.set('X-Content-Type-Options', 'nosniff')
  headers.set('Content-Security-Policy', "frame-ancestors 'none'")
  return new Response(response.body, { status: response.status, statusText: response.statusText, headers })
}

function requestId(): string {
  return crypto.randomUUID().replace(/-/g, '').slice(0, 8)
}

export async function handleSubmitApi(context: ApiContext, action: (now: number) => Response | Promise<Response>): Promise<Response> {
  const now = Date.now()
  let response: Response
  try {
    // Also covers unsupported methods and every auth/submit handler.
    assertTestEndpoints(context.env, context.request)
    scheduleCleanup(context, now)
    response = await action(now)
  } catch (error) {
    if (error instanceof ApiError) {
      const known = Object.hasOwn(ERRORS, error.code)
      const code = known ? error.code as keyof typeof ERRORS : 'server_error'
      const { status } = ERRORS[code]
      const message = code === 'github_error' && error.status === 503
        ? '状态暂时刷新不了，过一会儿再看' : ERRORS[code].message
      const headers: Record<string, string> = {}
      if (code === 'rate_limited') {
        const seconds = error.extra.retryAfter
        headers['Retry-After'] = String(typeof seconds === 'number' && Number.isFinite(seconds) ? Math.max(1, Math.ceil(seconds)) : 1)
      }
      response = json({ ...error.extra, ok: false, error: code, message }, known ? error.status : status, headers)
    } else {
      const code = error instanceof GitHubError ? 'github_error' : 'server_error'
      response = json({ ok: false, error: code, message: ERRORS[code].message, requestId: requestId() }, ERRORS[code].status)
    }
    // Never log or return exception messages/stacks (upstream errors may include credentials).
  }
  return secure(response)
}

export function submitMethodNotAllowed(allow: 'GET' | 'POST'): Response {
  return json({ ok: false, error: 'method_not_allowed', message: ERRORS.method_not_allowed.message }, 405, { Allow: allow })
}
