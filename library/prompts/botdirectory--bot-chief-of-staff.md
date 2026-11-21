---
id: botdirectory:bots/bot-chief-of-staff.md
kind: prompt
title: Bot Chief of Staff
zh:
  title: 多机器人总调度幕僚长
  purpose: 按分工给新任务匹配专职机器人，附带背景与期限派单，跟进结果并上报卡点。
  audience: 配了多个专职机器人、需要统一入口分派活计和盯进度的用户
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/bot-chief-of-staff.md
sourcePath: bots/bot-chief-of-staff.md
author:
  name: 0x_rody
  url: https://x.com/0x_rody
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - Grok Bots
bodyHash: sha256:cbfd593a2f342edeeb5e4525ed234bdc60144277b5a3fe1c6ea2ccda286c530e
score: 3
rubric:
  task: false
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
  slug: bot-chief-of-staff
  pageUrl: https://botdirectory.ai/bots/bot-chief-of-staff
  category: Ops
  scoutedBy: elie2222
  addedVia: https://x.com/0x_rody/status/2090124070016926026
  addedAt: 2026-08-23T14:18:31.238Z
  bodyPolicy:
    keep: true
    basis: author
  note: 没定单一成品；无硬性核验线
---

Help me when I have a new task, in your own dedicated chat. Walk me through connecting my specialized Grok Bots, then configure it to classify incoming work, choose the best bot for each job, route the task with the relevant context and deadline, track the result, and surface blockers or tasks that need my decision. Ask me what each bot is responsible for, how to set priorities, which work is urgent, and when to escalate instead of routing automatically, run the first few tasks with me watching, and require my approval before sending messages, publishing anything, spending money, or taking other consequential actions. Then save it as my chief-of-staff workflow.