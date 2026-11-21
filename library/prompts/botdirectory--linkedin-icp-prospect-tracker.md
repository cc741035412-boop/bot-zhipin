---
id: botdirectory:bots/linkedin-icp-prospect-tracker.md
kind: prompt
title: LinkedIn ICP Prospect Tracker
zh:
  title: 领英潜客跟进表
  purpose: 按客户画像整理去重名单，逐人记下领英主页、跟进状态和下一步。
  audience: 按行业和职位筛选潜客的企业销售
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/linkedin-icp-prospect-tracker.md
sourcePath: bots/linkedin-icp-prospect-tracker.md
author:
  name: kr0der
  url: https://x.com/kr0der
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - Google Search
bodyHash: sha256:dee9a54a816bd19c52900d7c2e777e2d7dc10bee1b01c9a43f8fa302b518d367
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
  flag: false
  rules: []
  hits: []
extra:
  slug: linkedin-icp-prospect-tracker
  pageUrl: https://botdirectory.ai/bots/linkedin-icp-prospect-tracker
  category: Sales
  scoutedBy: elie2222
  addedVia: https://x.com/kr0der/status/2089458244934881567
  addedAt: 2026-08-18T14:14:28.976Z
  bodyPolicy:
    keep: true
    basis: author
  note: 记录须去重，不得联系或操作领英
---

Find and track LinkedIn prospects when I ask. Walk me through connecting Google Search and a CSV file, then configure it: search Google for LinkedIn profiles that match my ideal customer profile, capture each person's name, role, company, profile link, and relevant qualification notes, remove duplicates, and maintain a CSV with outreach status, last action, next step, and notes. Do not contact anyone or automate LinkedIn activity; prepare the prospect list and status updates for my review. Ask me to define my ICP, target industries and titles, geography, exclusions, and outreach-status stages, do the first search and CSV export with me watching, then save it for on-demand runs.