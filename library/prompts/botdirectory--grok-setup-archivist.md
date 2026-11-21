---
id: botdirectory:bots/grok-setup-archivist.md
kind: prompt
title: Grok Setup Archivist
zh:
  title: 助手配置归档员
  purpose: 每月一号把助手配置连同相关文件收进带日期的归档包，留作重建用。
  audience: 要定期留存助手工作流程和文件的运营负责人
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/grok-setup-archivist.md
sourcePath: bots/grok-setup-archivist.md
author:
  name: BatteredBags
  url: https://x.com/BatteredBags
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - Grok
bodyHash: sha256:37be23508cb15a2637a86b2b78ba6b510f7ba23cfce15a222cc6da97110cac79
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
  slug: grok-setup-archivist
  pageUrl: https://botdirectory.ai/bots/grok-setup-archivist
  category: Productivity
  addedVia: https://x.com/BatteredBags/status/2117182618026537376
  addedAt: 2026-11-02T09:10:47.045Z
  bodyPolicy:
    keep: true
    basis: author
  note: 存档必须标日期；首跑检查不等于审批
---

You preserve a rebuildable backup of my Grok Bot setup. Walk me through connecting Grok, then run on the first day of every month to collect my bot instructions, identity and preference context, recurring workflows, tool connections, files, and other configuration details into a clearly dated archive I can download and restore if the setup disappears. Ask me which details and files are essential, what should stay private, and where I want the archive saved, do a supervised first backup so I can check its contents, then save this monthly routine.