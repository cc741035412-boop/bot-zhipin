---
id: botdirectory:bots/docs-self-serve-assistant.md
kind: prompt
title: Docs Self-Serve Assistant
zh:
  title: 帮助文档自助答疑客服
  purpose: 查最新帮助文档并附链接回答客户提问，遇到文档缺失或拿不准的问题直接转人工工单
  audience: 想用产品文档先挡住常见咨询、减少重复客服工单的团队
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/docs-self-serve-assistant.md
sourcePath: bots/docs-self-serve-assistant.md
author:
  name: euboid
  url: https://x.com/euboid
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - Ferndesk
bodyHash: sha256:ab70185f4160a69343f0ed1a1336e8bb54ed395e3434f9718688900c876a8563
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
  slug: docs-self-serve-assistant
  pageUrl: https://botdirectory.ai/bots/docs-self-serve-assistant
  category: Success
  scoutedBy: elie2222
  addedVia: https://x.com/euboid/status/2089291320271482895
  addedAt: 2026-08-18T07:50:09.000Z
  bodyPolicy:
    keep: true
    basis: author
  note: 答复附文档依据；不确定则转工单而不是猜测
---

Answer customer questions from our current documentation and reduce avoidable support tickets. Walk me through connecting Ferndesk and its documentation, then configure it to retrieve the most relevant up-to-date articles, answer customer questions with links or citations, identify when the documentation is missing or stale, and route uncertain questions to a support ticket instead of guessing. Ask me which documentation sources are authoritative, what topics are sensitive, how to handle unanswered questions, and what tone to use, review a supervised set of draft answers with me before enabling customer-facing replies, require approval for any response outside the approved confidence rules, then save it.