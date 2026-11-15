export interface Draft {
  plaintext?: string
  token?: string
  license?: boolean
  pr?: unknown
  result?: unknown
  [key: string]: unknown
}
export interface StoredShot {
  receipt: string
  exp: number
  thumb?: string
  [key: string]: unknown
}
const DRAFT = 'bz-submit'
const PREFIX = 'bz-submit-shots:'

export function createStore(options: { session?: Storage | null; local?: Storage | null } = {}) {
  let session: Storage | null | undefined, local: Storage | null | undefined
  try { session = options.session === undefined ? window.sessionStorage : options.session } catch { /* 禁用存储或 SSR */ }
  try { local = options.local === undefined ? window.localStorage : options.local } catch { /* 同上 */ }
  const key = (uid: string | number, slug: string) => `${PREFIX}${uid}:${slug}`
  const read = (storage: Storage | null | undefined, name: string) => {
    try { return JSON.parse(storage?.getItem(name) || 'null') } catch { return null }
  }
  const write = (storage: Storage | null | undefined, name: string, value: unknown) => {
    try { storage?.setItem(name, JSON.stringify(value)) } catch { /* 隐私模式、配额不足 */ }
  }
  const remove = (storage: Storage | null | undefined, name: string) => {
    try { storage?.removeItem(name) } catch { /* 尽力清理 */ }
  }
  const loadDraft = (): Draft | null => {
    const value = read(session, DRAFT)
    return value && typeof value === 'object' && !Array.isArray(value) ? value : null
  }
  return {
    saveDraft(draft: Draft) { write(session, DRAFT, draft) },
    inappDismissed() { return read(session, 'bz-submit-inapp-dismissed') === true },
    dismissInapp() { write(session, 'bz-submit-inapp-dismissed', true) },
    switchAccount(uid: string | number) {
      const previous = read(session, 'bz-submit-account')
      write(session, 'bz-submit-account', uid)
      return previous !== null && previous !== uid
    },
    loadDraft,
    clearDraft() { remove(session, DRAFT) },
    saveResult(result: unknown) { write(session, DRAFT, { ...loadDraft(), result }) },
    saveShot(uid: string | number, slug: string, slot: number, shot: StoredShot | null) {
      if (!Number.isInteger(slot) || slot < 0 || slot >= 30) return
      const saved = read(local, key(uid, slug))
      const shots = Array.isArray(saved) ? saved : []
      shots[slot] = shot
      write(local, key(uid, slug), shots)
    },
    loadShots(uid: string | number, slug: string, now = Date.now()): (StoredShot | null)[] {
      const saved = read(local, key(uid, slug))
      if (!Array.isArray(saved)) return []
      // 不用 filter：过期槽保留 null，绝不把后面的回执移到别的截图槽。
      const shots = saved.map((shot) => shot && typeof shot.receipt === 'string' &&
        Number.isFinite(shot.exp) && shot.exp > now ? shot : null)
      write(local, key(uid, slug), shots)
      return shots
    },
    clearShots(uid: string | number, slug: string) { remove(local, key(uid, slug)) },
    clearShotsExcept(uid: string | number) {
      try {
        const keys: string[] = []
        for (let i = 0; i < (local?.length || 0); i++) {
          const name = local!.key(i)
          if (name?.startsWith(PREFIX) && !name.startsWith(`${PREFIX}${uid}:`)) keys.push(name)
        }
        for (const name of keys) remove(local, name)
        return keys.length > 0
      } catch { /* 存储不可用不能中断登录 */ }
      return false
    },
  }
}
