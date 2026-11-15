// 仅执行默认分支上的可信代码；PR 正文和文件名只作为数据读取。
import { resolve } from 'node:path'
import { pathToFileURL } from 'node:url'

const submissionBranch = /^submission\/(web-[1-9]\d{0,19}-[a-z0-9]+(?:-[a-z0-9]+)*|issue-[1-9]\d*)$/
const marker = '<!-- bot-zhipin-live -->'

export async function announceLive({ sha, repo, siteUrl, appBotLogin, timeoutMs = 600_000, intervalMs = 15_000 }, deps) {
  const { github, fetchSite, sleep, now } = deps
  const result = { announced: [], skipped: [] }
  const pending = []
  const site = siteUrl.replace(/\/+$/, '')
  for (const pr of await github.pullsForCommit(sha)) {
    let reason
    if (!pr.merged_at) reason = 'PR 尚未合并'
    else if (pr.base?.ref !== 'main') reason = 'PR 目标分支不是 main'
    else if (!submissionBranch.test(pr.head?.ref || '')) reason = '不是合法的投稿分支'
    else if (pr.user?.login !== 'github-actions[bot]' && !(appBotLogin && pr.user?.login === appBotLogin)) reason = 'PR 作者不是受信投稿机器人'
    if (reason) {
      result.skipped.push({ pr: pr.number, reason })
      continue
    }
    const files = await github.prFiles(pr.number)
    const slugs = new Set()
    let outside = false
    for (const file of files) {
      // 重命名的旧路径也属于改动范围，不能用移动文件绕过检查。
      for (const path of [file.filename, file.previous_filename].filter((value) => value !== undefined)) {
        const match = /^bots\/([a-z0-9]+(?:-[a-z0-9]+)*)\/.+$/.exec(path)
        if (!match || path.split('/').some((part) => part === '..' || part === '.')) outside = true
        else slugs.add(match[1])
      }
      if (!file.filename) outside = true
    }
    if (!files.length) reason = 'PR 没有改动文件，无法确定 slug'
    else if (outside) reason = 'PR 含 bots/<slug>/ 以外的改动文件'
    else if (slugs.size !== 1) reason = 'PR 改动涉及多个 slug，必须全部在同一个 bots/<slug>/ 下'
    if (reason) {
      result.skipped.push({ pr: pr.number, reason })
      continue
    }
    const [slug] = slugs
    pending.push({ pr, slug, liveUrl: `${site}/bots/${slug}` })
  }
  if (!pending.length) return result

  // 全部 PR 共用一个部署判断和超时预算，旧详情页的 200 不能证明更新已上线。
  const started = now()
  const expired = () => now() - started >= timeoutMs
  const timeout = () => new Error(`等待部署超时：${repo} 的 ${sha} 或 Bot 详情页尚未就绪`)
  let deployed = false
  while (true) {
    if (expired()) throw timeout()
    if (!deployed) {
      let commit
      try {
        const response = await fetchSite(`${site}/api-data/build.json`)
        if (response.status === 200) commit = (await response.json())?.commit
      } catch { /* 部署切换期间的网络或 JSON 错误，按同一超时预算重试。 */ }
      if (typeof commit === 'string' && commit.trim()) {
        deployed = commit === sha || ['identical', 'ahead'].includes((await github.compare(sha, commit)).status)
      }
    }
    let pagesReady = deployed
    if (deployed) {
      for (const liveUrl of new Set(pending.map((item) => item.liveUrl))) {
        try {
          if ((await fetchSite(liveUrl)).status !== 200) pagesReady = false
        } catch { pagesReady = false }
      }
    }
    if (expired()) throw timeout()
    if (pagesReady) break
    await sleep(Math.min(intervalMs, timeoutMs - (now() - started)))
  }

  async function commentOnce(number, body) {
    const comments = await github.listComments(number)
    if (!comments.some((comment) => comment.body?.includes(marker))) {
      await github.createComment(number, body)
    }
  }
  for (const { pr, slug, liveUrl } of pending) {
    const submitter = /投稿人：@([A-Za-z0-9](?:[A-Za-z0-9-]{0,38}))/.exec(pr.body || '')?.[1]
    const body = `🎉 已上线：${liveUrl}\n\n感谢${submitter ? ` @${submitter}` : ''}，你已成为 Bot 直聘的贡献者。\n\n${marker}`
    await commentOnce(pr.number, body)
    if (pr.head.ref.startsWith('submission/issue-')) {
      const issue = /\bCloses #([1-9]\d*)\b/i.exec(pr.body || '')?.[1]
      if (issue) await commentOnce(Number(issue), body)
    }
    // 评论成功后尽力清理：包括 GitHub 自动删分支的情况；清理失败不撤回上线结果。
    try { await github.deleteBranch(pr.head.ref) } catch { /* 下次运行仍会查重并重试清理。 */ }
    result.announced.push({ pr: pr.number, slug, liveUrl })
  }
  return result
}

export async function main() {
  const { GH_TOKEN, SHA, REPO, SITE_URL, APP_BOT_LOGIN } = process.env
  if (!GH_TOKEN || !SHA || !REPO || !SITE_URL) throw new Error('缺少上线通知环境变量：GH_TOKEN、SHA、REPO、SITE_URL 必填')
  const root = `/repos/${REPO}`
  async function request(path, method = 'GET', body) {
    const response = await fetch(`https://api.github.com${path}`, {
      method,
      headers: {
        Authorization: `Bearer ${GH_TOKEN}`,
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
        'Content-Type': 'application/json',
      },
      body: body === undefined ? undefined : JSON.stringify(body),
      signal: AbortSignal.timeout(30_000),
      redirect: 'error',
    })
    // 不回显 API 错误正文、请求头或令牌。
    if (!response.ok) throw new Error(`GitHub API ${method} 失败（HTTP ${response.status}）`)
    return response
  }
  async function list(path) {
    const items = []
    for (let page = 1; ; page++) {
      const response = await request(`${path}?per_page=100&page=${page}`)
      items.push(...await response.json())
      // 不直接跟随 Link URL，避免将凭据发送到其他主机。
      if (!response.headers.get('link')?.includes('rel="next"')) return items
    }
  }
  const github = {
    pullsForCommit: (sha) => list(`${root}/commits/${encodeURIComponent(sha)}/pulls`),
    prFiles: (number) => list(`${root}/pulls/${number}/files`),
    compare: async (base, head) => (await request(`${root}/compare/${encodeURIComponent(base)}...${encodeURIComponent(head)}`)).json(),
    listComments: (number) => list(`${root}/issues/${number}/comments`),
    createComment: (number, body) => request(`${root}/issues/${number}/comments`, 'POST', { body }),
    deleteBranch: (ref) => request(`${root}/git/refs/heads/${ref.split('/').map(encodeURIComponent).join('/')}`, 'DELETE'),
  }
  const result = await announceLive({ sha: SHA, repo: REPO, siteUrl: SITE_URL, appBotLogin: APP_BOT_LOGIN }, {
    github,
    fetchSite: (url) => {
      const target = new URL(url)
      target.searchParams.set('_live', crypto.randomUUID())
      return fetch(target, { cache: 'no-store', signal: AbortSignal.timeout(30_000) })
    },
    sleep: (ms) => new Promise((resolve) => setTimeout(resolve, ms)),
    now: () => Date.now(),
  })
  console.log(JSON.stringify(result))
}

if (process.env.GITHUB_ACTIONS === 'true' && process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  main().catch(() => {
    // 避免底层网络异常意外包含敏感请求信息。
    console.error('✗ 上线通知失败：请检查环境变量、GitHub 权限及部署状态（等待部署超时上限为 10 分钟）。')
    process.exitCode = 1
  })
}
