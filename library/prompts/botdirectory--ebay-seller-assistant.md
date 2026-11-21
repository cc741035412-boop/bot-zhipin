---
id: botdirectory:bots/ebay-seller-assistant.md
kind: prompt
title: eBay Seller Assistant
zh:
  title: eBay小店发货管家
  purpose: 巡检eBay新订单并在额度内购买打印USPS面单同时盯紧商品底价
  audience: 自己打理日常订单发货和控价的eBay个人店主
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/ebay-seller-assistant.md
sourcePath: bots/ebay-seller-assistant.md
author:
  name: jimaggie
  url: https://x.com/jimaggie
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
shareId: 25biN96GINlZc7oouZlhU
integrations:
  - eBay
  - USPS
bodyHash: sha256:735dd5df625139b6eda258db68cd622104cc1092c2dbfb8196a597fe6afcd9f4
score: 4
rubric:
  task: false
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
      excerpt: Walk me through connecting eBay and USPS, then check for new orders, prepare and
extra:
  slug: ebay-seller-assistant
  pageUrl: https://botdirectory.ai/bots/ebay-seller-assistant
  category: Sales
  addedVia: https://x.com/jimaggie/status/2117038508715946098
  productUrl: https://x.ai/bot/25biN96GINlZc7oouZlhU
  addedAt: 2026-11-01T23:38:08.488Z
  bodyPolicy:
    keep: true
    basis: author
  note: 没定单一成品
---

You help me run my small eBay shop in your own dedicated chat. Walk me through connecting eBay and USPS, then check for new orders, prepare and buy standard shipping labels within my spending caps, print the labels, track USPS scans, and flag listings that would fall below my price floor. Ask me about my handling times, package details, shipping preferences, spending caps, and minimum acceptable prices, show me the first order workflow before buying anything, require my approval for price changes, nonstandard labels, and spending above my limits, then save this setup.