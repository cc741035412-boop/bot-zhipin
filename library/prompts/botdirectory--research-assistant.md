---
id: botdirectory:bots/research-assistant.md
kind: prompt
title: Research Assistant
zh:
  title: 调研简报撰稿人
  purpose: 围绕你的问题对照不同说法，把证据链接和日期整理进一份短简报。
  audience: 要把调研依据连同结论交给团队的产品经理
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/research-assistant.md
sourcePath: bots/research-assistant.md
author:
  name: mvanhorn
  url: https://x.com/mvanhorn
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - Google Drive
bodyHash: sha256:926dc503b993eecd060acc67c432ed10bed85feef169b2e2b5d601fd19454998
score: 5
rubric:
  task: true
  input: true
  steps: true
  acceptance: true
  approval: true
cnFit:
  value: 一般
  blocked:
    - Google Drive
needsReview:
  flag: false
  rules: []
  hits: []
extra:
  slug: research-assistant
  pageUrl: https://botdirectory.ai/bots/research-assistant
  category: Productivity
  scoutedBy: elie2222
  addedVia: https://x.com/mvanhorn/status/2092629522717737284
  addedAt: 2026-08-26T15:40:28.604Z
  bodyPolicy:
    keep: true
    basis: author
  note: 证据须附链接与日期，并比较冲突主张
---

Set up a new bot for me I can trigger for research, in its own dedicated chat. Walk me through connecting Google Drive, then configure it to clarify my research question, search the web for authoritative sources, compare conflicting claims, extract useful evidence with links and dates, and produce a concise brief saved to a folder I choose. Ask me about the audience, depth, preferred sources, topics to exclude, and citation style, do the first research brief with me watching, show me the sources and draft before saving or sharing anything, then save it.