import { execFile } from 'node:child_process'
import { realpathSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { promisify } from 'node:util'
import { assertReadOnly, buildReport, renderReport } from './lib/report.mjs'

const exec = promisify(execFile)
const help = `用法：npm run report -- [--days N] [--local] [--json]
  --days N  最近 N 天（含今天），1～90，默认 7
  --local   查询本地库，默认查询线上库
  --json    输出 JSON，默认输出中文 Markdown
  --help    显示用法`

export function parseArgs(args) {
  const options = { days: 7, local: false, json: false, help: false }
  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '--days': {
        const value = args[++i]
        if (!/^\d+$/.test(value ?? '') || Number(value) < 1 || Number(value) > 90) {
          throw new Error('--days 必须指定 1～90 的整数')
        }
        options.days = Number(value)
        break
      }
      case '--local': options.local = true; break
      case '--json': options.json = true; break
      case '--help': options.help = true; break
      default: throw new Error(`不认识的参数：${args[i]}`)
    }
  }
  return options
}

export function beijingToday(now = Date.now()) {
  return new Date(now + 8 * 3_600_000).toISOString().slice(0, 10)
}

export async function wranglerQuery(sql, local, execute = exec) {
  assertReadOnly(sql)
  const { stdout, stderr } = await execute('npx', [
    'wrangler', 'd1', 'execute', 'bot-zhipin', local ? '--local' : '--remote', '--json', '--command', sql,
  ], { encoding: 'utf8', maxBuffer: 32 * 1024 * 1024 })
  try {
    const [result] = JSON.parse(stdout)
    if (!Array.isArray(result?.results) || result.success === false) throw new Error('返回结果不完整')
    return result.results
  } catch (error) {
    throw Object.assign(error, { stdout, stderr })
  }
}

export async function runReport(args, {
  runSql = wranglerQuery, today = beijingToday(), print = console.log, error = console.error,
} = {}) {
  let options
  try {
    options = parseArgs(args)
  } catch (err) {
    error(err.message)
    return 2
  }
  if (options.help) {
    print(help)
    return 0
  }
  try {
    const report = await buildReport({ runSql: (sql) => runSql(sql, options.local), today, days: options.days })
    const data = { ...report, database: options.local ? 'local' : 'remote' }
    print(options.json ? JSON.stringify(data, null, 2) : renderReport(data).trimEnd())
    return 0
  } catch (err) {
    if ([err.message, err.stderr, err.stdout].some((text) => /no such table:\s*events\b/i.test(text ?? ''))) {
      error('events 表不存在：库里还没应用迁移 0005，见 docs/dev/TRACKING.md 第 8 节')
    } else {
      const detail = (err.stderr || '').split(/\r?\n/).slice(0, 20).join('\n').trimEnd()
      error(detail ? `查询失败\n${detail}` : '查询失败')
    }
    return 1
  }
}

if (process.argv[1] && realpathSync(process.argv[1]) === fileURLToPath(import.meta.url)) {
  process.exitCode = await runReport(process.argv.slice(2))
}
