import { validate as check, schema } from './generated/bot-schema.mjs'
const decode = (key) => key.replace(/~1/g, '/').replace(/~0/g, '~')
const parts = (pointer) => pointer.split('/').slice(1).map(decode)
const valueAt = (data, pointer) => parts(pointer).reduce((value, key) => value?.[key], data)
const show = (value) => JSON.stringify(value) ?? '（未填写）'

function distance(a, b) {
  let row = Array.from({ length: b.length + 1 }, (_, i) => i)
  for (let i = 1; i <= a.length; i++) {
    const next = [i]
    for (let j = 1; j <= b.length; j++) next[j] = Math.min(next[j - 1] + 1, row[j] + 1, row[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1))
    row = next
  }
  return row[b.length]
}

function propertySchema(pointer) {
  return parts(pointer).reduce((node, key) => node?.properties?.[key] ?? node?.items, schema)
}

export function validateSchema(bot, report) {
  if (check(bot.data)) return
  const selected = new Map()
  for (const error of check.errors) {
    if (error.keyword === 'if') continue
    // anyOf 只保留与实际类型相符的分支，避免一处错误出现三条。
    if (error.schemaPath.startsWith('#/properties/prerequisites/anyOf')) {
      const value = bot.data.prerequisites
      const branch = typeof value === 'string' ? 0 : Array.isArray(value) ? 1 : null
      if (branch === null && error.keyword !== 'anyOf') continue
      if (branch !== null && !error.schemaPath.startsWith(`#/properties/prerequisites/anyOf/${branch}/`)) continue
    }
    let pointer = error.instancePath
    if (error.keyword === 'required') pointer += `/${error.params.missingProperty}`
    if (error.keyword === 'additionalProperties') pointer += `/${error.params.additionalProperty}`
    if (!selected.has(pointer) || (error.keyword === 'pattern' && ['/name', '/tagline', '/pitch'].includes(pointer))) selected.set(pointer, error)
  }
  for (const [pointer, error] of selected) {
    const where = parts(pointer).join('.') || '整个 bot.yaml'
    const value = valueAt(bot.data, pointer)
    const node = propertySchema(pointer)
    let problem, fix
    switch (error.keyword) {
      case 'required': {
        const field = error.params.missingProperty
        const options = node?.enum
        const label = node?.description?.split(/[，。]/)[0]
        problem = `缺少必填字段 ${where}${label ? `（${label}）` : ''}`
        fix = options
          ? `加一行 ${field}: ${options[Math.floor(options.length / 2)]}（可选值：${options.join('、')}）`
          : `在 ${parts(error.instancePath).join('.') || 'bot.yaml 顶层'} 加上 ${field} 字段${node?.description ? `：${node.description}` : '，填写实际内容'}。`
        break
      }
      case 'additionalProperties': {
        const name = error.params.additionalProperty
        if (name.length > 64) {
          problem = `不认识的字段 ${where}`
          fix = `删除字段 ${name}，只使用 schema/bot.schema.json 中定义的字段。`
          break
        }
        const legal = Object.keys(error.parentSchema.properties || {})
        const closest = legal.sort((a, b) => distance(name, a) - distance(name, b) || a.localeCompare(b))[0]
        problem = `不认识的字段 ${where}，是不是想写 ${closest}？`
        fix = `将字段名 ${name} 改为 ${closest}（确认含义正确），或删除这个字段。`
        break
      }
      case 'enum':
        problem = `${where} 当前值 ${show(value)} 不是可选的值；可选值：${error.params.allowedValues.join('、')}`
        fix = `把 ${where} 改成以上可选值之一，文字必须完全一致。`
        break
      case 'minLength':
      case 'maxLength': {
        const rules = error.parentSchema
        problem = `${where} 当前值 ${show(value)}，长度为 ${[...value].length}；要求 ${rules.minLength ?? 0}～${rules.maxLength ?? '不限'} 个字符`
        fix = `调整 ${where} 的文字长度，满足上述范围。`
        break
      }
      case 'pattern':
        if (where === 'templateUrl') {
          problem = typeof value === 'string' && !value.startsWith('https://x.ai/bot/')
            ? `templateUrl 当前值 ${show(value)}，必须以 https://x.ai/bot/ 开头`
            : `templateUrl 当前值 ${show(value)} 格式不正确；要求 https://x.ai/bot/ 后接字母、数字、下划线或短横线组成的非空 ID`
          fix = '将 templateUrl 替换成 Grok Bot 分享得到的完整模板链接，不加空格、查询参数或额外路径。'
        } else if (['name', 'tagline', 'pitch'].includes(where)) {
          problem = `${where} 不能使用字符 <、>、"（英文双引号）`
          fix = `删除 ${where} 中的 <、>、"，用纯文字描述，不要填写 HTML。`
        } else if (where === 'addedAt') {
          problem = `addedAt 当前值 ${show(value)} 不是有效日期；要求 YYYY-MM-DD`
          fix = '填写真实存在的年月日，例如 2026-01-01。'
        } else {
          problem = `${where} 当前值 ${show(value)} 格式不正确；要求 ${node?.description || ''}，匹配正则 ${error.params.pattern}`
          fix = `按上述格式改写 ${where}。`
        }
        break
      case 'type':
        problem = `${where} 当前值 ${show(value)} 类型不正确；要求 ${error.params.type}`
        fix = `把 ${where} 改成 ${error.params.type} 类型，不要用空值代替实际内容。`
        break
      case 'anyOf':
        problem = `${where} 当前值 ${show(value)} 格式不正确；要求 1～200 字的字符串，或至少一项、每项 1～100 字的字符串列表`
        fix = `将 ${where} 填为实际准备事项；无需准备时写 prerequisites: 无。`
        break
      case 'minItems':
        problem = `${where} 当前值 ${show(value)}，要求至少 ${error.params.limit} 项`
        fix = `在 ${where} 中补充实际内容；无需准备时写 prerequisites: 无。`
        break
      case 'uniqueItems':
        problem = `${where} 当前值 ${show(value)} 含重复项；要求每个值只出现一次`
        fix = `删除 ${where} 中重复的列表项。`
        break
      default:
        problem = `${where} 当前值 ${show(value)} 不符合 ${error.keyword} 要求`
        fix = `按照 schema/bot.schema.json 中 ${where} 的定义修改。`
    }
    report(bot.yamlPath, where, problem, fix)
  }
}
