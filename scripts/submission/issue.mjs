import YAML from 'yaml'
import { decode, unpack, stripFence } from './bundle.mjs'
import { fail } from './errors.mjs'

export const LICENSE_TEXT = '我同意以 CC BY 4.0 授权这次投稿，并确认内容和截图都是我有权公开的'
export const FORM_LABELS = Object.freeze({
  bundle: '投稿包（由你的 AI 生成，不用改）',
  screenshots: '截图：把 Bot 真实输出的截图拖到这里（至少一张，按投稿包里写的顺序）',
  license: '授权',
})

/** 只识别表单的固定标题；代码块里的 ### 不是字段分界。 */
export function parseForm(body) {
  if (typeof body !== 'string' || body.length > 750_000) fail('Issue', '正文', '表单正文为空或过长。', '请使用「投稿 Bot」表单重新提交。')
  const fields = Object.create(null)
  let key, fence, inBundle = false
  for (const line of body.trim().replaceAll('\r\n', '\n').split('\n')) {
    // render:text 的外层围栏可能与文件里的代码围栏同长；包的显式边界优先。
    if (key === 'bundle' && line === 'BOT-ZHIPIN-BUNDLE v1') inBundle = true
    if (inBundle) {
      fields[key].push(line)
      if (line === '=== end ===') inBundle = false
      continue
    }
    if (fence) {
      if (new RegExp(`^\\s{0,3}${fence[0]}{${fence.length},}\\s*$`).test(line)) fence = null
    } else {
      const marker = /^\s{0,3}(`{3,}|~{3,})/.exec(line)
      if (marker) fence = marker[1]
      const heading = /^###\s+(.+?)\s*$/.exec(line)
      const match = heading && Object.keys(FORM_LABELS).find((name) => FORM_LABELS[name] === heading[1])
      if (match) {
        if (Object.hasOwn(fields, match)) fail('Issue', match, '表单字段重复。', '每个表单字段只保留一份，不要复制标题。')
        key = match
        fields[key] = []
        continue
      }
    }
    if (key) fields[key].push(line)
  }
  return Object.fromEntries(Object.keys(FORM_LABELS).map((name) => {
    const value = (fields[name] || []).join('\n').replace(/^(?:[ \t]*\n)+|(?:\n[ \t]*)+$/g, '')
    return [name, stripFence(value) === '_No response_' ? '' : value]
  }))
}

export function assertIdentity({ login, id, number }) {
  if (typeof login !== 'string' || !/^[A-Za-z0-9](?:[A-Za-z0-9]|-(?=[A-Za-z0-9])){0,38}$/.test(login) ||
      !/^[1-9]\d*$/.test(String(id)) || !Number.isSafeInteger(Number(id)) ||
      !/^[1-9]\d*$/.test(String(number)) || !Number.isSafeInteger(Number(number))) {
    fail('Issue', '作者与编号', 'Issue 作者身份或编号无效。', '请用个人 GitHub 账号从「投稿 Bot」表单重新提交。')
  }
}

export function parseBotMetadata(text, slug) {
  let data
  try { data = YAML.parse(text, { maxAliasCount: 50 }) } catch { /* 不回显 YAML 原文 */ }
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    fail(`bots/${slug}/bot.yaml`, 'YAML', '找不到 bot.yaml 或无法解析为合法的「键: 值」映射。', '补齐 bot.yaml，检查缩进、引号、冒号和重复字段。')
  }
  return data
}

function hasLicense(text) {
  let fence
  for (const line of text.replace(/<!--[\s\S]*?(?:-->|$)/g, '').split('\n')) {
    if (fence) {
      if (new RegExp(`^\\s{0,3}${fence[0]}{${fence.length},}\\s*$`).test(line)) fence = null
      continue
    }
    const marker = /^\s{0,3}(`{3,}|~{3,})/.exec(line)
    if (marker) { fence = marker[1]; continue }
    if (/^(?: {4}|\t)/.test(line)) continue
    if (line.trim() === `- [x] ${LICENSE_TEXT}` || line.trim() === `- [X] ${LICENSE_TEXT}`) return true
  }
  return false
}

export function parseSubmission(input) {
  assertIdentity(input)
  const fields = parseForm(input.body)
  if (!hasLicense(fields.license)) {
    fail('Issue', 'license', '尚未勾选内容与截图的公开授权。', '确认有权公开内容和截图后，勾选 CC BY 4.0 授权，再提交。')
  }
  const value = stripFence(fields.bundle)
  const bundle = unpack(value.startsWith('BZB1:') ? decode(value) : value)
  const data = parseBotMetadata(bundle.files[`bots/${bundle.slug}/bot.yaml`], bundle.slug)
  if (typeof data.author?.github !== 'string' || data.author.github.toLowerCase() !== input.login.toLowerCase()) {
    fail(`bots/${bundle.slug}/bot.yaml`, 'author.github', 'author.github 必须等于 Issue 作者的 GitHub 用户名（忽略大小写），不能替别人冒名投稿。', '让实际作者提交 Issue，或把 author.github 改成当前投稿账号。')
  }
  return { ...input, fields, bundle, data, slug: bundle.slug }
}

/** existing 为 null 表示目录不存在；存在但缺少元数据也不能覆盖。 */
export function checkOwnership(submission, existing) {
  if (existing === null) return false
  const { slug, login, data } = submission
  if (typeof existing.author?.github !== 'string' || existing.author.github.toLowerCase() !== login.toLowerCase()) {
    fail(`bots/${slug}/bot.yaml`, 'slug', '这个 slug 已被别人使用，换一个', '换一个未占用的英文短名，同步修改文件夹、投稿包路径和 bot.yaml 的 slug。')
  }
  if (typeof existing.addedAt !== 'string' || data.addedAt !== existing.addedAt) {
    fail(`bots/${slug}/bot.yaml`, 'addedAt', '更新已有 Bot 时，addedAt 必须和现有值一致。', '保留默认分支上的原上架日期，不要改成今天。')
  }
  return true
}

export function publication(submission, { warnings = [], template, repo, defaultBranch }) {
  const { login, id, number, data, slug } = submission
  // 自动化只勾选能证实的项目：内容真实性、无隐私、链接可匿名打开仍需人工核验。
  const checklist = template.slice(template.indexOf('## 投稿检查')).replace(
    /^- \[ \] (本地运行 `npm run validate` 已通过|我同意以 CC BY 4\.0 授权本次提交的内容（见 `bots\/LICENSE`）)$/gm,
    '- [x] $1',
  )
  return {
    branch: `submission/issue-${number}`, base: defaultBranch,
    author: { name: login, email: `${id}+${login}@users.noreply.github.com` },
    committer: { name: 'github-actions[bot]', email: '41898282+github-actions[bot]@users.noreply.github.com' },
    message: `新增 Bot：${data.name}（投稿 #${number}）`, title: `新增 Bot：${data.name}`,
    body: `## 自动投稿\n\n来源 Issue：https://github.com/${repo}/issues/${number}\nCloses #${number}\n\n- Bot：\`bots/${slug}/\`\n- 投稿人：@${login}\n- 自动检查：validateBots 与单 Bot 范围检查通过${warnings.length ? `（${warnings.length} 条提醒，请维护者复核）` : ''}；已请求 CI，构建结果以 validate-and-build 为准。\n- 投稿人已在表单勾选 CC BY 4.0 授权，并确认内容和截图有权公开。\n- 设计说明、截图与权限已做机器校验；真实性、隐私及模板链接可匿名访问无法由机器确认，下面对应项留给维护者核验。\n\n${checklist}`,
  }
}
