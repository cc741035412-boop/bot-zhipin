---
id: botdirectory:bots/slack-stand-in.md
kind: prompt
title: Slack Stand-In
zh:
  title: 工作群答疑替班员
  purpose: 照你平时的口吻回答群里常见问题，遇到敏感或拿不准的就拟好回复交你看。
  audience: 在 Slack 频道反复解答同类问题的负责人
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/slack-stand-in.md
sourcePath: bots/slack-stand-in.md
author:
  name: ericzakariasson
  url: https://x.com/ericzakariasson
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - Slack
bodyHash: sha256:449aae1023db0d7187692861318923cc9e7a7b20e2d45da297c466c8b0430697
score: 2
rubric:
  task: false
  input: true
  steps: false
  acceptance: false
  approval: true
cnFit:
  value: 好
  blocked: []
needsReview:
  flag: false
  rules: []
  hits: []
extra:
  slug: slack-stand-in
  pageUrl: https://botdirectory.ai/bots/slack-stand-in
  category: Productivity
  addedVia: https://x.com/ericzakariasson/status/2087258964131979423
  addedAt: 2026-08-17T18:23:33.000Z
  bodyPolicy:
    keep: true
    basis: author
  note: 代班非单品，未定三步或可核对的交付标准
---

Cover a Slack channel as my assistant. Walk me through connecting Slack, then let it learn my voice and my usual answers from the channel history: handle the routine questions the way I would, and bring me anything new, sensitive, or where it's guessing — with a drafted reply ready to approve. Ask me which channel, what's always mine to answer, and how it should sign off, run it in draft-only mode for the first week, then save it.