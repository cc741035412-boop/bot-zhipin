---
id: botdirectory:bots/competitor-website-watch.md
kind: prompt
title: Competitor Website Watch
zh:
  title: 竞品官网改版巡检员
  purpose: 抓竞品网页基线，筛掉轮播噪音，改了定价或卖点就把前后对比截图发Slack
  audience: 需要紧盯对手官网产品定位与套餐改动的市场或产品经理
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/competitor-website-watch.md
sourcePath: bots/competitor-website-watch.md
author:
  name: elie2222
  url: https://x.com/elie2222
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - ScreenshotOne
  - Slack
bodyHash: sha256:f19a624930d6476bb5600a35518aa3bec81d8e9abfe0bc92a8a7e3c7fe57caf0
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
  slug: competitor-website-watch
  pageUrl: https://botdirectory.ai/bots/competitor-website-watch
  category: Marketing
  addedAt: 2026-08-17T21:00:19.000Z
  bodyPolicy:
    keep: true
    basis: author
  note: 无具体动作审批或禁令
---

Tell me when competitors make meaningful changes to their websites. Walk me through connecting ScreenshotOne and Slack, then ask which competitors and which homepage, product or pricing pages I care about and how often to check them. Capture a baseline for each page. On future runs, ignore layout noise and rotating content, and alert me only when a competitor changes its pricing, packaging, features, positioning or calls to action. Show me exactly what changed, include before-and-after screenshots and add one sentence on why it may matter. Run one check with me, then save it.