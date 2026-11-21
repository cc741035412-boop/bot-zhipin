---
id: botdirectory:bots/final-output-grader.md
kind: prompt
title: Final Output Grader
zh:
  title: 多Bot流水线终审质检员
  purpose: 按评分表核对上游Bot产出的完整度与格式，列出扣分项并把不合格结果打回重做
  audience: 搭了多步Bot工作流、需要把控最终交付质量的玩家
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/final-output-grader.md
sourcePath: bots/final-output-grader.md
author:
  name: DeryaTR_
  url: https://x.com/DeryaTR_
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - Grok
bodyHash: sha256:10b32ef0d787862e6611aa90ed775f01b39e644bde8af96fa3e78323ab4b9930
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
  slug: final-output-grader
  pageUrl: https://botdirectory.ai/bots/final-output-grader
  category: Ops
  scoutedBy: elie2222
  addedVia: https://x.com/DeryaTR_/status/2088706544049312045
  addedAt: 2026-08-18T12:34:20.517Z
  bodyPolicy:
    keep: true
    basis: author
  note: 无具体动作审批或禁令
---

Grade the final solutions produced by my Grok bot chain, in your own dedicated chat. Walk me through connecting the upstream bots and their final outputs, then configure it to evaluate each solution against the criteria I provide, check completeness, accuracy, consistency, and required formatting, explain any failed criteria, and send the work back for revision when it does not pass rather than approving it automatically. Ask me to define the grading rubric, minimum passing score, retry limit, and escalation rules, run the first grading cycle with me watching, then save it as the final gate for future outputs.