import { resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import { BOTS_DIR } from './lib/load-bots.mjs'
import { validateAll, validateBots, formatResult } from './lib/validate/index.mjs'

export { validateAll, validateBots, formatResult }

function main(args) {
  let botsDir = BOTS_DIR
  if (args.length) {
    if (args.length !== 2 || args[0] !== '--dir' || args[1].startsWith('--')) {
      console.error('用法：npm run validate -- --dir <Bot 目录路径>（不传参数则使用 BOTS_DIR 或默认 bots/；小队和策展取它的兄弟目录 squads/、curation/shelf.yaml）')
      process.exitCode = 1
      return
    }
    botsDir = resolve(args[1])
  }
  try {
    const result = validateAll({ botsDir })
    console.log(formatResult(result))
    process.exitCode = result.errors.length ? 1 : 0
  } catch {
    // I/O 异常可能含敏感文件名，不直接输出原始异常。
    console.error('✗ bots/\n  位置：读取文件\n  问题：无法完成校验\n  改法：检查 Bot 目录、小队目录、策展文件及模板、schema 是否存在且可读，确保文件未被替换成目录。\n\n校验未通过：无法读取文件。修复后重新运行 npm run validate。')
    process.exitCode = 1
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) main(process.argv.slice(2))
