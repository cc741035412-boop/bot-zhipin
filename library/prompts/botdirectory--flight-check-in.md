---
id: botdirectory:bots/flight-check-in.md
kind: prompt
title: Flight Check-In
zh:
  title: 航班值机助手
  purpose: 从确认邮件跟踪值机时间，窗口一开就按你的座位偏好办理。
  audience: 常坐飞机且对座位有偏好的出差人
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/flight-check-in.md
sourcePath: bots/flight-check-in.md
author:
  name: ericzakariasson
  url: https://x.com/ericzakariasson
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - Gmail
bodyHash: sha256:6a6a9df5d719dbbff7c80c872c7ccda0048f8302ebe2e9e25087904087407e53
score: 3
rubric:
  task: false
  input: true
  steps: true
  acceptance: false
  approval: true
cnFit:
  value: 一般
  blocked:
    - Gmail
needsReview:
  flag: false
  rules: []
  hits: []
extra:
  slug: flight-check-in
  pageUrl: https://botdirectory.ai/bots/flight-check-in
  category: Personal
  addedVia: https://x.com/ericzakariasson/status/2087259022172840124
  addedAt: 2026-08-17T18:23:33.000Z
  bodyPolicy:
    keep: true
    basis: author
  note: 未定具体交付或硬验收，遇验证才转人
---

Watch my inbox for flight confirmations. Walk me through connecting Gmail, then configure it: track each flight's check-in window, check me in the moment it opens with my usual seat preference, and ping me only when it hits a 2FA prompt or captcha that needs a human. Ask me for my airlines, loyalty numbers and seat rules, walk through one upcoming flight together, then save it.