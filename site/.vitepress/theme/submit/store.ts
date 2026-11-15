export interface Draft {
  plaintext?: string
  token?: string
  license?: boolean
  pr?: unknown
  result?: unknown
  [key: string]: unknown
}
const DRAFT = 'bz-submit'

export function createStore(options: { session?: Storage | null } = {}) {
  let session: Storage | null | undefined
  try { session = options.session === undefined ? window.sessionStorage : options.session } catch { /* 禁用存储或 SSR */ }
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
    loadDraft,
    clearDraft() { remove(session, DRAFT) },
    saveResult(result: unknown) { write(session, DRAFT, { ...loadDraft(), result }) },
  }
}
