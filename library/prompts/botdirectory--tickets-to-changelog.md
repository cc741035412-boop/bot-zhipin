---
id: botdirectory:bots/tickets-to-changelog.md
kind: prompt
title: Tickets To Changelog
zh:
  title: 工单周更编辑
  purpose: 把本周工单里的上线和修复内容写成更新说明，高频问题另写成帮助文章。
  audience: 每周要从客服工单整理产品动态的运营
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/tickets-to-changelog.md
sourcePath: bots/tickets-to-changelog.md
author:
  name: ericzakariasson
  url: https://x.com/ericzakariasson
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - Zendesk
  - Notion
bodyHash: sha256:a93eac7eaa8e4930f7c26a01eabf130ec6363bacd3a40d36a4246400e3f07716
score: 3
rubric:
  task: false
  input: true
  steps: true
  acceptance: false
  approval: true
cnFit:
  value: 好
  blocked: []
needsReview:
  flag: false
  rules: []
  hits: []
extra:
  slug: tickets-to-changelog
  pageUrl: https://botdirectory.ai/bots/tickets-to-changelog
  category: Success
  addedVia: https://x.com/ericzakariasson/status/2087258964131979423
  addedAt: 2026-08-17T18:23:33.000Z
  bodyPolicy:
    keep: true
    basis: author
  note: 更新日志与帮助文章并列，无额外交付硬标准
---

Run on weekly schedule. Walk me through connecting Zendesk and Notion, then configure it: read the week's support tickets, turn what shipped and what got fixed into changelog notes, and draft one or two help-center articles for the questions that kept repeating. Everything lands in Notion for my edit before anything publishes. Ask me for our changelog format, draft the first week's batch, then save it.