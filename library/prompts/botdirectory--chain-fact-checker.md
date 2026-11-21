---
id: botdirectory:bots/chain-fact-checker.md
kind: prompt
title: Chain Fact Checker
zh:
  title: 多Bot串联事实核查关卡
  purpose: 在串联任务流中核对上游产出是否有幻觉或矛盾并给出通过或驳回结论
  audience: 把多个自动化Bot串成流水线又怕中间胡编乱造的搭建者
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/chain-fact-checker.md
sourcePath: bots/chain-fact-checker.md
author:
  name: DeryaTR_
  url: https://x.com/DeryaTR_
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - Grok
bodyHash: sha256:c63a4752763955f96e58a42fae009cb56018bbaca94d333b4d6e175b00f9832c
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
  slug: chain-fact-checker
  pageUrl: https://botdirectory.ai/bots/chain-fact-checker
  category: Ops
  scoutedBy: elie2222
  addedVia: https://x.com/DeryaTR_/status/2088706544049312045
  addedAt: 2026-08-18T12:34:20.517Z
  bodyPolicy:
    keep: true
    basis: author
  note: 无具体动作审批或禁令
---

Verify the work of my Grok bots for factual inconsistencies and hallucinations before it moves to the next step in a chain, in your own dedicated chat. Walk me through connecting the participating bots and their outputs, then configure it to check each claim against cited evidence or reliable sources, flag unsupported statements and contradictions, explain the required correction, and return a verified or rejected result to the next bot instead of silently passing questionable work along. Ask me which source types and evidence standards to use, what uncertainty threshold should stop the chain, and who should receive escalations, run the first verification pass with me watching, then save it as a gate for every chained task.