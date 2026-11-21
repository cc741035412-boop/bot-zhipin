import { expect, it } from 'vitest'
import { renderLlms } from '../../scripts/lib/llms.mjs'
import { SITE } from '../../site/.vitepress/meta.mjs'

it('仅列出非空分组，按枚举顺序、组内中文叫法排序，小队单独成节', () => {
  const bots = [
    { name: 'Zoo', nameZh: '安安', category: '内容', detailUrl: '/bots/aa', tagline: '安安简介' },
    { name: '早早', category: '产品', detailUrl: '/bots/bb', tagline: '早早简介' },
    { name: 'Zebra', nameZh: '阿宝', category: '产品', detailUrl: '/bots/cc', tagline: '阿宝简介' },
  ]
  const squads = [{ name: '示例小队', detailUrl: '/squads/team', tagline: '队伍简介' }]
  const text = renderLlms({ bots, squads }, ['产品', '市场', '内容'])
  expect(text.startsWith(`# ${SITE.name}\n\n> ${SITE.tagline}\n\n`)).toBe(true)
  expect(text).toContain('现在收录 3 个 Bot、1 支小队，分成 产品、内容 这几组。')
  expect(text.slice(text.indexOf('## Bot\n'))).toBe(`## Bot

### 产品

- [阿宝（Zebra）](${SITE.url}/bots/cc)：阿宝简介
- [早早](${SITE.url}/bots/bb)：早早简介

### 内容

- [安安（Zoo）](${SITE.url}/bots/aa)：安安简介

## 小队

- [示例小队](${SITE.url}/squads/team)：队伍简介
`)
})

it('没有小队时省略小队节，末尾只有一个换行', () => {
  const text = renderLlms({ bots: [], squads: [] }, [])
  expect(text).not.toContain('## 小队')
  expect(text.endsWith('## Bot\n')).toBe(true)
})
