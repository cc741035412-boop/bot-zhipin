---
id: botdirectory:bots/viral-tweet-scout.md
kind: prompt
title: Viral Tweet Scout
zh:
  title: 热帖笑点采编员
  purpose: 按你关心的话题挑出好笑的热门推文，附上作者、原帖链接和可以接着聊的梗。
  audience: 在X上给品牌账号找话题的社媒运营
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/viral-tweet-scout.md
sourcePath: bots/viral-tweet-scout.md
author:
  name: petergyang
  url: https://x.com/petergyang
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - X
bodyHash: sha256:5cc61ea8e51baf76ecccc09153c1555167c06e08ba93eb24fccd6a969a7b482a
score: 4
rubric:
  task: true
  input: true
  steps: false
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
  slug: viral-tweet-scout
  pageUrl: https://botdirectory.ai/bots/viral-tweet-scout
  category: Marketing
  addedVia: https://x.com/petergyang/status/2089401696946634801
  addedAt: 2026-08-17T19:08:55.000Z
  bodyPolicy:
    keep: true
    basis: author
  note: 只写找推文和给清单，未列三步筛选法
---

Scout X for me. Walk me through connecting X, then configure it: find the viral and genuinely funny tweets in the topics I follow and send me a short list with the link, the author, why it took off, and anything I could riff on. It reads only — it never posts, likes or replies from my account. Ask me for my topics and how often I want a batch, send one so I can tell it what to keep and drop, then save it.