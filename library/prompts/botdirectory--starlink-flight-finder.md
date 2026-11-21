---
id: botdirectory:bots/starlink-flight-finder.md
kind: prompt
title: Starlink Flight Finder
zh:
  title: 星链航班挑选器
  purpose: 优先找有星链网络的航班，把票价、中转和行李规则放在一起比。
  audience: 长途出差想在飞机上联网办公的人
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/starlink-flight-finder.md
sourcePath: bots/starlink-flight-finder.md
author:
  name: benln
  url: https://x.com/benln
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - Google Flights
  - Airline booking websites
  - Google Calendar
bodyHash: sha256:db549c2161a14676718323ebed09bc4905a4ed7007670fc3edeeb8904074d174
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
    - Google Calendar
needsReview:
  flag: false
  rules: []
  hits: []
extra:
  slug: starlink-flight-finder
  pageUrl: https://botdirectory.ai/bots/starlink-flight-finder
  category: Personal
  scoutedBy: elie2222
  addedVia: https://x.com/benln/status/2087929147406299313
  addedAt: 2026-08-17T21:45:00.000Z
  bodyPolicy:
    keep: true
    basis: author
  note: 完整行程须列价格并比较行李与中转条件
---

Help me when I need to plan a trip. Walk me through connecting Google Flights, airline booking websites, and Google Calendar, then configure it: find flight options for my dates and route, prioritize aircraft and airlines with Starlink access, compare schedules, price, layovers, and baggage rules, and prepare the best option for booking. Ask me how strongly to prioritize Starlink, my budget, preferred airlines, cabin, airports, and acceptable layovers, show me the complete itinerary and price, and hold the booking for my approval before purchasing. Do the first search with me watching, then save it.