export interface SubmitContext {
  index: Array<{ slug: string; name?: string; templateUrl?: string; authorGithub?: string | null; addedAt?: string; external?: boolean }>
  template: { files: Record<string, string> }
  copy?: { permissions: Record<string, string>; quota: Record<string, string> }
  limits?: { files: number; fileBytes: number; totalBytes: number; imageBytes: number }
}

let cached: Promise<SubmitContext> | undefined
export function loadContext(): Promise<SubmitContext> {
  if (!cached) {
    cached = (async () => {
      const response = await fetch('/api-data/submit-context.json', { credentials: 'same-origin' })
      if (!response.ok) throw new Error('暂时读不到投稿检查资料。')
      const data = await response.json()
      if (!Array.isArray(data?.index) || !data?.template?.files ||
          typeof data.template.files !== 'object' || Array.isArray(data.template.files) ||
          !Object.values(data.template.files).every((text) => typeof text === 'string')) {
        throw new Error('投稿检查资料格式不正确。')
      }
      return data
    })().catch((error) => { cached = undefined; throw error })
  }
  return cached
}
