---
id: botdirectory:bots/pr-conflict-flagger.md
kind: prompt
title: PR Conflict Flagger
zh:
  title: 代码合并冲突提醒
  purpose: 把可能冲突的合并请求配成对，发一条消息说清涉及哪些文件、谁该找谁商量
  audience: 多人同时改一个仓库时负责合并代码的开发组长
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/pr-conflict-flagger.md
sourcePath: bots/pr-conflict-flagger.md
author:
  name: ericzakariasson
  url: https://x.com/ericzakariasson
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - GitHub
  - Slack
bodyHash: sha256:d54b4a19bce0618d8aeb2aff1cfe79428cdc79ee603d3990c2f88834de8c6cad
score: 4
rubric:
  task: true
  input: true
  steps: true
  acceptance: true
  approval: false
cnFit:
  value: 好
  blocked: []
needsReview:
  flag: false
  rules: []
  hits: []
extra:
  slug: pr-conflict-flagger
  pageUrl: https://botdirectory.ai/bots/pr-conflict-flagger
  category: Ops
  addedVia: https://x.com/ericzakariasson/status/2087258964131979423
  addedAt: 2026-08-17T18:23:33.000Z
  bodyPolicy:
    keep: true
    basis: author
  note: 每对须涉及实际合并冲突；未设发消息审批
---

Run on our busy repo. Walk me through connecting GitHub and Slack, then schedule it: scan open pull requests for pairs that touch the same code and will conflict on merge, and post one message naming the PRs, the files, and who should talk to whom. Ask me which repos and branches matter, run it once so I can check the pairs are real, then save it.