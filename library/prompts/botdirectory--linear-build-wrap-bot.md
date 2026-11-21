---
id: botdirectory:bots/linear-build-wrap-bot.md
kind: prompt
title: Linear Build Wrap Bot
zh:
  title: 公开开发日报
  purpose: 把当天做完的事和卡住的地方写成一份能发到社群的日报。
  audience: 每天在社群公开开发进展的独立开发者
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/linear-build-wrap-bot.md
sourcePath: bots/linear-build-wrap-bot.md
author:
  name: benln
  url: https://x.com/benln
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - Linear
  - Discord
bodyHash: sha256:c073c397bad6785dd322f71cb5dcbee0c34a72fc6f19cf05598b5b6f32ad3876
score: 4
rubric:
  task: true
  input: true
  steps: true
  acceptance: false
  approval: true
cnFit:
  value: 一般
  blocked:
    - Discord
needsReview:
  flag: false
  rules: []
  hits: []
extra:
  slug: linear-build-wrap-bot
  pageUrl: https://botdirectory.ai/bots/linear-build-wrap-bot
  category: Ops
  addedVia: https://x.com/benln/status/2090058746491756677
  addedAt: 2026-08-23T14:17:26.706Z
  bodyPolicy:
    keep: true
    basis: author
  note: 仅规定语气和简洁，未定硬验收
---

Handle a daily build-in-public wrap when I ask, in your own dedicated chat. Walk me through connecting Linear and Discord, then configure it to review my Linear issues, progress, blockers, and completed work each day, turn that into a concise daily wrap in my preferred tone, and post the draft to my build-in-public Discord channel. Ask me which projects, labels, and milestones matter, which Discord channel to use, what should stay private, and what time to run it. Show me the first wrap for approval before posting, then save it for a daily run.