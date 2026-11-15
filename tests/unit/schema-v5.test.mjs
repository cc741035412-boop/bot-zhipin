// V5 的 bot.yaml 新规则：岗位枚举、多句台词、about。
import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { join, relative, resolve } from 'node:path'
import YAML from 'yaml'
import { ROOT, loadBot, loadEnums } from '../../scripts/lib/load-bots.mjs'
import { buildBotModel } from '../../scripts/lib/bot-model.mjs'
import { validateModels } from '../../scripts/lib/validate/core.mjs'
import { schema } from '../../scripts/lib/validate/generated/bot-schema.mjs'

const fixture = join(ROOT, 'tests/fixtures/bots'), now = '2026-11-14T04:00:00Z'
function memory(bot) {
  return buildBotModel(bot.slug, {
    files: bot.files.map((file) => ({ ...file, rel: relative(bot.dir, file.path) })),
    dirs: bot.skills.map((skill) => `skills/${skill.name}`),
    symlinks: bot.symlinks.map((link) => relative(bot.dir, resolve(bot.dir, '../..', link))),
  })
}
const template = memory(loadBot('_template', join(ROOT, 'bots')))
// demo-weekly-digest 没有 pitch 和 about，改起来最干净。
const fresh = (update = () => {}) => { const bot = memory(loadBot('demo-weekly-digest', fixture)); bot.data.forkedFrom = undefined; delete bot.data.forkedFrom; update(bot.data); return bot }
const check = (update, options = {}) => validateModels([fresh(update)], { template, now, ...options })
const at = (update, prefix) => check(update).errors.filter((error) => error.where === prefix || error.where.startsWith(`${prefix}.`))
const long = (n) => '字'.repeat(n)

describe('岗位', () => {
  it('9 个岗位，顺序固定；字段名还是 category，说明改成「岗位」', () => {
    expect(loadEnums().categories).toEqual(['产品', '市场', '销售', '内容', '运营', '学习', '求职', '管家', '生活'])
    expect(schema.properties.category.description).toBe('岗位')
  })
  it.each(loadEnums().categories)('%s 通过', (category) => {
    expect(check((data) => { data.category = category }).errors).toEqual([])
  })
  // 旧 8 类里的「学习」「求职」在新枚举里还在；「个人」是 7 个岗位那一版的叫法，已改成「生活」。
  it.each(['调研', '定义', '评审', 'AI 评测', '日常', '基础设施', '个人'])('旧分类 %s 不再接受，报错列出全部岗位', (category) => {
    const errors = at((data) => { data.category = category }, 'category')
    expect(errors).toHaveLength(1)
    expect(errors[0].file).toBe('bots/demo-weekly-digest/bot.yaml')
    expect(errors[0].problem).toContain('可选值：产品、市场、销售、内容、运营、学习、求职、管家、生活')
    expect(errors[0].fix).toContain('改成以上可选值之一')
  })
})

describe('多句台词', () => {
  it.each([
    ['一句话', '一句自荐的话'],
    ['一句的列表', ['一句自荐的话']],
    ['三句的列表', ['第一句话', '第二句话', '第三句话']],
    ['每句刚好 2 字和 30 字', ['两字', long(30)]],
  ])('%s 通过', (_label, pitch) => {
    expect(check((data) => { data.pitch = pitch }).errors).toEqual([])
  })
  it.each([
    ['空列表', [], 'pitch', '要求至少 1 项'],
    ['四句', ['第一句话', '第二句话', '第三句话', '第四句话'], 'pitch', '最多 3 项'],
    ['两句一样', ['同一句话', '同一句话'], 'pitch', '含重复项'],
    ['列表里有尖括号', ['正常的一句', '带 <b> 的一句'], 'pitch.1', '不能使用字符 <、>、"'],
    ['列表里有英文双引号', ['带 " 的一句'], 'pitch.0', '不能使用字符 <、>、"'],
    ['列表里某句超过 30 字', ['正常的一句', long(31)], 'pitch.1', '要求 2～30 个字符'],
    ['列表里某句只有 1 字', ['短'], 'pitch.0', '要求 2～30 个字符'],
    ['一句话超过 30 字', long(31), 'pitch', '要求 2～30 个字符'],
    ['一句话带尖括号', '<script>', 'pitch', '不能使用字符 <、>、"'],
    ['数字', 123, 'pitch', '要求一句 2～30 字的话，或 1～3 句互不相同的话组成的列表'],
    ['对象', { a: '一句话' }, 'pitch', '要求一句 2～30 字的话，或 1～3 句互不相同的话组成的列表'],
  ])('%s：只报一条，写清位置和改法', (_label, pitch, where, problem) => {
    const errors = at((data) => { data.pitch = pitch }, 'pitch')
    expect(errors).toHaveLength(1)
    expect(errors[0].where).toBe(where)
    expect(errors[0].problem).toContain(problem)
    expect(errors[0].fix.length).toBeGreaterThan(4)
  })
  it('列表里混进模板的示例句也算没改模板', () => {
    const example = template.data.pitch
    expect(typeof example).toBe('string')
    for (const pitch of [example, [example], ['自己写的一句', example]]) {
      const errors = at((data) => { data.pitch = pitch }, 'pitch')
      expect(errors.map((error) => error.problem)).toEqual(['pitch 还是模板里的示例'])
    }
    expect(at((data) => { data.pitch = ['自己写的一句'] }, 'pitch')).toEqual([])
  })
})

const about = () => ({
  intro: '你把一周的聊天记录发给它，它整理成一份周报交给你。',
  does: ['整理聊天记录', '按项目归类'],
  starters: ['帮我整理这周的记录'],
  skills: [{ name: 'weekly-summary', does: '把零散记录整理成周报' }],
  routines: [{ what: '整理本周周报', when: '每周五下午 5 点', default: '关', quiet: '不打扰' }],
  fit: '每周都要写周报的人',
  notFit: '一周只有两三条记录的人',
  cnFit: '好',
  cnNote: '不用连任何账号',
})
describe('about', () => {
  it('写全了通过；每个字段都可选，单独写一个也通过；空对象也通过', () => {
    expect(check((data) => { data.about = about() }).errors).toEqual([])
    for (const [key, value] of Object.entries(about())) expect(check((data) => { data.about = { [key]: value } }).errors, key).toEqual([])
    expect(check((data) => { data.about = {} }).errors).toEqual([])
  })
  it('上下限刚好卡在边界上通过', () => {
    expect(check((data) => {
      data.about = {
        intro: long(200), does: Array.from({ length: 6 }, () => long(40)), starters: Array.from({ length: 3 }, () => long(60)),
        skills: Array.from({ length: 16 }, () => ({ name: long(30), does: long(60) })),
        routines: Array.from({ length: 12 }, () => ({ what: '任务', when: '每天', default: '未说明', quiet: '未说明' })),
        fit: long(60), notFit: long(60), cnFit: '一般', cnNote: long(80),
      }
    }).errors.filter((error) => error.where !== '文件大小')).toEqual([])
    expect(check((data) => { data.about = { intro: long(10), does: ['两字'], skills: [{ name: '名', does: '两字' }] } }).errors).toEqual([])
  })
  it.each([
    ['intro 不到 10 字', (a) => { a.intro = '太短了' }, 'about.intro', '要求 10～200 个字符'],
    ['intro 超过 200 字', (a) => { a.intro = long(201) }, 'about.intro', '要求 10～200 个字符'],
    ['intro 带尖括号', (a) => { a.intro = '它会输出 <b>加粗</b> 的结果给你看。' }, 'about.intro', '不能使用字符 <、>、"'],
    ['does 是空列表', (a) => { a.does = [] }, 'about.does', '要求至少 1 项'],
    ['does 有 7 条', (a) => { a.does = Array.from({ length: 7 }, (_, i) => `第 ${i} 件事`) }, 'about.does', '最多 6 项'],
    ['does 某条只有 1 字', (a) => { a.does = ['短'] }, 'about.does.0', '要求 2～40 个字符'],
    ['does 某条超过 40 字', (a) => { a.does = ['正常的一条', long(41)] }, 'about.does.1', '要求 2～40 个字符'],
    ['does 写成一句话', (a) => { a.does = '一句话' }, 'about.does', '要求 array'],
    ['starters 有 4 条', (a) => { a.starters = ['第一句', '第二句', '第三句', '第四句'] }, 'about.starters', '最多 3 项'],
    ['starters 某条超过 60 字', (a) => { a.starters = [long(61)] }, 'about.starters.0', '要求 2～60 个字符'],
    ['skills 有 17 个', (a) => { a.skills = Array.from({ length: 17 }, (_, i) => ({ name: `skill-${i}`, does: '做一件事' })) }, 'about.skills', '最多 16 项'],
    ['skills 缺 does', (a) => { a.skills = [{ name: 'only-name' }] }, 'about.skills.0.does', '缺少必填字段 about.skills.0.does'],
    ['skills 缺 name', (a) => { a.skills = [{ does: '做一件事' }] }, 'about.skills.0.name', '缺少必填字段 about.skills.0.name'],
    ['skills 的 name 超过 30 字', (a) => { a.skills = [{ name: long(31), does: '做一件事' }] }, 'about.skills.0.name', '要求 1～30 个字符'],
    ['skills 的 does 超过 60 字', (a) => { a.skills = [{ name: '技能', does: long(61) }] }, 'about.skills.0.does', '要求 2～60 个字符'],
    ['skills 里有不认识的字段', (a) => { a.skills = [{ name: '技能', does: '做一件事', dose: '写错了' }] }, 'about.skills.0.dose', '是不是想写 does'],
    ['routines 有 13 个', (a) => { a.routines = Array.from({ length: 13 }, () => ({ what: '任务', when: '每天', default: '关', quiet: '照发' })) }, 'about.routines', '最多 12 项'],
    ['routines 的 default 不在可选值里', (a) => { a.routines[0].default = '开着' }, 'about.routines.0.default', '可选值：开、关、未说明'],
    ['routines 的 quiet 不在可选值里', (a) => { a.routines[0].quiet = '安静' }, 'about.routines.0.quiet', '可选值：不打扰、照发、未说明'],
    ['routines 缺 quiet', (a) => { delete a.routines[0].quiet }, 'about.routines.0.quiet', '缺少必填字段 about.routines.0.quiet'],
    ['routines 缺 when', (a) => { delete a.routines[0].when }, 'about.routines.0.when', '缺少必填字段 about.routines.0.when'],
    ['routines 的 what 超过 60 字', (a) => { a.routines[0].what = long(61) }, 'about.routines.0.what', '要求 2～60 个字符'],
    ['routines 的 when 超过 40 字', (a) => { a.routines[0].when = long(41) }, 'about.routines.0.when', '要求 2～40 个字符'],
    ['fit 超过 60 字', (a) => { a.fit = long(61) }, 'about.fit', '要求 2～60 个字符'],
    ['notFit 只有 1 字', (a) => { a.notFit = '无' }, 'about.notFit', '要求 2～60 个字符'],
    ['cnFit 不在可选值里', (a) => { a.cnFit = '差' }, 'about.cnFit', '可选值：好、一般'],
    ['cnNote 超过 80 字', (a) => { a.cnNote = long(81) }, 'about.cnNote', '要求 2～80 个字符'],
    ['cnNote 带英文双引号', (a) => { a.cnNote = '要先点 "允许" 才能用' }, 'about.cnNote', '不能使用字符 <、>、"'],
    ['about 里有不认识的字段', (a) => { a.introo = '写错字段名了，应该是 intro。' }, 'about.introo', '是不是想写 intro'],
  ])('%s：只报一条，位置精确到字段', (_label, mutate, where, problem) => {
    const errors = at((data) => { data.about = about(); mutate(data.about) }, 'about')
    expect(errors).toHaveLength(1)
    expect(errors[0]).toMatchObject({ file: 'bots/demo-weekly-digest/bot.yaml', where })
    expect(errors[0].problem).toContain(problem)
    expect(errors[0].fix.length).toBeGreaterThan(4)
  })
  it('about 写成一句话或列表：报类型不对', () => {
    for (const value of ['一句话', ['列表']]) {
      const errors = at((data) => { data.about = value }, 'about')
      expect(errors).toHaveLength(1)
      expect(errors[0].problem).toContain('要求 object')
    }
  })
  it('缺枚举字段时改法里给出可选值', () => {
    const [error] = at((data) => { data.about = about(); delete data.about.routines[0].default }, 'about')
    expect(error.fix).toBe('加一行 default: 关（可选值：开、关、未说明）')
  })
  it('网站投稿（非外部收录）也可以写 about 和多句台词', () => {
    const login = fresh().data.author.github
    expect(check((data) => { data.about = about(); data.pitch = ['第一句话', '第二句话'] }, { policy: { submission: { login } } }).errors).toEqual([])
  })
})

describe('投稿模板里的例子', () => {
  const text = readFileSync(join(ROOT, 'bots/_template/bot.yaml'), 'utf8')
  it('岗位注释列的是 schema 里的 9 个岗位，示例值也在里面', () => {
    const categories = loadEnums().categories
    expect(text).toContain(`九选一：${categories.join('、')}`)
    expect(categories).toContain(template.data.category)
    expect(text).not.toMatch(/八选一|七选一|调研、定义|管家、个人/)
  })
  it('注释掉的 about 例子去掉注释后是合法的写法', () => {
    const start = text.indexOf('# about:')
    expect(start).toBeGreaterThan(0)
    const block = text.slice(start).split('\n').filter((line) => line.startsWith('#')).map((line) => line.replace(/^# ?/, '')).join('\n')
    const example = YAML.parse(block).about
    expect(Object.keys(example)).toEqual(['intro', 'does', 'starters', 'routines', 'fit', 'notFit', 'cnFit', 'cnNote'])
    expect(check((data) => { data.about = example }).errors).toEqual([])
  })
  it('模板的示例台词本身符合规则（一句，2 到 30 字）', () => {
    expect(typeof template.data.pitch).toBe('string')
    expect([...template.data.pitch].length).toBeGreaterThanOrEqual(2)
    expect([...template.data.pitch].length).toBeLessThanOrEqual(30)
  })
})
