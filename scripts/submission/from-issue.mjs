import { resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import { SubmissionError, COMMENT_MARKER, errorItems, failureComment } from './errors.mjs'
import { parseSubmission, checkOwnership, publication } from './issue.mjs'
import { extractImageUrls, makeFilePlan } from './screenshots.mjs'

/** 所有副作用均由 adapters 提供；解析、授权、命名和 PR 内容生成独立于 git/gh/网络。 */
export async function submitIssue(input, adapters) {
  try {
    const submission = parseSubmission(input)
    await adapters.assertClean()
    const update = checkOwnership(submission, await adapters.readExisting(submission.slug))
    const urls = extractImageUrls(submission.fields.screenshots)
    const images = []
    for (const url of urls) images.push(await adapters.download(url))
    const plan = makeFilePlan(submission.bundle, images)
    await adapters.writeFiles(plan, { update, submission })
    const result = await adapters.validate()
    const scopeErrors = await adapters.checkScope(plan.slug)
    const errors = [...result.errors, ...scopeErrors]
    if (errors.length) throw new SubmissionError(errors)
    const details = publication(submission, { ...adapters.context, warnings: result.warnings })
    const pr = await adapters.publish(plan, details)
    await adapters.dispatch(details.branch)
    await adapters.comment(input.number, `${COMMENT_MARKER}\n✓ 检查通过，已自动创建 PR：${pr}。维护者审核合并后就会上线，你会成为项目贡献者。`)
    return { ok: true, pr, plan, details }
  } catch (error) {
    const errors = errorItems(error)
    await adapters.comment(input.number, failureComment(errors))
    return { ok: false, errors }
  }
}

async function main() {
  try {
    // 防止在开发者工作区误运行带远端写操作的适配器。
    if (process.env.GITHUB_ACTIONS !== 'true') throw new Error('只在 Actions 内运行')
    const { createAdapters } = await import('./adapters.mjs')
    const adapters = createAdapters({ root: process.cwd(), repo: process.env.SUBMISSION_REPO, defaultBranch: process.env.DEFAULT_BRANCH })
    const result = await submitIssue({
      body: process.env.ISSUE_BODY, login: process.env.ISSUE_AUTHOR_LOGIN,
      id: process.env.ISSUE_AUTHOR_ID, number: process.env.ISSUE_NUMBER,
    }, adapters)
    console.log(result.ok ? '✓ 投稿检查通过，PR 和 CI 已处理。' : '投稿未通过，中文改法已更新到 Issue 评论。')
    process.exitCode = result.ok ? 0 : 1
  } catch {
    console.error('投稿工作流未完成。请维护者检查 Actions 权限与运行环境；本脚本只能在 GitHub Actions 中运行。')
    process.exitCode = 1
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) await main()
