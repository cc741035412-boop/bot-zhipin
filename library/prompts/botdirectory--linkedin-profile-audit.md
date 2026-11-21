---
id: botdirectory:bots/linkedin-profile-audit.md
kind: prompt
title: LinkedIn Profile Audit
zh:
  title: 领英主页改稿员
  purpose: 拿近期工作记录对照旧主页，给出标题、自我介绍和经历的新旧对照稿。
  audience: 换了工作重点还没更新领英主页的产品经理
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/linkedin-profile-audit.md
sourcePath: bots/linkedin-profile-audit.md
author:
  name: ericzakariasson
  url: https://x.com/ericzakariasson
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - LinkedIn
  - Notion
  - Slack
bodyHash: sha256:ed09dd5134c05d7851449a5e63f267715d2a0fce6d2126c270eb800d65ab7f51
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
  slug: linkedin-profile-audit
  pageUrl: https://botdirectory.ai/bots/linkedin-profile-audit
  category: Marketing
  addedVia: https://x.com/ericzakariasson/status/2087258914060664902
  addedAt: 2026-08-17T18:23:33.000Z
  bodyPolicy:
    keep: true
    basis: author
  note: 新旧完整版本须并排供比对
---

Help me when my profile goes stale. Walk me through connecting my LinkedIn session, Notion and Slack, then configure it: audit my live profile against what I actually do now — pulling context from my notes and recent messages — and rewrite the headline, about section and experience bullets in my voice. Nothing publishes without my approval. Ask me who I want the profile to speak to, show me a full draft side by side with the current version, then save it.