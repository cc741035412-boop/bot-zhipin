import { readFile, writeFile } from 'node:fs/promises'
import { createHash } from 'node:crypto'
import { join } from 'node:path'

/** buildEnd sees the final HTML, including VitePress's appearance/router bootstraps. */
export async function generateHeaders(outDir) {
  const html = await readFile(join(outDir, 'submit.html'), 'utf8')
  const scripts = [...html.matchAll(/<script\b(?![^>]*\bsrc\s*=)[^>]*>([\s\S]*?)<\/script>/gi)].map((m) => m[1])
  const hashes = [...new Set(scripts.map((code) => `'sha256-${createHash('sha256').update(code, 'utf8').digest('base64')}'`))]
  if (!hashes.length) throw new Error('投稿页没有内联脚本，请检查 CSP 生成器。')
  const csp = `default-src 'self'; script-src 'self' ${hashes.join(' ')}; style-src 'self' 'unsafe-inline'; img-src 'self' blob: data: https://avatars.githubusercontent.com; connect-src 'self'; base-uri 'none'; form-action 'self'; object-src 'none'; frame-ancestors 'none'`
  await writeFile(join(outDir, '_headers'), `/*\n  Content-Security-Policy: frame-ancestors 'none'\n/submit\n  Content-Security-Policy: ${csp}\n/submit.html\n  Content-Security-Policy: ${csp}\n`)
}
