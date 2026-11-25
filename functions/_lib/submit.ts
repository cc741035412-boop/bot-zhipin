import { parseDocument } from 'yaml'
import { modelFromBundle } from '../../scripts/lib/bot-model.mjs'
import { validateModels } from '../../scripts/lib/validate/core.mjs'
import { fetchTemplateMeta, lookupVersion } from '../../scripts/lib/template-meta.mjs'
import { applyServerFields, applyTemplateVersion, omitTemplateVersion } from '../../scripts/lib/submit-fields.mjs'
import { botYamlTooLarge, botYamlSizeError } from '../../scripts/lib/yaml-limits.mjs'
import { unpack, LIMITS } from '../../scripts/submission/bundle-core.mjs'
import { planScreenshots } from '../../scripts/submission/screenshot-plan.mjs'
import { SubmissionError } from '../../scripts/submission/errors.mjs'
import { redact } from '../../scripts/lib/validate/secrets.mjs'
import { imageFormat, MAX_IMAGE_BYTES } from '../../scripts/lib/validate/images.mjs'
import { GitHubError, SUBMISSION_BRANCH_RE, type createGitHub } from './github'
import { fail } from './respond'
import { hit, RATE_LIMITS } from './ratelimit'
import { sign, verify, type SessionUser } from './session'
import type { SubmitContext } from './context'
import type { Env } from './types'

type GitHub = ReturnType<typeof createGitHub>
type DB = Env['DB']
type Secrets = Pick<Env, 'SESSION_SECRET' | 'SESSION_SECRET_PREV'>
interface Receipt { t: 'r'; v: 1; uid: number; sha: string; size: number; format: string; exp: number }
interface Item { file: string; where: string; problem: string; fix: string }
interface Dependencies {
  github: GitHub
  db: DB
  context: () => Promise<SubmitContext>
  now: number
  secrets: Secrets
  templateMeta?: (id: string) => Promise<{ ok: true; version: number } | { ok: false; kind: 'not_found' | 'error' }>
  dryRunUserIds?: string
  origin: string
}

export async function rate(db: DB, bucket: keyof typeof RATE_LIMITS, key: string, now: number, bytes = 0) {
  const result = await hit(db, { bucket, key, bytes, ...RATE_LIMITS[bucket] }, now)
  if (!result.ok) fail('rate_limited', { retryAfter: result.retryAfter })
}

export async function uploadScreenshot(bytes: Uint8Array, type: string, user: SessionUser,
  { github, db, now, secrets }: Pick<Dependencies, 'github' | 'db' | 'now' | 'secrets'>) {
  // Strict ASCII magic as well as the shared detector (which masks high ASCII bits).
  const head = bytes.subarray(0, 16)
  const format = imageFormat(head)
  if (!format || type !== `image/${format}` || ((format === 'gif' || format === 'webp')
    && [...head.subarray(0, format === 'gif' ? 6 : 4), ...(format === 'webp' ? head.subarray(8, 12) : [])].some((b) => b > 127))) fail('unsupported_type')
  if (bytes.length > MAX_IMAGE_BYTES) fail('too_large')
  await rate(db, 'shot', String(user.id), now, bytes.length)
  await rate(db, 'shot-all', '*', now)
  const sha = await github.createBlob(bytes)
  const payload: Receipt = { t: 'r', v: 1, uid: user.id, sha, size: bytes.length, format, exp: now + 86_400_000 }
  const receipt = await sign(secrets.SESSION_SECRET!, payload)
  return { ok: true, receipt, sha, size: bytes.length, format, exp: payload.exp }
}

function safeErrors(error: unknown): Item[] {
  if (error instanceof SubmissionError) return error.errors.map((item: Item) => Object.fromEntries(
    Object.entries(item).map(([key, value]) => [key, redact(value)]),
  ))
  return [{ file: '投稿包', where: '格式', problem: '无法读取投稿包。', fix: '请让 AI 重新生成投稿包。' }]
}

export async function verifyReceipts(values: unknown, user: SessionUser, secrets: Secrets, now: number): Promise<Receipt[]> {
  // 截图可选（DECISIONS 第 43 条）：新投稿页不再上传截图；旧页面传来的回执照常校验。
  if (values === undefined || (Array.isArray(values) && !values.length)) return []
  if (!Array.isArray(values)) fail('receipt_invalid', { slots: [0] })
  if (values.length > LIMITS.files) fail('receipt_invalid', { slots: values.map((_, i) => i) })
  // At most 30 independent native HMAC operations; preserve input order without
  // serializing 25 event-loop round trips in the largest supported submission.
  const payloads = await Promise.all(values.map((value) => verify([secrets.SESSION_SECRET, secrets.SESSION_SECRET_PREV], value, now)))
  const images: Receipt[] = [], slots: number[] = []
  for (let i = 0; i < values.length; i++) {
    const payload = payloads[i]
    if (!payload || payload.t !== 'r' || payload.v !== 1 || payload.uid !== user.id
      || typeof payload.sha !== 'string' || !/^[0-9a-f]{40}$/i.test(payload.sha)
      || !Number.isSafeInteger(payload.size) || Number(payload.size) < 1 || Number(payload.size) > MAX_IMAGE_BYTES
      || !['png', 'jpeg', 'webp', 'gif'].includes(String(payload.format))) slots.push(i)
    else images.push(payload as unknown as Receipt)
  }
  if (slots.length) fail('receipt_invalid', { slots })
  return images
}

// Reused by the HTTP flow and the benchmark: no filesystem, fetch, clock or DB access.
export function validateSubmission(bundle: ReturnType<typeof unpack>, images: Receipt[], user: SessionUser,
  addedAt: string, context: SubmitContext, now: number) {
  const yamlPath = `bots/${bundle.slug}/bot.yaml`
  if (botYamlTooLarge(bundle.files[yamlPath])) fail('invalid', { errors: [{ file: yamlPath, ...botYamlSizeError }] })
  let yaml: string
  try { yaml = applyServerFields(bundle.files[yamlPath], { login: user.login, addedAt }) }
  catch {
    fail('invalid', { errors: [{ file: yamlPath, where: '格式', problem: 'bot.yaml 或 author 不是合法的键值映射。', fix: '检查 YAML 缩进、重复键，并填写 author 映射。' }] })
  }
  let plan: ReturnType<typeof planScreenshots>
  try { plan = planScreenshots({ ...bundle, files: { ...bundle.files, [yamlPath]: yaml } }, images) }
  catch (error) { fail('invalid', { errors: safeErrors(error) }) }
  let model: ReturnType<typeof modelFromBundle>
  try { model = modelFromBundle(plan, plan.images) }
  catch { fail('invalid', { errors: [{ file: yamlPath, where: '格式', problem: '无法解析 Bot 内容。', fix: '检查 YAML 和技能 frontmatter，避免循环或过量别名。' }] }) }
  if (model.yamlTooLarge) fail('invalid', { errors: [{ file: yamlPath, ...botYamlSizeError }] })
  if (model.data?.author?.github !== user.login || model.data?.addedAt !== addedAt) {
    fail('invalid', { errors: [{ file: yamlPath, where: 'author.github / addedAt',
      problem: 'bot.yaml 的作者或日期字段写法特殊，无法自动填写', fix: '用普通的 `author:` 和 `addedAt:` 写法' }] })
  }
  const result = validateModels([model], {
    template: context.templateModel, now: new Date(now), others: context.index.filter((item) => item.slug !== bundle.slug),
    policy: { submission: { login: user.login } },
  })
  if (result.errors.length) fail('invalid', { errors: result.errors })
  return { plan, model, warnings: result.warnings as Item[] }
}

export async function computeSubmission(text: string, receipts: unknown, user: SessionUser, secrets: Secrets,
  addedAt: string, context: SubmitContext, now: number) {
  const bundle = unpack(text)
  const images = await verifyReceipts(receipts, user, secrets, now)
  return validateSubmission(bundle, images, user, addedAt, context, now)
}

function prBody(slug: string, user: SessionUser, update: boolean, warnings: Item[], legacyOwner: boolean, versionNote: string): string {
  return `${legacyOwner ? '> ⚠ **这个 Bot 之前没有绑定作者数字 ID，只按 GitHub 用户名核对，请人工确认是原作者**\n\n' : ''}## 网站投稿

- Bot：\`bots/${slug}/\`（${update ? '更新' : '新增'}）
- 投稿人：@${user.login}（GitHub 账号已登录验证）
- 提交作者记为投稿人，合并后计为贡献者。
- 自动检查：校验器和密钥扫描在推送前已通过${warnings.length ? `，${warnings.length} 条提醒请复核` : ''}；构建以 validate-and-build 为准。
- 模板版本：${versionNote}
- 投稿人已在投稿页勾选 CC BY 4.0 授权，并确认内容有权公开。
- 已开启自动合并：批准且检查通过后自动用普通合并合入。

## 维护者核对（机器判断不了）

- [ ] 设计说明是真实经历，没有编造效果
- [ ] 设计说明「实际效果」里摘的输出像这个 Bot 的真实输出，没有露出隐私、密钥或公司内部信息
- [ ] 声明的权限和额度如实
- [ ] 模板链接在无痕窗口能打开

<!-- bot-zhipin-web-submission uid=${user.id} slug=${slug} -->`
}

export async function submitBot(body: Record<string, unknown>, user: SessionUser, deps: Dependencies) {
  const { github: gh, db, now, secrets } = deps
  // 1. Authentication has already happened in the HTTP adapter.
  if (body.license !== true) fail('license_required')
  if (body.dryRun === true && !(deps.dryRunUserIds || '').split(',').map((id) => id.trim()).includes(String(user.id))) fail('forbidden_origin')
  // 2–4. Only plaintext: one bounded unpack, never decompress on the server.
  await rate(db, 'submit-try', String(user.id), now)
  let bundle: ReturnType<typeof unpack>
  try { bundle = unpack(body.bundle) } catch (error) { fail('bad_request', { errors: safeErrors(error) }) }
  if (body.dryRun !== true) await rate(db, 'submit-slug', `${user.id}:${bundle.slug}`, now)
  const images = await verifyReceipts(body.screenshots, user, secrets, now)
  const slug = bundle.slug
  const branch = `submission/web-${user.id}-${slug}`
  if (!SUBMISSION_BRANCH_RE.test(branch)) fail('bad_request')
  // 5–7. Main HEAD is authoritative, never the possibly stale build index.
  await gh.installationToken()
  const mainHead = (await gh.getRef('heads/main')).object.sha
  const rootTree = (await gh.getCommit(mainHead)).tree.sha
  const existing = await gh.getContent(`bots/${slug}/bot.yaml`, mainHead)
  let addedAt = new Date(now + 8 * 3_600_000).toISOString().slice(0, 10)
  const update = existing !== null
  let legacyOwner = false
  if (existing) {
    let data
    try {
      const doc = parseDocument(existing.text)
      if (doc.errors.length) throw new Error()
      data = doc.toJS()
    } catch { throw new GitHubError(502) }
    if (data?.external === true) fail('slug_taken')
    const owner = await db.prepare('SELECT user_id FROM bot_owners WHERE slug = ?1').bind(slug).first<{ user_id: number }>()
    if (owner) {
      if (owner.user_id !== user.id) fail('slug_taken')
    } else {
      if (typeof data?.author?.github !== 'string' || data.author.github.toLowerCase() !== user.login.toLowerCase()) fail('slug_taken')
      legacyOwner = true
    }
    if (typeof data.addedAt !== 'string') throw new GitHubError(502)
    addedAt = data.addedAt
  }
  // 8. Refresh tracked PRs before counting; an update to a waiting PR uses no new slot.
  const rows = await db.prepare('SELECT slug, pr_number FROM web_submissions WHERE user_id = ?1').bind(user.id)
    .all<{ slug: string; pr_number: number }>()
  const pulls: { number: number; url: string; slug: string }[] = []
  for (const row of rows.results) {
    const pr = await gh.getPr(row.pr_number)
    if (pr.merged || pr.state === 'closed') {
      await db.prepare('DELETE FROM web_submissions WHERE user_id = ?1 AND slug = ?2').bind(user.id, row.slug).run()
    } else pulls.push({ number: pr.number, url: pr.html_url, slug: row.slug })
  }
  if (pulls.length >= 3 && !pulls.some((pr) => pr.slug === slug)) fail('pr_limit', { pulls })
  // 9–10. Complete validation (including secrets) before ANY repository write.
  const { plan, model, warnings } = validateSubmission(bundle, images, user, addedAt, await deps.context(), now)
  const prefix = `bots/${slug}/`
  const files = [...Object.keys(plan.files), ...plan.images.map((image: Receipt & { name: string }) => `${prefix}screenshots/${image.name}`)]
  if (body.dryRun === true) return { ok: true, dryRun: true, slug, update, files, warnings }
  const meta = await lookupVersion(model.data.templateUrl, deps.templateMeta ?? ((id: string) => fetchTemplateMeta(id, { fetch, timeoutMs: 5000 })))
  const yamlPath = `${prefix}bot.yaml`
  if (meta.ok) plan.files[yamlPath] = applyTemplateVersion(plan.files[yamlPath], meta.version)
  else if (model.data.templateVersion !== undefined) plan.files[yamlPath] = omitTemplateVersion(plan.files[yamlPath])
  const versionNote = meta.ok ? `v${meta.version}，已记进 templateVersion` : `没查到（${meta.kind}），合并后上游核对会提醒补上`
  // Charge publishing quotas only after validation/secrets and the dryRun exit.
  await rate(db, 'submit', String(user.id), now)
  await rate(db, 'submit-all', '*', now)
  // 11. New subtree without base_tree removes old-only files; outer tree preserves everything else.
  const entries: Parameters<GitHub['createTree']>[0]['entries'] = Object.entries(plan.files).map(([path, content]) => ({
    path: path.slice(prefix.length), mode: '100644', type: 'blob', content: content as string,
  }))
  for (const image of plan.images) entries.push({ path: `screenshots/${image.name}`, mode: '100644', type: 'blob', sha: image.sha })
  const subtree = await gh.createTree({ entries })
  const tree = await gh.createTree({ baseTree: rootTree, entries: [{ path: `bots/${slug}`, mode: '040000', type: 'tree', sha: subtree }] })
  // 12–14. One commit on main, one whitelisted branch, create or update the same PR.
  const title = `${update ? '更新' : '新增'} Bot：${model.data.name}（网站投稿）`
  const commit = await gh.createCommit({ message: title, tree, parents: [mainHead],
    author: { name: user.login, email: `${user.id}+${user.login}@users.noreply.github.com` } })
  await gh.upsertRef(branch, commit)
  const open = await gh.findOpenPr(branch)
  const prInput = { title: legacyOwner ? `⚠ 更新已上架 Bot：${model.data.name}（网站投稿）` : title,
    body: prBody(slug, user, update, warnings, legacyOwner, versionNote) }
  const pr = open ? await gh.updatePr(open.number, prInput) : await gh.createPr({ ...prInput, head: branch, base: 'main' })
  // No main Bot means a new submission: overwrite any obsolete binding only after PR success.
  await db.prepare(`INSERT INTO bot_owners (slug, user_id, updated_at) VALUES (?1, ?2, ?3)
    ON CONFLICT (slug) DO UPDATE SET user_id = excluded.user_id, updated_at = excluded.updated_at`)
    .bind(slug, user.id, now).run()
  // 15–17. Auto-merge is best effort; persistence is not.
  let autoMerge = false
  try { autoMerge = await gh.enableAutoMerge(pr.node_id) } catch { /* no upstream diagnostics */ }
  if (!autoMerge) warnings.push({ file: `bots/${slug}/`, where: '自动合并', problem: '未能开启自动合并，投稿 PR 已创建。', fix: '请维护者批准且检查通过后手动合并。' })
  await db.prepare(`INSERT INTO web_submissions (user_id, slug, pr_number, branch, created_at, updated_at)
    VALUES (?1, ?2, ?3, ?4, ?5, ?5) ON CONFLICT (user_id, slug) DO UPDATE SET
    pr_number = excluded.pr_number, branch = excluded.branch, updated_at = excluded.updated_at`)
    .bind(user.id, slug, pr.number, branch, now).run()
  return { ok: true, slug, update, branch, pr: { number: pr.number, url: pr.html_url }, liveUrl: `${deps.origin}/bots/${slug}`, autoMerge, warnings }
}

export async function submissionStatus(number: number, { github: gh, origin, build }: {
  github: GitHub; origin: string; build: () => Promise<string>
}) {
  let pr: Awaited<ReturnType<GitHub['getPr']>>
  try { pr = await gh.getPr(number) } catch (error) {
    if (error instanceof GitHubError && error.status === 404) fail('not_found')
    throw error
  }
  const branch = pr.head?.ref
  if (typeof branch !== 'string' || !/^submission\/(web-\d+-[a-z0-9-]+|issue-\d+)$/.test(branch)) fail('not_found')
  // Issue submissions have no slug in the branch; null avoids another API operation.
  const slug = branch.startsWith('submission/web-') ? branch.replace(/^submission\/web-\d+-/, '') : null
  let state: string, checks = 'pending'
  if (pr.merged) {
    checks = 'success'
    state = 'merged'
    const commit = await build()
    if (pr.merge_commit_sha && (commit === pr.merge_commit_sha || (/^[a-f0-9]{40}$/i.test(commit)
      && ['identical', 'ahead'].includes((await gh.compare(pr.merge_commit_sha, commit)).status)))) state = 'live'
  } else if (pr.state === 'closed') state = 'closed'
  else {
    const runs = (await gh.getChecks(pr.head.sha)).check_runs.filter((run) => run.name === 'validate-and-build')
    if (runs.some((run) => run.status === 'completed' && run.conclusion !== 'success')) {
      state = 'failed'; checks = 'failure'
    } else if (!runs.length || runs.some((run) => run.status !== 'completed' || run.conclusion !== 'success')) state = 'checking'
    else {
      checks = 'success'
      const reviews = await gh.getReviews(number)
      const latest = new Map<string, string>()
      for (const review of [...reviews].sort((a, b) => a.submitted_at.localeCompare(b.submitted_at) || a.id - b.id)) {
        if (['APPROVED', 'CHANGES_REQUESTED', 'DISMISSED'].includes(review.state)) latest.set(review.user.login.toLowerCase(), review.state)
      }
      state = [...latest.values()].includes('APPROVED') ? 'approved' : 'waiting_review'
    }
  }
  return { ok: true, state, checks, slug, url: pr.html_url, liveUrl: state === 'live' && slug ? `${origin}/bots/${slug}` : null }
}
