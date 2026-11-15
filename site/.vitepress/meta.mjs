// 站点级配置：站名、仓库地址、安装提示词、默认台词。全站只在这里改。
export const SITE = {
  // 占位站名，正式名字定了改这里
  name: 'Bot 直聘',
  // 只给页面的 meta description 用，界面上不显示
  tagline: 'Grok Bot 模板货架：挑一个顺手的直接导入，也欢迎把你做的 Bot 挂上来。',
  repo: 'https://github.com/jakob52123/bot-zhipin',
  url: 'https://bot-zhipin.pages.dev',
  branch: 'main',
}

// 品牌招牌独立于货架与排序：前 5 只站上排（橙色居中），后 4 只站下排并错开半格。
// 上下左右和斜向相邻的砖都不同色系（暖橙 / 粉红 / 蓝紫 / 绿）。
export const HERO_MASCOTS = [
  { key: 'amber', shape: 'hex', color: '#f5a623' },
  { key: 'teal', shape: 'star', color: '#14b8a6' },
  { key: 'orange', shape: 'blob', color: '#ff6a13' },
  { key: 'pink', shape: 'sparkle', color: '#ff2e93' },
  { key: 'blue', shape: 'cloud', color: '#3b82f6' },
  { key: 'rose', shape: 'heart', color: '#f43f5e' },
  { key: 'violet', shape: 'tablet', color: '#8b5cf6' },
  { key: 'mint', shape: 'teardrop', color: '#34d399' },
  { key: 'brown', shape: 'pebble', color: '#9a6a3a' },
]

// 首页主推：编辑挑的三个，按这个顺序排。这几个不在货架上时（比如测试数据），退回按热度取前三。
export const FEATURED = ['idea-stress-test', 'quota-saver', 'copy-humanizer']

// 首页货架的固定文案。界面上不放解释性的句子（决策 37）：这里只有标题、按钮、标签和状态反馈。
// 搜索占位字首屏搜索框和搜索面板共用。
export const SHELF_COPY = {
  searchPlaceholder: '搜索',
  searchLabel: '搜索 Bot',
  contribute: '我要投稿',
  featuredTitle: '本周主推',
  allTitle: '全部 Bot',
  allCategories: '全部',
  filterLabel: '按岗位筛选',
  emptyFilter: '这个岗位下暂时没有 Bot',
  showAll: '看看全部',
}

// 每个岗位一句说明。岗位的取值和顺序只认 schema（bot.schema.json 的 category）；单测保证这里一个不多、一个不少。
export const CATEGORY_COPY = {
  产品: '想清楚做什么，写出来，做出来，再挑毛病',
  市场: '盯竞品，定定位，做投放，看数据',
  销售: '找客户，备会，跟进，复盘',
  内容: '找选题，写稿，剪视频',
  运营: '办活动，管行政，招人',
  管家: '管你的 Bot：省额度、备份、接飞书、派活',
  个人: '求职、生活，还有好玩的',
}

export const POKE_PITCHES = ['哎，痒！', '再戳我就变形了', '好啦好啦，我在呢', '你找我呀？']
export const ANGRY_PITCH = '别戳啦！'
export const NOT_FOUND = {
  title: '这一页走丢了',
  back: '回货架看看',
}

export const CONTRIBUTE_URL = '/submit'

/** 投稿页的定稿提示词。 */
export const submitPrompt = () =>
  [
    `请帮我把我做的 Grok Bot 投稿到「Bot 直聘」：${SITE.repo}`,
    '1. 先完整读一遍仓库根目录的 AGENTS.md，严格按它的步骤做。',
    '2. 能从你自己（或我的 Bot 配置）里查到的信息直接用，查不到的再一次问清我；不要编造效果和截图。',
    '3. 不要向我要 GitHub 令牌或密码。',
    `4. 最后给我一个 ${SITE.url}/submit 开头的投稿链接。`,
  ].join('\n')

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
  '导入一次，天天替你跑腿。',
  '简历就在详情页，欢迎来面试。',
  '额度花在刀刃上，这事我在行。',
  '别急着走，点开看看我会什么。',
]
