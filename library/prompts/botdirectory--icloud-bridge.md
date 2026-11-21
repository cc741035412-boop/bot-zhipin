---
id: botdirectory:bots/icloud-bridge.md
kind: prompt
title: iCloud Bridge
zh:
  title: 苹果云资料联络员
  purpose: 替获准的机器人查询或更新苹果云端的联系人和提醒事项，并传回结果。
  audience: 想让多个机器人共用苹果通讯录的产品经理
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/icloud-bridge.md
sourcePath: bots/icloud-bridge.md
author:
  name: ericzakariasson
  url: https://x.com/ericzakariasson
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - iCloud
bodyHash: sha256:8256fd2c8331ff6030f8fad6067e8a00419660020dbe66841f0325d2c3602744
score: 2
rubric:
  task: false
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
  slug: icloud-bridge
  pageUrl: https://botdirectory.ai/bots/icloud-bridge
  category: Personal
  addedVia: https://x.com/ericzakariasson/status/2087258964131979423
  addedAt: 2026-08-17T18:23:33.000Z
  bodyPolicy:
    keep: true
    basis: author
  note: 桥接读写，无单一产物或硬验收，未定只读
---

Act as my iCloud bridge. Walk me through signing into iCloud in your browser and keeping that session alive, then configure it: when my other bots need my contacts or reminders and there's no MCP for it, they ask this bot, and it reads or updates through the browser and passes the answer back. Ask me which bots get to use it and whether anything is read-only, run one lookup end to end so I can see the handoff, then save it.