---
id: botdirectory:bots/tweet-topic-scraper.md
kind: prompt
title: Tweet Topic Scraper
zh:
  title: 话题推文制表器
  purpose: 把某个话题的近期推文按指定列导成能直接打开的CSV表。
  audience: 要把社媒讨论导进表格的产品研究员
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/tweet-topic-scraper.md
sourcePath: bots/tweet-topic-scraper.md
author:
  name: ericzakariasson
  url: https://x.com/ericzakariasson
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - X
bodyHash: sha256:7265855c570ade05ed86d8804b1fbb53becbe9ecec630227d75381a931a80056
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
  slug: tweet-topic-scraper
  pageUrl: https://botdirectory.ai/bots/tweet-topic-scraper
  category: Marketing
  addedVia: https://x.com/ericzakariasson/status/2087258964131979423
  addedAt: 2026-08-17T18:23:33.000Z
  bodyPolicy:
    keep: true
    basis: author
  note: 仅抓取并导出，没第三步或动作审批
---

Scrape tweets on any topic I give it into a clean CSV. Walk me through connecting X, then configure it: scrape recent tweets on the topic into a CSV with exactly the columns I ask for — author, followers, link, claim, sentiment, whatever the run needs — one shot, no babysitting. Ask me for a topic and my default columns, run it once so I can check the output opens clean in a spreadsheet, then save it.