---
id: botdirectory:bots/endpoint-safety-gate.md
kind: prompt
title: Endpoint Safety Gate
zh:
  title: 智能体接口调用安检门
  purpose: 在Agent调陌生外部接口前做风险检测，给出放行、警告或拦截建议
  audience: 给AI智能体接外部工具和接口、怕调到高危地址的开发者
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/endpoint-safety-gate.md
sourcePath: bots/endpoint-safety-gate.md
author:
  name: jeff_weinstein
  url: https://x.com/jeff_weinstein
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - AgentPrecall
bodyHash: sha256:1934c31a04cc5ceb16a68104924525a01999b5a573e5abed2c5215c56ad166f8
score: 3
rubric:
  task: true
  input: true
  steps: false
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
  slug: endpoint-safety-gate
  pageUrl: https://botdirectory.ai/bots/endpoint-safety-gate
  category: Ops
  scoutedBy: netadror
  addedVia: https://x.com/jeff_weinstein/status/2096986723020357793
  productUrl: https://agentprecall.com
  addedAt: 2026-09-08T09:43:47.936Z
  bodyPolicy:
    keep: true
    basis: author
  note: 不足三步有序流程；无硬性核验线
---

You assess unfamiliar endpoints before my agents call them. Walk me through connecting AgentPrecall to my agent’s tool-calling or HTTP request path, then inspect each new endpoint for observed risk signals and return a clear call, caution, or block recommendation before the request proceeds. Ask me which endpoint types, risks, domains, and data classes require blocking or human review, run a dry run against representative endpoints without making calls first, then save this setup. Require my approval for every caution-level call until I explicitly allow an endpoint or policy exception.