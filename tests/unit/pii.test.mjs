import { spawnSync } from 'node:child_process'
import { appendFileSync, cpSync, mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { warningAnnotation } from '../../scripts/lib/actions-annotation.mjs'
import { ROOT } from '../../scripts/lib/load-bots.mjs'
import { scanPersonalInfo } from '../../scripts/lib/validate/pii.mjs'
import { validateAll } from '../../scripts/validate.mjs'

// 号码取自验收脚本；变体只改写法、日期或边界。
const phone = '13812345678'
const squadPhone = '13987654321'
const identity = '110101199003071234'
const mailbox = 'lina@qq.com'
const phoneProblem = '疑似手机号（138****5678）'
const idProblem = '疑似身份证（110101***********4）'
const emailProblem = '疑似邮箱（l***@qq.com）'
const fix = '确认是不是真人的信息：是就删掉或换成「××」；只是示例就换成明显的假数据（邮箱用 example.com）'
const design = 'bots/demo-prd-reviewer/DESIGN.md'
const squad = 'squads/demo-squad/squad.yaml'

function scan(text, file = {}) {
  const warnings = []
  scanPersonalInfo({ files: [{ path: design, text, size: Buffer.byteLength(text), ...file }] },
    (...warning) => warnings.push(warning))
  return warnings
}

it.each([
  ['连续数字', phone],
  ['短横线', '138-1234-5678'],
  ['空格', '138 1234 5678'],
  ['+86 前缀和短横线', '+86-138-1234-5678'],
  ['86 前缀和空格', '86 138 1234 5678'],
  ['紧连的 86 前缀', `86${phone}`],
])('手机号识别并打码：%s', (_label, text) => {
  expect(scan(`联系人：${text}。`)).toEqual([[design, '第 1 行', phoneProblem, fix, true]])
})

it('身份证识别并打码，末位可为数字、X 或 x', () => {
  expect(scan(`${identity}\n${identity.slice(0, -1)}X\n${identity.slice(0, -1)}x`)).toEqual([
    [design, '第 1 行', idProblem, fix, true],
    [design, '第 2 行', '疑似身份证（110101***********X）', fix, true],
    [design, '第 3 行', '疑似身份证（110101***********x）', fix, true],
  ])
})

it('邮箱保留首字符和域名，跳过同一行开头的保留邮箱', () => {
  expect(scan(`demo@example.com ${mailbox}.`)).toEqual([[design, '第 1 行', emailProblem, fix, true]])
})

it('不提醒保留域名、localhost 或 GitHub noreply', () => {
  const domains = ['example.com', 'EXAMPLE.NET', 'example.org', 'foo.example', 'foo.test', 'foo.invalid', 'localhost', 'users.noreply.github.com']
  expect(scan(domains.map((domain) => `demo@${domain}`).join('\n'))).toEqual([])
})

it('不把时间戳、长订单号或紧邻数字的手机号片段当作手机号', () => {
  expect(scan(`1795602970644 202611251234567890123 2${phone} ${phone}2`)).toEqual([])
})

it('不提醒日期不合法或紧邻字母、数字的身份证片段', () => {
  const dates = ['18990307', '19901307', '19900431', '19900229', '19900300']
  const invalid = dates.map((date) => identity.slice(0, 6) + date + identity.slice(14))
  expect(scan([...invalid, `A${identity}`, `${identity}Z`, `2${identity}`, `${identity}2`].join('\n'))).toEqual([])
})

it('同一行每类只提醒一次，兼容 CRLF、CR 和 LF 行号', () => {
  const line = `${phone} ${phone} ${identity} ${identity} ${mailbox} ${mailbox}`
  expect(scan(`第一行\r\n第二行\r${line}\n${phone}`)).toEqual([
    [design, '第 3 行', phoneProblem, fix, true],
    [design, '第 3 行', idProblem, fix, true],
    [design, '第 3 行', emailProblem, fix, true],
    [design, '第 4 行', phoneProblem, fix, true],
  ])
})

it('跳过图片和超大文件，但不因文本扩展名为 .png 就跳过', () => {
  expect(scan(phone, { format: 'png' })).toEqual([])
  expect(scan(phone, { size: 100 * 1024 + 1 })).toEqual([])
  expect(scan(phone, { path: '文本.png', format: null, size: 100 * 1024 })).toHaveLength(1)
})

it('Actions 注释对属性转义百分号、换行、逗号和冒号；消息只转义百分号和换行', () => {
  expect(warningAnnotation('bots/a%,:\r\n.md', '位置:,\r\n%', '问题:,\r\n%')).toBe(
    '::warning file=bots/a%25%2C%3A%0D%0A.md,title=位置%3A%2C%0D%0A%25::问题:,%0D%0A%25',
  )
})

describe('Bot、小队及 CLI 接入', () => {
  let temp, botsDir
  beforeAll(() => {
    temp = mkdtempSync(join(tmpdir(), 'bot-zhipin-pii-'))
    cpSync(join(ROOT, 'tests/fixtures'), temp, { recursive: true })
    botsDir = join(temp, 'bots')
    appendFileSync(join(temp, design), `\n联系人：${phone}。\n身份证：${identity}。\n邮箱：${mailbox}。\ntoken: ${'z'.repeat(24)}\n`)
    appendFileSync(join(temp, squad), `\n# 交接电话：${squadPhone}\n`)
  })
  afterAll(() => {
    if (temp) rmSync(temp, { recursive: true, force: true })
  })

  it('Bot 和小队的命中都进入 warnings，不进入 errors', () => {
    const { errors, warnings } = validateAll({ botsDir, now: new Date('2026-11-14T04:00:00Z') })
    expect(errors).toEqual([])
    expect(warnings.filter(({ problem }) => !problem.includes('通用凭据'))).toEqual([
      ...[phoneProblem, idProblem, emailProblem].map((problem) => expect.objectContaining({ file: design, problem })),
      expect.objectContaining({ file: squad, problem: '疑似手机号（139****4321）' }),
    ])
  })

  it.each([false, true])('CLI 只提醒仍退出 0；Actions=%s 时按环境输出注释', (actions) => {
    const { status, stdout } = spawnSync(process.execPath, [join(ROOT, 'scripts/validate.mjs'), '--dir', botsDir], {
      cwd: ROOT, env: { ...process.env, GITHUB_ACTIONS: String(actions) }, encoding: 'utf8', timeout: 15000,
    })
    expect(status).toBe(0)
    expect([phone, squadPhone, identity, mailbox].some((value) => stdout.includes(value))).toBe(false)
    expect(stdout).toContain('✓ 校验通过')
    const annotations = stdout.split('\n').filter((line) => line.startsWith('::warning '))
    if (actions) {
      expect(annotations).toHaveLength(5)
      expect(annotations).toContainEqual(expect.stringMatching(new RegExp(`^::warning file=${design},title=第 \\d+ 行::疑似手机号`)))
      expect(annotations.some((line) => line.startsWith(`::warning file=${squad},`) && line.includes('139****4321'))).toBe(true)
      expect(annotations.some((line) => line.includes('疑似通用凭据'))).toBe(true)
    } else {
      expect(annotations).toEqual([])
    }
  })
})
