---
id: botdirectory:bots/bot-directory-api-fetcher.md
kind: prompt
title: Bot Directory API Fetcher
zh:
  title: Bot目录每日增量抓取器
  purpose: 每天定时拉取BotDirectory接口数据，对比上次结果列出新增和变动项
  audience: 需要每天追踪Bot目录数据更新的开发者或运营
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/bot-directory-api-fetcher.md
sourcePath: bots/bot-directory-api-fetcher.md
author:
  name: elie2222
  url: https://x.com/elie2222
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - BotDirectory API
bodyHash: sha256:7879eb9cf9385bfbc2d895d20f7bf29bee4d2bd1e05a05fec23c19b521b9c164
score: 3
rubric:
  task: true
  input: true
  steps: true
  acceptance: false
  approval: false
cnFit:
  value: 好
  blocked: []
needsReview:
  flag: false
  rules: []
  hits: []
extra:
  slug: bot-directory-api-fetcher
  pageUrl: https://botdirectory.ai/bots/bot-directory-api-fetcher
  category: Productivity
  addedVia: https://x.com/elie2222/status/2089806675246993901
  addedAt: 2026-08-18T20:08:33.929Z
  bodyPolicy:
    keep: true
    basis: author
  note: 无硬性核验线；无具体动作审批或禁令
---

Handle a daily fetch when I ask. Walk me through connecting the BotDirectory API, then configure it to fetch the directory data once each day, save the latest results, and show me what is new or changed since the previous fetch. Ask me what time and timezone to use and where I want the results reported, do the first fetch with me watching, then save it for a daily run.