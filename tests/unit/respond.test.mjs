import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { ApiError } from '../../functions/_lib/errors.ts'
import { GitHubError } from '../../functions/_lib/github.ts'
import { ERRORS, fail, handleSubmitApi } from '../../functions/_lib/respond.ts'
import { assertMediaType, assertSameOrigin, isSameOrigin, mediaType } from '../../functions/_lib/origin.ts'
import { validateClickHeaders } from '../../functions/_lib/http.ts'

const context = { env: {}, waitUntil: () => {} }
const req = (headers = {}) => new Request('https://example.test/api/submit', { headers })
beforeEach(() => vi.spyOn(Math, 'random').mockReturnValue(0.5))
afterEach(() => vi.restoreAllMocks())
function secure(response) {
  expect(response.headers.get('Cache-Control')).toBe('no-store')
  expect(response.headers.get('X-Content-Type-Options')).toBe('nosniff')
  expect(response.headers.get('Content-Security-Policy')).toBe("frame-ancestors 'none'")
  expect(response.headers.has('Access-Control-Allow-Origin')).toBe(false)
}

describe('投稿公共响应', () => {
  it.each(Object.entries(ERRORS))('%s 的中文默认错误、状态和安全头', async (code, { status, message }) => {
    const response = await handleSubmitApi(context, () => fail(code))
    expect(response.status).toBe(status)
    if (code === 'rate_limited') expect(response.headers.get('Retry-After')).toBe('1')
    expect(await response.json()).toEqual({ ok: false, error: code, message })
    secure(response)
  })

  it('附加 fields 保持原样；429 同时给 Retry-After', async () => {
    const extra = { errors: [{ file: 'demo', where: 'x', problem: '问题', fix: '修改' }], retryAfter: 17, requestId: 'abcd1234', slots: [0, 2], pulls: [{ number: 1, url: 'https://example.test/1', slug: 'demo' }] }
    const response = await handleSubmitApi(context, () => fail('rate_limited', extra))
    expect(response.headers.get('Retry-After')).toBe('17')
    expect(await response.json()).toEqual({ ok: false, error: 'rate_limited', message: ERRORS.rate_limited.message, ...extra })
  })

  it('ApiError.message 不参与响应，extra 不能伪造成功', async () => {
    const error = new ApiError(400, 'bad_request', { ok: true, message: 'private detail' })
    error.message = 'sensitive diagnostic'
    const response = await handleSubmitApi(context, () => { throw error })
    expect(await response.json()).toEqual({ ok: false, error: 'bad_request', message: ERRORS.bad_request.message })
  })

  it.each([['github_error', 502, () => new GitHubError(401)], ['server_error', 500, () => new Error('private upstream diagnostic')]])('异常 %s 隐去原文、不记日志，给 8 位随机 ID', async (code, status, make) => {
    const spies = ['log', 'warn', 'error'].map((name) => vi.spyOn(console, name))
    const ids = []
    for (let i = 0; i < 2; i++) {
      const error = make()
      error.message = 'private upstream diagnostic'
      const response = await handleSubmitApi(context, () => { throw error })
      expect(response.status).toBe(status)
      secure(response)
      const body = await response.json()
      expect(body.error).toBe(code)
      expect(body.requestId).toMatch(/^[a-f0-9]{8}$/)
      expect(JSON.stringify(body)).not.toContain(error.message)
      ids.push(body.requestId)
    }
    expect(ids[0]).not.toBe(ids[1])
    for (const spy of spies) expect(spy).not.toHaveBeenCalled()
  })

  it.each([200, 204, 302, 405])('成功、空响应、重定向和 405 都补安全头：%i', async (status) => {
    const response = await handleSubmitApi(context, () => new Response(null, { status, headers: { Location: '/submit', 'Set-Cookie': 'fake=example; HttpOnly' } }))
    expect(response.status).toBe(status)
    expect(response.headers.get('Set-Cookie')).toBe('fake=example; HttpOnly')
    secure(response)
  })
})

describe('来源与媒体类型（不改变点击旧行为）', () => {
  it('Origin 缺省/完全同源为真，协议/端口/null/空不匹配为假', () => {
    expect(isSameOrigin(req())).toBe(true)
    expect(isSameOrigin(req({ Origin: 'https://example.test' }))).toBe(true)
    for (const Origin of ['http://example.test', 'https://example.test:444', 'null', '']) expect(isSameOrigin(req({ Origin }))).toBe(false)
  })

  it.each(['cross-site', 'same-site', 'none', ''])('投稿拒绝非 same-origin 的 Sec-Fetch-Site：%s', (site) => {
    expect(() => assertSameOrigin(req({ 'Sec-Fetch-Site': site }))).toThrowError(expect.objectContaining({ status: 403, code: 'forbidden_origin' }))
  })

  it('投稿允许无来源头及同源，点击仍只拦 cross-site', () => {
    expect(() => assertSameOrigin(req())).not.toThrow()
    expect(() => assertSameOrigin(req({ Origin: 'https://example.test', 'Sec-Fetch-Site': 'same-origin' }))).not.toThrow()
    for (const site of ['same-site', 'none', '']) {
      expect(() => validateClickHeaders(req({ 'Content-Type': 'application/json', 'Sec-Fetch-Site': site }))).not.toThrow()
    }
    expect(() => validateClickHeaders(req({ 'Content-Type': 'application/json', 'Sec-Fetch-Site': 'cross-site' })))
      .toThrowError(expect.objectContaining({ code: 'forbidden' }))
  })

  it('mediaType 归一化参数/大小写，拒绝错误类型并保留旧点击错误码', () => {
    expect(mediaType(req())).toBeNull()
    expect(mediaType(req({ 'Content-Type': 'Application/JSON; charset=UTF-8' }))).toBe('application/json')
    expect(() => assertMediaType(req({ 'Content-Type': 'image/png' }), ['application/json', 'image/png'])).not.toThrow()
    expect(() => assertMediaType(req(), ['application/json'])).toThrowError(expect.objectContaining({ status: 415, code: 'unsupported_type' }))
    expect(() => validateClickHeaders(req())).toThrowError(expect.objectContaining({ status: 415, code: 'unsupported_media_type' }))
  })
})
