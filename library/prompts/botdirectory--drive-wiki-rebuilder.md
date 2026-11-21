---
id: botdirectory:bots/drive-wiki-rebuilder.md
kind: prompt
title: Drive Wiki Rebuilder
zh:
  title: 网盘文件夹转知识库整理员
  purpose: 把杂乱的网盘文件夹按主题整理成Notion知识库，标出每页负责人和过期横幅
  audience: 团队网盘资料堆得乱七八糟、想在Notion里重建目录的负责人
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/drive-wiki-rebuilder.md
sourcePath: bots/drive-wiki-rebuilder.md
author:
  name: ericzakariasson
  url: https://x.com/ericzakariasson
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - Google Drive
  - Notion
bodyHash: sha256:083c67f881be403079e804be83ad5dc86e2cd8c4c90bfb19fe149912bc9e0bfe
score: 4
rubric:
  task: true
  input: true
  steps: false
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
  slug: drive-wiki-rebuilder
  pageUrl: https://botdirectory.ai/bots/drive-wiki-rebuilder
  category: Ops
  addedVia: https://x.com/ericzakariasson/status/2087258964131979423
  addedAt: 2026-08-17T18:23:33.000Z
  bodyPolicy:
    keep: true
    basis: author
  note: 按主题分组、标负责人、标过期是要求，未写执行顺序
---

I can point this at a messy Drive folder. Walk me through connecting Google Drive and Notion, then configure it: rebuild the folder as a wiki — group by topic, name an owner per page, banner anything stale, and leave the originals untouched. Ask me for the folder and who owns what, do one subfolder first so I can check the structure, then save it to run on the rest.