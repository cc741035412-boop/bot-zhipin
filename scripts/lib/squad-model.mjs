// 与存储无关的小队和策展模型：只解析 YAML，不读盘。读盘在 load-squads.mjs、load-curation.mjs。
import YAML from 'yaml'
import { utf8Bytes } from './yaml-limits.mjs'

export const SQUAD_YAML_BYTES = 16 * 1024
export const CURATION_YAML_BYTES = 64 * 1024

/** raw 为 null 表示文件不存在。allowEmpty：只有注释或空白的文件当成空映射。 */
export function parseMapping(raw, limit, { allowEmpty = false } = {}) {
  if (raw === null) return { data: null, yamlError: '找不到文件', yamlTooLarge: false }
  if (utf8Bytes(raw) > limit) return { data: null, yamlError: null, yamlTooLarge: true }
  const doc = YAML.parseDocument(raw, { prettyErrors: true })
  if (doc.errors.length) return { data: null, yamlError: doc.errors[0].message, yamlTooLarge: false }
  let data
  // 别名过多时 toJS 会抛错，当成格式错误处理。
  try { data = doc.toJS() } catch { return { data: null, yamlError: '别名（&、*）展开失败', yamlTooLarge: false } }
  if (data === null && allowEmpty) return { data: {}, yamlError: null, yamlTooLarge: false }
  if (data === null || typeof data !== 'object' || Array.isArray(data)) {
    return { data: null, yamlError: '不是「键: 值」的格式', yamlTooLarge: false }
  }
  return { data, yamlError: null, yamlTooLarge: false }
}

/** extras：文件夹里除 squad.yaml 以外的东西；symlinks：符号链接。两者都只用来报错。 */
export function buildSquadModel(slug, { raw, extras = [], symlinks = [] }) {
  return { slug, raw, ...parseMapping(raw, SQUAD_YAML_BYTES), extras: [...extras], symlinks: [...symlinks] }
}

/** 策展文件不存在是正常情况（当空）：exists 为 false，data 是空映射。 */
export function buildCurationModel({ raw, symlink = false }) {
  if (raw === null) return { exists: false, raw, data: {}, yamlError: null, yamlTooLarge: false, symlink }
  return { exists: true, raw, ...parseMapping(raw, CURATION_YAML_BYTES, { allowEmpty: true }), symlink }
}
