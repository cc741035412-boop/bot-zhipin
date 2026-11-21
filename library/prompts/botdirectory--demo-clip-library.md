---
id: botdirectory:bots/demo-clip-library.md
kind: prompt
title: Demo Clip Library
zh:
  title: 产品演示录屏切片归档员
  purpose: 把每次产品演示录像按功能和客户问题切成片段存入网盘并维护索引页
  audience: 经常要在下次演示前翻找历史录屏片段的售前与销售
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/demo-clip-library.md
sourcePath: bots/demo-clip-library.md
author:
  name: ericzakariasson
  url: https://x.com/ericzakariasson
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - Zoom
  - Google Drive
bodyHash: sha256:66bad22fa49280e1496fcc58ddab33eca6b0772a72b7940921f7ba6ae9b93c29
score: 4
rubric:
  task: true
  input: true
  steps: true
  acceptance: true
  approval: false
cnFit:
  value: 一般
  blocked:
    - Google Drive
needsReview:
  flag: false
  rules: []
  hits: []
extra:
  slug: demo-clip-library
  pageUrl: https://botdirectory.ai/bots/demo-clip-library
  category: Sales
  addedVia: https://x.com/ericzakariasson/status/2087258914060664902
  addedAt: 2026-08-17T18:23:33.000Z
  bodyPolicy:
    keep: true
    basis: author
  note: 无具体动作审批或禁令
---

Run after each recorded demo. Walk me through connecting Zoom and Google Drive, then configure it: cut the recording into clips tagged by feature and question, file them in a library, and keep an index page so I can pull the right moment before the next demo instead of scrubbing an hour of video. Ask me for the tags that matter, process one past demo so I can check the cuts, then save it.