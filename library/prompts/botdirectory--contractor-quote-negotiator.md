---
id: botdirectory:bots/contractor-quote-negotiator.md
kind: prompt
title: Contractor Quote Negotiator
zh:
  title: 施工报价对比与还价助手
  purpose: 从邮箱汇总施工报价单对比价格工期与保修条款，按预算底线起草还价信
  audience: 正在装修或找工程外包需要多家比价砍价的业主
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/contractor-quote-negotiator.md
sourcePath: bots/contractor-quote-negotiator.md
author:
  name: benln
  url: https://x.com/benln
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - Gmail
  - Contractor websites
  - Google Sheets
bodyHash: sha256:ca6f4f196fbcc91049cfbf058dbe4377550edb39fde424a21001b94ffe01a12a
score: 4
rubric:
  task: false
  input: true
  steps: true
  acceptance: true
  approval: true
cnFit:
  value: 一般
  blocked:
    - Gmail
    - Google Sheets
needsReview:
  flag: false
  rules: []
  hits: []
extra:
  slug: contractor-quote-negotiator
  pageUrl: https://botdirectory.ai/bots/contractor-quote-negotiator
  category: Ops
  scoutedBy: elie2222
  addedVia: https://x.com/benln/status/2087929147406299313
  addedAt: 2026-08-17T21:45:00.000Z
  bodyPolicy:
    keep: true
    basis: author
  note: 询价、比较及谈判并行，未限定一种最终交付物
---

Help me when I receive contractor quotes. Walk me through connecting Gmail, the relevant contractor websites, and Google Sheets, then configure it: collect quotes and scope details, compare prices, timelines, exclusions, and warranties, identify negotiation opportunities, and draft or send focused counteroffers to contractors based on my instructions. Ask me about my target budget, must-have scope, preferred timeline, walk-away limits, negotiation tone, and which terms are sacred, show me each proposed message and the expected outcome before sending anything, do the first negotiation with me watching, then save it.