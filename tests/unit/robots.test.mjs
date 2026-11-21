import { readFileSync } from 'node:fs'
import { expect, it } from 'vitest'
import { SITE } from '../../site/.vitepress/meta.mjs'

it('robots.txt 的 Sitemap 行指向当前正式域名', () => {
  const robots = readFileSync(new URL('../../site/public/robots.txt', import.meta.url), 'utf8')
  expect(robots.split('\n').filter((line) => line.startsWith('Sitemap:'))).toEqual([`Sitemap: ${SITE.url}/sitemap.xml`])
})
