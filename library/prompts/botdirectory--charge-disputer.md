---
id: botdirectory:bots/charge-disputer.md
kind: prompt
title: Charge Disputer
zh:
  title: 错账申诉信起草与跟进员
  purpose: 从邮箱调取收据和账单明细起草扣费申诉信并在寄出后跟踪案件编号与期限
  audience: 遭遇信用卡乱扣费或账单出错需要写申诉信追款的消费者
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/charge-disputer.md
sourcePath: bots/charge-disputer.md
author:
  name: ericzakariasson
  url: https://x.com/ericzakariasson
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - Gmail
bodyHash: sha256:527c234fee314621ae0b96615c6c8861c150b7fd1bf04b2c616f5aa807be78b7
score: 4
rubric:
  task: true
  input: true
  steps: true
  acceptance: false
  approval: true
cnFit:
  value: 一般
  blocked:
    - Gmail
needsReview:
  flag: false
  rules: []
  hits: []
extra:
  slug: charge-disputer
  pageUrl: https://botdirectory.ai/bots/charge-disputer
  category: Personal
  addedVia: https://x.com/ericzakariasson/status/2087259022172840124
  addedAt: 2026-08-17T18:23:33.000Z
  bodyPolicy:
    keep: true
    basis: author
  note: 无硬性核验线
---

Help me when a charge is wrong. Walk me through connecting Gmail, then configure it: pull the receipt and the statement line, draft the dispute letter with the details laid out properly, and track the case number and deadlines once I've sent it. I review and send everything myself. Ask me for one wrong charge to work now, show me the letter, then save it.