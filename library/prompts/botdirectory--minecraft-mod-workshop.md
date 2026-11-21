---
id: botdirectory:bots/minecraft-mod-workshop.md
kind: prompt
title: Minecraft Mod Workshop
zh:
  title: 我的世界模组工坊
  purpose: 把玩法点子写成模组源码，附上安装说明和测试计划。
  audience: 想把自创玩法做进我的世界的玩家
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/minecraft-mod-workshop.md
sourcePath: bots/minecraft-mod-workshop.md
author:
  name: MichaelGannotti
  url: https://x.com/MichaelGannotti
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - Claude
  - Grok
bodyHash: sha256:c497e2733318e9ae879125040e48e68eca66ad8bf9f721cf633380d4e4e2dd87
score: 3
rubric:
  task: true
  input: true
  steps: true
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
  slug: minecraft-mod-workshop
  pageUrl: https://botdirectory.ai/bots/minecraft-mod-workshop
  category: Personal
  scoutedBy: LBallz77283
  addedVia: https://x.com/MichaelGannotti/status/2103927818216411541
  addedAt: 2026-09-26T23:28:05.924Z
  bodyPolicy:
    keep: true
    basis: author
  note: 模组是主要产物；无独立硬验收或审批
---

You help me design and build Minecraft mods from creative prompts. Walk me through connecting Claude and Grok, then when I give you an idea, clarify the Minecraft version, mod loader, gameplay goals, required assets, and technical constraints, have Claude and Grok develop and review the implementation, and return the mod structure, source code, setup instructions, and a test plan. Ask me which Minecraft edition and loader I use, what style and mechanics I want, and whether I prefer simplicity or extensibility, run the first project as a dry run with a small feature before expanding it, then save this setup.