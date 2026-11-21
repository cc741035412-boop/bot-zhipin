// 维护者手动执行；需要 PATH 上有 FontTools 的 pyftsubset。构建只读最终的 OTF。
import { createHash } from 'node:crypto'
import { execFileSync } from 'node:child_process'
import { copyFile, mkdir, mkdtemp, readFile, rm, stat, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { shelfData } from '../site/.vitepress/data/bots.mjs'
import { SITE } from '../site/.vitepress/meta.mjs'

const release = 'https://raw.githubusercontent.com/notofonts/noto-cjk/Sans2.004/'
const hashes = {
  Bold: 'b5f0d1a190a7f9b43c310a8850630af12553df32c4c050543f9059732d9b4c0a',
  Medium: 'ca094f6b0001fb048ca39ddd797a0cdb0179e1e55c6561e111c49c3e6a61d7b7',
}
async function download(path, hash, dest) {
  execFileSync('curl', ['-fsSL', '--retry', '2', '--max-time', '120', release + path, '-o', dest], { stdio: 'inherit' })
  const bytes = await readFile(dest)
  if (createHash('sha256').update(bytes).digest('hex') !== hash) throw new Error(`${path} 的 sha256 不匹配`)
}
function unicodeList() {
  const chars = new Set()
  for (const [a, b] of [[32, 126], [0xa0, 0xff], [0x2000, 0x206f], [0x3000, 0x303f], [0xff00, 0xffef]]) {
    for (let i = a; i <= b; i++) chars.add(String.fromCodePoint(i))
  }
  const gbk = new TextDecoder('gbk')
  for (let row = 0xb0; row <= 0xf7; row++) {
    for (let col = 0xa1; col <= 0xfe; col++) {
      // 一级字区最后五个码位为空，不是 GB2312 汉字。
      if (row !== 0xd7 || col < 0xfa) chars.add(gbk.decode(Uint8Array.of(row, col)))
    }
  }
  const { bots, squads } = shelfData()
  for (const text of [...Object.values(SITE), ...[...bots, ...squads].flatMap(x => [x.name, x.nameZh, x.tagline])]) {
    for (const ch of text || '') chars.add(ch)
  }
  return [...chars].map(ch => ch.codePointAt(0).toString(16)).join(',')
}
const dir = new URL('./og/fonts/', import.meta.url)
const temp = await mkdtemp(join(tmpdir(), 'og-fonts-'))
try {
  const unicodeFile = join(temp, 'unicodes.txt')
  await writeFile(unicodeFile, unicodeList())
  const files = ['OFL.txt']
  await download('LICENSE', '6a73f9541c2de74158c0e7cf6b0a58ef774f5a780bf191f2d7ec9cc53efe2bf2', join(temp, 'OFL.txt'))
  for (const [weight, hash] of Object.entries(hashes)) {
    const name = `NotoSansCJKsc-${weight}.otf`, subset = `NotoSansSC-${weight}.subset.otf`
    await download(`Sans/OTF/SimplifiedChinese/${name}`, hash, join(temp, name))
    execFileSync('pyftsubset', [join(temp, name), `--unicodes-file=${unicodeFile}`, '--layout-features=', '--no-hinting', `--output-file=${join(temp, subset)}`], { stdio: 'inherit' })
    if ((await stat(join(temp, subset))).size > 3.5 * 1024 ** 2) throw new Error(`${subset} 超过体积限制`)
    files.push(subset)
  }
  await mkdir(dir, { recursive: true })
  for (const file of files) await copyFile(join(temp, file), new URL(file, dir))
} finally {
  await rm(temp, { recursive: true, force: true })
}
