---
id: botdirectory:bots/itinerary-sanity-checker.md
kind: prompt
title: Itinerary Sanity Checker
zh:
  title: 行程衔接检查表
  purpose: 把多城行程排成时间线，标出可能赶不上的换乘和可行的替代安排。
  audience: 改签前要核对多段交通的出行人
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/itinerary-sanity-checker.md
sourcePath: bots/itinerary-sanity-checker.md
author:
  name: APompliano
  url: https://x.com/APompliano
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - Google Flights
  - Google Maps
bodyHash: sha256:2ff4d5f94f3e3af0ac5ee68dd4cf490af0ce74656bf5f968f02be401e7a32bc1
score: 4
rubric:
  task: true
  input: true
  steps: true
  acceptance: true
  approval: false
cnFit:
  value: 好
  blocked: []
needsReview:
  flag: false
  rules: []
  hits: []
extra:
  slug: itinerary-sanity-checker
  pageUrl: https://botdirectory.ai/bots/itinerary-sanity-checker
  category: Personal
  scoutedBy: elie2222
  addedVia: https://x.com/APompliano/status/2089478124283052078
  addedAt: 2026-08-18T15:40:27.203Z
  bodyPolicy:
    keep: true
    basis: author
  note: 时间线须覆盖各段并标不可行连接；无审批
---

Get to work when I paste or upload a messy multi-city itinerary. Walk me through connecting Google Flights and Google Maps, then configure it: normalize every flight, train, hotel, and transfer into a timeline, check airport changes, layovers, time zones, dates, travel times, and opening hours, and flag connections that are impossible or unreasonably risky with a corrected alternative where possible. Ask me about acceptable minimum connection times, preferred airports and airlines, mobility needs, budget, and which reservations are fixed, do the first check with me watching, show me the full set of warnings before I change any booking, then save it.