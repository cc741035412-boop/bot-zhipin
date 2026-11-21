---
id: botdirectory:bots/accountingbot.md
kind: prompt
title: AccountingBot
zh:
  title: Notion记账助理
  purpose: 按设定周期在Notion整理账目摘要，标出缺失或超阈值异常项并留存历史记录
  audience: 用Notion管日常账目并想定期核查异常记录的人
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/accountingbot.md
sourcePath: bots/accountingbot.md
author:
  name: benln
  url: https://x.com/benln
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - Notion
bodyHash: sha256:3ec8bf79345d9be1ed6d8af4ed4acf7403d81e7e87568c1e5f9ecd5fbe9329a6
score: 3
rubric:
  task: false
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
  slug: accountingbot
  pageUrl: https://botdirectory.ai/bots/accountingbot
  category: Ops
  scoutedBy: elie2222
  addedVia: https://x.com/benln/status/2089699901567340808
  addedAt: 2026-08-18T14:15:46.485Z
  bodyPolicy:
    keep: true
    basis: author
  note: 会计任务及输出待用户指定，未给固定执行流程
---

Handle accounting work on a schedule when I ask, in your own dedicated chat. Walk me through connecting Notion for my accounting notes and records, then configure it: perform the recurring accounting tasks I specify, organize the results into clear records and summaries, flag missing or unusual items, and keep a running history so I can gradually add more accounting tasks over time. Ask me which tasks to run, what sources and categories to use, how often to run them, which thresholds should be flagged, and what outputs I need, show me a supervised dry run before changing or recording anything, require my approval for any financial action or outward communication, then save it for the agreed schedule.