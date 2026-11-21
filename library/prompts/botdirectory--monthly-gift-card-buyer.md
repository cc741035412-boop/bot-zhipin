---
id: botdirectory:bots/monthly-gift-card-buyer.md
kind: prompt
title: Monthly Gift Card Buyer
zh:
  title: 每月礼品卡订购单
  purpose: 每月按收礼人的偏好备好礼品卡订单，列清费用和送达日期。
  audience: 每月要给固定几个人送礼品卡的经办人
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/monthly-gift-card-buyer.md
sourcePath: bots/monthly-gift-card-buyer.md
author:
  name: LBallz77283
  url: https://x.com/LBallz77283
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - Home Depot
  - Lowe's
  - Bass Pro
  - Target
  - Subway
bodyHash: sha256:68df84c24bdea636d7997bf74f66aa17fdb8686110a3ecd29ff6aa9edb5263a7
score: 5
rubric:
  task: true
  input: true
  steps: true
  acceptance: true
  approval: true
cnFit:
  value: 好
  blocked: []
needsReview:
  flag: true
  rules:
    - R-pay
  hits:
    - rule: R-pay
      excerpt: "Set up a new bot for me that runs once a month to buy gift cards for the people "
    - rule: R-pay
      excerpt: Show me the full list of recipients, retailers, amounts, fees, and delivery deta
extra:
  slug: monthly-gift-card-buyer
  pageUrl: https://botdirectory.ai/bots/monthly-gift-card-buyer
  category: Personal
  addedVia: https://x.com/LBallz77283/status/2094083076095651880
  addedAt: 2026-08-30T15:21:28.930Z
  bodyPolicy:
    keep: true
    basis: author
  note: 批准前要列完送达明细和费用
---

Set up a new bot for me that runs once a month to buy gift cards for the people I specify from Home Depot, Lowe's, Bass Pro, Target, and Subway. Walk me through connecting these retailers and configure it: keep a recipient list with each person's preferred retailer, gift card amount, delivery details, and delivery date, remind me before the monthly run, and prepare the correct orders. Show me the full list of recipients, retailers, amounts, fees, and delivery details and hold every purchase for my approval until I say otherwise. Ask me who should receive gift cards, which retailer and amount belong to each person, when each card should arrive, and whether any retailer should be excluded, do the first month's run with me watching, then save it for a monthly run.