// 与存储无关的收录条目模型（Prompt、Skill）：一条一个 YAML 文件，只解析不读盘。读盘在 load-prompts-skills.mjs。
import { parseMapping } from './squad-model.mjs'

// 一条 Prompt 的正文最多 6000 字（中文约 18KB），留出其他字段的余量；Skill 不收正文。
export const LIBRARY_KINDS = Object.freeze({
  prompt: Object.freeze({ kind: 'prompt', dir: 'prompts', yamlBytes: 32 * 1024 }),
  skill: Object.freeze({ kind: 'skill', dir: 'skills', yamlBytes: 16 * 1024 }),
})

/**
 * name：目录里的文件名（如 socratic-tutor.yaml）；slug 是去掉 .yaml 的部分。
 * stray：不是「<slug>.yaml 普通文件」的东西（directory / symlink / extension），只用来报错，网站跳过它们。
 */
export function buildEntryModel(kind, name, { raw = null, stray = null } = {}) {
  const { yamlBytes } = LIBRARY_KINDS[kind]
  const slug = name.endsWith('.yaml') ? name.slice(0, -'.yaml'.length) : name
  const base = { kind, name, slug, raw, stray }
  if (stray) return { ...base, data: null, yamlError: null, yamlTooLarge: false }
  return { ...base, ...parseMapping(raw, yamlBytes) }
}
