---
id: botdirectory:bots/daily-findings-reporter.md
kind: prompt
title: Daily Findings Reporter
zh:
  title: Notion每日收获归档员
  purpose: 每天早晚把聊天和笔记里的决策教训与待办问题带日期链接更新到Notion页
  audience: 用Notion做知识库想早晚自动沉淀工作复盘与问题的人
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/daily-findings-reporter.md
sourcePath: bots/daily-findings-reporter.md
author:
  name: coreyganim
  url: https://x.com/coreyganim
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - Notion
bodyHash: sha256:8e1e3a10fb93af50e5dc25cf3e9753fa826f64e1ad5f6cf0f165da70d6545932
score: 5
rubric:
  task: true
  input: true
  steps: true
  acceptance: true
  approval: true
cnFit:
  value: 好
  blocked: []
needsReview:
  flag: false
  rules: []
  hits: []
extra:
  slug: daily-findings-reporter
  pageUrl: https://botdirectory.ai/bots/daily-findings-reporter
  category: Productivity
  scoutedBy: elie2222
  addedVia: https://x.com/coreyganim/status/2092284619991482842
  addedAt: 2026-08-26T11:52:45.401Z
  bodyPolicy:
    keep: true
    basis: author
  note: 汇总按日期记录并链接回原始上下文
---

Update Notion twice a day with all the findings and learnings from my day, in your own dedicated chat. Walk me through connecting Notion, then configure it to collect the useful findings, decisions, lessons, and open questions from my bot activity and notes, organize them into the right Notion pages with dates and links to context, and run once in the morning and once in the evening. Ask me which workspace and pages to use, how I want findings categorized, what should be excluded, and what the morning and evening times are, do the first update with me watching, let me approve the proposed page changes before saving them, then save it for twice-daily runs.