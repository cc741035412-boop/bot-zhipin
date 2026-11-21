---
id: botdirectory:bots/evergreen-content-flywheel.md
kind: prompt
title: Evergreen Content Flywheel
zh:
  title: 常青内容翻新员
  purpose: 每周挑出最多五篇表现好的旧帖改写成各渠道草稿，获批发布后对比新旧表现
  audience: 管多个社媒账号、想把优质旧内容改写重发的运营
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/evergreen-content-flywheel.md
sourcePath: bots/evergreen-content-flywheel.md
author:
  name: elie2222
  url: https://x.com/elie2222
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - FeedHive
  - Notion
  - Slack
bodyHash: sha256:7236d309a24c696ba355c4986adc5676b1d2e272c28a871b78f92ceda834cb22
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
  slug: evergreen-content-flywheel
  pageUrl: https://botdirectory.ai/bots/evergreen-content-flywheel
  category: Marketing
  addedAt: 2026-08-17T21:00:19.000Z
  bodyPolicy:
    keep: true
    basis: author
  note: 每周最多五条，排除过时或已失实的帖子
---

Find strong evergreen posts worth reusing each week. Walk me through connecting FeedHive, Notion and Slack, then ask which accounts to analyze, what performance threshold to use and which topics must never be recycled. Each week, nominate up to five proven posts, exclude anything dated or no longer true, and create fresh channel-specific versions as unscheduled FeedHive drafts. Send them to me for approval and never publish automatically. After approved versions run, compare their performance with the originals. Run the first analysis read-only, then save it.