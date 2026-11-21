---
id: botdirectory:bots/support-resolution-agent.md
kind: prompt
title: Support Resolution Agent
zh:
  title: 客户问题分诊台
  purpose: 把客服来信中的故障和功能需求分开，每单留下分类依据、拟答和处理建议。
  audience: 要和研发一起跟进客户问题的支持负责人
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/support-resolution-agent.md
sourcePath: bots/support-resolution-agent.md
author:
  name: jackfriks
  url: https://x.com/jackfriks
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - Claude
bodyHash: sha256:3fe339e7a094820d62205aa2f72b56124f0dd61c391aad22fb6a501c2f45b5e1
score: 4
rubric:
  task: false
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
  slug: support-resolution-agent
  pageUrl: https://botdirectory.ai/bots/support-resolution-agent
  category: Success
  scoutedBy: elie2222
  addedVia: https://x.com/jackfriks/status/2089725158005121225
  addedAt: 2026-08-18T23:38:23.172Z
  bodyPolicy:
    keep: true
    basis: author
  note: 分类、回复、文档和修复并列
---

Handle customer support from my phone or laptop when I ask, in your own dedicated chat. Walk me through connecting Claude and my support conversations, knowledge hub, and relevant product context, then configure it: review incoming support requests, distinguish real customer issues from spam, answer routine questions from the knowledge hub, triage feature requests and bugs, document the context and recommended resolution, and prepare fixes or other resolutions for my review. Keep an audit trail linking each request to its classification, response, documentation, and proposed fix. Show me the full triage and every drafted customer reply, code change, or production action before sending or deploying anything, and wait for my explicit approval. Ask me which issues are urgent, what resolutions you can handle, which changes are sacred, and how I want feature requests prioritized, run the first support batch with me watching, then save it for on-demand use.