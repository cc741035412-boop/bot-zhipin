import { ref } from 'vue'
import { DEFAULT_PITCHES, POKE_PITCHES, ANGRY_PITCH } from '../meta.mjs'
import type { StateId } from './vendor/bloub/states'

export const POKE_STATES: StateId[] = ['wink', 'burst', 'orbit', 'play', 'comet', 'egg', 'hexagon', 'thinking']
/** 同一 slug 在 Hero、卡片、详情间共享历史；工厂供离线单测使用。 */
export function createPokes(random = Math.random) {
  const history = new Map<string, { state?: StateId; text?: string; taps: number[] }>()
  return (slug: string, at = Date.now()) => {
    const prev = history.get(slug) ?? { taps: [] }
    const taps = [...prev.taps.filter((t) => at - t < 3000), at]
    if (taps.length >= 5) {
      history.set(slug, { ...prev, taps: [] })
      return { state: 'alert' as StateId, text: ANGRY_PITCH }
    }
    const states = POKE_STATES.filter((state) => state !== prev.state)
    const lines = POKE_PITCHES.filter((text) => text !== prev.text)
    const state = states[Math.floor(random() * states.length)]
    const text = lines[Math.floor(random() * lines.length)]
    history.set(slug, { state, text, taps })
    return { state, text }
  }
}
export const nextPoke = createPokes()

// 跨卡片、跨页面共享：全页只允许一个头像发言。
export const activePitch = ref<symbol | null>(null)
const previous = new Map<string, string>()
const turn = new Map<string, number>()
/**
 * 这次该说哪一句。pitch 可以是一句话，也可以是几句话的数组（摘要里的 pitches）。
 * 有专属台词：在它自己的几句里按顺序轮换，第一次说第一句，多于一句时不会连说同一句。
 * 没有专属台词：从通用池里随机挑，不连续重复。
 */
export function nextPitch(slug: string, pitch?: string | readonly string[] | null, random: () => number = Math.random) {
  const own = (typeof pitch === 'string' ? [pitch] : Array.isArray(pitch) ? pitch : [])
    .filter((text): text is string => typeof text === 'string' && text !== '')
  if (own.length) {
    const index = (turn.get(slug) ?? 0) % own.length
    turn.set(slug, index + 1)
    return own[index]
  }
  const choices = DEFAULT_PITCHES.filter((text) => text !== previous.get(slug))
  const text = choices[Math.floor(random() * choices.length)] || DEFAULT_PITCHES[0]
  previous.set(slug, text)
  return text
}
