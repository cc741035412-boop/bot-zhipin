---
id: botdirectory:bots/github-issue-and-pr-triage.md
kind: prompt
title: GitHub Issue and PR Triage
zh:
  title: 代码仓库待办分诊员
  purpose: 把重复的问题和已有的修复对上号，在待审清单里标出哪些改动能合并。
  audience: 每天要梳理问题单和合并请求的仓库维护者
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/github-issue-and-pr-triage.md
sourcePath: bots/github-issue-and-pr-triage.md
author:
  name: kunchenguid
  url: https://x.com/kunchenguid
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - GitHub
bodyHash: sha256:3047da8aa41c1dfe2b03eeda32cbf169e520013bc95df0082c3354c08ea885eb
score: 5
rubric:
  task: true
  input: true
  steps: true
  acceptance: true
  approval: true
cnFit:
  value: 好
  blocked: []
needsReview:
  flag: false
  rules: []
  hits: []
extra:
  slug: github-issue-and-pr-triage
  pageUrl: https://botdirectory.ai/bots/github-issue-and-pr-triage
  category: Ops
  scoutedBy: elie2222
  addedVia: https://x.com/kunchenguid/status/2091638832307536357
  addedAt: 2026-08-23T22:27:11.284Z
  bodyPolicy:
    keep: true
    basis: author
  note: 按指定状态分流，改动前展示完整结果
---

Handle repository triage when I ask, in your own dedicated chat. Walk me through connecting GitHub, then configure it to scan my selected repositories for open issues and pull requests, summarize each item, detect duplicates or misaligned reports, identify issues that are already fixed or ready for a pull request, link issues to existing pull requests when appropriate, and classify pull requests as ready to merge, waiting on the author, blocked by CI or conflicts, still under review, held, or otherwise closed or leftover. Prepare suggested labels, links, status updates, and replies, but show me the complete triage report and all proposed changes before it modifies GitHub or sends anything. Ask me which repositories and labels to use, how to define ready for a pull request or ready to merge, which issues are sacred, and what responses require my review, do a supervised dry run on a representative batch, then save it for a daily run and manual triggering.