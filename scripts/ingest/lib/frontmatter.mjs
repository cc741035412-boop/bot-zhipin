// 读 Markdown 头上的 YAML frontmatter。来源文件是不可信数据：只解析成普通对象，不支持自定义标签。
import { parse } from 'yaml'

const FM = /^---\r?\n([\s\S]*?)\r?\n---[ \t]*(?:\r?\n|$)/

export function splitFrontmatter(text) {
  const src = String(text).replace(/^﻿/, '')
  const m = src.match(FM)
  if (!m) return { data: {}, body: src, hasFrontmatter: false }
  let data
  try {
    data = parse(m[1], { schema: 'core', customTags: [], maxAliasCount: 50 }) ?? {}
  } catch (error) {
    throw new Error(`frontmatter 不是合法 YAML：${error.message}`)
  }
  if (typeof data !== 'object' || Array.isArray(data)) data = {}
  return { data, body: src.slice(m[0].length), hasFrontmatter: true }
}

export function parseYaml(text) {
  const data = parse(String(text), { schema: 'core', customTags: [], maxAliasCount: 50 }) ?? {}
  return typeof data === 'object' && !Array.isArray(data) ? data : {}
}

// 第一个 Markdown 一级标题；没有就返回 null。
export function firstHeading(text) {
  const m = String(text).match(/^#[ \t]+(.+?)[ \t]*#*[ \t]*$/m)
  return m ? m[1].trim() : null
}
