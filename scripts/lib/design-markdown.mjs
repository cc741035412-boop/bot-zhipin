import { stripComments, stripDesignFrontmatter } from './design-content.mjs'

export function prepareDesignSource(text) {
  return stripComments(stripDesignFrontmatter(text || '')).replace(/^# [^\r\n]*(?:\r?\n|$)/m, '')
}

// assetUrl 只由可信适配器提供；name 是经过检查、仍保留 URL 编码的截图相对名。
// 第二个参数 env 供构建 renderer 在一批 Bot 间切换 slug。
export function installSafeDesignRules(md, { assetUrl }) {
  const image = md.renderer.rules.image
  md.renderer.rules.image = (tokens, index, options, env, self) => {
    const token = tokens[index]
    const src = token.attrGet('src') || ''
    const local = /^(?:\.\/)?screenshots\/(.+)$/.exec(src)
    let safeLocal = false
    if (local && !/[\\?#]/.test(local[1])) {
      try {
        safeLocal = local[1].split('/').every((part) => {
          const decoded = decodeURIComponent(part)
          return decoded && decoded !== '.' && decoded !== '..' && !/[\\/%?#\u0000-\u001f]/.test(decoded)
        })
      } catch { /* 畸形 URL 编码降级为链接 */ }
    }
    const url = safeLocal ? assetUrl(local[1], env) : null
    if (typeof url === 'string') {
      token.attrSet('src', url)
      return image(tokens, index, options, env, self)
    }
    const alt = self.renderInlineAsText(token.children || [], options, env) || '图片链接'
    return `<a href="${md.utils.escapeHtml(src)}" target="_blank" rel="noreferrer">${md.utils.escapeHtml(alt)}</a>`
  }
}
