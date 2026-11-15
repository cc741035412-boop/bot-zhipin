// 生成 site/public/ 下的三个静态图标：favicon.svg、favicon.ico（32×32）、apple-touch-icon.png（180×180）。
// 画的是 theme/live/favicon.ts 里的 FAVICON_DEFAULT，和脚本运行时的动态图标出自同一段代码。
// 改了 FAVICON_DEFAULT、FAVICON_FACE 或画法之后运行：npm run gen:favicon（需要本机装过 Playwright 的 Chromium）。
// 三个文件都提交进仓库；tests/unit/favicon.test.mjs 会检查 favicon.svg 有没有跟上代码。
import { writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { build } from 'esbuild'
import { chromium } from '@playwright/test'
import { ROOT } from './lib/load-bots.mjs'

const PUBLIC = join(ROOT, 'site', 'public')
/** 主屏幕图标的底色：iOS 会把透明处填成黑色，所以自己铺一层站点的深色底。 */
const TOUCH_BACKGROUND = '#141418'

const bundled = await build({
  entryPoints: [join(ROOT, 'site/.vitepress/theme/live/favicon.ts')],
  bundle: true, format: 'esm', write: false, logLevel: 'warning',
})
const { faviconStill, faviconHref, FAVICON_DEFAULT } = await import(
  `data:text/javascript;base64,${Buffer.from(bundled.outputFiles[0].text).toString('base64')}`
)
const svg = faviconStill(FAVICON_DEFAULT)
writeFileSync(join(PUBLIC, 'favicon.svg'), `${svg}\n`)

const browser = await chromium.launch()
try {
  const page = await browser.newPage({ deviceScaleFactor: 1 })
  const shot = async (size, inner, background) => {
    await page.setViewportSize({ width: size, height: size })
    await page.setContent(`<body style="margin:0;display:grid;place-items:center;width:${size}px;height:${size}px;background:${background}">`
      + `<img src="${faviconHref(svg)}" width="${inner}" height="${inner}">`)
    await page.locator('img').evaluate((img) => img.decode())
    return page.screenshot({ omitBackground: background === 'transparent' })
  }
  const png32 = await shot(32, 32, 'transparent')
  // ICO 容器里直接放一张 PNG：6 字节文件头 + 16 字节目录项 + PNG 数据。
  const header = Buffer.alloc(22)
  header.writeUInt16LE(1, 2)             // 类型：图标
  header.writeUInt16LE(1, 4)             // 图片数量
  header.writeUInt8(32, 6)               // 宽
  header.writeUInt8(32, 7)               // 高
  header.writeUInt16LE(1, 10)            // 色彩平面
  header.writeUInt16LE(32, 12)           // 每像素位数
  header.writeUInt32LE(png32.length, 14) // 数据长度
  header.writeUInt32LE(22, 18)           // 数据偏移
  writeFileSync(join(PUBLIC, 'favicon.ico'), Buffer.concat([header, png32]))
  writeFileSync(join(PUBLIC, 'apple-touch-icon.png'), await shot(180, 124, TOUCH_BACKGROUND))
} finally {
  await browser.close()
}
console.log('已生成 site/public/favicon.svg、favicon.ico、apple-touch-icon.png')
