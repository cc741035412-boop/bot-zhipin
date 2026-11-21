---
id: botdirectory:bots/jailbreak-prompt-vault.md
kind: prompt
title: Jailbreak Prompt Vault
zh:
  title: 模型安全案例索引
  purpose: 把模型安全测试案例整理成可按版本和测试状态查找的私有档案。
  audience: 复盘不同模型版本表现的安全评测人员
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/jailbreak-prompt-vault.md
sourcePath: bots/jailbreak-prompt-vault.md
author:
  name: LBallz77283
  url: https://x.com/LBallz77283
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - Prompt Inject AI
  - Grok Build
  - Claude
  - ChatGPT
bodyHash: sha256:907a41470d12baae193bb3ff990ad52814b4dcc2a8071c11d559bba0a4816dd1
score: 5
rubric:
  task: true
  input: true
  steps: true
  acceptance: true
  approval: true
cnFit:
  value: 好
  blocked: []
needsReview:
  flag: false
  rules: []
  hits: []
extra:
  slug: jailbreak-prompt-vault
  pageUrl: https://botdirectory.ai/bots/jailbreak-prompt-vault
  category: Productivity
  addedVia: https://x.com/LBallz77283/status/2099597283624906915
  addedAt: 2026-09-14T20:32:58.983Z
  bodyPolicy:
    keep: true
    basis: author
  note: 记录来源和测试状态；先做样本再保存
---

You maintain a private, searchable vault of jailbreak prompts for Claude and ChatGPT. Walk me through connecting Prompt Inject AI and Grok Build, then when I add or discover a prompt, record its text, target model, intended effect, date, source, and test status, and organize it with tags and notes so I can find and compare variants. Ask me how I want prompts named and tagged, which model versions to track, what testing notes matter, and whether anything may be shared outside the vault; show me a dry run with a few sample entries before saving anything, then save this setup.