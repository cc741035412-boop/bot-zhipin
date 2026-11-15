import { botFace } from './face'

// 与默认头像共用确定性种子，舞台和 Hero 的颜色不会在 hydration 时变化。
export function avatarSeed(slug: string) {
  let value = 0x811c9dc5
  for (let i = 0; i < slug.length; i++) value = Math.imul(value ^ slug.charCodeAt(i), 0x01000193)
  return value >>> 0
}
export function avatarColor(slug: string) {
  return botFace(slug).color
}
