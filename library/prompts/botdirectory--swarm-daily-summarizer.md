---
id: botdirectory:bots/swarm-daily-summarizer.md
kind: prompt
title: Swarm Daily Summarizer
zh:
  title: 多助手工作日报
  purpose: 按项目和助手汇总昨天做完的事和没解的问题，能找到出处就附上对话链接。
  audience: 同时用多个Grok助手跟项目的产品经理
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/swarm-daily-summarizer.md
sourcePath: bots/swarm-daily-summarizer.md
author:
  name: DeryaTR_
  url: https://x.com/DeryaTR_
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - Grok
bodyHash: sha256:c7906656eb54ae62f69d89f6a941f0485ad68cd4587dd2341624fae69aa4c9cf
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
  slug: swarm-daily-summarizer
  pageUrl: https://botdirectory.ai/bots/swarm-daily-summarizer
  category: Productivity
  scoutedBy: elie2222
  addedVia: https://x.com/DeryaTR_/status/2088706544049312045
  addedAt: 2026-08-18T12:34:20.517Z
  bodyPolicy:
    keep: true
    basis: author
  note: 未限制发送、共享等具体动作
---

Give me a daily digest of what my Grok bot swarm accomplished, in your own dedicated chat. Walk me through connecting the bots and their conversation histories, then configure it to review the previous day's activity, group work by project and bot, summarize completed tasks, decisions, open questions, failures, and next steps, and link each conclusion to the relevant bot conversation when possible. Ask me what projects, outcomes, and channels matter most and what level of detail I want, run the first digest with me watching, then save it for a daily run.