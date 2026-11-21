import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import opentype from '@shuding/opentype.js'
import { shelfData } from '../../site/.vitepress/data/bots.mjs'
import { ogImageFile } from '../lib/share.mjs'
import { renderCard } from './card.mjs'

export async function loadFonts() {
  const fonts = [], metrics = {}
  for (const [weight, suffix] of [[500, 'Medium'], [700, 'Bold']]) {
    const bytes = await readFile(new URL(`./fonts/NotoSansSC-${suffix}.subset.otf`, import.meta.url))
    const data = bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength)
    fonts.push({ name: 'Noto SC', weight, style: 'normal', data })
    metrics[weight] = opentype.parse(data)
  }
  return { fonts, metrics }
}
export async function generateOgImages(outDir) {
  const start = performance.now(), resources = await loadFonts(), { bots, squads } = shelfData()
  async function save(kind, data) {
    const slug = data?.slug ?? 'site', file = join(outDir, ogImageFile(kind, slug))
    const { png, emoji, missing } = await renderCard(kind, data, resources)
    if (emoji) console.warn(`[分享图] 去掉 emoji ${slug}`)
    if (missing) console.warn(`[分享图] 缺字 ${slug}：${missing}`)
    await mkdir(dirname(file), { recursive: true })
    await writeFile(file, png)
  }
  for (const bot of bots) await save('bot', bot)
  for (const squad of squads) await save('squad', squad)
  await save('site')
  console.log(`[分享图] 已生成 ${bots.length + squads.length + 1} 张（Bot ${bots.length}、小队 ${squads.length}、全站 1），用时 ${((performance.now() - start) / 1000).toFixed(1)} 秒`)
}
