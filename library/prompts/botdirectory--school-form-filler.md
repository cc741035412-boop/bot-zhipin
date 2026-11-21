---
id: botdirectory:bots/school-form-filler.md
kind: prompt
title: School Form Filler
zh:
  title: 入学表格代填员
  purpose: 照去年的表填好今年的学校或营地表格，只把变动项和签名留给你。
  audience: 每年要给孩子重填报名表的家长
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/school-form-filler.md
sourcePath: bots/school-form-filler.md
author:
  name: ericzakariasson
  url: https://x.com/ericzakariasson
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - Google Drive
  - Gmail
bodyHash: sha256:ceb6c28dbbf14fc1d2531fb9bfb26fb3868d0c341c5b1d3cc79e791db57ea668
score: 5
rubric:
  task: true
  input: true
  steps: true
  acceptance: true
  approval: true
cnFit:
  value: 一般
  blocked:
    - Gmail
    - Google Drive
needsReview:
  flag: false
  rules: []
  hits: []
extra:
  slug: school-form-filler
  pageUrl: https://botdirectory.ai/bots/school-form-filler
  category: Personal
  addedVia: https://x.com/ericzakariasson/status/2087259022172840124
  addedAt: 2026-08-17T18:23:33.000Z
  bodyPolicy:
    keep: true
    basis: author
  note: 只就变更字段和签名打扰用户
---

Handle school and camp paperwork. Walk me through connecting Google Drive and Gmail, then configure it: when a new form lands, fill it from last year's PDFs — same kids, same doctors, same emergency contacts — and ping me only for the parts that changed and the signature. Nothing is submitted without me. Ask me where last year's forms live, fill one current form for me to check, then save it.