import { relative } from 'node:path'
import { ROOT } from '../../../scripts/lib/load-bots.mjs'
import { PROMPTS_DIR, SKILLS_DIR, loadAllPrompts, loadAllSkills } from '../../../scripts/lib/load-prompts-skills.mjs'
import { isPublicEntry, listPrompt, listSkill, sortEntries, summarizePrompt, summarizeSkill } from '../../../scripts/lib/entry-summary.mjs'

// 收录的 Prompt 和 Skill：一条一个 YAML 文件（prompts/<slug>.yaml、skills/<slug>.yaml）。
// 解析不了、slug 和文件名对不上的跳过并警告；正常构建前 npm run validate 已经拦住这类错误。
function readPublic(entries, label) {
  return entries.filter((entry) => {
    if (isPublicEntry(entry)) return true
    if (!entry.stray) console.warn(`[${label}] 跳过 ${entry.name}：${entry.yamlError || entry.yamlTooLarge ? '无法解析' : 'slug 不合法或与文件名不同'}`)
    return false
  })
}

export const readPrompts = (dir = PROMPTS_DIR) => readPublic(loadAllPrompts(dir), 'Prompt')
export const readSkills = (dir = SKILLS_DIR) => readPublic(loadAllSkills(dir), 'Skill')

/** 全部 Prompt 的完整数据（带正文），按默认顺序排好。详情页的路由参数从这里取。 */
export function promptData(entries = readPrompts()) {
  return sortEntries(entries.map(summarizePrompt))
}
/** 全部 Skill 的完整数据，按默认顺序排好。 */
export function skillData(entries = readSkills()) {
  return sortEntries(entries.map(summarizeSkill))
}

/** 本库列表与筛选用：去掉正文、摘要这些长文字。 */
export const promptList = (entries) => promptData(entries).map(listPrompt)
export const skillList = (entries) => skillData(entries).map(listSkill)

// 数据加载器的监听范围；仓库外的目录不放进来（原因见 bots.mjs 的 shelfWatch），由 bot-watch.mjs 定点监听。
const inside = (path) => !relative(ROOT, path).startsWith('..')
export const promptsWatch = () => [inside(PROMPTS_DIR) && `${PROMPTS_DIR}/**/*`].filter(Boolean)
export const skillsWatch = () => [inside(SKILLS_DIR) && `${SKILLS_DIR}/**/*`].filter(Boolean)
