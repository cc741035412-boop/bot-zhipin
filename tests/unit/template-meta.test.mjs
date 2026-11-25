import { expect, it, vi } from 'vitest'
import { fetchTemplateMeta, shareIdOf, TEMPLATE_META_URL } from '../../scripts/lib/template-meta.mjs'
const shareId = 'gOdlWNIcvTPU_C8iHklMS'
const template = { shareId, name: '额度省省助手', avatarShape: 'tablet', avatarColor: 'yellow', createdAtMs: '1791261604921', updatedAtMs: '1791261741783', blobObjectKey: `templates/${shareId}_v1.json`, published: true, activeVersion: 1, ownerType: 'GROK_BOT_TEMPLATE_OWNER_TYPE_USER' }
it('公开接口请求及返回', async () => {
  const fetch = vi.fn(async () => Response.json({ template, ownerDisplayName: '铁柱AGI' }))
  expect(await fetchTemplateMeta(shareId, { fetch })).toEqual({ ok: true, version: 1, name: template.name, published: true, updatedAt: '2026-10-06T04:42:21.783Z' })
  expect(fetch).toHaveBeenCalledWith(TEMPLATE_META_URL, expect.objectContaining({ method: 'POST', body: JSON.stringify({ shareId }) }))
})
it.each([[404, {}, 'not_found'], [400, { code: 'not_found' }, 'not_found'], [400, {}, 'error'], [200, {}, 'error'], [200, { template: { ...template, activeVersion: 0 } }, 'error']])('HTTP %i %j', async (status, body, kind) => {
  expect(await fetchTemplateMeta(shareId, { fetch: async () => Response.json(body, { status }) })).toMatchObject({ ok: false, status, kind })
})
it('超时取消请求', async () => {
  const fetch = (_, { signal }) => new Promise((_, reject) => signal.addEventListener('abort', reject))
  expect(await fetchTemplateMeta(shareId, { fetch, retries: 0, timeoutMs: 2 })).toMatchObject({ kind: 'error', message: '查询超时' })
})
it('503 等两秒重试', async () => {
  vi.useFakeTimers()
  try {
    const fetch = vi.fn().mockResolvedValueOnce(Response.json({}, { status: 503 })).mockResolvedValueOnce(Response.json({ template }))
    const result = fetchTemplateMeta(shareId, { fetch })
    await vi.advanceTimersByTimeAsync(1999); expect(fetch).toHaveBeenCalledTimes(1)
    await vi.advanceTimersByTimeAsync(1); expect((await result).ok).toBe(true)
  } finally { vi.useRealTimers() }
})
it.each([['https://x.ai/bot/abc_-', 'abc_-'], ['https://x.ai/bot/a?b', null], ['http://x.ai/bot/a', null], [null, null]])('模板链接 %s', (url, id) => expect(shareIdOf(url)).toBe(id))
