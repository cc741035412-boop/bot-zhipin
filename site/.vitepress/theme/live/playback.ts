import { STATE_BY_ID, type StateId } from '../vendor/bloub/states'

export interface Play { state: StateId; hold?: number }

/** 只消费共享时钟的秒数；基础状态改变不会打断有限时长的动作。 */
export function createPlayback(initial: StateId, change: (state: StateId, t: number) => void) {
  let rest = initial
  let state = initial
  let action: { state: StateId; until: number } | null = null
  function set(next: StateId, t: number) { state = next; change(next, t) }
  function reset(t: number, reduced = false) {
    action = null
    set(reduced ? 'idle' : rest, t)
  }
  return {
    get state() { return state },
    get busy() { return action !== null && action.until !== Infinity },
    play(detail: Play, t: number) {
      const def = detail && STATE_BY_ID.get(detail.state)
      if (!def) return
      const hold = detail.hold === Infinity ? Infinity
        : Number.isFinite(detail.hold) ? Math.max(0, detail.hold!) : def.duration
      action = { state: def.id, until: t + hold }
      set(def.id, t)
    },
    setRest(next: StateId, t: number) {
      rest = next
      // wide/Infinity 是悬停的常驻反馈；离开可以释放，戳和睡眠不能被误取消。
      if (!action || (action.state === 'wide' && action.until === Infinity)) reset(t)
    },
    tick(t: number) { if (action && t >= action.until) reset(t) },
    reset,
  }
}
