// Node 压缩适配器；容器规则由浏览器和服务端共用。
import { gzipSync, gunzipSync } from 'node:zlib'
import { unpack, stripFence, LIMITS } from './bundle-core.mjs'
import { fail } from './errors.mjs'
export * from './bundle-core.mjs'

const bad = (problem, fix = '请让 AI 按 BOT-ZHIPIN-BUNDLE v1 格式重新生成投稿包。') => fail('投稿包', '格式与安全边界', problem, fix)

export function encode(text) {
  unpack(text)
  return `BZB1:${gzipSync(Buffer.from(text, 'utf8')).toString('base64url')}`
}

/** 解压限额由 zlib 在分配输出时执行，不能等解压完再量大小。 */
export function decode(input) {
  const token = stripFence(input)
  if (token.length > 720_000 || !/^BZB1:[A-Za-z0-9_-]+$/.test(token)) bad('压缩令牌格式不正确，应为一行 BZB1: 开头的 base64url。')
  let text
  try {
    const encoded = token.slice(5)
    const bytes = Buffer.from(encoded, 'base64url')
    if (bytes.toString('base64url') !== encoded) throw new Error('非规范编码')
    text = new TextDecoder('utf-8', { fatal: true, ignoreBOM: true }).decode(gunzipSync(bytes, { maxOutputLength: LIMITS.expandedBytes }))
  } catch {
    bad('压缩令牌损坏、不是 UTF-8，或解压后超过 512KB。')
  }
  unpack(text)
  return text
}
