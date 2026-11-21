---
id: botdirectory:bots/security-questionnaire.md
kind: prompt
title: Security Questionnaire
zh:
  title: 安全问卷起草员
  purpose: 用公开文档和往次答卷起草答案，能引出处就附上，拿不准的题标给同事。
  audience: 收到客户安全问卷的售前人员
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/security-questionnaire.md
sourcePath: bots/security-questionnaire.md
author:
  name: ericzakariasson
  url: https://x.com/ericzakariasson
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - Google Drive
  - Notion
bodyHash: sha256:ed9bab6ec4a36e1cf1cc87ef34f893d293d6afa2a0136a59bfee5e99a6878997
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
  slug: security-questionnaire
  pageUrl: https://botdirectory.ai/bots/security-questionnaire
  category: Ops
  addedVia: https://x.com/ericzakariasson/status/2087258914060664902
  addedAt: 2026-08-17T18:23:33.000Z
  bodyPolicy:
    keep: true
    basis: author
  note: 未限制提交或发送问卷
---

Help me when a questionnaire lands. Walk me through connecting Google Drive and Notion, then configure it: draft answers from our public docs and past responses, cite what it can, and flag every question that genuinely needs a human. Ask me where past questionnaires live, run it once on a real one, then save it.