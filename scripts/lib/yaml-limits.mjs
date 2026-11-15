// 在任何 YAML 解析之前限制元数据大小；长 Markdown 正文不受此小限额影响。
export const BOT_YAML_BYTES = 8192
export const SKILL_FRONTMATTER_BYTES = 4096
export const utf8Bytes = (text) => new TextEncoder().encode(text).length
export const botYamlTooLarge = (text) => typeof text === 'string' && utf8Bytes(text) > BOT_YAML_BYTES
export const botYamlSizeError = Object.freeze({
  where: '文件大小', problem: 'bot.yaml 超过 8KB',
  fix: 'bot.yaml 只放卡片信息，长内容写进 ROLE.md 或 DESIGN.md',
})
