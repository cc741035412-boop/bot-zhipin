import { data as enums } from './enums.data.mjs'
export interface LibraryCard {
  kind: 'prompt' | 'skill'
  slug: string
  title: string
  category: string
  purpose: string
  scenarios: string[]
  tags: string[]
  author: { name: string; url?: string }
  license: string
  licenseUrl?: string
  source: { name: string; url: string }
  addedAt: string
  detailUrl: string
  hasBody?: boolean
  copyText?: string | null
  titleOriginal?: string
  name?: string
  agents?: string[]
  models?: string[]
  images?: { src: string; alt: string; credit: string; width: number; height: number }[]
}
export interface LibraryItem extends LibraryCard {
  summary?: string
  copyright?: string
  lang?: string
  usage?: string
  body?: string
  bodyZh?: string
  requires?: string[]
  install?: { agent: string; command: string; note?: string }[]
}
export const categoriesFor = (kind: LibraryCard['kind']): string[] =>
  kind === 'prompt' ? enums.promptCategories : enums.skillCategories
export const norm = (s: string) => s.normalize('NFKC').trim().toLowerCase()
export const fieldsFor = (i: LibraryCard) =>
  [
    i.title,
    i.titleOriginal || i.name || '',
    i.category,
    i.purpose,
    ...i.scenarios,
    ...i.tags,
    i.author.name,
    ...(i.agents || []),
    ...(i.kind === 'prompt' && i.copyText ? [i.copyText] : []),
  ].map(norm)
export function listQuery(q: string, cat: string) {
  const params = new URLSearchParams()
  if (q.trim()) params.set('q', q.trim())
  if (cat) params.set('cat', cat)
  return params.size ? '?' + params : ''
}
export function readQuery(categories: string[]) {
  const params = new URLSearchParams(location.search)
  const cat = params.get('cat') || ''
  return { q: (params.get('q') || '').trim(), cat: categories.includes(cat) ? cat : '' }
}
