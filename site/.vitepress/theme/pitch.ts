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
export function nextPitch(slug: string, pitch?: string | null) {
  if (pitch) return pitch
  const choices = DEFAULT_PITCHES.filter((text) => text !== previous.get(slug))
  const text = choices[Math.floor(Math.random() * choices.length)] || DEFAULT_PITCHES[0]
  previous.set(slug, text)
  return text
}
