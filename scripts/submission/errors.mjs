import { redact } from '../lib/validate/secrets.mjs'

export const COMMENT_MARKER = '<!-- bot-zhipin-submission -->'

export class SubmissionError extends Error {
  constructor(errors) {
    super(errors.map((item) => item.problem).join('；'))
    this.errors = errors
  }
}

export function fail(file, where, problem, fix) {
  throw new SubmissionError([{ file, where, problem, fix }])
}

export function errorItems(error) {
  return error instanceof SubmissionError ? error.errors : [{
    file: '投稿工作流', where: '自动处理', problem: '处理未完成（未公开内部异常或命令输出）',
    fix: '请维护者检查 Actions 运行、仓库权限和网络，再编辑或重新打开这个 Issue 重试。',
  }]
}

export function formatErrors(errors) {
  return errors.map(({ file, where, problem, fix }) =>
    `文件：${file}\n位置：${where}\n问题：${problem}\n改法：${fix}`,
  ).map(redact).join('\n\n')
}

export function failureComment(errors) {
  // 不让投稿内容闭合诊断代码块，也不回显凭据；为 GitHub 评论长度留余量。
  const all = formatErrors(errors).replace(/`{100,}/g, '（超长反引号已省略）')
  const text = all.length > 40_000 ? `${all.slice(0, 40_000)}\n（错误过多，先修复以上问题再重试。）` : all
  const fence = '`'.repeat(Math.max(3, ...[...text.matchAll(/`+/g)].map((m) => m[0].length + 1)))
  return `${COMMENT_MARKER}\n还没通过检查\n\n${fence}text\n${text}\n${fence}\n\n把这条评论整段发给你的 AI，让它改好后给你一个新链接；或者点这个 Issue 右上角 ··· → Edit，把投稿包换成新的，保存后会自动重新检查。`
}
