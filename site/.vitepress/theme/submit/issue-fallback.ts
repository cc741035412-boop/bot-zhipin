import { encodeToken } from '../../../../scripts/lib/bundle-web.mjs'
import { URL_LIMITS } from '../../../../scripts/submission/bundle-core.mjs'
import { SITE } from '../../meta.mjs'

export async function issueFallbackUrl(plaintext: string, { name }: { name: string }) {
  const token = await encodeToken(plaintext)
  const base = `${SITE.repo}/issues/new?template=submit-bot.yml&title=${encodeURIComponent(`投稿：${name}`)}`
  const url = `${base}&bundle=${encodeURIComponent(token)}`
  return url.length > URL_LIMITS.issueUrl ? { url: base, needsPaste: true } : { url, needsPaste: false }
}
