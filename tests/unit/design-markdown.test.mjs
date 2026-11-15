import { expect, it } from 'vitest'
import MarkdownIt from 'markdown-it'
import { prepareDesignSource, installSafeDesignRules } from '../../scripts/lib/design-markdown.mjs'
import { renderDesign } from '../../site/.vitepress/theme/submit/preview.ts'

it('预处理与原有 frontmatter、成对注释、首个一级标题规则一致', () => {
  expect(prepareDesignSource('\uFEFF---javascript\nthrow 1\n---\n# 标题\n<!-- 删除 -->正文\n# 第二个\n')).toBe('正文\n# 第二个\n')
  expect(prepareDesignSource('---\n未闭合')).toBe('')
  expect(prepareDesignSource('# 标题\n<!-- 未闭合')).toBe('<!-- 未闭合')
  expect(prepareDesignSource(null)).toBe('')
})
it('图片映射保持编码，支持 env；默认 img 转义属性', () => {
  const md = new MarkdownIt({ html: false })
  installSafeDesignRules(md, { assetUrl: (name, env) => `/bot-assets/${env.slug}/${name}` })
  expect(md.render('![说明](screenshots/中文.png)', { slug: 'demo' })).toBe('<p><img src="/bot-assets/demo/%E4%B8%AD%E6%96%87.png" alt="说明"></p>\n')
})
it('截图没有映射时降级为链接，空 alt 使用默认文案', () => {
  const html = renderDesign('![](screenshots/a.png)', { slug: 'demo', assetUrl: () => null })
  expect(html).toBe('<p><a href="screenshots/a.png" target="_blank" rel="noreferrer">图片链接</a></p>\n')
})
it.each([
  ['原始 HTML', '<img src=x onerror=alert(1)>', /<img/],
  ['脚本', '<script>alert(1)</script>', /<script/],
  ['SVG', '<svg onload=alert(1)>', /<svg/],
  ['javascript 链接', '[点我](javascript:alert%281%29)', /href="javascript:/],
  ['data HTML', '[点我](data:text/html;base64,PHNjcmlwdD4=)', /href="data:/],
  ['外链图片', '![图](https://tracker.example/a.png)', /<img/],
  ['协议相对图片', '![图](//tracker.example/a.png)', /<img/],
  ['编码穿越', '![图](screenshots/%2e%2e/private.png)', /<img/],
  ['编码斜杠', '![图](screenshots/a%2fb.png)', /<img/],
  ['反斜杠', '![图](screenshots/a%5cb.png)', /<img/],
  ['二次编码', '![图](screenshots/%252e%252e/a.png)', /<img/],
  ['编码查询', '![图](screenshots/a%3fb.png)', /<img/],
  ['坏编码', '![图](screenshots/a%zz.png)', /<img/],
  ['attrs 插件语法', '[点我](https://example.com){onclick="alert(1)"}', /<a[^>]+onclick=/],
  ['snippet', '<<< /etc/passwd', /<pre/],
  ['代码块', '```html\n<script>alert(1)</script>\n```', /<script/],
])('%s 不成为可执行 HTML 或外链图片', (_name, source, forbidden) => {
  const html = renderDesign(source, { slug: 'demo', assetUrl: (name) => `blob:${name}` })
  expect(html).not.toMatch(forbidden)
})
it('普通代码只转义，链接自动识别，Vue 插值仍是文本', () => {
  const html = renderDesign('```js\n<x>\n```\n\nhttps://example.com\n\n{{ alert(1) }}', { slug: 'demo' })
  expect(html).toContain('<pre><code>&lt;x&gt;\n</code></pre>')
  expect(html).toContain('href="https://example.com"')
  expect(html).toContain('{{ alert(1) }}')
  expect(html).not.toContain('shiki')
  expect(renderDesign('example.com', { slug: 'demo' })).toBe('<p>example.com</p>\n')
})
it('外链图片 alt 和 href 始终转义', () => {
  const html = renderDesign('![<img src=x>](https://example.com/a?x=1&y=2)', { slug: 'demo' })
  expect(html).toContain('&amp;y=2')
  expect(html).toContain('&lt;img src=x&gt;')
  expect(html).not.toContain('<img')
})
