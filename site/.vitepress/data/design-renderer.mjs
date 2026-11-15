import { Worker, isMainThread, parentPort, workerData } from 'node:worker_threads'
import { createMarkdownRenderer } from 'vitepress'
import { stripComments, stripDesignFrontmatter } from '../../../scripts/lib/design-content.mjs'

// VitePress 1.6 的 renderer 是进程级单例。隔离投稿内容，避免 html:false
// 污染站点模板编译，也避免 dev 模式复用 html:true 的站点 renderer。
export function renderDesigns(bots) {
  return new Promise((resolve, reject) => {
    const worker = new Worker(new URL('./design-renderer.mjs', import.meta.url), { workerData: bots })
    worker.once('message', resolve)
    worker.once('error', reject)
    worker.once('exit', (code) => {
      if (code !== 0) reject(new Error(`设计说明渲染失败（退出码 ${code}）`))
    })
  })
}

if (!isMainThread) {
  let renderMarkdown
  const md = await createMarkdownRenderer(process.cwd(), {
    // frontmatter 插件不是 ruler 规则，而是 render 包装器。
    // 在插件安装前保存纯 markdown-it render，安装后恢复，彻底绕开 gray-matter。
    preConfig: (renderer) => { renderMarkdown = renderer.render.bind(renderer) },
    config: (renderer) => { renderer.render = renderMarkdown },
    html: false,
    attrs: { disable: true },
    codeCopyButtonTitle: '复制代码',
    // 投稿内容不需要语法高亮；也不加载或执行任何投稿者代码。
    highlight: (code) => `<pre><code>${md.utils.escapeHtml(code)}</code></pre>`,
    anchor: { permalink: false },
  })
  // 禁止读取服务器文件（<<< / @include）；include 只存在于页面编译器，
  // 此处只调用 renderer，额外禁用 renderer 的 snippet 插件。
  md.disable('snippet')
  const image = md.renderer.rules.image
  md.renderer.rules.image = (tokens, index, options, env, self) => {
    const token = tokens[index]
    const src = token.attrGet('src') || ''
    const local = /^(?:\.\/)?screenshots\/(.+)$/.exec(src)
    // 允许中文/空格文件名的 URL 编码，但不允许编码后的穿越、分隔符或查询参数。
    let safeLocal = false
    if (local && !/[\\?#]/.test(local[1])) {
      try {
        safeLocal = local[1].split('/').every((part) => {
          const decoded = decodeURIComponent(part)
          return decoded && decoded !== '.' && decoded !== '..' && !/[\\/%?#\u0000-\u001f]/.test(decoded)
        })
      } catch { /* 畸形 URL 编码降级为链接 */ }
    }
    if (safeLocal) {
      token.attrSet('src', `/bot-assets/${env.slug}/${local[1]}`)
      return image(tokens, index, options, env, self)
    }
    const alt = self.renderInlineAsText(token.children || [], options, env) || '图片链接'
    return `<a href="${md.utils.escapeHtml(src)}" target="_blank" rel="noreferrer">${md.utils.escapeHtml(alt)}</a>`
  }
  parentPort.postMessage(Object.fromEntries(workerData.map(({ slug, design }) => {
    const body = stripComments(stripDesignFrontmatter(design || '')).replace(/^# [^\r\n]*(?:\r?\n|$)/m, '')
    return [slug, md.render(body, { slug })]
  })))
}
