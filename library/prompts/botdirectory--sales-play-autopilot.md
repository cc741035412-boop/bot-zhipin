---
id: botdirectory:bots/sales-play-autopilot.md
kind: prompt
title: Sales Play Autopilot
zh:
  title: 销售流程复刻器
  purpose: 把手工筛客户、写文案和同步名单的流程串起来，产出结果供你和原版比对。
  audience: 想把固定销售流程改成按需运行的销售运营
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/sales-play-autopilot.md
sourcePath: bots/sales-play-autopilot.md
author:
  name: ericzakariasson
  url: https://x.com/ericzakariasson
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - Snowflake
  - Salesforce
  - Gmail
bodyHash: sha256:0c3e128cf2e6f0913f511a4041cd2909ae5a90dba9b46597d82f6428c49243b0
score: 1
rubric:
  task: false
  input: true
  steps: false
  acceptance: false
  approval: false
cnFit:
  value: 一般
  blocked:
    - Gmail
needsReview:
  flag: false
  rules: []
  hits: []
extra:
  slug: sales-play-autopilot
  pageUrl: https://botdirectory.ai/bots/sales-play-autopilot
  category: Sales
  addedVia: https://x.com/ericzakariasson/status/2087258914060664902
  addedAt: 2026-08-17T18:23:33.000Z
  bodyPolicy:
    keep: true
    basis: author
  note: 整套销售执行非单品，未定三步、硬标准或禁行项
---

Run our sales plays end to end, on demand. Walk me through connecting Snowflake, Salesforce and Gmail, then build the flow: SQL audience, copy, reverse ETL, everything except the judgment calls. Ask me for one play I already run manually, reproduce it so I can diff the output, then save it.