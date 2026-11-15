// 站点级配置：站名、仓库地址、安装提示词、默认台词。全站只在这里改。
export const SITE = {
  // 占位站名，正式名字定了改这里
  name: 'Bot 直聘',
  tagline: 'Grok Bot 模板货架：挑一个顺手的直接导入，也欢迎把你做的 Bot 挂上来。',
  repo: 'https://github.com/jakob52123/bot-zhipin',
  branch: 'main',
}

export const POKE_PITCHES = ['哎，痒！', '再戳我就变形了', '好啦好啦，我在呢', '你找我呀？']
export const ANGRY_PITCH = '别戳啦！'
export const NOT_FOUND = {
  title: '这一页走丢了',
  description: '这个 Bot 可能已经下架了，或者链接写错了。',
  back: '回货架看看',
}

export const CONTRIBUTE_URL = `${SITE.repo}/blob/${SITE.branch}/CONTRIBUTING.md`

/** 某个 Bot 在仓库里的地址，安装提示词里用 */
export const botRepoUrl = (slug) => `${SITE.repo}/tree/${SITE.branch}/bots/${slug}`

/** 「复制安装提示词」按钮复制的内容。文字由产品定稿，改动前先确认。 */
export const installPrompt = (slug) =>
  [
    `请帮我安装一个 Bot：${botRepoUrl(slug)}`,
    '1. 先读里面的 ROLE.md、skills/ 下的所有 SKILL.md 和 routines.md，用几句话告诉我它会做什么、需要哪些权限、会访问哪些外部服务。',
    '2. 等我确认后，把这些技能保存为你的技能，按 routines.md 创建定时任务，并记住 ROLE.md 里的岗位职责。',
    '3. 装完告诉我装了什么、怎么用。',
  ].join('\n')

/** 没写 pitch 的 Bot，悬停时从这里随机挑一句。都是本站自己写的。 */
export const DEFAULT_PITCHES = [
  '挑我吧，上岗不用培训。',
  '重复的活交给我，你去想更重要的事。',
  '不画大饼，只交能用的结果。',
  '先看看我的设计说明，再决定要不要我。',
  '导入一次，天天替你跑腿。',
  '简历就在详情页，欢迎来面试。',
  '额度花在刀刃上，这事我在行。',
  '别急着走，点开看看我会什么。',
]
