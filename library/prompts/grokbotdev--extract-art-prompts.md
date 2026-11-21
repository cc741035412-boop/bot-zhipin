---
id: grokbotdev:content/use-cases/extract-art-prompts.md
kind: prompt
title: Archivist · Prompt Library
zh:
  title: 历史提示词归档员
  purpose: 分块遍历所有历史项目和对话，把写过的生图提示词按主题归类汇总成一份可搜索文档
  audience: 在几百个旧对话里散落了大量提示词想集中整理复用的创作者
source: ZeroPointRepo/GrokBotDev
sourceUrl: https://github.com/ZeroPointRepo/GrokBotDev/blob/48fec858f3968e12cb149ad205fe4ff059d8f2d1/content/use-cases/extract-art-prompts.md
sourcePath: content/use-cases/extract-art-prompts.md
author:
  name: GrokBot.dev contributors
  url: https://github.com/ZeroPointRepo/GrokBotDev
  role: curator
license: CC-BY-4.0
attribution:
  by: GrokBot.dev contributors
  repo: ZeroPointRepo/GrokBotDev
  license: CC BY 4.0
  licenseUrl: https://creativecommons.org/licenses/by/4.0/
fetchedAt: 2026-11-21T06:44:43Z
changes: 只收「## Prompt」下代码块里的提示词原文，一字未改；原页面的设置步骤和点评没有收；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
bodyHash: sha256:cdd8e649d0cfaa671d9c9247d9bfa9b698f6e74fac1aa5f6df04b7997ef762ec
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
  promptBlock: true
  provenance: curator
  inspiredBy:
    name: JulieZMcCann
    url: https://x.com/JulieZMcCann
  setupMinutes: 20
  difficulty: beginner
  autonomy: readonly
  schedule: none
  category: data
  subcategory: enrichment
  awesomeScore: 64
  replicability: "A Curator reconstruction of Julie's task. To adapt: point the bot at your own projects, tell it what to extract, and — the key lesson — tell it to work in smaller blocks and checkpoint so timeouts don't lose progress on a long job."
  status: live
  setup: |-
    1. Point the bot at all of your projects and chats — the places your prompts are buried.
    2. Tell it exactly what to pull (here: every art prompt) and how to organize it — Julie had it sort by subject into one searchable file.
    3. Tell it up front to work in **smaller blocks** and checkpoint as it goes. Julie's run timed out twice before the bot switched to smaller, more manageable chunks on its own; asking for that from the start avoids the false starts.
    4. Let it run — a job this size took ~30 hours across 557 chats; check in and re-point it if its computer needs an update mid-run.
    5. Get back one compiled, sorted, searchable library you can mine for future work.
  note: 逐条记原聊天并保留原文；未设具体审批
---

Go through all of my projects and chats and build me one searchable library of every prompt I've written.

1. Work project by project, chat by chat. Extract every prompt you find (for me: AI art prompts — the generation prompts, not the replies).
2. Work in SMALL blocks and checkpoint after each one. Do not try to hold everything at once — if a block is large, split it further. Save progress as you go so a timeout never loses work.
3. Normalize each entry: the prompt text, which project/chat it came from, and a subject tag.
4. Sort the whole set by subject and compile it into one searchable file (and tell me the total count).

Rules: extract only what's actually there — never invent or "improve" a prompt. If you hit a limit, shrink the block and continue rather than stopping. Give me a progress note after each project so I can see how far along you are.