import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { constants } from 'node:os'
import { parseFace, syncFaces, checkFaces } from '../../scripts/sync-faces.mjs'
import { XAI_SHAPE_IDS, shapeRadii, resolveFace, botFace, faceColors } from '../../site/.vitepress/theme/face'
import { avatarSeed, avatarColor } from '../../site/.vitepress/theme/avatar'
import { SHAPES, COLORS } from '../../site/.vitepress/theme/vendor/bloub/skins'
import { PROFILES } from '../../site/.vitepress/theme/vendor/bloub/profiles'

const REF = '/Users/Admin/Documents/pi-prompts/2026-11-14-bot-zhipin-living/refs/xai-memory-keeper.html'
// 本机可选样本：只在系统读文件失败时跳过；读到空字符串也要照常验证。
let referenceHtml = null
try {
  referenceHtml = readFileSync(REF, 'utf8')
} catch (error) {
  if (!Object.hasOwn(constants.errno, error.code)) throw error
}
const snippet = '{"addHref":"grokbot://add/template","color":"#FF9800","shape":"tablet"}'
const old = { color: '#777777', shape: 'hex', fetchedAt: '2026-01-01' }
const today = '2026-11-14'

describe('公开页面数据', () => {
  it.skipIf(referenceHtml === null)('解析真实的 Next.js 转义页面', () => {
    expect(parseFace(referenceHtml)).toEqual({ color: '#777777', shape: 'hex' })
  })
  it('支持原始 JSON 和转义引号；仅取 addHref 旁的字段并统一颜色大小写', () => {
    for (const html of [snippet, snippet.replaceAll('"', '\\"'), snippet.replaceAll('"', '\\\\"')]) {
      expect(parseFace('"color":"#111111","shape":"wrong"' + html)).toEqual({ color: '#ff9800', shape: 'tablet' })
    }
    for (const html of ['', '<html>nothing</html>', '"color":"#777777","shape":"hex"',
      snippet.replace('#FF9800', '#fff'), snippet.replace('tablet', ' '),
      '"addHref":"x","other":{"color":"#777777","shape":"hex"}']) {
      expect(parseFace(html)).toBeNull()
    }
  })
  it('成功更新；抓取与解析失败分别保留旧条目，无旧数据则不写入；不修改输入', async () => {
    const previous = { success: old, network: old, parsing: old }
    const bots = ['success', 'network', 'parsing', 'new-network', 'new-parsing'].map((slug) => ({ slug, templateUrl: slug }))
    const fetchText = async (url) => {
      if (url.includes('network')) throw new Error('mock network failure')
      return url === 'success' ? snippet : '<html>changed</html>'
    }
    const { faces, warnings } = await syncFaces({ bots, previous, fetchText, today })
    expect(faces).toEqual({ success: { color: '#ff9800', shape: 'tablet', fetchedAt: today }, network: old, parsing: old })
    expect(previous).toEqual({ success: old, network: old, parsing: old })
    expect(warnings).toHaveLength(4)
    for (const slug of ['network', 'parsing', 'new-network', 'new-parsing']) {
      expect(warnings.some((w) => w.includes(` / ${slug} / `) && w.includes('改法'))).toBe(true)
    }
  })
})

describe('离线数据校验', () => {
  it('接受合法 slug、未知但非空的形状名', () => {
    expect(checkFaces({ 'a-12': old, b: { ...old, shape: 'future-shape' } })).toEqual([])
    expect(checkFaces({})).toEqual([])
  })
  it.each([null, [], 3, 'text'])('拒绝非对象根节点：%s', (input) => {
    expect(checkFaces(input).join('\n')).toMatch(/faces\.json.*根对象.*改法/)
  })
  it('逐条说明非法键、缺失/额外字段、格式和类型错误', () => {
    const errors = checkFaces({
      'Bad--slug': { color: '#ABCDEF', shape: ' ', fetchedAt: '14/11/2026', extra: true },
      missing: {}, array: [], nil: null, number: { color: 777777, shape: 1, fetchedAt: 20261114 }
    })
    for (const field of ['Bad--slug（键）', 'Bad--slug.extra', 'Bad--slug.color', 'Bad--slug.shape',
      'Bad--slug.fetchedAt', 'missing.color', 'missing.shape', 'missing.fetchedAt', 'array', 'nil', 'number.color']) {
      expect(errors.some((e) => e.includes(` / ${field} / `))).toBe(true)
    }
    expect(errors.every((e) => e.includes('faces.json / ') && e.includes(' / 改法：'))).toBe(true)
  })
})

describe('形状及缓存', () => {
  it('25 个形状都具有有效的 64 点轮廓，并缓存为稳定对象', () => {
    expect(XAI_SHAPE_IDS).toHaveLength(25)
    for (const id of XAI_SHAPE_IDS) {
      const radii = shapeRadii(id)
      expect(radii).toBe(shapeRadii(id))
      expect(radii).toHaveLength(64)
      expect(radii.every(Number.isFinite)).toBe(true)
      expect(Math.max(...radii)).toBeGreaterThanOrEqual(0.95)
      expect(Math.max(...radii)).toBeLessThanOrEqual(1.2)
      expect(Math.min(...radii), id).toBeGreaterThan(0.3)
    }
    expect(shapeRadii('unknown')).toBeNull()
    expect(shapeRadii('constructor')).toBeNull()
  })
  it('自带形状保留眼睛修正用的数组身份；egg 只复制一次', () => {
    const mapping = { blob: 'cercle', pebble: 'galet', squircle: 'squircle', square: 'squircle', tablet: 'capsule',
      capsule: 'capsule', hex: 'hexagone', cloud: 'nuage', teardrop: 'goutte' }
    for (const [id, original] of Object.entries(mapping)) {
      expect(shapeRadii(id)).toBe(SHAPES.find((s) => s.id === original).radii)
    }
    expect(shapeRadii('egg')).toEqual(PROFILES.egg)
    expect(shapeRadii('egg')).not.toBe(PROFILES.egg)
  })
  it('仅两对别名允许重合，其余形状逐点最大差大于 0.02', () => {
    const aliases = ['capsule,tablet', 'square,squircle']
    for (let i = 0; i < XAI_SHAPE_IDS.length; i++) {
      for (const b of XAI_SHAPE_IDS.slice(i + 1)) {
        const a = XAI_SHAPE_IDS[i]
        if (aliases.includes([a, b].sort().join(','))) continue
        expect(Math.max(...shapeRadii(a).map((r, k) => Math.abs(r - shapeRadii(b)[k]))), `${a}/${b}`).toBeGreaterThan(0.02)
      }
    }
  })
})

describe('真脸选择和兼容回退', () => {
  it('无官方数据完全保持旧算法；三个 fixtures 的颜色不变', () => {
    for (const slug of ['demo-weekly-digest', 'demo-prd-reviewer', 'demo-external', 'constructor']) {
      const seed = avatarSeed(slug)
      const shape = SHAPES[seed % SHAPES.length]
      const color = COLORS[Math.floor(seed / SHAPES.length) % COLORS.length].hex
      expect(resolveFace(slug)).toEqual({ slug, shape: `seed:${shape.id}`, radii: shape.radii, color, source: 'seed' })
      expect(resolveFace(slug).radii).toBe(shape.radii)
      expect(avatarColor(slug)).toBe(color)
    }
  })
  it('官方颜色与已知形状优先', () => {
    expect(resolveFace('example', { color: '#FF9800', shape: 'tablet' })).toEqual({
      slug: 'example', shape: 'tablet', color: '#ff9800', radii: shapeRadii('tablet'), source: 'official'
    })
    expect(botFace('memory-keeper').source).toBe('official')
    expect(avatarColor('memory-keeper')).toBe('#777777')
  })
  it('未知形状只退回 seed 形状，保留官方颜色', () => {
    const fallback = resolveFace('example')
    const face = resolveFace('example', { color: '#ABCDEF', shape: 'future' })
    expect(face).toEqual({ ...fallback, color: '#abcdef' })
    expect(face.radii).toBe(fallback.radii)
  })
})

describe('WCAG 主题亮度边界', () => {
  it('深色阈值两侧：#383838 < 0.04，#393939 > 0.04', () => {
    expect(faceColors('#383838').dark).toBe('#f1efe9')
    expect(faceColors('#393939').dark).toBe('#393939')
    expect(faceColors('#000000')).toEqual({ light: '#000000', dark: '#f1efe9', outline: null })
  })
  it('描边阈值两侧：#ededed < 0.85，#eeeeee > 0.85', () => {
    expect(faceColors('#EDEDED')).toEqual({ light: '#ededed', dark: '#ededed', outline: null })
    expect(faceColors('#EEEEEE')).toEqual({ light: '#eeeeee', dark: '#eeeeee', outline: 'rgba(0,0,0,.12)' })
    expect(faceColors('#FFFFFF').outline).toBe('rgba(0,0,0,.12)')
  })
  it('彩色按各通道亮度权重计算，而非 RGB 平均', () => {
    expect(faceColors('#00FF00')).toEqual({ light: '#00ff00', dark: '#00ff00', outline: null })
    expect(faceColors('#000080').dark).toBe('#f1efe9')
  })
})
