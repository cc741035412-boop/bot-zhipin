import { loadAllBots, loadEnums } from '../../../scripts/lib/load-bots.mjs'
import { SITE } from '../meta.mjs'
import { isPublicBot } from '../../../scripts/lib/public-bot.mjs'

export function readBots() {
  return loadAllBots().filter((bot) => {
    if (isPublicBot(bot)) return true
    console.warn(`[货架] 跳过 ${bot.yamlRel}：${bot.yamlError ? '无法解析 bot.yaml' : 'slug 不合法或与文件夹不同'}`)
    return false
  })
}

export function botSummaries(bots = readBots()) {
  const names = new Map(bots.map((bot) => [bot.slug, bot.data.name]))
  return bots.map((bot) => {
    const data = bot.data
    const source = `${SITE.repo}/blob/${SITE.branch}/bots/${bot.slug}`
    const asset = (file) => `/bot-assets/${bot.slug}/${encodeURIComponent(file)}`
    const author = data.author || {}
    return {
      slug: bot.slug,
      name: data.name,
      tagline: data.tagline,
      category: data.category,
      author: {
        name: author.name,
        github: author.github || null,
        url: author.url || null,
        link: author.github ? `https://github.com/${author.github}` : author.url || data.templateUrl,
      },
      templateUrl: data.templateUrl,
      addedAt: data.addedAt,
      prerequisites: Array.isArray(data.prerequisites) ? data.prerequisites : [data.prerequisites || '无'],
      quotaCost: data.quotaCost,
      permissions: data.permissions || [],
      pitch: data.pitch || null,
      forkedFrom: data.forkedFrom || null,
      forkedFromName: names.get(data.forkedFrom) || data.forkedFrom || null,
      external: data.external === true,
      avatar: bot.avatar ? asset('avatar.png') : null,
      screenshots: bot.screenshots.filter((shot) => shot.isImage).map((shot) => asset(shot.file)),
      skills: bot.skills.filter((skill) => skill.exists).map((skill) => ({
        name: skill.frontmatter?.name || skill.name,
        description: skill.frontmatter?.description || '',
        sourceUrl: `${source}/skills/${encodeURIComponent(skill.name)}/SKILL.md`,
      })),
      hasRoutines: bot.routines !== null,
      routinesUrl: bot.routines !== null ? `${source}/routines.md` : null,
      detailUrl: `/bots/${bot.slug}`,
    }
  })
}

// 枚举只来自 schema；这里是产品文案，不是另一套枚举定义。
const permissionCopy = {
  云电脑文件: '会读写你 Grok Bot 云电脑里的文件',
  '浏览器 Cookie': '会用云电脑浏览器里已登录网站的登录状态',
  外部账号: '需要你连接或登录第三方账号',
  联网: '会访问互联网上的网站或接口',
  定时自动运行: '会按计划自己运行，不用你每次叫它',
  代我发消息: '会以你的名义发送消息或发布内容',
}
const quotaCopy = {
  低: '偶尔用一下，几乎不占额度',
  中: '每次运行会消耗一些额度',
  高: '运行频繁或任务较重，留意额度',
}
export function explanations() {
  const enums = loadEnums()
  return {
    permissions: Object.fromEntries(enums.permissions.map((key) => [key, permissionCopy[key]])),
    quota: Object.fromEntries(enums.quotaCosts.map((key) => [key, quotaCopy[key]])),
  }
}
