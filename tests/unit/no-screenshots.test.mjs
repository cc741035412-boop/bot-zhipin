// DECISIONS 第 43 条：投稿不收截图。这里只放跨模块的兜底断言，细节见各模块自己的测试。
import { expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { pack, unpack } from '../../scripts/submission/bundle.mjs'

it('手写投稿包可以不写 screenshots 段，解出来是零张', () => {
  const manual = 'BOT-ZHIPIN-BUNDLE v1\n=== bots/demo-x/bot.yaml ===\nslug: demo-x\n=== bots/demo-x/DESIGN.md ===\n# 设计说明\n=== end ===\n'
  expect(unpack(manual)).toEqual({ slug: 'demo-x', files: { 'bots/demo-x/bot.yaml': 'slug: demo-x', 'bots/demo-x/DESIGN.md': '# 设计说明' }, screenshots: [] })
})
it('生成的投稿包仍带空的 screenshots 段，旧令牌和新令牌都能互相读', () => {
  const bundle = { slug: 'demo-x', files: { 'bots/demo-x/bot.yaml': 'slug: demo-x\n' }, screenshots: [] }
  const text = pack(bundle)
  expect(text).toContain('=== bots/demo-x/screenshots ===\n\n=== end ===\n')
  expect(unpack(text)).toEqual(bundle)
})
it('screenshots 段仍然只能出现一次', () => {
  const twice = 'BOT-ZHIPIN-BUNDLE v1\n=== bots/demo-x/bot.yaml ===\nslug: demo-x\n=== bots/demo-x/screenshots ===\n\n=== bots/demo-x/screenshots ===\n\n=== end ===\n'
  expect(() => unpack(twice)).toThrow()
})
it('给投稿 AI 的指南里，手写格式示例没有 screenshots 段，也不让用户准备截图', () => {
  const guide = readFileSync('AGENTS.md', 'utf8')
  expect(guide).not.toMatch(/=== bots\/<slug>\/screenshots ===/)
  expect(guide).not.toMatch(/拖(进|入)[^\n]*截图|截图[^\n]*拖(进|入)|准备[^\n]{0,8}截图/)
})
