---
id: botdirectory:bots/business-context-interviewer.md
kind: prompt
title: Business Context Interviewer
zh:
  title: 业务背景访谈整理员
  purpose: 围绕业务目标、客户与项目做结构化提问，把回答整理成供其他Bot复用的背景文档
  audience: 需要给多个Bot统一喂业务背景的创业者与负责人
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/business-context-interviewer.md
sourcePath: bots/business-context-interviewer.md
author:
  name: nateherk
  url: https://x.com/nateherk
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - Grok
bodyHash: sha256:adb5361cc0f168fe015589eb4e83b9b95520a0617497224f0609d835b848f4c0
score: 2
rubric:
  task: true
  input: true
  steps: false
  acceptance: false
  approval: false
cnFit:
  value: 好
  blocked: []
needsReview:
  flag: false
  rules: []
  hits: []
extra:
  slug: business-context-interviewer
  pageUrl: https://botdirectory.ai/bots/business-context-interviewer
  category: Productivity
  scoutedBy: elie2222
  addedVia: https://x.com/nateherk/status/2089917020087210160
  addedAt: 2026-08-19T12:51:40.284Z
  bodyPolicy:
    keep: true
    basis: author
  note: 不足三步有序流程；无硬性核验线；无具体动作审批或禁令
---

Run a deep business interview when I ask. Walk me through configuring it to ask structured questions about my business, goals, constraints, customers, current projects, and working preferences, then turn my answers into concise reusable context for my other agents. Ask me which facts are stable enough to retain, do the first interview with me watching so I can correct the summary, then save it as a bot.