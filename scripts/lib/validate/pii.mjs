import { imageFormat } from './images.mjs'

const phone = /(?<!\d)(?:\+?86[ -]?)?(1[3-9]\d)[ -]?\d{4}[ -]?(\d{4})(?!\d)/
const id = /(?<![a-z0-9])(\d{6})((?:19|20)\d{2})(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{3}([\dx])(?![a-z0-9])/gi
const email = /(?<![a-z0-9_%+.@-])([a-z0-9_%+-]+(?:\.[a-z0-9_%+-]+)*)@([a-z0-9]+(?:-+[a-z0-9]+)*(?:\.[a-z0-9]+(?:-+[a-z0-9]+)*)+)(?![a-z0-9-]|\.[a-z0-9-])/gi
const reservedDomains = new Set(['example.com', 'example.net', 'example.org', 'localhost', 'users.noreply.github.com'])
const reservedSuffix = /\.(?:example|test|invalid)$/
const fix = '确认是不是真人的信息：是就删掉或换成「××」；只是示例就换成明显的假数据（邮箱用 example.com）'

export function scanPersonalInfo(bot, report) {
  for (const file of bot.files) {
    if (file.format !== undefined ? file.format : imageFormat(file.head || new Uint8Array())) continue
    // 超大的非图片文件已由密钥扫描报告。
    if (file.size > 100 * 1024) continue
    const lines = (file.text ?? '').split(/\r\n|\n|\r/)
    for (const [index, line] of lines.entries()) {
      const warn = (kind, masked) => report(file.path, `第 ${index + 1} 行`, `疑似${kind}（${masked}）`, fix, true)
      const number = phone.exec(line)
      if (number) warn('手机号', `${number[1]}****${number[2]}`)
      for (const [, region, year, month, day, last] of line.matchAll(id)) {
        const date = `${year}-${month}-${day}`
        // Date 会把某些不存在的日期滚到下一月，转回字符串才能确认日期未变。
        if (new Date(`${date}T00:00:00Z`).toISOString().slice(0, 10) !== date) continue
        warn('身份证', `${region}***********${last}`)
        break
      }
      for (const [, local, domain] of line.matchAll(email)) {
        const normalized = domain.toLowerCase()
        if (reservedDomains.has(normalized) || reservedSuffix.test(normalized)) continue
        warn('邮箱', `${local[0]}***@${domain}`)
        break
      }
    }
  }
}
