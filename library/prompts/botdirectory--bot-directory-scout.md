---
id: botdirectory:bots/bot-directory-scout.md
kind: prompt
title: Bot Directory Scout
zh:
  title: 新上架Bot每日巡检侦察员
  purpose: 每天从目录接口筛出符合偏好的新Bot，说明入选理由并拟好创建方案待批
  audience: 想按固定标准每天淘选新Bot并批量引入的团队负责人
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/bot-directory-scout.md
sourcePath: bots/bot-directory-scout.md
author:
  name: elie2222
  url: https://x.com/elie2222
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - Bot Directory API
bodyHash: sha256:ebb4b1b5c64ec57bea480e01cc82ddc8add3f71c4e65e0757d72896fd6f491e4
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
  slug: bot-directory-scout
  pageUrl: https://botdirectory.ai/bots/bot-directory-scout
  category: Productivity
  addedVia: https://x.com/elie2222/status/2089748154123976880
  addedAt: 2026-08-18T16:16:01.191Z
  bodyPolicy:
    keep: true
    basis: author
  note: 无硬性核验线
---

Run daily. Walk me through connecting the Bot Directory API using its documentation, then configure it to fetch newly added bots once a day, identify the ones that match my interests, explain why each is interesting, and prepare the selected bots for creation. Ask me which categories, capabilities, and quality signals matter to me and whether I want automatic or conservative recommendations, show me the full list and proposed creations for approval before creating anything, do a supervised first fetch and dry run with me, then save it for a daily run.