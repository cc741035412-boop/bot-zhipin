import { ref } from 'vue'
import { DEFAULT_PITCHES } from '../meta.mjs'

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
