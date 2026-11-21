---
id: botdirectory:bots/vfd-troubleshooter.md
kind: prompt
title: VFD Troubleshooter
zh:
  title: 变频器故障排查单
  purpose: 对照厂家手册解释面板上的故障码，按顺序列出可能原因和待查项目。
  audience: 变频器报警后要安排检修的设备主管
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/vfd-troubleshooter.md
sourcePath: bots/vfd-troubleshooter.md
author:
  name: APompliano
  url: https://x.com/APompliano
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - Grok
bodyHash: sha256:39c07f382194d077560f9cb846407677e5a2a88a4dbb5efc0c4e691dc5759fad
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
  slug: vfd-troubleshooter
  pageUrl: https://botdirectory.ai/bots/vfd-troubleshooter
  category: Ops
  scoutedBy: elie2222
  addedVia: https://x.com/APompliano/status/2089478124283052078
  addedAt: 2026-08-18T15:40:27.203Z
  bodyPolicy:
    keep: true
    basis: author
  note: 安全提醒未明确规定机器人具体禁行事项
---

Help me when an industrial drive or VFD shows a fault. Walk me through connecting Grok and letting me upload photos of the display, wiring, and manual or model information, then configure it: interpret the displayed codes and status indicators, compare them with the manufacturer's documentation, identify the most likely cause, and give me a safe, ordered diagnostic checklist with the required voltage and control-signal checks. Ask me for the drive model, motor type, symptoms, recent changes, wiring details, and what test equipment I have, do a supervised first diagnosis, remind me to isolate power and defer hazardous electrical work to a qualified technician, then save it.