import { cpSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterEach, beforeEach, expect, it } from 'vitest'
import { buildAuthors } from '../../scripts/lib/authors.mjs'
import { loadAllSquads } from '../../scripts/lib/load-squads.mjs'
import { isPublicBot, isPublicSquad } from '../../scripts/lib/public-bot.mjs'
import { shelfData } from '../../site/.vitepress/data/bots.mjs'
import { ROOT, loadAllBots } from '../../scripts/lib/load-bots.mjs'
import { syncAssets } from '../../scripts/sync-assets.mjs'

let dir
const fixtures = join(ROOT, 'tests/fixtures')
beforeEach(() => { dir = mkdtempSync(join(tmpdir(), 'authors-')) })
afterEach(() => rmSync(dir, { recursive: true, force: true }))
function manifest(squadsDir = join(fixtures, 'squads')) {
  const apiData = join(dir, 'api-data')
  syncAssets({ botsDir: join(fixtures, 'bots'), squadsDir, out: join(dir, 'out'), apiData })
  return JSON.parse(readFileSync(join(apiData, 'authors.json'), 'utf8'))
}
it('fixtures 作者名单已去重且按 ASCII 升序', () => {
  expect(manifest()).toEqual(['another-example', 'example-user'])
})
it('清单与 fixtures 生成的作者页键列表一致', () => {
  const bots = loadAllBots(join(fixtures, 'bots')).filter(isPublicBot)
  const squads = loadAllSquads(join(fixtures, 'squads')).filter(isPublicSquad)
  const authors = buildAuthors(shelfData(bots, { squads, curation: {} }))
  expect(manifest()).toEqual(authors.map(author => author.key))
})
it('包括小队独有作者，大小写不同的同一作者只列一次', () => {
  const squads = join(dir, 'squads')
  cpSync(join(fixtures, 'squads'), squads, { recursive: true })
  const path = join(squads, 'demo-squad/squad.yaml')
  const raw = readFileSync(path, 'utf8')
  writeFileSync(path, raw.replace('github: example-user', 'github: Squad-Only'))
  expect(manifest(squads)).toEqual(['another-example', 'example-user', 'squad-only'])
  writeFileSync(path, raw.replace('github: example-user', 'github: Example-User'))
  expect(manifest(squads)).toEqual(['another-example', 'example-user'])
})
