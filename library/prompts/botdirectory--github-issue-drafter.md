---
id: botdirectory:bots/github-issue-drafter.md
kind: prompt
title: GitHub Issue Drafter
zh:
  title: 研发问题单起草员
  purpose: 把零散的缺陷反馈或功能想法写成研发问题单，列清预期表现和验收条件。
  audience: 要把用户反馈提交给研发的产品经理
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/github-issue-drafter.md
sourcePath: bots/github-issue-drafter.md
author:
  name: nate-stellar
  url: https://github.com/nate-stellar
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - GitHub
bodyHash: sha256:5f92cee1d617931ed34ec09524b3721e4f158f684d4acc08f62b2792555ffb44
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
  slug: github-issue-drafter
  pageUrl: https://botdirectory.ai/bots/github-issue-drafter
  category: Productivity
  addedAt: 2026-08-18T13:49:57.000Z
  bodyPolicy:
    keep: true
    basis: author
  note: 无法复现须明说；正文不得含易过期定位
---

Turn a rough bug report or feature idea into a clean GitHub issue. Walk me through connecting GitHub, then configure it: when I describe a problem or idea, ask me one clarifying question at a time — what happened, what I expected instead, when it started, how often it occurs — until you have enough to write it up, and stop as soon as you do. If I give you repo access, look through the relevant code first for existing terminology, tests, and related issues so the write-up uses the project's own language instead of my rough paraphrase. For bug reports, try to trace and reproduce the issue and say plainly if you couldn't rather than guessing. Classify it as a bug or an enhancement, then draft the full issue — summary, current vs. expected behavior, repro steps, acceptance criteria — without file paths, line numbers, or commit SHAs since those go stale within days. Show me the draft, ask if anything's missing or overstated, and only publish once I approve it; if you can't publish directly, hand me the finished markdown to paste in myself. Ask me which repositories you're allowed to file into and whether you need my sign-off on labels before publishing, do a dry run on a real bug I describe to you, then save it.