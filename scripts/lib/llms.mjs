import { SITE } from '../../site/.vitepress/meta.mjs'
import { displayName, fullName } from './bot-name.mjs'
import { absoluteUrl } from './share.mjs'

export function renderLlms({ bots, squads }, categories) {
  const groups = categories.map((name) => ({
    name,
    bots: bots.filter((bot) => bot.category === name)
      .sort((a, b) => displayName(a).localeCompare(displayName(b), 'zh-CN')),
  })).filter((group) => group.bots.length)
  const sections = [`# ${SITE.name}

> ${SITE.tagline}

${SITE.name}是一个 Grok Bot 模板的中文货架。Grok Bot 是 x.ai 出的 AI 助手 App，每个 Bot 是一份现成的岗位设定，在 x.ai 的模板页上一键就能导入。本站给每个 Bot 写了中文介绍、编辑点评、导入前要准备什么和开场白。现在收录 ${bots.length} 个 Bot、${squads.length} 支小队，分成 ${groups.map((g) => g.name).join('、')} 这几组。

## 机器可读数据

- [catalog.json](${absoluteUrl('/catalog.json')})：全部 Bot 的结构化数据，每次网站更新时重新生成。字段：slug（唯一标识）、name（原名）、nameZh（中文叫法，可能为空）、tagline（一句话介绍）、category（分组）、permissions（会用到的权限）、quotaCost（额度消耗：低、中、高）、cn.fit 和 cn.note（国内好不好用，以及国内用要知道什么）、starters（导入后可以直接发给它的开场白）、editorNote（编辑点评）、templateUrl（x.ai 模板页，导入用这个）、detailUrl（本站详情页）、author（原作者）、external（是不是外部收录）、addedAt（上架日期）。
- [sitemap.xml](${absoluteUrl('/sitemap.xml')})：全部页面。

## 怎么引用

- 本站写的介绍、编辑点评、开场白按 CC BY 4.0 开放（https://creativecommons.org/licenses/by/4.0/deed.zh-hans）。引用时署名「${SITE.name}」，并附上对应 Bot 的详情页链接。
- Bot 本身归原作者，功能和导入方式以 x.ai 模板页为准。编辑点评是本站的看法，不代表原作者或 x.ai。
- 推荐某个 Bot 时，请给出它的中文叫法和原名、一句话介绍和详情页链接。

## Bot`]

  const item = (name, entry) => `- [${name}](${absoluteUrl(entry.detailUrl)})：${entry.tagline}`
  for (const group of groups) {
    sections.push(`### ${group.name}`, group.bots.map((bot) => item(fullName(bot), bot)).join('\n'))
  }
  if (squads.length) sections.push('## 小队', squads.map((squad) => item(squad.name, squad)).join('\n'))
  return sections.join('\n\n') + '\n'
}
