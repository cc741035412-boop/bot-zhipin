// Node 读取适配器：读 squads/<slug>/squad.yaml，不跟随符号链接；解析和校验由纯内核完成。
import { lstatSync, readdirSync, readFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { BOTS_DIR, ROOT } from './load-bots.mjs'
import { buildSquadModel, SQUAD_YAML_BYTES } from './squad-model.mjs'

/**
 * 小队目录：SQUADS_DIR 指定了就用它；否则取 Bot 目录的兄弟目录 <上级>/squads。
 * 默认 Bot 目录是 bots/，所以默认就是 squads/；只设 BOTS_DIR（比如指到 fixtures）时跟着走。目录不存在就当没有小队。
 */
export function squadsDirFor(botsDir = BOTS_DIR) {
  return process.env.SQUADS_DIR ? resolve(ROOT, process.env.SQUADS_DIR) : join(dirname(resolve(botsDir)), 'squads')
}
export const SQUADS_DIR = squadsDirFor()

export function listSquadDirs(squadsDir = SQUADS_DIR) {
  if (!lstatSync(squadsDir, { throwIfNoEntry: false })?.isDirectory()) return []
  return readdirSync(squadsDir, { withFileTypes: true })
    .filter((d) => (d.isDirectory() || d.isSymbolicLink()) && !d.name.startsWith('_') && !d.name.startsWith('.'))
    .map((d) => d.name).sort()
}

export function loadSquad(slug, squadsDir = SQUADS_DIR) {
  const dir = join(squadsDir, slug), yamlPath = join(dir, 'squad.yaml')
  const base = { dir, yamlPath, rel: `squads/${slug}`, yamlRel: `squads/${slug}/squad.yaml` }
  // 整个文件夹是符号链接时不进去读。
  if (lstatSync(dir, { throwIfNoEntry: false })?.isSymbolicLink()) return { ...buildSquadModel(slug, { raw: null, symlinks: ['.'] }), ...base }
  const extras = [], symlinks = []
  let raw = null
  for (const name of readdirSync(dir).sort()) {
    const stat = lstatSync(join(dir, name), { throwIfNoEntry: false })
    if (!stat) continue
    if (stat.isSymbolicLink()) symlinks.push(name)
    else if (name !== 'squad.yaml' || !stat.isFile()) extras.push(name)
    // 超限的文件不读进内存：给一个刚好超限的占位，让内核报「文件太大」。
    else raw = stat.size > SQUAD_YAML_BYTES ? ' '.repeat(SQUAD_YAML_BYTES + 1) : readFileSync(yamlPath, 'utf8')
  }
  return { ...buildSquadModel(slug, { raw, extras, symlinks }), ...base }
}

export function loadAllSquads(squadsDir = SQUADS_DIR) {
  return listSquadDirs(squadsDir).map((slug) => loadSquad(slug, squadsDir))
}
