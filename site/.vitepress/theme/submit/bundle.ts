import { stripFence, unpack } from '../../../../scripts/submission/bundle-core.mjs'
import { decodeToken } from '../../../../scripts/lib/bundle-web.mjs'

export async function readBundleInput(text: string) {
  let input = stripFence(text)
  if (/^https?:\/\//i.test(input)) input = input.slice(input.indexOf('#') + 1)
  // unpack 自己处理容器首尾空白；原始明文不 trim，保证与令牌解码逐字一致。
  const plaintext = input.startsWith('BZB1:') ? await decodeToken(input)
    : /^\s*BOT-ZHIPIN-BUNDLE v1\r?\n/.test(text) ? text : input
  return { plaintext, bundle: unpack(plaintext) }
}

// 无片段返回 null。成功时先尽力暂存，再去片段；失败也清掉片段，错误由 UI 展示。
export async function readLocationBundle() {
  if (typeof location === 'undefined' || !location.hash) return null
  const input = location.hash.slice(1)
  try {
    const result = await readBundleInput(input)
    const { createStore } = await import('./store')
    const store = createStore()
    const previous = store.loadDraft()
    store.saveDraft(previous?.plaintext === result.plaintext
      ? { ...previous, token: input }
      : { plaintext: result.plaintext, token: input, license: false })
    return result
  } finally {
    history.replaceState(history.state, '', location.pathname + location.search)
  }
}
