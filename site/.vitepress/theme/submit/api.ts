export interface ApiFailure {
  status: number
  error: string
  message: string
  retryAfter?: number
  [key: string]: unknown
}
const networkFailure = (error = 'network_error'): ApiFailure => ({
  status: 0, error, message: '网络好像断了，检查一下网络再试。',
})
function failure(status: number, body: unknown, retry: string | null): ApiFailure {
  const data = body && typeof body === 'object' && !Array.isArray(body) ? body as Record<string, unknown> : {}
  const result = {
    error: status >= 500 ? 'github_error' : 'bad_request',
    message: '请求没有完成，请稍后再试。', ...data, status,
  } as ApiFailure
  if (result.retryAfter === undefined && retry !== null && Number.isFinite(Number(retry))) result.retryAfter = Number(retry)
  return result
}
async function request(path: string, init: RequestInit = {}) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), 30_000)
  try {
    const response = await fetch(path, { ...init, credentials: 'same-origin', signal: controller.signal })
    if (response.status === 204 && response.ok) return null
    let body
    try { body = await response.json() } catch {
      if (response.ok) throw failure(response.status, { error: 'bad_response', message: '服务器返回的内容不完整，请重试。' }, null)
    }
    if (!response.ok) throw failure(response.status, body, response.headers.get('Retry-After'))
    return body
  } catch (error) {
    if (error && typeof error === 'object' && 'status' in error) throw error
    throw networkFailure(controller.signal.aborted ? 'timeout' : 'network_error')
  } finally { clearTimeout(timer) }
}

export const me = () => request('/api/auth/me')
export function startLogin() { location.assign('/api/auth/start') }
export const logout = () => request('/api/auth/logout', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}' })
export const status = (pr: string | number) => request(`/api/submit/status?pr=${encodeURIComponent(pr)}`)
// 投稿不收截图（DECISIONS 第 43 条）：只提交文本投稿包，后端截图接口留给旧页面兼容。
export function submit({ plaintext, license, dryRun }: {
  plaintext: string; license: boolean; dryRun?: boolean
}) {
  return request('/api/submit', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ bundle: plaintext, license, ...(dryRun === undefined ? {} : { dryRun }) }),
  })
}
