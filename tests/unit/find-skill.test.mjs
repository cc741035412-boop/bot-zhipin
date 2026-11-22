// bot-zhipin skill 的搜索打分（integrations/bot-zhipin/skills/bot-zhipin/scripts/find.py）：
// 用合成条目调它的 score()，把审查里踩过的排序坑固定下来。不联网、不写缓存，也不留 __pycache__。
import { spawnSync } from 'node:child_process'
import { join } from 'node:path'
import { expect, it } from 'vitest'
import { ROOT } from '../../scripts/lib/load-bots.mjs'

const FIND = join(ROOT, 'integrations/bot-zhipin/skills/bot-zhipin/scripts/find.py')
const HARNESS = `
import importlib.util, json, sys
spec = importlib.util.spec_from_file_location('find', sys.argv[1])
find = importlib.util.module_from_spec(spec); spec.loader.exec_module(find)
cases = json.loads(sys.stdin.read())
out = []
for case in cases:
    terms = [t for t in find.SPLIT.split(find.fold(case['query'])) if t]
    phrase = ' '.join(terms)
    out.append([find.score(item, terms, phrase) for item in case['items']])
print(json.dumps(out))
`
function scores(cases) {
  const run = spawnSync('python3', ['-c', HARNESS, FIND], {
    input: JSON.stringify(cases), encoding: 'utf8', env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' },
  })
  expect(run.status, run.stderr).toBe(0)
  return JSON.parse(run.stdout)
}
const item = (fields) => ({ kind: 'prompt', slug: 'x', title: '', purpose: '', scenarios: [], tags: [], author: '', ...fields })

it('三个字的词不切成两字：只有前两个字的条目排在含完整原词的后面', () => {
  const [[full, prefix]] = scores([{ query: '面试题', items: [
    item({ title: '备考教练', purpose: '按岗位出面试题库' }),
    item({ title: '面试陪练' }),
  ] }])
  expect(full).toBeGreaterThan(prefix)
})

it('原词完整出现在标签里，排在标题只凑上半截的前面', () => {
  const [[tagged, halves]] = scores([{ query: '概念学习', items: [
    item({ title: '追问式家教', tags: ['概念学习'] }),
    item({ title: '概念卡片', purpose: '学习时用' }),
  ] }])
  expect(tagged).toBeGreaterThan(halves)
})

it('四个字的词只命中一半也给分，排在全中之后', () => {
  const [[whole, half, none]] = scores([{ query: '简历优化', items: [
    item({ title: '简历优化师' }), item({ title: '简历定制师' }), item({ title: '公司拆解员' }),
  ] }])
  expect(whole).toBeGreaterThan(half)
  expect(half).toBeGreaterThan(0)
  expect(none).toBe(0)
})

it('零碎片段凑不出结果：五个片段只中一个不算', () => {
  const [[noise]] = scores([{ query: '不存在的词', items: [item({ title: '现在的做法' })] }])
  expect(noise).toBe(0)
})

it('英文按词边界：pr 不命中 prompt、prd；review 能命中 reviews', () => {
  const [[prompt, pr], [reviews]] = scores([
    { query: 'pr', items: [item({ title: 'prompt prd' }), item({ purpose: '改完开成 PR' })] },
    { query: 'review', items: [item({ purpose: 'code reviews' })] },
  ])
  expect(prompt).toBe(0)
  expect(pr).toBeGreaterThan(0)
  expect(reviews).toBeGreaterThan(0)
})

it('适用工具里的「Claude Code」不让单独的 code 命中，整名和首词才算', () => {
  const skill = (fields) => item({ kind: 'skill', agents: ['Claude Code', 'Codex'], ...fields })
  const [[metrics, codeReview], [byAgent]] = scores([
    { query: 'code review', items: [skill({ title: 'metrics-review' }), item({ title: '审代码', slug: 'fabric-zh-code-review', purpose: '按严重程度 review code' })] },
    { query: 'claude', items: [skill({ title: '写作' })] },
  ])
  expect(codeReview).toBeGreaterThan(metrics)
  expect(byAgent).toBeGreaterThan(0)
})

it('全角标点也能分词', () => {
  const [[both]] = scores([{ query: '小红书，标题', items: [item({ title: '小红书封面', purpose: '提炼大字标题' })] }])
  const [[onlyOne]] = scores([{ query: '小红书，标题', items: [item({ title: '小红书封面' })] }])
  expect(both).toBeGreaterThan(onlyOne)
})
