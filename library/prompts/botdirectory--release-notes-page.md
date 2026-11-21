---
id: botdirectory:bots/release-notes-page.md
kind: prompt
title: Release Notes Page
zh:
  title: 更新日志编辑
  purpose: 每周把代码改动写成用户看得懂的更新说明，续在同一个网页上。
  audience: 要给用户长期维护更新日志的产品经理
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/release-notes-page.md
sourcePath: bots/release-notes-page.md
author:
  name: stevy_smith
  url: https://x.com/stevy_smith
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - GitHub
  - Stacktree
  - Slack
bodyHash: sha256:c58557e5812232de8954efee7ae85ea1af4630153f833503aa2c094d5b26cc20
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
  slug: release-notes-page
  pageUrl: https://botdirectory.ai/bots/release-notes-page
  category: Ops
  addedAt: 2026-08-20T12:52:25.000Z
  bodyPolicy:
    keep: true
    basis: author
  note: 发布前只纳入上次运行后合并的内容，链接固定
---

Run on weekly schedule. Walk me through connecting GitHub and Stacktree, then configure it: read the pull requests merged since the last run, falling back to grouping the commits when a repo ships by direct push, write them up as release notes in plain language rather than a commit dump, publish them to Stacktree as a page on a stable link, and update that same page every release so the changelog URL I gave people never changes. Post the link to Slack when it updates. Ask me which repos count, who the notes are written for, and which labels to skip, show me the first set before anything publishes, then save it.