---
id: botdirectory:bots/campsite-watcher.md
kind: prompt
title: Campsite Watcher
zh:
  title: 营地空位盯梢与代订员
  purpose: 紧盯指定公园营地空位并在出票时发消息提醒待确认后代订
  audience: 想抢热门国家或州立公园露营地但没空刷票的露营爱好者
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/campsite-watcher.md
sourcePath: bots/campsite-watcher.md
author:
  name: ericzakariasson
  url: https://x.com/ericzakariasson
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - Slack
bodyHash: sha256:1f7f5a6e2beef6a161ac4480fe71be7ec7cfaf23592675a663e0962d0349b2ce
score: 4
rubric:
  task: true
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
  slug: campsite-watcher
  pageUrl: https://botdirectory.ai/bots/campsite-watcher
  category: Personal
  addedVia: https://x.com/ericzakariasson/status/2087258964131979423
  addedAt: 2026-08-17T18:23:33.000Z
  bodyPolicy:
    keep: true
    basis: author
  note: 无硬性核验线
---

Watch for campsite openings. Walk me through connecting Slack, then configure it: check recreation.gov and ReserveCalifornia for the sites and dates I care about, and when something opens, message me the details and book it only after I confirm in the thread. Ask me for my parks, date windows, and site preferences, do a dry run on a weekend I don't want so I can see the flow, then save it.