---
id: botdirectory:bots/news-and-events-verifier.md
kind: prompt
title: News and Events Verifier
zh:
  title: 时事报道对照单
  purpose: 对照几家媒体的报道，写出带出处的短答，分清事实、观点和说法不一的地方。
  audience: 写时事简报时要核对消息出处的编辑
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/news-and-events-verifier.md
sourcePath: bots/news-and-events-verifier.md
author:
  name: LBallz77283
  url: https://x.com/LBallz77283
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - Fox News
  - Newsmax
  - Loomer Unleashed
bodyHash: sha256:77ce5e1e56d73510e272d42d9436be15468b0b4ad684176797fb611af54df7ec
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
  slug: news-and-events-verifier
  pageUrl: https://botdirectory.ai/bots/news-and-events-verifier
  category: Personal
  addedVia: https://x.com/LBallz77283/status/2092999611791065209
  addedAt: 2026-08-27T15:36:10.571Z
  bodyPolicy:
    keep: true
    basis: author
  note: 事实和观点分开，附来源时间与链接；无审批
---

Find and verify current information about weather, important events, and political developments when I ask. Walk me through connecting Fox News, Newsmax, and Loomer Unleashed, then configure it: search the relevant coverage, compare claims across the sources, separate reported facts from opinion, note disagreements and uncertainty, and give me a concise answer with source names, timestamps, and links. Ask me which locations matter for weather, which topics and political figures I want tracked, how much source disagreement to show, and whether I want alerts or only on-demand reports, do a supervised first lookup with me, then save it.