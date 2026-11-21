---
id: botdirectory:bots/research-plugin-builder.md
kind: prompt
title: Research Plugin Builder
zh:
  title: 调研插件开发员
  purpose: 按你的调研流程写插件，附上配置说明和用实际任务样例试跑的结果。
  audience: 想给 Grok 或 Perplexity 加调研工具的学员
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/research-plugin-builder.md
sourcePath: bots/research-plugin-builder.md
author:
  name: LBallz77283
  url: https://x.com/LBallz77283
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - Perplexity
  - Grok
bodyHash: sha256:7e35571e968ec7079245132ac56933bd8794a4be5f6887e5dcac63196c8ecf4b
score: 3
rubric:
  task: false
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
  slug: research-plugin-builder
  pageUrl: https://botdirectory.ai/bots/research-plugin-builder
  category: Productivity
  addedVia: https://x.com/LBallz77283/status/2094085200439296186
  addedAt: 2026-08-30T15:29:53.283Z
  bodyPolicy:
    keep: true
    basis: author
  note: 代码与说明并列，没写测试通过等验收条件
---

Set up a new bot for me I can trigger to build research plugins for Perplexity or Grok. Walk me through connecting Perplexity and Grok, then ask which platform the plugin targets, what research workflow it should support, which data sources or APIs it may use, what language and output format I want, and what permissions are allowed. Generate the plugin code, explain the setup, run it in a sandbox with a representative research task, show me the files and test results, and get my approval before installing or publishing anything. Ask me what should be kept private, do the first build with me watching, then save it.