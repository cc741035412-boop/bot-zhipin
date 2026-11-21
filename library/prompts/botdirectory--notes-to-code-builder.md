---
id: botdirectory:bots/notes-to-code-builder.md
kind: prompt
title: Notes-to-Code Builder
zh:
  title: 需求笔记转原型
  purpose: 把选中的需求笔记写成可运行的代码，配上项目文件和运行、测试说明。
  audience: 想把需求笔记做成可测原型的产品经理
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/notes-to-code-builder.md
sourcePath: bots/notes-to-code-builder.md
author:
  name: LBallz77283
  url: https://x.com/LBallz77283
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - Notes app
bodyHash: sha256:6c297063d6ccbcd8d12f7c6a7ca4a8a9c5fdb48bbc8403470045d7d2dfb7d77d
score: 4
rubric:
  task: true
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
  slug: notes-to-code-builder
  pageUrl: https://botdirectory.ai/bots/notes-to-code-builder
  category: Productivity
  addedVia: https://x.com/LBallz77283/status/2094289900623245404
  addedAt: 2026-08-31T05:03:19.605Z
  bodyPolicy:
    keep: true
    basis: author
  note: 只要求可运行并说明测试，未定具体硬标准
---

Set up a new bot for me I can trigger whenever I have a note to turn into software. Walk me through connecting my notes app, then configure it: read the note I select, infer the intended behavior, turn it into working code, create the necessary files, and explain how to run and test the result. Ask me which programming language, framework, coding style, project structure, and runtime environment to use, have me review and approve the generated code before it changes any files or runs commands, do a supervised first conversion with me watching, then save it.