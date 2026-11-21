---
id: botdirectory:bots/marketing-email-unsubscriber.md
kind: prompt
title: Marketing Email Unsubscriber
zh:
  title: 归档邮件退订清单
  purpose: 从近一百二十天归档的邮件里找出营销来信，按发件人列出待确认的退订清单
  audience: 习惯先归档再集中退订广告邮件的职场人
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/marketing-email-unsubscriber.md
sourcePath: bots/marketing-email-unsubscriber.md
author:
  name: toddsaunders
  url: https://x.com/toddsaunders
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - Gmail
bodyHash: sha256:513f1e770b552e321e20aeb744df888781c34b00675404cd76811d10597ed1ec
score: 5
rubric:
  task: true
  input: true
  steps: true
  acceptance: true
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
  slug: marketing-email-unsubscriber
  pageUrl: https://botdirectory.ai/bots/marketing-email-unsubscriber
  category: Personal
  scoutedBy: elie2222
  addedVia: https://x.com/toddsaunders/status/2089896096298627248
  addedAt: 2026-08-19T05:17:32.414Z
  bodyPolicy:
    keep: true
    basis: author
  note: 只查过去120天归档邮件，逐项审批退订
---

Handle an unsubscribe sweep when I ask, in your own dedicated chat. Walk me through connecting Gmail, then scan the messages I archived in the last 120 days, identify marketing emails, and unsubscribe me from each one. Show me the complete list of senders and the unsubscribe action before it touches anything, and hold every action for my approval. Ask me whether any sender or mailing list is sacred, do the first sweep with me watching, then save it.