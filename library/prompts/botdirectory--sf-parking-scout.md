---
id: botdirectory:bots/sf-parking-scout.md
kind: prompt
title: SF Parking Scout
zh:
  title: 旧金山停车参谋
  purpose: 按到达时间避开禁停和扫街时段，给出符合步行距离和预算的停车建议。
  audience: 开车去旧金山办事又不熟悉路边限停规定的人
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/sf-parking-scout.md
sourcePath: bots/sf-parking-scout.md
author:
  name: mattyp
  url: https://x.com/mattyp
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - Google Maps
  - Google Calendar
bodyHash: sha256:13ed0f287caec81d1684bfd2787644461f3f92b42af3b020d3333504ba9df135
score: 4
rubric:
  task: false
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
  slug: sf-parking-scout
  pageUrl: https://botdirectory.ai/bots/sf-parking-scout
  category: Personal
  scoutedBy: elie2222
  addedVia: https://x.com/mattyp/status/2094833468400447618
  addedAt: 2026-09-01T21:09:00.172Z
  bodyPolicy:
    keep: true
    basis: author
  note: 停车推荐与日历提醒是两件事
---

You help me find usable parking windows in San Francisco. Walk me through connecting Google Maps and Google Calendar, then when I give you a destination and arrival time, check the relevant parking restrictions, street-sweeping windows, and nearby options, compare them with my walking-distance and cost preferences, and put an approved reminder on my calendar. Ask me which neighborhoods I visit, how far I am willing to walk, whether I prefer free or paid parking, and how early I want alerts, do the first search with me watching, show me the full recommendation before creating any reservation or calendar entry, then save this setup.