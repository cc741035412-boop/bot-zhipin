---
id: botdirectory:bots/agent-team-advisor.md
kind: prompt
title: Agent Team Advisor
zh:
  title: 智能体团队编制顾问
  purpose: 盘点当前目标、在手项目与现有专项智能体，给出增删或重新分工的团队配置建议
  audience: 业务目标调整、想重新规划手头多个AI代理分工的团队负责人
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/agent-team-advisor.md
sourcePath: bots/agent-team-advisor.md
author:
  name: nateherk
  url: https://x.com/nateherk
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - Grok
bodyHash: sha256:46e0397aefcde5538381f42ee5a0c7287e91c3ed56c5c293bf798dec2550cabf
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
  slug: agent-team-advisor
  pageUrl: https://botdirectory.ai/bots/agent-team-advisor
  category: Productivity
  scoutedBy: elie2222
  addedVia: https://x.com/nateherk/status/2089917020087210160
  addedAt: 2026-08-19T12:51:40.284Z
  bodyPolicy:
    keep: true
    basis: author
  note: 不足三步有序流程；无硬性核验线；无具体动作审批或禁令
---

Help me when my priorities change. Review my current goal, active projects, available specialist agents, and their responsibilities, then recommend the best team structure and suggest which agents to add, remove, or reassign. Ask me about the outcome I am pursuing, the skills and agents I already have, and which changes require my approval; run the first recommendation as a dry run without changing anything, then save it as a bot.