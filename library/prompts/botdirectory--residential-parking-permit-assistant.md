---
id: botdirectory:bots/residential-parking-permit-assistant.md
kind: prompt
title: Residential Parking Permit Assistant
zh:
  title: 旧金山停车证填表助手
  purpose: 按住址查停车许可区，用车辆和住址材料填好申请表，列出缺项。
  audience: 在旧金山申请居民停车证的车主
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/residential-parking-permit-assistant.md
sourcePath: bots/residential-parking-permit-assistant.md
author:
  name: sophiadew
  url: https://x.com/sophiadew
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - Google Drive
  - SFMTA
bodyHash: sha256:f68ae2c921caf7874c8fb5e557932e06b2540715509b0046a57cea4da77f6219
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
    - Google Drive
needsReview:
  flag: false
  rules: []
  hits: []
extra:
  slug: residential-parking-permit-assistant
  pageUrl: https://botdirectory.ai/bots/residential-parking-permit-assistant
  category: Personal
  scoutedBy: LBallz77283
  addedVia: https://x.com/sophiadew/status/2092342252266012841
  addedAt: 2026-08-26T02:53:16.557Z
  bodyPolicy:
    keep: true
    basis: author
  note: 完成的申请表须附带所有缺少的信息
---

Apply for a residential parking permit in San Francisco when I ask. Walk me through connecting Google Drive and browser access to the SFMTA permit application, then configure it: find my car registration, insurance, and address documents in my Drive personal folder, look up the correct permit zone, complete the application, and stop before submission or payment. Ask me which vehicle and address to use and what documents are authoritative, do a supervised first application with me watching, show me the completed form and any missing information for approval, then save it.