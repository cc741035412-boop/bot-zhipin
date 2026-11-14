import { reactive } from 'vue'

// 只在客户端调用 fetch；SSR 的初始状态不含任何用户数据。
export const heatState = reactive({
  values: {} as Record<string, number>,
  status: 'idle' as 'idle' | 'loading' | 'ready' | 'failed',
})
let pending: Promise<boolean> | undefined

export function loadHeat(): Promise<boolean> {
  if (pending) return pending
  heatState.status = 'loading'
  pending = (async () => {
    try {
      const response = await fetch('/api/stats')
      const data = await response.json()
      if (!response.ok || data.ok !== true || !data.heat || typeof data.heat !== 'object' || Array.isArray(data.heat)) throw new Error('热度接口不可用')
      heatState.values = Object.fromEntries(Object.entries(data.heat).filter(([, value]) => typeof value === 'number' && Number.isFinite(value) && value >= 0)) as Record<string, number>
      heatState.status = 'ready'
      return true
    } catch {
      heatState.values = {}
      heatState.status = 'failed'
      return false
    } finally {
      pending = undefined
    }
  })()
  return pending
}

export function heatLabel(slug: string) {
  return `热度 ${heatState.values[slug] ?? (heatState.status === 'ready' ? 0 : heatState.status === 'failed' ? '—' : '…')}`
}

export function reportClick(slug: string, kind: 'import' | 'prompt') {
  // 不 await：复制和新标签跳转均不依赖接口成功。
  void fetch('/api/click', {
    method: 'POST',
    keepalive: true,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ slug, kind }),
  }).then(async (response) => {
    if (!response.ok) return
    const data = await response.json()
    if (data.ok === true && typeof data.heat === 'number' && Number.isFinite(data.heat) && data.heat >= 0) {
      heatState.values[slug] = data.heat
    }
  }).catch(() => {})
}
