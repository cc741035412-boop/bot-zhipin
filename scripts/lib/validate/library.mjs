// 收录条目（Prompt、Skill）的校验内核：纯函数，不读盘。读盘在 load-prompts-skills.mjs。
// 许可证规矩（PS 契约 §2.4）：只有 schema 里 $defs.reusableLicense 列出的许可证才能放正文 body，其余只写 summary + 链接。
import { validate as checkPrompt, schema as promptSchema } from './generated/prompt-schema.mjs'
import { validate as checkSkill, schema as skillSchema } from './generated/skill-schema.mjs'
import { reportSchemaErrors } from './schema.mjs'
import { validateDate } from './core.mjs'
import { reporter, reportYaml, scan } from './squads.mjs'
import { LIBRARY_KINDS } from '../library-model.mjs'

/** 允许原样转载正文的许可证，取值只在 schema/prompt.schema.json 的 $defs.reusableLicense。 */
export const REUSABLE_LICENSES = Object.freeze([...promptSchema.$defs.reusableLicense.enum])
export const isReusable = (license) => REUSABLE_LICENSES.includes(license)

const RULES = {
  prompt: { check: checkPrompt, schema: promptSchema, schemaFile: 'schema/prompt.schema.json', noun: '条 Prompt', tooLarge: '超过 32KB', trim: '正文超过 6000 字的不收正文，改成 summary + 链接；精简 summary、usage 的文字。' },
  skill: { check: checkSkill, schema: skillSchema, schemaFile: 'schema/skill.schema.json', noun: '个 Skill', tooLarge: '超过 16KB', trim: 'Skill 只放本站写的摘要、安装命令和链接，不放 SKILL.md 原文。' },
}
const filled = (value) => typeof value === 'string' && value.trim() !== ''

// 离线判定地址，不请求上游。查询串、尾斜杠不应让仓库首页变成文件链接。
function checkSource(value, say) {
  if (typeof value !== 'string') return // 缺字段、类型错误由 schema 报
  const url = URL.parse(value)
  if (!url || url.protocol !== 'https:') {
    say('source.url', '不是完整的 HTTPS 地址', '复制原始文章、文件或具体 skill 目录的 HTTPS 链接。')
  } else if (/^(?:www\.)?github\.com\.?$/.test(url.hostname) && url.pathname.split('/').filter(Boolean).length <= 2) {
    say('source.url', '出处是 GitHub 首页、用户页或仓库首页，没有指到具体条目', '换成这一条所在的文件、文章或 skill 目录链接。')
  }
}

// 离线只能识别标明的引用；没加标记的搬运仍需审稿时对照原文。
function checkQuotes(data, say) {
  for (const field of ['summary', 'usage']) {
    if (typeof data[field] !== 'string') continue
    const quotes = data[field].matchAll(/“([^”]*)”|「([^」]*)」|"([^"\n]*)"|^\s*>\s*(.+)$/gm)
    let length = 0
    for (const match of quotes) length += [...match.slice(1).find((part) => part !== undefined)].length
    if (length > 30) say(field, '不允许转载正文的条目，标明的引用超过 30 字', `缩短 ${field} 中的引文，用自己的话介绍并保留 source.url。`)
  }
}

function reportStray(entry, dir, report) {
  const { name, stray } = entry
  if (stray === 'root-file') {
    report('', '文件类型', `${dir} 不是目录`, `创建 ${dir}/ 目录，每条写一个 <slug>.yaml 文件。`)
  } else if (stray === 'symlink') {
    report(name === '.' ? '' : name, '文件类型', '不允许符号链接（文件或目录）', `删除符号链接；${dir}/ 里只放真实的 <slug>.yaml 文件。`)
  } else if (stray === 'directory') {
    report(name, '文件类型', `${dir}/ 下不能有文件夹，一条一个 <slug>.yaml 文件`, `把内容写进 ${dir}/<slug>.yaml，删掉 ${dir}/${name}/ 这个文件夹。`)
  } else if (name.endsWith('.yml')) {
    report(name, '文件名', '扩展名是 .yml，要写成 .yaml', `把文件改名为 ${name.slice(0, -4)}.yaml。`)
  } else {
    report(name, '文件名', `${dir}/ 里只放 <slug>.yaml 文件`, `删掉 ${dir}/${name}；要收录的内容改写成 ${dir}/<slug>.yaml。`)
  }
}

/**
 * kind：prompt 或 skill；entries：buildEntryModel 的结果（load-prompts-skills.mjs 的 loadEntries）。
 * 返回 { errors, warnings }，每条是 { file, where, problem, fix }，和 Bot、小队同一个口径。
 */
export function validateLibrary(kind, entries, { now = new Date() } = {}) {
  const errors = [], warnings = []
  const { dir } = LIBRARY_KINDS[kind]
  const rule = RULES[kind]
  const taken = new Map()
  for (const entry of entries) {
    const report = reporter(`${dir}/`, errors, warnings)
    if (entry.stray) {
      reportStray(entry, dir, report)
      continue
    }
    const name = entry.name
    const parsed = reportYaml(entry, name, report, {
      tooLarge: { problem: `${name} ${rule.tooLarge}`, fix: rule.trim },
      missing: `在 ${dir}/ 里创建 ${name}。`,
    })
    if (parsed) {
      const data = entry.data
      const say = (where, problem, fix, warning) => report(name, where, problem, fix, warning)
      // Skill 不收正文：先给一句说得清的话，再把 body 拿掉做 schema 校验，免得再报一条「不认识的字段」。
      let checked = data
      if (kind === 'skill' && Object.prototype.hasOwnProperty.call(data, 'body')) {
        say('body', 'Skill 不收正文（SKILL.md 原文长、带脚本，也会随上游更新）', '删掉 body；它会做什么写进 summary（本站自己写的中文），原文让人点 source.url 去看。')
        const { body, ...rest } = data
        checked = rest
      }
      reportSchemaErrors({
        check: rule.check, schema: rule.schema, data: checked, doc: name, schemaFile: rule.schemaFile,
        report: (where, problem, fix) => say(where, problem, fix),
      })
      if (typeof data.slug === 'string') {
        if (data.slug !== entry.slug) say('slug', `slug ${data.slug} 和文件名不一致（文件名是 ${name}）`, `把 slug 改成 ${entry.slug}，或者把文件改名为 ${data.slug}.yaml。`)
        if (data.slug === 'index') say('slug', 'index 已被列表页占用', '换一个 slug，并同步修改文件名。')
        const first = taken.get(data.slug)
        if (first) say('slug', `slug 重复，与 ${dir}/${first} 相同`, `给这一${rule.noun.slice(0, 1)}换一个没用过的 slug，并把文件改成同名。`)
        else taken.set(data.slug, name)
      }
      validateDate({ data, yamlPath: name }, now, report)
      checkSource(data.source?.url, say)
      if (!isReusable(data.license)) checkQuotes(data, say)

      if (kind === 'prompt') {
        const body = Object.hasOwn(data, 'body')
        if (body && !filled(data.copyright)) {
          say('copyright', '转载正文缺少原版权行', '将原许可证中的版权行原样填入 copyright（单行，1～200 字）；无法核实就删掉 body，改写摘要。')
        }
        if (body && !isReusable(data.license)) {
          say('body', `许可证是「${data.license}」，不允许转载正文；只有 ${REUSABLE_LICENSES.join('、')} 可以放 body`,
            `删掉 body，改写 summary（本站自己写的中文摘要，40～300 字，引用原文不超过 30 字），让人点 source.url 看原文；如果原作者其实用的是上面这些许可证之一，把 license 改成实际的许可证，licenseUrl 写许可证原文链接。`)
        }
        if (!filled(data.body) && !filled(data.summary)) {
          say('summary', '既没有 body（正文）也没有 summary（摘要），页面上什么内容都没有', '许可证允许转载就写 body（原样照抄）；不允许就写 summary（本站自己写的中文，40～300 字）。两个都写也可以。')
        }
        if (body && isReusable(data.license) && !filled(data.licenseUrl)) {
          say('licenseUrl', '放了正文，但没写许可证原文链接', '在 licenseUrl 写上许可证原文的地址（仓库里的 LICENSE 文件或许可证页面），转载正文要能查到授权依据。', true)
        }
      }
    }
    scan(name, entry.raw, report)
  }
  return { errors, warnings }
}
