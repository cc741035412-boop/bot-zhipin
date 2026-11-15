import { unpack, stripFence, LIMITS } from '../submission/bundle-core.mjs'
import { fail } from '../submission/errors.mjs'

const bad = (problem) => fail('投稿包', '格式与安全边界', problem, '请让 AI 按 BOT-ZHIPIN-BUNDLE v1 格式重新生成投稿包。')
const base64url = (bytes) => {
  // 分块，避免大包展开为函数参数导致栈溢出；兼容尚无 toBase64 的浏览器。
  let binary = ''
  for (let i = 0; i < bytes.length; i += 8192) binary += String.fromCharCode(...bytes.subarray(i, i + 8192))
  return btoa(binary).replaceAll('+', '-').replaceAll('/', '_').replace(/=+$/, '')
}
const streamOf = (bytes) => new ReadableStream({ start(controller) { controller.enqueue(bytes); controller.close() } })

export async function encodeToken(text) {
  unpack(text)
  const stream = streamOf(new TextEncoder().encode(text)).pipeThrough(new CompressionStream('gzip'))
  const bytes = new Uint8Array(await new Response(stream).arrayBuffer())
  return `BZB1:${base64url(bytes)}`
}

export async function decodeToken(input) {
  const token = stripFence(input)
  if (token.length > 720_000 || !/^BZB1:[A-Za-z0-9_-]+$/.test(token)) bad('压缩令牌格式不正确，应为一行 BZB1: 开头的 base64url。')
  let text
  try {
    const encoded = token.slice(5)
    // BZB1 omits padding; strict native decoding requires a complete last chunk.
    const enc = encoded + '='.repeat((4 - encoded.length % 4) % 4)
    let bytes
    if (typeof Uint8Array.fromBase64 === 'function') {
      bytes = Uint8Array.fromBase64(enc, { alphabet: 'base64url', lastChunkHandling: 'strict' })
    } else {
      const remainder = encoded.length % 4
      const last = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_'.indexOf(encoded.at(-1))
      if (remainder === 1 || (remainder === 2 && (last & 15)) || (remainder === 3 && (last & 3))) throw new Error('非规范编码')
      const binary = atob(encoded.replaceAll('-', '+').replaceAll('_', '/'))
      bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0))
    }
    const reader = streamOf(bytes).pipeThrough(new DecompressionStream('gzip')).getReader()
    const chunks = []
    let total = 0
    try {
      for (;;) {
        const { done, value } = await reader.read()
        if (done) break
        total += value.byteLength
        if (total > LIMITS.expandedBytes) {
          await reader.cancel()
          bad('投稿包展开后不能超过 512KB。')
        }
        chunks.push(value)
      }
    } finally { reader.releaseLock() }
    const expanded = new Uint8Array(total)
    let offset = 0
    for (const chunk of chunks) { expanded.set(chunk, offset); offset += chunk.length }
    text = new TextDecoder('utf-8', { fatal: true, ignoreBOM: true }).decode(expanded)
  } catch (error) {
    if (error.errors) throw error
    bad('压缩令牌损坏、不是 UTF-8，或解压后超过 512KB。')
  }
  unpack(text)
  return text
}
