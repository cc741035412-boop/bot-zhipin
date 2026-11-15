export interface Diagnostic { file: string; where: string; problem: string; fix: string }
export interface ErrorCopy { message: string; next: string; action: string; fallback?: boolean; aiText?: string }
const expired = { message: '登录过期了，请重新登录。已经放好的截图都还在，不用重传。', next: '用 GitHub 登录', action: 'login' }

// 模板可直接给界面用；含变量、上传/提交差异时调用 explainError。
export const errorCopy: Record<string, ErrorCopy> = {
  bad_request: { message: '页面状态有点乱，刷新一下再试。已经传好的截图不会丢。', next: '刷新页面', action: 'reload' },
  unauthenticated: expired,
  session_expired: expired,
  forbidden_origin: { message: '请直接在 bot-zhipin.pages.dev 上打开投稿页再提交。', next: '复制本页链接', action: 'copy-link' },
  license_required: { message: '先勾选上面的授权，再提交。', next: '勾选授权', action: 'license-checkbox' },
  not_found: { message: '找不到这个投稿记录了，可能已经被关闭。', next: '查看 PR ↗', action: 'view-pr' },
  slug_taken: { message: '这个英文短名（slug：{slug}）已经被别人用了。', next: '复制给 AI', action: 'copy-ai', aiText: '投稿页提示 slug「{slug}」已经被别人用了。请换一个新的英文短名，同步修改文件夹名和 bot.yaml 里的 slug，再生成新的投稿链接给我。' },
  pr_limit: { message: '你已经有 {n} 个投稿在等审核了。等其中一个合并或关闭后再投新的。要改已经投的那个，用同一个 Bot 重新提交就会更新它。', next: '查看待审 PR', action: 'list-pulls' },
  too_large: { message: '投稿包太大了，请让 AI 精简一下文字内容。', next: '复制给 AI', action: 'copy-ai', aiText: '投稿页提示投稿包太大，请精简 DESIGN.md、ROLE.md 和技能说明，让文字总量少于 400KB，再生成新链接给我。' },
  unsupported_type: { message: '只支持 PNG、JPG、WebP、GIF。iPhone 的 HEIC 照片先截个屏，或者导出成 JPG。', next: '换一张', action: 'replace-shot' },
  invalid: { message: '还有 {N} 处要改', next: '复制给 AI', action: 'validation-errors' },
  rate_limited: { message: '提交太频繁了，{倒计时}后再试。', next: '倒计时结束后重试', action: 'countdown' },
  github_error: { message: 'GitHub 那边出了点问题，这次没提交上去。过一会儿再点一次就行。', next: '再试一次', action: 'retry', fallback: true },
  submit_disabled: { message: '网站投稿暂时用不了。可以改用 GitHub Issue 投稿，效果一样。', next: '改用 GitHub Issue 投稿 ↗', action: 'issue-fallback', fallback: true },
  receipt_invalid: { message: '有 {n} 张截图需要重新上传（上传记录过期了，或者换了账号）。', next: '这张需要重新上传。', action: 'failed-slots' },
  network_error: { message: '网络好像断了，检查一下网络再试。', next: '再试一次', action: 'retry' },
  timeout: { message: '网络好像断了，检查一下网络再试。', next: '再试一次', action: 'retry' },
  'gif-too-large': { message: '动图超过 2MB，没法自动压缩。换一张静态截图，或者把动图压小一点再放。', next: '换一张', action: 'replace-shot' },
  'too-large': { message: '压缩后还是超过 2MB，裁掉多余的部分再放。', next: '换一张', action: 'replace-shot' },
}

export function explainError(code: string, details: {
  stage?: 'login' | 'upload' | 'submit'; slug?: string; n?: number; errors?: Diagnostic[]
  slots?: number[]; pulls?: unknown[]; retryAfter?: number; countdown?: string
  message?: string; failures?: number; gif?: boolean
} = {}): ErrorCopy {
  let copy = { ...(errorCopy[code] || { message: details.message || '操作没有完成，请再试一次。', next: '再试一次', action: 'retry' }) }
  if (code === 'too_large' && details.stage === 'upload') copy = { ...errorCopy[details.gif ? 'gif-too-large' : 'too-large'] }
  if (code === 'rate_limited') {
    copy.message = details.stage === 'login' ? '登录太频繁了，{倒计时}后再试。'
      : details.stage === 'upload' ? '传得太快了，{倒计时}后再试。' : copy.message
  }
  if (code === 'network_error' || code === 'timeout') copy.fallback = (details.failures || 0) >= 2
  const seconds = Math.max(0, Math.ceil(details.retryAfter || 0))
  const countdown = details.countdown || (seconds < 60 ? `${seconds} 秒` : seconds < 3600 ? `约 ${Math.ceil(seconds / 60)} 分钟` : `约 ${Math.ceil(seconds / 3600)} 小时`)
  const n = details.n ?? (code === 'pr_limit' ? details.pulls?.length : details.slots?.length) ?? 0
  const fill = (text: string) => text.replaceAll('{slug}', details.slug || '').replaceAll('{n}', String(n))
    .replaceAll('{N}', String(details.errors?.length || 0)).replaceAll('{倒计时}', countdown)
  copy.message = fill(copy.message)
  if (copy.aiText) copy.aiText = fill(copy.aiText)
  if (code === 'invalid') copy.aiText = copyForAi(details.errors || [])
  return copy
}

export function copyForAi(errors: Diagnostic[]) {
  return '投稿页检查没通过，请按「改法」逐条修改，改完重新生成投稿链接给我：\n' +
    errors.map(({ file, where, problem, fix }) => `✗ ${file}\n  位置：${where}\n  问题：${problem}\n  改法：${fix}`).join('\n\n')
}
