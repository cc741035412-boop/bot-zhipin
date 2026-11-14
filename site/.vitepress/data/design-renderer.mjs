import { Worker, isMainThread, parentPort, workerData } from 'node:worker_threads'
import { createMarkdownRenderer } from 'vitepress'

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
  const md = await createMarkdownRenderer(process.cwd(), {
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
    if (/^(?:\.\/)?screenshots\//.test(src)) {
      token.attrSet('src', `/bot-assets/${env.slug}/${src.replace(/^(?:\.\/)?screenshots\//, '')}`)
    }
    return image(tokens, index, options, env, self)
  }
  parentPort.postMessage(Object.fromEntries(workerData.map(({ slug, design }) => {
    const body = (design || '').replace(/<!--[\s\S]*?(?:-->|$)/g, '').replace(/^# [^\r\n]*(?:\r?\n|$)/m, '')
    return [slug, md.render(body, { slug })]
  })))
}
