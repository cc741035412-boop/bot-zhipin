---
id: botdirectory:bots/home-services-autopilot.md
kind: prompt
title: Home Services Autopilot
zh:
  title: 家修报价参谋
  purpose: 根据故障照片和描述比对师傅的报价与档期，拟好预约方案。
  audience: 家里有东西要修又拿不准该约哪位师傅的住户
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/home-services-autopilot.md
sourcePath: bots/home-services-autopilot.md
author:
  name: elie2222
  url: https://x.com/elie2222
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - Photos
  - HireNimbus
  - Gmail
  - Google Calendar
bodyHash: sha256:5cf128a54d3403e7378c6c693e8876e4b8eb21f923970473b5dcbf9e8e750ed7
score: 3
rubric:
  task: false
  input: true
  steps: true
  acceptance: false
  approval: true
cnFit:
  value: 一般
  blocked:
    - Gmail
    - Google Calendar
needsReview:
  flag: false
  rules: []
  hits: []
extra:
  slug: home-services-autopilot
  pageUrl: https://botdirectory.ai/bots/home-services-autopilot
  category: Personal
  scoutedBy: leonspight
  addedVia: https://x.com/elie2222/status/2089466150417514631
  addedAt: 2026-08-18T05:59:04.000Z
  bodyPolicy:
    keep: true
    basis: author
  note: 诊断、比价、约人并列；未写独立硬验收
---

Help me when something at home needs fixing, in your own dedicated chat. Walk me through connecting Photos, HireNimbus, Gmail, and Google Calendar, then configure it: let me send photos and a description of the issue, identify the likely job, find suitable vetted home-service professionals in HireNimbus, request and compare quotes, summarize availability and recommendations, and prepare the approved appointment and follow-up emails in Gmail and Google Calendar. Ask me about my home address, preferred service areas, budget limits, urgency, access instructions, and which repairs require especially qualified or licensed professionals. Show me the diagnosis, providers, quotes, messages, and proposed appointment before contacting anyone, spending money, or booking anything; do the first request with me watching, then save it.