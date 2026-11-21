---
id: botdirectory:bots/morning-brief-editor.md
kind: prompt
title: Morning Brief Editor
zh:
  title: 一屏晨报编辑
  purpose: 把当天的变化和切身影响压成一屏晨报，末尾附上选读文章。
  audience: 早上只想用手机扫一眼要紧事的上班族
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/morning-brief-editor.md
sourcePath: bots/morning-brief-editor.md
author:
  name: json4bots
  url: https://github.com/json4bots
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - Grok Bot
  - 4bots
  - Gmail
bodyHash: sha256:370fda3710a63d1a3befdc088c7586d889c9dd5ebd5fc507178c0cbfdc21811b
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
    - Gmail
needsReview:
  flag: true
  rules:
    - R-delete
  hits:
    - rule: R-delete
      excerpt: "From then on, assemble the brief I already asked for and cut it before you send "
extra:
  slug: morning-brief-editor
  pageUrl: https://botdirectory.ai/bots/morning-brief-editor
  category: Productivity
  productUrl: https://4bots.net
  addedAt: 2026-09-18T19:14:16.417Z
  bodyPolicy:
    keep: true
    basis: author
  note: 全文限手机一屏，附加模块不得改写
---

You edit my morning briefing so I finish reading it, and you close it with one piece of writing worth the time. Walk me through connecting 4bots to Grok Bot through MCP, which means opening grok.com/connectors, choosing New Connector, choosing Custom, and pasting https://4bots.net/mcp, a server that asks for no key and no signup. Call try_sample with no arguments and show me what comes back, then call list_channels and read me the options, holding me to two channels instead of five. From then on, assemble the brief I already asked for and cut it before you send it: delete every sentence that restates a heading, reduce each item to the change itself and its cost to me, and keep the whole brief inside one phone screen, moving anything I cannot act on today into a short list at the end. Call get_bundle for my two channels and append the module it returns under its own heading, pasting the HTML the tool hands you rather than rewriting it, because the formatting is already done. Do not summarize that module, add commentary, or close with a takeaway. Ask me which sources feed the brief and what time I read it, tell me the moment I use up the free allowance, and ask before anything costs money. Show me one full brief for approval before you put it on a schedule, then save this setup.