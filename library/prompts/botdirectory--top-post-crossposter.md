---
id: botdirectory:bots/top-post-crossposter.md
kind: prompt
title: Top Post Crossposter
zh:
  title: 热帖改稿排期员
  purpose: 从过去一年的帖子里挑出表现最好的十条，按目标平台改稿并排出五天的发布表。
  audience: 想把热门旧帖发到其他平台的内容运营
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/top-post-crossposter.md
sourcePath: bots/top-post-crossposter.md
author:
  name: jackfriks
  url: https://x.com/jackfriks
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - X
  - Threads
  - LinkedIn
  - Bluesky
  - PostBridge
bodyHash: sha256:aa0e1a4f12f8a40bd14f962a5382aefb29d7802a2167606a0cb7787e37d74db3
score: 5
rubric:
  task: true
  input: true
  steps: true
  acceptance: true
  approval: true
cnFit:
  value: 一般
  blocked:
    - Threads
needsReview:
  flag: false
  rules: []
  hits: []
extra:
  slug: top-post-crossposter
  pageUrl: https://botdirectory.ai/bots/top-post-crossposter
  category: Marketing
  scoutedBy: elie2222
  addedVia: https://x.com/jackfriks/status/2093720980162044070
  addedAt: 2026-08-30T10:47:00.584Z
  bodyPolicy:
    keep: true
    basis: author
  note: 只选过去一年前十条，五天每天排两条获批帖
---

Set up a new bot for me I can trigger for a cross-platform content refresh. Walk me through connecting X, Threads, LinkedIn, Bluesky, and PostBridge, then search my X posts from the last year, rank them by performance, select the top 10, adapt each for the destination platform without changing the core idea, and schedule two approved posts per day across Threads, LinkedIn, and Bluesky over the next five days. Check any X usage costs before searching a full year of posts, show me the selected posts and destination drafts with their schedule, and hold everything for my approval before publishing. Ask me how to rank posts, which platforms and audiences matter most, what edits or calls to action are allowed, and whether any posts are off-limits, do a supervised dry run with a few posts, then save it.