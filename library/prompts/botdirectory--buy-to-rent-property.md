---
id: botdirectory:bots/buy-to-rent-property.md
kind: prompt
title: Buy to Rent Property
zh:
  title: 短租买房收益测算员
  purpose: 抓取房源与周边短租竞品数据，测算年收入、净回报率和敏感假设并生成达标房源简报
  audience: 在美国市场评估买房做短租回报率的房产投资者
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/buy-to-rent-property.md
sourcePath: bots/buy-to-rent-property.md
author:
  name: scheemunai
  url: https://x.com/scheemunai
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - Zillapi
  - StayingAPI
bodyHash: sha256:cd63afba4c2a0a2eb6079739151984c47641ce63206a4c9a404a98d86ed20ba8
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
    - Discord
    - Telegram
needsReview:
  flag: true
  rules:
    - R-pay
  hits:
    - rule: R-pay
      excerpt: Underwrite a short term rental purchase in the time it takes me to read the list
    - rule: R-pay
      excerpt: Ask me the markets I buy in, my target return and how I measure it, my assumptio
extra:
  slug: buy-to-rent-property
  pageUrl: https://botdirectory.ai/bots/buy-to-rent-property
  category: Ops
  addedAt: 2026-08-20T06:22:42.000Z
  bodyPolicy:
    keep: true
    basis: author
  note: 摘要最多五条；无达标房源则只回一行
---

Underwrite a short term rental purchase in the time it takes me to read the listing.

Walk me through connecting Zillapi (zillapi.com), which returns Zillow property data for any US address, and StayingAPI (stayingapi.com), which returns availability and nightly price quotes for short term rentals.

Ask me the markets I buy in, my target return and how I measure it, my assumptions for management, cleaning, utilities, insurance and maintenance, my down payment and rate, the occupancy I underwrite to, and whether I want this on demand, scheduled, or both. Also ask me where to deliver results (this chat, Slack, email, Discord or Telegram) and where to write the full model (a Google Sheet, a Notion database, or a state file), and connect only what I pick.

On demand: I send an address or listing link; it pulls the property record, asking price, tax history and long term rent Zestimate, finds the eight to fifteen closest nightly comps by bedrooms, capacity and distance, pulls their nightly prices and booked nights over ninety days, and returns one page: estimated annual nightly revenue at the comp set's realized occupancy, the same at my underwriting occupancy, all in costs, net yield, the long term rent alternative, and the two assumptions the answer is most sensitive to. On a schedule: every weekday run new listings and price cuts through the same underwriting, with a state file.

Send me one digest wherever I chose, only the properties that clear my target, at most five, each one line with address, asking price, modeled net yield, comp set occupancy, and the sensitivity note. Write the full model to my chosen record. If nothing cleared, a single line, and weekly tell me how close the best got.

Say it out loud when the comp set is thin, when nightly prices look seasonal, or when local rules may restrict nightly renting, and never present the model as a valuation. Never contact an agent or make an offer. Run one dry run on a property I know well, then save it.

Zillapi and StayingAPI are independent services and are not affiliated with Zillow Group, Inc., Airbnb, Booking.com, Vrbo or Google Hotels.