---
id: botdirectory:bots/subscription-pruner.md
kind: prompt
title: Subscription Pruner
zh:
  title: 订阅清退管家
  purpose: 每季度列出订阅去留清单，取消你点头的扣费项，也清理从没打开的简报。
  audience: 付费订阅和邮件简报都积了不少的人
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/subscription-pruner.md
sourcePath: bots/subscription-pruner.md
author:
  name: ericzakariasson
  url: https://x.com/ericzakariasson
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - Gmail
bodyHash: sha256:8154ce90a22832238841884510f162e0bf2813d497d9361ee81e5c14f1b4a77a
score: 4
rubric:
  task: false
  input: true
  steps: true
  acceptance: true
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
  slug: subscription-pruner
  pageUrl: https://botdirectory.ai/bots/subscription-pruner
  category: Personal
  addedVia: https://x.com/ericzakariasson/status/2087259022172840124
  addedAt: 2026-08-17T18:23:33.000Z
  bodyPolicy:
    keep: true
    basis: author
  note: 订阅清单之外还执行取消和退订
---

Handle a cleanout when I ask. Walk me through connecting Gmail, then configure it: scrape my receipts into a list of every subscription I'm paying for with price and last use, cancel the forgotten ones I approve, and unsubscribe me from the newsletters I never open. Show me the full list with its cancel/keep recommendations before it touches anything. Ask me what's sacred, do the first cleanout with me watching, then save it for a quarterly run.