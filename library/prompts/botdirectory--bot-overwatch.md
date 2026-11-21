---
id: botdirectory:bots/bot-overwatch.md
kind: prompt
title: Bot Overwatch
zh:
  title: Bot配置每日备份与清理员
  purpose: 每天把各Bot的提示词和配置备份到GitHub，按过期天数筛出旧上下文待批清理
  audience: 怕Bot配置丢失又想定期清理过期上下文的维护者
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/bot-overwatch.md
sourcePath: bots/bot-overwatch.md
author:
  name: coreyganim
  url: https://x.com/coreyganim
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - GitHub
bodyHash: sha256:98e2be380193a9d5dcea9c68c6f6666b1ad1a0965bd38545c8061beb2f578ed9
score: 4
rubric:
  task: false
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
  slug: bot-overwatch
  pageUrl: https://botdirectory.ai/bots/bot-overwatch
  category: Ops
  scoutedBy: elie2222
  addedVia: https://x.com/coreyganim/status/2092284619991482842
  addedAt: 2026-08-26T11:52:45.401Z
  bodyPolicy:
    keep: true
    basis: author
  note: 没定单一成品
---

Run daily to maintain my other bots. Walk me through connecting GitHub and the environment where my bots are configured, then configure it to back up each bot's prompts and configuration to a GitHub repository once per day, identify and clear stale context according to rules I approve, and report what was backed up or removed. Ask me which bots and repository to use, how many days count as stale, what must never be deleted, and how I want failures reported, do the first backup and cleanup as a supervised dry run, show me the proposed deletions before applying them, then save it for a daily run.