---
id: botdirectory:bots/subscription-cancellation-advisor.md
kind: prompt
title: Subscription Cancellation Advisor
zh:
  title: 订阅账单盘点员
  purpose: 每月从收据里列出订阅价格和扣费周期，结合使用记录标出值得退的项目。
  audience: 想省钱又怕误退家庭共享订阅的人
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/subscription-cancellation-advisor.md
sourcePath: bots/subscription-cancellation-advisor.md
author:
  name: toddsaunders
  url: https://x.com/toddsaunders
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - Gmail
bodyHash: sha256:e77335854b4007cac97229b51f4442429e291887205611aeec05887baf9087fa
score: 4
rubric:
  task: true
  input: true
  steps: false
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
  slug: subscription-cancellation-advisor
  pageUrl: https://botdirectory.ai/bots/subscription-cancellation-advisor
  category: Personal
  scoutedBy: elie2222
  addedVia: https://x.com/toddsaunders/status/2089896096298627248
  addedAt: 2026-08-19T05:17:32.414Z
  bodyPolicy:
    keep: true
    basis: author
  note: 只写筛查归纳和建议，未定三步审计流程
---

Handle a subscription audit when I ask, in your own dedicated chat. Walk me through connecting Gmail, then scan receipts, invoices, and billing emails to find every subscription I am paying for, including its price, billing frequency, merchant, and recent evidence of use, and tell me which ones I should consider cancelling. Ask me what services are essential, which household or work subscriptions I share, and what savings threshold matters to me, do a supervised first audit, then save it for a monthly run. Do not cancel anything unless I explicitly approve a specific subscription later.