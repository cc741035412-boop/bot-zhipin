import { join } from 'node:path'

export const stripComments = (text) => text.replace(/<!--[\s\S]*?(?:-->|$)/g, '')
const headings = (text) => [...stripComments(text).matchAll(/^##[ \t]+(.+?)[ \t]*#*[ \t]*\r?$/gm)].map((m) => m[1])

export function validateContent(bot, template, report) {
  if (bot.data?.external === true) return
  if (bot.role === null || !stripComments(bot.role).trim()) {
    report(join(bot.dir, 'ROLE.md'), '正文', bot.role === null ? '缺少 ROLE.md' : 'ROLE.md 去掉 HTML 注释后为空', '创建或补充 ROLE.md，写清 Bot 的岗位、职责和边界；不要只写注释。')
  }
  const designPath = join(bot.dir, 'DESIGN.md')
  if (bot.design === null) {
    report(designPath, '正文', '缺少 DESIGN.md', '创建 DESIGN.md，按 bots/_template/DESIGN.md 的五个二级标题写至少 200 字正文。')
  } else {
    const body = stripComments(bot.design).replace(/^[ \t]*#.*$/gm, '').replace(/\s/g, '')
    const count = [...body].length
    if (count < 200) report(designPath, '正文', `正文只有 ${count} 字，至少要 200 字`, '补充真实的问题、设计、效果和局限；HTML 注释、标题行和空白不计字数。')
    const present = headings(bot.design)
    const missing = headings(template.design).filter((title) => !present.includes(title))
    if (missing.length) report(designPath, '二级标题', `缺少二级标题：${missing.join(' / ')}`, `补上以下标题及对应内容：${missing.map((title) => `## ${title}`).join('；')}。`, true)
  }
  if (!bot.skills.length) report(join(bot.dir, 'skills'), '技能文件夹', 'skills/ 下至少需要一个技能文件夹', '创建 skills/<技能名>/SKILL.md，填写 frontmatter 和具体操作步骤。')
  for (const skill of bot.skills) {
    if (!skill.exists) {
      report(skill.path, '文件', '技能文件夹缺少 SKILL.md', `在 skills/${skill.name}/ 中创建 SKILL.md，填写 name、description 的 frontmatter 和技能正文。`)
      continue
    }
    if (skill.frontmatterError) {
      const line = Number(/at line (\d+)/.exec(skill.frontmatterError)?.[1] || 1) + 1
      report(skill.path, 'frontmatter', `frontmatter YAML 格式错误（第 ${line} 行），必须是合法的「键: 值」映射`, '检查 --- 之间的 YAML 缩进、冒号、引号，name 和 description 都要填写非空文字。')
    } else if (!skill.frontmatter) {
      report(skill.path, 'frontmatter', '缺少 frontmatter', `在文件最开头添加（每个 \\n 表示换行）：---\\nname: ${skill.name}\\ndescription: 说明技能用途和调用时机\\n---`)
    } else {
      for (const key of ['name', 'description']) {
        const value = skill.frontmatter[key]
        if (typeof value !== 'string' || !value.trim()) {
          report(skill.path, `frontmatter.${key}`, `frontmatter 缺少 ${key} 或值为空/不是文字`, `在开头的 --- 之间填写 ${key}: ${key === 'name' ? skill.name : '说明这个技能做什么、什么时候调用'}。`)
        } else if (key === 'name' && value !== skill.name) {
          report(skill.path, 'frontmatter.name', `name ${value} 和文件夹名 ${skill.name} 不同`, `将 name 改为 ${skill.name}，或将技能文件夹改成与 name 一致。`, true)
        }
      }
    }
  }
}

export function validateTemplate(bot, template, report) {
  const data = bot.data
  if (data) {
    const fields = [
      ['slug', data.slug === template.data.slug],
      ['templateUrl', typeof data.templateUrl === 'string' && data.templateUrl.includes('REPLACE-ME')],
      ['author.github', data.author?.github === template.data.author.github],
      ['tagline', data.tagline === template.data.tagline],
      ['pitch', data.pitch === template.data.pitch],
    ]
    for (const [field, leftover] of fields) {
      if (leftover) report(bot.yamlPath, field, `${field} 还是模板里的示例`, `修改 bot.yaml 的 ${field}，填写你自己的真实内容${field === 'slug' ? '，并将 Bot 文件夹改成同名' : ''}。`)
    }
  }
  for (const skill of bot.skills) {
    const example = template.skills.find((item) => item.name === skill.name)
    if (example && skill.frontmatter?.description === example.frontmatter?.description) {
      report(skill.path, 'frontmatter.description', '技能 description 还是模板里的示例', `修改 skills/${skill.name}/SKILL.md 的 description，写清真实技能的用途和调用时机，并将示例文件夹及 name 改为真实技能名。`)
    }
  }
  if (bot.routines !== null && bot.routines.trim() === template.routines.trim()) {
    report(join(bot.dir, 'routines.md'), '正文', 'routines.md 还是模板里的示例', '修改 routines.md，写明实际任务的时间、动作和结果去向；没有定时任务就删除此文件。')
  }
}
