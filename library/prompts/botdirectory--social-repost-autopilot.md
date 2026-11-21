---
id: botdirectory:bots/social-repost-autopilot.md
kind: prompt
title: Social Repost Autopilot
zh:
  title: 新帖跨平台转发员
  purpose: 把你在 X 上的新帖按原文列进跨平台转发计划，等你点头再发。
  audience: 以 X 为首发阵地又要兼顾其他账号的运营
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/social-repost-autopilot.md
sourcePath: bots/social-repost-autopilot.md
author:
  name: jackfriks
  url: https://x.com/jackfriks
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - Grok
  - X
bodyHash: sha256:d9682facf11aa127e66c4ddf63d4e8d5255fb542753334917f4fa503290d1fd9
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
  slug: social-repost-autopilot
  pageUrl: https://botdirectory.ai/bots/social-repost-autopilot
  category: Marketing
  scoutedBy: elie2222
  addedVia: https://x.com/jackfriks/status/2093719119984001073
  addedAt: 2026-08-29T18:41:51.757Z
  bodyPolicy:
    keep: true
    basis: author
  note: 转发执行和发布计划并列，未限定单一产物
---

Handle cross-platform reposting when I ask. Walk me through connecting Grok to my X account and the other social accounts I use, then monitor X for new posts and quote tweets and copy them to my selected platforms without rewriting the content unless I ask. Ignore older posts by default, let me choose which platforms and posting order to use, and show me the full cross-platform publishing plan for approval before anything goes live. Ask me which accounts to include, whether to preserve or adapt formatting, how to handle media and links, and which types of posts to skip, do a supervised dry run with my next new post, then save it.