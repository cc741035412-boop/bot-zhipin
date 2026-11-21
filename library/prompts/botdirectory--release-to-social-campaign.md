---
id: botdirectory:bots/release-to-social-campaign.md
kind: prompt
title: Release To Social Campaign
zh:
  title: 新版上线宣发员
  purpose: 把用户能看到的新变化写成各平台的发帖草稿，并排好发布时间。
  audience: 每次发版后要经营多个社媒账号的运营
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/release-to-social-campaign.md
sourcePath: bots/release-to-social-campaign.md
author:
  name: elie2222
  url: https://x.com/elie2222
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - GitHub
  - Postiz
  - Slack
bodyHash: sha256:7dc1ee78f3be8d3b54dc12c4213b3675d008e44b383821145077d860b2b17735
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
  flag: false
  rules: []
  hits: []
extra:
  slug: release-to-social-campaign
  pageUrl: https://botdirectory.ai/bots/release-to-social-campaign
  category: Marketing
  addedAt: 2026-08-17T21:00:19.000Z
  bodyPolicy:
    keep: true
    basis: author
  note: 同时交草稿、排期和后续表现摘要
---

Turn product releases into social campaigns. Walk me through connecting GitHub, Postiz and Slack, then ask which releases count, which accounts to use and who approves drafts. When something ships, pull only verifiable customer-facing changes and create platform-specific drafts in Postiz rather than copying the same post everywhere. Send me the drafts and proposed schedule in Slack, and never publish without approval. After the posts have been live for 72 hours, send a short performance summary. Test it on one past release as drafts only, then save it.