---
id: botdirectory:bots/botdirectory-api-fetcher.md
kind: prompt
title: BotDirectory API Fetcher
zh:
  title: Bot目录接口每日拉取检错器
  purpose: 每天定时请求BotDirectory接口，发回数据摘要并标出报错和缺失字段
  audience: 需要定时同步Bot目录接口数据并排查字段缺漏的开发者
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/botdirectory-api-fetcher.md
sourcePath: bots/botdirectory-api-fetcher.md
author:
  name: Cavire19
  url: https://x.com/Cavire19
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - BotDirectory API
bodyHash: sha256:b9c2e1662219d58590d86e2852c21214287b10aabab45e78cadcfdc900de2567
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
  slug: botdirectory-api-fetcher
  pageUrl: https://botdirectory.ai/bots/botdirectory-api-fetcher
  category: Productivity
  addedVia: https://x.com/Cavire19/status/2090205985277149603
  addedAt: 2026-08-19T22:35:16.621Z
  bodyPolicy:
    keep: true
    basis: author
  note: 无具体动作审批或禁令
---

Run daily to fetch the latest data from the BotDirectory API. Walk me through connecting the API and configuring authentication, then schedule a daily request, retrieve the available directory data, and show me a clear summary of what was fetched with any errors or missing fields. Ask me what time zone and delivery destination I want and whether I want the raw response, a summary, or both, do the first fetch with me watching, then save it for a daily run.