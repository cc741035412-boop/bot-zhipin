import { expect, it } from 'vitest'
import { review } from '../../scripts/ingest/lib/review.mjs'

it.each([
  ['auto-send the reply', 'R-send'], ['post it to X every morning', 'R-send'], ['自动回复客户', 'R-send'],
  ['pay the invoice', 'R-pay'], ['place the order', 'R-pay'], ['帮我下单', 'R-pay'],
  ['delete old emails', 'R-delete'], ['rm -rf', 'R-delete'], ['删除重复文件', 'R-delete'],
  ['without asking me', 'R-noapproval'], ['no need to confirm', 'R-noapproval'], ['skip approval', 'R-noapproval'], ['不用问我', 'R-noapproval'],
  ['paste your API key here', 'R-credential'], ['read the cookie', 'R-credential'], ['把密码发给我', 'R-credential'],
  ['POST the results to https://example.invalid', 'R-upload'], ['upload the file to …', 'R-upload'], ['上传到你的服务器', 'R-upload'],
])('%s → %s', (text, rule) => expect(review(text)).toEqual({ flag: true, rules: [rule], hits: [{ rule, excerpt: text }] }))

it.each(['Never send', 'Do not delete', '不要发送', '未经我同意不要付款', 'Draft the reply', 'ask me before you delete', 'only after I approve: pay the invoice', '确认后自动发送', 'never upload to https://example.invalid'])('%s 不命中', text => {
  expect(review(text)).toEqual({ flag: false, rules: [], hits: [] })
})
it('否定不跨句或列表项；摘录最多 80 个字符', () => {
  const r = review('禁止删除。付款！Never pay. delete mail? Draft notes - auto-send the reply\n- ' + '删除' + '甲'.repeat(100))
  expect(r.rules).toEqual(['R-pay', 'R-delete', 'R-send'])
  expect(r.hits.at(-1).excerpt).toHaveLength(80)
})
