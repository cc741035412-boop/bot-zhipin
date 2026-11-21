---
id: botdirectory:bots/what-did-we-promise.md
kind: prompt
title: What Did We Promise
zh:
  title: 客户承诺核对单
  purpose: 把合同和客户沟通记录对成一页，分清哪些是承诺、哪些是暗示、哪里说法不一。
  audience: 接手老客户前要核实交付范围的客户经理
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/what-did-we-promise.md
sourcePath: bots/what-did-we-promise.md
author:
  name: ericzakariasson
  url: https://x.com/ericzakariasson
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - Slack
  - Salesforce
  - Google Drive
bodyHash: sha256:e5015df70cff7db5d7633f2362e9dff76a20f5c22b6917fa508cef529f8524e2
score: 3
rubric:
  task: true
  input: true
  steps: false
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
  slug: what-did-we-promise
  pageUrl: https://botdirectory.ai/bots/what-did-we-promise
  category: Success
  addedVia: https://x.com/ericzakariasson/status/2087258914060664902
  addedAt: 2026-08-17T18:23:33.000Z
  bodyPolicy:
    keep: true
    basis: author
  note: 读取多处后写简报，未定三步或动作审批
---

Get the truth on any account when I ask. Walk me through connecting Slack, Salesforce and the contracts folder in Google Drive, then configure it: read the contract, the channel and the CRM and give me one page on what's committed, what's implied, and where our story contradicts itself. Ask me an account I know well to test on, then save it.