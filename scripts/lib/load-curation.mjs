// Node 读取适配器：读策展文件 curation/shelf.yaml，不跟随符号链接；文件不存在就当空。
import { lstatSync, readFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { BOTS_DIR, ROOT } from './load-bots.mjs'
import { buildCurationModel, CURATION_YAML_BYTES } from './squad-model.mjs'

/** 策展文件：CURATION_FILE 指定了就用它；否则取 Bot 目录的兄弟 <上级>/curation/shelf.yaml。 */
export function curationFileFor(botsDir = BOTS_DIR) {
  return process.env.CURATION_FILE ? resolve(ROOT, process.env.CURATION_FILE) : join(dirname(resolve(botsDir)), 'curation', 'shelf.yaml')
}
export const CURATION_FILE = curationFileFor()

export function loadCuration(file = CURATION_FILE) {
  const stat = lstatSync(file, { throwIfNoEntry: false })
  const base = { file, rel: 'curation/shelf.yaml' }
  if (!stat) return { ...buildCurationModel({ raw: null }), ...base }
  if (stat.isSymbolicLink() || !stat.isFile()) return { ...buildCurationModel({ raw: null, symlink: true }), ...base }
  const raw = stat.size > CURATION_YAML_BYTES ? ' '.repeat(CURATION_YAML_BYTES + 1) : readFileSync(file, 'utf8')
  return { ...buildCurationModel({ raw }), ...base }
}
