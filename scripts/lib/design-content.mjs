// 投稿 DESIGN 不允许 frontmatter；渲染时仍独立剥离，不能依赖先运行校验器。
export function hasDesignFrontmatter(text) {
  return text.replace(/^\uFEFF/, '').startsWith('---')
}

export function stripDesignFrontmatter(text) {
  const src = text.replace(/^\uFEFF/, '')
  if (!hasDesignFrontmatter(src)) return src
  const lines = src.split(/\r\n|\n|\r/)
  const end = lines.findIndex((line, index) => index > 0 && line.startsWith('---'))
  return end < 0 ? '' : lines.slice(end + 1).join('\n')
}

// 只删除成对注释；未闭合的开头及后续正文必须保留。线性扫描避免反复回溯。
export function stripComments(text) {
  const parts = []
  let position = 0
  for (;;) {
    const start = text.indexOf('<!--', position)
    const end = start < 0 ? -1 : text.indexOf('-->', start + 4)
    if (end < 0) return parts.join('') + text.slice(position)
    parts.push(text.slice(position, start))
    position = end + 3
  }
}
