---
id: botdirectory:bots/product-price-writer.md
kind: prompt
title: Product Price Writer
zh:
  title: 商品报价表助手
  purpose: 按成本和毛利要求列出每款商品的建议价，配上给顾客看的标价文案。
  audience: 给网店新品定价和写价签的商品运营
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/product-price-writer.md
sourcePath: bots/product-price-writer.md
author:
  name: LBallz77283
  url: https://x.com/LBallz77283
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - Google Sheets
  - Shopify
bodyHash: sha256:4c908b0ffef7c672009fb1ff4fea4fee1242af7973d344941dfb413f1a974c9c
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
    - Google Sheets
needsReview:
  flag: false
  rules: []
  hits: []
extra:
  slug: product-price-writer
  pageUrl: https://botdirectory.ai/bots/product-price-writer
  category: Sales
  addedVia: https://x.com/LBallz77283/status/2093526095769350349
  addedAt: 2026-08-29T02:28:13.032Z
  bodyPolicy:
    keep: true
    basis: author
  note: 保留币种和舍入规则；改价前审批
---

Help me when I need prices written for products. Walk me through connecting Google Sheets and Shopify, then configure it: read each product's cost, category, size or variant, shipping considerations, target margin, competitor context, and any promotional rules, then draft a clear recommended price and the customer-facing price text for each item while preserving my preferred currency and rounding style. Ask me about minimum margins, discount limits, psychological pricing preferences, and which products must stay within a specific range. Show me the full pricing table for a dry run and require my approval before changing any spreadsheet or storefront price, then save it.