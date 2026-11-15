import { afterEach, expect, it, vi } from 'vitest'
import { gzipSync } from 'node:zlib'
import { encode, decode } from '../../scripts/submission/bundle.mjs'
import { pack, unpack, LIMITS, URL_LIMITS } from '../../scripts/submission/bundle-core.mjs'
import { encodeToken, decodeToken } from '../../scripts/lib/bundle-web.mjs'

const text = pack({ slug: 'web-bot', files: { 'bots/web-bot/ROLE.md': '\uFEFF中文😀\r\n尾行\n\n' }, screenshots: ['shot.png'] })
afterEach(() => vi.unstubAllGlobals())
it('Web 压缩解压保持中文、BOM、CRLF 和尾换行', async () => {
  const token = await encodeToken(text)
  expect(token).toMatch(/^BZB1:[A-Za-z0-9_-]+$/)
  expect(await decodeToken(token)).toBe(text)
})
it('Node → Web 兼容首尾空白和围栏', async () => {
  expect(await decodeToken(` \n${encode(text)}\n `)).toBe(text)
  expect(await decodeToken(`\`\`\`text\n${encode(text)}\n\`\`\``)).toBe(text)
})
it('Web → Node 逐字往返', async () => expect(decode(await encodeToken(text))).toBe(text))
it('压缩前必须先校验明文', async () => {
  await expect(encodeToken('不是投稿包')).rejects.toThrow('投稿包版本或开头不正确')
})
it.each(['BZB1:bad', 'BZB1:***', 'BZB2:abc', '', 'BZB1:A', 'BZB1:' + 'a'.repeat(720000)])('坏令牌给中文诊断（%#）', async (token) => {
  await expect(decodeToken(token)).rejects.toMatchObject({ errors: [expect.objectContaining({ file: '投稿包', where: '格式与安全边界', problem: expect.stringMatching(/压缩令牌/) })] })
})
it('拒绝无效 UTF-8', async () => {
  const token = `BZB1:${gzipSync(new Uint8Array([255])).toString('base64url')}`
  await expect(decodeToken(token)).rejects.toThrow('UTF-8')
})
it('真实 gzip 解压炸弹与 unpack 使用同款超限诊断', async () => {
  const oversized = 'x'.repeat(LIMITS.expandedBytes + 1)
  let expected
  try { unpack(oversized) } catch (error) { expected = error.errors }
  const token = `BZB1:${gzipSync(oversized).toString('base64url')}`
  await expect(decodeToken(token)).rejects.toMatchObject({ errors: expected })
})
it('流累计超限立刻 cancel，不继续读取', async () => {
  const cancel = vi.fn()
  let reads = 0
  vi.stubGlobal('DecompressionStream', class {
    constructor() {
      this.writable = new WritableStream()
      this.readable = new ReadableStream({
        pull(controller) { reads++; controller.enqueue(new Uint8Array(LIMITS.expandedBytes / 2 + 1)) }, cancel,
      }, { highWaterMark: 0 })
    }
  })
  await expect(decodeToken(encode(text))).rejects.toThrow('投稿包展开后不能超过 512KB')
  expect(cancel).toHaveBeenCalledOnce()
  expect(reads).toBe(2)
})
it('解压成功后仍检查容器及非规范 base64url', async () => {
  await expect(decodeToken(`BZB1:${gzipSync('not a bundle').toString('base64url')}`)).rejects.toThrow('投稿包版本')
  await expect(decodeToken('BZB1:AB')).rejects.toThrow('损坏')
})
it('URL 限额公开且不可修改', () => {
  expect(URL_LIMITS).toEqual({ submitUrl: 16000, issueUrl: 7500 })
  expect(Object.isFrozen(URL_LIMITS)).toBe(true)
})
