---
id: grokbotdev:content/use-cases/instagram-bug-to-pr.md
kind: prompt
title: Support Line · Bug to Fix
zh:
  title: 社媒报障转代码修复组
  purpose: 从社媒私信抓取用户报障，自动拉QA复现、让开发提修复PR并起草客户回复
  audience: 常在社媒私信收用户报错的独立开发者或小团队产品经理
source: ZeroPointRepo/GrokBotDev
sourceUrl: https://github.com/ZeroPointRepo/GrokBotDev/blob/48fec858f3968e12cb149ad205fe4ff059d8f2d1/content/use-cases/instagram-bug-to-pr.md
sourcePath: content/use-cases/instagram-bug-to-pr.md
author:
  name: GrokBot.dev contributors
  url: https://github.com/ZeroPointRepo/GrokBotDev
  role: curator
license: CC-BY-4.0
attribution:
  by: GrokBot.dev contributors
  repo: ZeroPointRepo/GrokBotDev
  license: CC BY 4.0
  licenseUrl: https://creativecommons.org/licenses/by/4.0/
fetchedAt: 2026-11-21T06:44:43Z
changes: 只收「## Prompt」下代码块里的提示词原文，一字未改；原页面的设置步骤和点评没有收；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
bodyHash: sha256:2fab9163a4405233da68a0199ca74e428c37ec26ebaf639d012a194f59cdc258
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
  promptBlock: true
  provenance: curator
  inspiredBy:
    name: danpeguine
    url: https://x.com/danpeguine
  setupMinutes: 25
  difficulty: advanced
  autonomy: acts-with-approval
  schedule: none
  category: support
  subcategory: escalation
  awesomeScore: 73
  replicability: "A Curator reconstruction of Dan's multi-bot setup. To adapt: give an inbox-watcher access to your social DMs, put a QA bot and an engineer bot in one shared channel, define the report→reproduce→fix/reply path, and keep the customer reply and any PR merge behind approval."
  status: live
  setup: |-
    1. Give an inbox-watcher bot access to your Instagram (or other social) inbox to catch incoming complaints and bug reports.
    2. Create a shared **Ship channel** holding a **QA** bot and an **engineer** bot (Dan's is named 'David').
    3. When a bug is reported, the watcher posts it into the Ship channel and tags QA.
    4. QA reproduces it — tests the funnel/flow the customer described. If nothing's wrong, a **Writer** bot drafts the reply back to the customer.
    5. If QA finds a real bug, the engineer bot fixes it and opens a PR for your review. Keep the customer reply and the PR merge behind your approval.
  note: 流程分流到客户回复或修复PR，非单一交付
---

You run my front-line support-to-engineering loop across a team. Watch my social inbox and turn bug reports into either a clear reply or a fix.

When a message looks like a bug report or complaint about the product:
1. Post a concise summary into the Ship channel and tag the QA bot: what the customer said, where, and any link.
2. QA: reproduce it — walk the exact flow/funnel described. Report what you actually observed.
3. If QA finds no problem: the Writer bot drafts a friendly reply to the customer explaining what you checked. Show it to me before sending.
4. If QA confirms a bug: the engineer bot proposes a fix and opens a PR for my review — do not merge without me. Then the Writer drafts the customer reply once a fix is in motion.

Rules: never tell a customer something is fixed unless it is; never merge or ship without my approval; keep the whole thread visible in the Ship channel so I can see who did what.