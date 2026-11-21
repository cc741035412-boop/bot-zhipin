---
id: botdirectory:bots/ad-pacing-digest.md
kind: prompt
title: Ad Pacing Digest
zh:
  title: 苹果搜索广告消耗晨报员
  purpose: 每天早八点在Slack发苹果搜索广告消耗对比日报，并按回复执行出价修改
  audience: 负责苹果应用商店搜索广告日常盯盘和控预算的投放运营
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/ad-pacing-digest.md
sourcePath: bots/ad-pacing-digest.md
author:
  name: ericzakariasson
  url: https://x.com/ericzakariasson
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - Apple Search Ads
  - Slack
bodyHash: sha256:b6248d8ef502bbdc9601083c4233f2e143e397f38d23f0e7d0b0e90512cad287
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
  slug: ad-pacing-digest
  pageUrl: https://botdirectory.ai/bots/ad-pacing-digest
  category: Marketing
  addedVia: https://x.com/ericzakariasson/status/2087258914060664902
  addedAt: 2026-08-17T18:23:33.000Z
  bodyPolicy:
    keep: true
    basis: author
  note: 无硬性核验线
---

Run daily at 8:00am. Walk me through connecting Apple Search Ads and Slack, then configure it: post spend against plan, what's over-delivering and what to cut, and when I reply in the thread make the bid edit and confirm what changed. Ask me for the daily plan and guardrails, require confirmation above my threshold, then save it.