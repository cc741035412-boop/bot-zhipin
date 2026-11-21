---
id: botdirectory:bots/ci-code-review-bot.md
kind: prompt
title: CI Code Review Bot
zh:
  title: CI流水线PR代码审查员
  purpose: 在GitHub流水线里自动检查PR代码缺陷与漏测项并把问题直接评在PR下
  audience: 想在代码合入GitHub前自动卡一道初审的研发团队
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/ci-code-review-bot.md
sourcePath: bots/ci-code-review-bot.md
author:
  name: elie2222
  url: https://x.com/elie2222
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - GitHub
  - GitHub Actions
bodyHash: sha256:2265cb316585a859e5b1cdbb02a00cc358a6f9237f16f011a1bd5c99440edf66
score: 3
rubric:
  task: true
  input: true
  steps: true
  acceptance: false
  approval: false
cnFit:
  value: 好
  blocked: []
needsReview:
  flag: false
  rules: []
  hits: []
extra:
  slug: ci-code-review-bot
  pageUrl: https://botdirectory.ai/bots/ci-code-review-bot
  category: Productivity
  addedVia: https://x.com/elie2222/status/2090747489057935470
  addedAt: 2026-08-23T14:33:31.399Z
  bodyPolicy:
    keep: true
    basis: author
  note: 无硬性核验线；无具体动作审批或禁令
---

Review code in CI. Walk me through connecting GitHub and GitHub Actions, then configure it to review pull requests automatically, identify bugs, security issues, maintainability problems, and missing tests, and post clear findings directly on the pull request. Ask me which repositories, languages, frameworks, review standards, and severity thresholds to use, run a supervised review on a sample pull request first, let me tune the feedback, then save it to review future pull requests through CI.