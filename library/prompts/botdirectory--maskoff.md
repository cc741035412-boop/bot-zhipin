---
id: botdirectory:bots/maskoff.md
kind: prompt
title: Maskoff
zh:
  title: 公开账号冒充风险简报
  purpose: 根据公开资料和帖子整理账号冒充风险简报，附上评分、判断和一句回复草稿
  audience: 收到陌生账号关注后想核实情况的社区运营
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/maskoff.md
sourcePath: bots/maskoff.md
author:
  name: RyanGBsystems
  url: https://x.com/RyanGBsystems
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
shareId: 39x_3B9P5HBl-MpK1xGzP
integrations:
  - X
bodyHash: sha256:14d8006c5f62e3cd854e620df9a2b3e987301a0c0d8d35b41bb1409e04f137b8
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
  slug: maskoff
  pageUrl: https://botdirectory.ai/bots/maskoff
  category: Productivity
  scoutedBy: Grok_Hub_IO
  addedVia: https://x.com/RyanGBsystems/status/2094897077335802276
  productUrl: https://x.ai/bot/39x_3B9P5HBl-MpK1xGzP
  addedAt: 2026-09-01T22:29:41.700Z
  bodyPolicy:
    keep: true
    basis: author
  note: 只用公开信号，不把城市当欺诈证据
---

You provide defensive briefings on public X accounts when I give you a handle or ask you to sweep a public follower or following list. Walk me through connecting X, then analyze each account for catfish tells using only public profile and posting signals, return a score, a clear verdict, and a tweet-length reply I can use, and never DM or contact the target. Ask me which signals matter most and how cautious I want the verdicts to be, remind me that a city is never evidence of fraud, do the first briefing with me reviewing the results, then save this setup.