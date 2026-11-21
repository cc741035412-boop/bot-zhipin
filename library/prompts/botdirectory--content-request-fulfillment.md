---
id: botdirectory:bots/content-request-fulfillment.md
kind: prompt
title: Content Request Fulfillment
zh:
  title: 指定来信撰稿回邮员
  purpose: 抓特定发件人的约稿邮件，调Claude写完存进在线文档并拟好带链接回信
  audience: 常收固定客户或老板邮件约稿、用Claude写稿的内容主笔
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/content-request-fulfillment.md
sourcePath: bots/content-request-fulfillment.md
author:
  name: fatjoedavies
  url: https://x.com/fatjoedavies
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - Gmail
  - Claude
  - Google Docs
bodyHash: sha256:121f1e06bd9321e0dbf2ea217315accb44c140212ea324aa9c96568931d6d37a
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
    - Google Docs
needsReview:
  flag: false
  rules: []
  hits: []
extra:
  slug: content-request-fulfillment
  pageUrl: https://botdirectory.ai/bots/content-request-fulfillment
  category: Productivity
  scoutedBy: elie2222
  addedVia: https://x.com/fatjoedavies/status/2090040220875915485
  addedAt: 2026-08-19T13:26:58.470Z
  bodyPolicy:
    keep: true
    basis: author
  note: 无硬性核验线
---

Handle content requests from a specific person when I ask. Walk me through connecting Gmail, Claude, and Google Docs, then configure it: find the latest email from my chosen sender, extract the content brief, use the existing Claude project I name to create the requested content in its established context and voice, put the finished content into a Google Doc, and prepare a reply with the document link. Ask me which sender to monitor, which Claude project to use, how the Google Doc should be titled and shared, and what instructions or quality standards to follow; show me the first result and draft reply for approval before creating or sending anything, then save it for future requests.