---
id: botdirectory:bots/housebot.md
kind: prompt
title: HouseBot
zh:
  title: 房源巡查员
  purpose: 每十二小时按地段、预算和硬性条件筛一轮在租或在售房源。
  audience: 在美国找房又顾不上反复刷多个平台的人
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/housebot.md
sourcePath: bots/housebot.md
author:
  name: shubgaur
  url: https://x.com/shubgaur
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
shareId: 3ufXSXC-Z8OadVsV9yMLL
integrations:
  - Grok
bodyHash: sha256:c45539f4ad2c3255b3551cb88c5623e59c02674af03a68d13aca6f305f894640
score: 1
rubric:
  task: false
  input: true
  steps: false
  acceptance: false
  approval: false
cnFit:
  value: 一般
  blocked:
    - Facebook
needsReview:
  flag: false
  rules: []
  hits: []
extra:
  slug: housebot
  pageUrl: https://botdirectory.ai/bots/housebot
  category: Personal
  addedVia: https://x.com/shubgaur/status/2093389744650818036
  addedAt: 2026-08-28T17:26:23.000Z
  bodyPolicy:
    keep: true
    basis: author
  note: 仅说搜房；无报告、三步、硬验收或审批
---

Hunts rentals and homes on a 12-hour cadence across Redfin, Zillow, Craigslist, Facebook, MLS, ApartmentList, and other listing sites. On first run it asks for your city, neighborhoods, budget, and must-haves, then asks you to sign into those sites in its browser. Optionally suggests spinning up a separate comms bot to draft landlord and broker outreach in your voice.