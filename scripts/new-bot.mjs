// 用法：npm run new-bot -- <slug>
// 从 bots/_template 复制出 bots/<slug>/，并把 bot.yaml 里的 slug 和上架日期填好。
import { cpSync, existsSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { BOTS_DIR } from './lib/load-bots.mjs'

const slug = process.argv[2]
if (!slug || !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug) || slug.length < 2 || slug.length > 40) {
  console.error('用法：npm run new-bot -- <slug>\nslug 只能用小写字母、数字和短横线，2 到 40 个字符，比如 npm run new-bot -- prd-reviewer')
  process.exit(1)
}
const dest = join(BOTS_DIR, slug)
if (existsSync(dest)) {
  console.error(`bots/${slug}/ 已经存在。换一个 slug，或者直接编辑那个文件夹。`)
  process.exit(1)
}
cpSync(join(BOTS_DIR, '_template'), dest, { recursive: true })
const d = new Date()
const today = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
const yamlPath = join(dest, 'bot.yaml')
writeFileSync(
  yamlPath,
  readFileSync(yamlPath, 'utf8')
    .replace(/^slug: my-bot(\s)/m, `slug: ${slug}$1`)
    .replace(/^addedAt: \d{4}-\d{2}-\d{2}(\s)/m, `addedAt: ${today}$1`),
)
console.log(`已创建 bots/${slug}/。接下来：\n  1. 按注释填写 bots/${slug}/bot.yaml\n  2. 写 ROLE.md、DESIGN.md、skills/ 下的 SKILL.md\n  3. 运行 npm run validate`)
