export const TEMPLATE_META_URL = 'https://api2.cursor.sh/aiserver.v1.GrokBotService/GetPublicGrokBotTemplate'
export function shareIdOf(url) {
  return typeof url === 'string' ? /^https:\/\/x\.ai\/bot\/([A-Za-z0-9_-]+)$/.exec(url)?.[1] ?? null : null
}

export async function fetchTemplateMeta(shareId, { fetch, timeoutMs = 8000, retries = 1 } = {}) {
  for (let attempt = 0; ; attempt++) {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), timeoutMs)
    let status = 0, result
    try {
      const response = await fetch(TEMPLATE_META_URL, { method: 'POST', signal: controller.signal,
        headers: { 'Content-Type': 'application/json', 'Connect-Protocol-Version': '1' }, body: JSON.stringify({ shareId }) })
      status = response.status
      let body
      if (status !== 404) {
        try { body = await response.json() }
        catch (error) { if (!(error instanceof SyntaxError)) throw error }
      }
      if (status === 404 || body?.code === 'not_found') return { ok: false, kind: 'not_found', status }
      const t = body?.template
      const date = new Date(Number(t?.updatedAtMs))
      if (status === 200 && Number.isSafeInteger(t?.activeVersion) && t.activeVersion > 0 && Number.isFinite(+date)) {
        return { ok: true, version: t.activeVersion, updatedAt: date.toISOString(), published: t.published, name: t.name }
      }
      result = { ok: false, kind: 'error', status, message: status === 200 ? '模板数据格式不对' : `HTTP ${status}` }
      if (status !== 429 && status < 500) return result
    } catch {
      result = { ok: false, kind: 'error', status, message: controller.signal.aborted ? '查询超时' : '网络错误' }
    } finally { clearTimeout(timer) }
    if (attempt >= retries) return result
    await new Promise(resolve => setTimeout(resolve, 2000))
  }
}

// Adapter failures must not prevent publication; never echo upstream text into a PR.
export async function lookupVersion(url, lookup) {
  const id = shareIdOf(url)
  try { if (id) return await lookup(id) } catch { /* best effort */ }
  return { ok: false, kind: 'error' }
}
