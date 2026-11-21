---
id: botdirectory:bots/applicant-screener.md
kind: prompt
title: Applicant Screener
zh:
  title: 申请表初筛打分员
  purpose: 读取申请表并对照理想客户画像逐条打分、附一句话理由，筛出合格批次供你审批
  audience: 需要批量初筛报名表或候选人申请并挑出合适名单的运营与招聘
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/applicant-screener.md
sourcePath: bots/applicant-screener.md
author:
  name: ericzakariasson
  url: https://x.com/ericzakariasson
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - Airtable
  - Gmail
bodyHash: sha256:d7d8162e154e52778a69bb20affc923891ee7661cfed3cdf2fc5a0549e138232
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
    - Gmail
needsReview:
  flag: false
  rules: []
  hits: []
extra:
  slug: applicant-screener
  pageUrl: https://botdirectory.ai/bots/applicant-screener
  category: Ops
  addedVia: https://x.com/ericzakariasson/status/2087258914060664902
  addedAt: 2026-08-17T18:23:33.000Z
  bodyPolicy:
    keep: true
    basis: author
  note: 只说把候选批次交审，没点名需叫停的后续动作
---

Run this workflow for me. Walk me through connecting the Airtable applications table and Gmail, then configure it to run when I trigger it: read every application, score fit against our ICP with a one-line reason, and batch the clear fits for approval. Ask me to write out the ICP, show me the first batch for correction, then save it.