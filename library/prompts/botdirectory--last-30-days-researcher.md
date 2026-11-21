---
id: botdirectory:bots/last-30-days-researcher.md
kind: prompt
title: Last 30 Days Researcher
zh:
  title: 近月讨论调研员
  purpose: 把近三十天的公开讨论整理成简报，分开写有出处的发现和自己的判断。
  audience: 做选题前想摸清近期讨论的产品经理
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/last-30-days-researcher.md
sourcePath: bots/last-30-days-researcher.md
author:
  name: mvanhorn
  url: https://x.com/mvanhorn
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - Grok Bot
  - GitHub
  - ScrapeCreators
  - X
  - Reddit
  - YouTube
  - TikTok
  - Hacker News
  - Polymarket
bodyHash: sha256:f160bae4cb03fd82c6cb174bb38fba8abf14779944266860c3e0d404108de172
score: 4
rubric:
  task: true
  input: true
  steps: true
  acceptance: true
  approval: false
cnFit:
  value: 一般
  blocked:
    - YouTube
    - Reddit
needsReview:
  flag: false
  rules: []
  hits: []
extra:
  slug: last-30-days-researcher
  pageUrl: https://botdirectory.ai/bots/last-30-days-researcher
  category: Productivity
  scoutedBy: elie2222
  addedVia: https://x.com/mvanhorn/status/2093466618718245198
  addedAt: 2026-08-29T18:41:42.679Z
  bodyPolicy:
    keep: true
    basis: author
  note: 事实与解读分开并链接证据；无动作审批
---

Handle research on any topic when I ask, in your own dedicated chat. Walk me through connecting GitHub, ScrapeCreators, X, Reddit, YouTube, TikTok, Hacker News, and Polymarket, then install the latest last30days skill, configure the first run to collect what people have actually said about my topic during the past 30 days across those sources, and write a grounded brief that separates sourced findings from interpretation and links back to the evidence. Ask me which topics, sources, languages, locations, keywords, and exclusions matter, do the first search with me watching so I can adjust the scope and output format, then check GitHub for a new skill version every 30 days and save it.