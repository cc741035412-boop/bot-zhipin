// Node 读取适配器：读 prompts/<slug>.yaml、skills/<slug>.yaml，不跟随符号链接；解析和校验由纯内核完成。
import { lstatSync, readdirSync, readFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { BOTS_DIR, ROOT } from './load-bots.mjs'
import { LIBRARY_KINDS, buildEntryModel } from './library-model.mjs'

export const PROMPT_SCHEMA_PATH = join(ROOT, 'schema', 'prompt.schema.json')
export const SKILL_SCHEMA_PATH = join(ROOT, 'schema', 'skill.schema.json')

/**
 * 分类、正文语言、agents、许可证的取值和顺序只认 schema（和 loadEnums() 读 bot.schema.json 一个办法）。
 * reusable：放正文时应附许可链接的可转载许可证。
 */
export function loadLibraryEnums() {
  const prompt = JSON.parse(readFileSync(PROMPT_SCHEMA_PATH, 'utf8'))
  const skill = JSON.parse(readFileSync(SKILL_SCHEMA_PATH, 'utf8'))
  return {
    prompt: {
      categories: prompt.properties.category.enum,
      langs: prompt.properties.lang.enum,
      licenses: prompt.$defs.license.enum,
      reusable: prompt.$defs.reusableLicense.enum,
    },
    skill: {
      categories: skill.properties.category.enum,
      agents: skill.$defs.agent.enum,
      licenses: skill.$defs.license.enum,
    },
  }
}

/**
 * 目录怎么定，和小队一样「跟着 Bot 目录取兄弟目录」：
 * PROMPTS_DIR / SKILLS_DIR 指定了就用它；否则是 <Bot 目录的上级>/prompts、<上级>/skills。
 * 所以只设 BOTS_DIR=tests/fixtures/bots 就会一起用 fixtures 的 Prompt 和 Skill。目录不存在就当空。
 */
export function libraryDirFor(kind, botsDir = BOTS_DIR) {
  const env = kind === 'prompt' ? process.env.PROMPTS_DIR : process.env.SKILLS_DIR
  return env ? resolve(ROOT, env) : join(dirname(resolve(botsDir)), LIBRARY_KINDS[kind].dir)
}
export const promptsDirFor = (botsDir = BOTS_DIR) => libraryDirFor('prompt', botsDir)
export const skillsDirFor = (botsDir = BOTS_DIR) => libraryDirFor('skill', botsDir)
export const PROMPTS_DIR = promptsDirFor()
export const SKILLS_DIR = skillsDirFor()

/** 读一个目录里的全部条目。忽略目录占位文件和系统元数据；其余不是 <slug>.yaml 普通文件的记成 stray。 */
export function loadEntries(kind, dir = libraryDirFor(kind)) {
  const { yamlBytes } = LIBRARY_KINDS[kind]
  // 整个目录是符号链接时不进去读。
  const top = lstatSync(dir, { throwIfNoEntry: false })
  if (!top) return []
  if (top.isSymbolicLink()) return [buildEntryModel(kind, '.', { stray: 'symlink' })]
  if (!top.isDirectory()) return [buildEntryModel(kind, '.', { stray: 'root-file' })]
  return readdirSync(dir).filter((name) => name !== '.gitkeep' && name !== '.DS_Store').sort().map((name) => {
    const path = join(dir, name)
    const stat = lstatSync(path, { throwIfNoEntry: false })
    if (!stat) return null
    if (stat.isSymbolicLink()) return buildEntryModel(kind, name, { stray: 'symlink' })
    if (stat.isDirectory()) return buildEntryModel(kind, name, { stray: 'directory' })
    if (!stat.isFile() || !name.endsWith('.yaml')) return buildEntryModel(kind, name, { stray: 'extension' })
    // 超限的文件不读进内存：给一个刚好超限的占位，让内核报「文件太大」。
    const raw = stat.size > yamlBytes ? ' '.repeat(yamlBytes + 1) : readFileSync(path, 'utf8')
    return { ...buildEntryModel(kind, name, { raw }), path }
  }).filter(Boolean)
}

export const loadAllPrompts = (dir = PROMPTS_DIR) => loadEntries('prompt', dir)
export const loadAllSkills = (dir = SKILLS_DIR) => loadEntries('skill', dir)
