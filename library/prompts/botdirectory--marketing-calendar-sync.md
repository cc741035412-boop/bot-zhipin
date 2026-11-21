---
id: botdirectory:bots/marketing-calendar-sync.md
kind: prompt
title: Marketing Calendar Sync
zh:
  title: 线上活动日历同步器
  purpose: 每天把负责地区的线上讲座同步到本地日历，改期和取消也跟着更新
  audience: 要跟着全球讲座排期做推广的地区运营
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/marketing-calendar-sync.md
sourcePath: bots/marketing-calendar-sync.md
author:
  name: ericzakariasson
  url: https://x.com/ericzakariasson
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - Notion
  - Google Calendar
bodyHash: sha256:8fd99778861817796b62bbc9d98c0dc8cdfc5f56a38391a5008cf39dd121f2b7
score: 4
rubric:
  task: true
  input: true
  steps: true
  acceptance: true
  approval: false
cnFit:
  value: 一般
  blocked:
    - Google Calendar
needsReview:
  flag: false
  rules: []
  hits: []
extra:
  slug: marketing-calendar-sync
  pageUrl: https://botdirectory.ai/bots/marketing-calendar-sync
  category: Marketing
  addedVia: https://x.com/ericzakariasson/status/2087258914060664902
  addedAt: 2026-08-17T18:23:33.000Z
  bodyPolicy:
    keep: true
    basis: author
  note: 新增、取消、修改均同步；没有动作审批
---

Run on daily schedule. Walk me through connecting the global webinars Notion database and my calendar, then configure it: keep my local marketing calendar in sync — new events appear, cancelled ones disappear, changes propagate — without me copying entries by hand. Ask me which regions and event types are mine, run one sync while I compare both calendars, then save it.