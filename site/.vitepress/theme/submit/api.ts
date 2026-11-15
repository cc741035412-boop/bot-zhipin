export interface ApiFailure {
  status: number
  error: string
  message: string
  retryAfter?: number
  slots?: number[]
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
export function submit({ plaintext, receipts, license, dryRun }: {
  plaintext: string; receipts: string[]; license: boolean; dryRun?: boolean
}) {
  return request('/api/submit', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ bundle: plaintext, screenshots: receipts, license, ...(dryRun === undefined ? {} : { dryRun }) }),
  })
}

export function uploadScreenshot(file: Blob, { onProgress, signal }: {
  onProgress?: (percent: number) => void; signal?: AbortSignal
} = {}): Promise<Record<string, unknown>> {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) { reject(networkFailure('aborted')); return }
    const xhr = new XMLHttpRequest()
    let settled = false
    const abort = () => xhr.abort()
    const finish = (error?: ApiFailure, value?: Record<string, unknown>) => {
      if (settled) return
      settled = true
      signal?.removeEventListener('abort', abort)
      if (error) reject(error)
      else { onProgress?.(100); resolve(value!) }
    }
    xhr.onload = () => {
      let body
      try { body = typeof xhr.response === 'object' && xhr.response !== null ? xhr.response : JSON.parse(xhr.responseText) } catch { /* 非 JSON 错误页 */ }
      if (xhr.status < 200 || xhr.status >= 300) finish(failure(xhr.status, body, xhr.getResponseHeader('Retry-After')))
      else if (!body || typeof body !== 'object') finish(failure(xhr.status, { error: 'bad_response' }, null))
      else finish(undefined, body)
    }
    xhr.onerror = () => finish(networkFailure())
    xhr.ontimeout = () => finish(networkFailure('timeout'))
    xhr.onabort = () => finish(networkFailure('aborted'))
    xhr.upload.onprogress = (event) => {
      if (!settled && event.lengthComputable && event.total > 0) onProgress?.(Math.max(0, Math.min(100, Math.round(event.loaded / event.total * 100))))
    }
    try {
      xhr.open('POST', '/api/submit/screenshot')
      xhr.timeout = 30_000
      // 同源 XHR 默认带同源 cookie；不添加 Content-Length（浏览器管理）或 X- 头。
      xhr.setRequestHeader('Content-Type', file.type)
      signal?.addEventListener('abort', abort, { once: true })
      onProgress?.(0)
      xhr.send(file)
    } catch { finish(networkFailure()) }
  })
}
