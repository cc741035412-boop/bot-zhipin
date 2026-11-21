import { redact, scanSecrets } from '../../lib/validate/secrets.mjs'

// 动作规则不是权限判定：只供人工筛查，不执行来源文字。
export const RULES = [
  { id: 'R-send', action: /自动(?:发送|回复|发布)|代发|\b(?:auto(?:matically)?[- ]?(?:send|reply|publish|post)|send (?:the |a )?(?:reply|email|message)|post .{0,80}? to X)\b/i },
  { id: 'R-pay', action: /付款|支付|下单|转账|购买|订阅|\b(?:pay|purchase|buy|subscribe|transfer (?:money|funds)|place (?:the |an? )?order)\b/i },
  { id: 'R-delete', action: /删除|清空|\b(?:delete|erase|purge|rm\s+-rf)\b/i },
  { id: 'R-noapproval', action: /跳过(?:确认|审批)|不用问我|无需确认|自动批准|关(?:闭)?审批|\b(?:without asking me|no need to confirm|skip (?:approval|confirmation)|auto[- ]?approve|disable approvals?)\b/i },
  { id: 'R-credential', action: /(?:读取|索要|保存|粘贴).{0,40}?(?:密码|密钥|token|cookie|验证码|助记词)|把(?:密码|密钥|token|cookie|验证码|助记词)发给我|\b(?:paste|read|save|store|ask for|request)\b.{0,60}?\b(?:passwords?|api[-_ ]?keys?|tokens?|cookies?|verification codes?|seed phrases?)\b/i },
  { id: 'R-upload', action: /上传到|外发文件|\b(?:upload\b.{0,80}?\bto\b|post\b.{0,80}?\b(?:webhook|https?:\/\/))/i },
]
const guarded = /\b(?:never|don['’]t|do not|not|no|without my (?:approval|ok)|ask (?:me )?(?:first|before)|until I approve|only after I approve|draft)\b|不要|别|禁止|不得|不准|未经|先问|经我同意|确认后|草稿/i
const boundaries = /[。！？!?\r\n]+|\.(?![a-z0-9])|(?:^|\s)(?:[-+*•]|\d+[.)、])\s+/i

export function review(text) {
  const hits = []
  const rules = new Set()
  for (const part of (text ?? '').split(boundaries)) {
    const sentence = part.trim()
    if (!sentence) continue
    const exempt = guarded.test(sentence)
    for (const { id, action } of RULES) {
      if ((!exempt || id === 'R-noapproval') && action.test(sentence)) {
        rules.add(id)
        hits.push({ rule: id, excerpt: Array.from(sentence).slice(0, 80).join('') })
      }
    }
  }
  return { flag: rules.size > 0, rules: [...rules], hits }
}

export function screen(record) {
  if (!record.body) return { ...record, needsReview: review(null) }
  const file = { path: record.id, text: record.body, size: Buffer.byteLength(record.body), format: null }
  let secret = false
  scanSecrets({ files: [file] }, (_, location) => {
    // scanSecrets 对大文件只报告大小后跳过；仍用同模块的规则逐行复核。
    secret ||= location !== '文件大小' || file.text.split(/\r\n?|\n/).some(line => redact(line) !== line)
  })
  if (!secret) return { ...record, needsReview: review(record.body) }
  return { ...record, body: null, extra: { ...record.extra, withheld: 'secret' },
    needsReview: { flag: true, rules: ['R-secret'], hits: [] } }
}
