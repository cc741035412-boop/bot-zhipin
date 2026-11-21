---
id: botdirectory:bots/wildfire-emergency-monitor.md
kind: prompt
title: Wildfire Emergency Monitor
zh:
  title: 家人所在地山火提醒
  purpose: 家人附近的疏散令或封路情况一有重要变化，就发来带时间和来源的提醒。
  audience: 山火期间要跟进家人所在区域消息的人
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/wildfire-emergency-monitor.md
sourcePath: bots/wildfire-emergency-monitor.md
author:
  name: scheemunai
  url: https://x.com/scheemunai
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - County emergency website
  - Local news
  - Local emergency alerts
bodyHash: sha256:40397c73c536054ffc1fd39127b2ce33769add8dd7217aa9476dfd0ec0fce728
score: 3
rubric:
  task: true
  input: true
  steps: false
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
  slug: wildfire-emergency-monitor
  pageUrl: https://botdirectory.ai/bots/wildfire-emergency-monitor
  category: Personal
  scoutedBy: theplgeek
  addedVia: https://x.com/scheemunai/status/2092299955071242527
  addedAt: 2026-08-26T14:46:27.490Z
  bodyPolicy:
    keep: true
    basis: author
  note: 只写监测和通知，审核模板不等于审批具体动作
---

Monitor an active wildfire emergency near my family. Ask me which county, locations, evacuation zones, and trusted local sources to watch, then check the county emergency website, local news, and local emergency alert channels on a regular schedule for evacuation orders, road closures, incident changes, and crew-count updates. Notify me immediately when there is a meaningful update, including the time, source, affected area, and what changed. Do a supervised dry run with sample updates, show me the exact alert format and notification destinations for approval, then save it for continuous monitoring during active incidents.