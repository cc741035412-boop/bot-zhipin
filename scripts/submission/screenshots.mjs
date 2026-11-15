import { imageFormat, MAX_IMAGE_BYTES } from '../lib/validate/images.mjs'
import { LIMITS } from './bundle.mjs'
import { planScreenshots } from './screenshot-plan.mjs'
import { fail } from './errors.mjs'

const bad = (problem, fix = '请拖入真实的 PNG/JPG/WEBP/GIF 截图，每张不超过 2MB；不要粘贴外站图片地址。') => fail('Issue', 'screenshots', problem, fix)
const attachmentPrefix = 'https://github.com/user-attachments/assets/'
// GitHub 附件实际 302 到官方存储桶的预签名地址（2026-11-15 真实联调确认）；只放行这一个确切主机，且只能作为重定向目标。
const GITHUB_ASSET_BUCKET = 'github-production-user-asset-6210df.s3.amazonaws.com'

export function assertImageUrl(value, initial = false) {
  let url
  try { url = new URL(value) } catch { bad('截图地址不是合法 URL。') }
  const hostAllowed = url.hostname === 'github.com' || (url.hostname.endsWith('.githubusercontent.com') && url.hostname !== '.githubusercontent.com') ||
    (!initial && url.hostname === GITHUB_ASSET_BUCKET)
  if (url.protocol !== 'https:' || url.username || url.password || url.port || !hostAllowed ||
      (initial && (!value.startsWith(attachmentPrefix) || url.hostname !== 'github.com' || !url.pathname.startsWith('/user-attachments/assets/') || url.pathname === '/user-attachments/assets/'))) {
    bad('截图地址不在白名单：只接受 https://github.com/user-attachments/assets/ 下的附件，重定向只能到 GitHub 图片主机。')
  }
  return url.href
}

/** 同时提取 Markdown 图片和 GitHub 拖图生成的 HTML img，保持原始顺序。 */
export function extractImageUrls(text) {
  // 截图可选（DECISIONS 第 43 条）：新表单没有截图栏，旧表单的截图栏可以留空。
  const matches = [...(text || '').matchAll(/!\[[^\]\n]*\]\(\s*(?:<([^>\n]+)>|([^\s)]+))(?:\s+["'][^\n]*?["'])?\s*\)|<img\b[^>]*>/gi)]
  const urls = matches.map((match) => {
    if (match[1] || match[2]) return match[1] || match[2]
    const src = /\bsrc\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/i.exec(match[0])
    if (!src) bad('图片标签缺少 src 地址。')
    return (src[1] ?? src[2] ?? src[3]).replaceAll('&amp;', '&')
  })
  if (urls.length > LIMITS.files) bad('截图过多，投稿总文件数最多 30 个。')
  urls.forEach((url) => assertImageUrl(url, true))
  return urls
}

/** manual 重定向：发下一次请求之前也检查，防止先访问内网再检查最终 URL。 */
export async function downloadImage(url, { fetchImpl = fetch, timeoutMs = 20_000 } = {}) {
  const controller = new AbortController()
  let timer
  const timeout = new Promise((_, reject) => {
    timer = setTimeout(() => { controller.abort(); reject(new Error('下载超时')) }, timeoutMs)
  })
  const download = async () => {
    let current = assertImageUrl(url, true)
    for (let redirects = 0; redirects <= 5; redirects++) {
      const response = await fetchImpl(current, { redirect: 'manual', signal: controller.signal, credentials: 'omit' })
      if (response.url) assertImageUrl(response.url)
      if ([301, 302, 303, 307, 308].includes(response.status)) {
        const location = response.headers.get('location')
        await response.body?.cancel()
        if (!location || redirects === 5) bad('截图重定向次数过多或缺少目标地址。')
        current = assertImageUrl(new URL(location, current).href)
        continue
      }
      if (!response.ok || !response.body) bad('截图下载失败，请确认附件仍可访问，重新拖图后提交。')
      const size = Number(response.headers.get('content-length'))
      if (size > MAX_IMAGE_BYTES) { await response.body.cancel(); bad('截图超过 2MB。') }
      const reader = response.body.getReader()
      let total = 0
      const chunks = []
      try {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          total += value.byteLength
          if (total > MAX_IMAGE_BYTES) { await reader.cancel(); bad('截图超过 2MB。') }
          chunks.push(Buffer.from(value))
        }
      } finally { reader.releaseLock() }
      const bytes = Buffer.concat(chunks)
      if (!imageFormat(bytes)) bad('截图文件头无法识别，不能只改扩展名伪装图片。')
      return bytes
    }
  }
  try {
    return await Promise.race([download(), timeout])
  } catch (error) {
    if (error.errors) throw error
    bad('截图下载失败或超过 20 秒，请重新拖图后重试。')
  } finally {
    clearTimeout(timer)
    controller.abort()
  }
}

/** 只生成文件计划，不写盘。图片扩展名以文件头为准，并修正本地 Markdown 引用。 */
export function makeFilePlan(bundle, images) {
  const bytes = images.map((image) => Buffer.from(image))
  const plan = planScreenshots(bundle, bytes.map((image) => ({ size: image.length, format: imageFormat(image) })))
  const files = { ...plan.files }
  plan.images.forEach(({ name }, index) => { files[`bots/${bundle.slug}/screenshots/${name}`] = bytes[index] })
  return { slug: bundle.slug, files }
}
