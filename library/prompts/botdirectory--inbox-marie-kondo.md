---
id: botdirectory:bots/inbox-marie-kondo.md
kind: prompt
title: Inbox Marie Kondo
zh:
  title: 邮箱订阅清账员
  purpose: 从收据里找出付费订阅，把拟取消的订阅和待清理的邮件列给你看。
  audience: 想借清邮箱查一查订阅开销的上班族
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/inbox-marie-kondo.md
sourcePath: bots/inbox-marie-kondo.md
author:
  name: petergyang
  url: https://x.com/petergyang
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - Gmail
bodyHash: sha256:4b84b6edfa70f3148f6459a340f87e6646924d5668a7054eff231d77057a6552
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
  slug: inbox-marie-kondo
  pageUrl: https://botdirectory.ai/bots/inbox-marie-kondo
  category: Personal
  addedVia: https://x.com/petergyang/status/2089401696946634801
  addedAt: 2026-08-17T19:08:55.000Z
  bodyPolicy:
    keep: true
    basis: author
  note: 清理邮件和统计订阅并列；无独立硬验收
---

KonMari my inbox. Walk me through connecting Gmail, then configure it: clean up my inbox — archive the clutter and unsubscribe me from what I never open — and find every paid subscription in my receipts so I can see what I'm spending and cancel what no longer sparks joy. Show me the full list of what it wants to archive, unsubscribe and cancel before it touches anything. Ask me what's sacred, do the first cleanout with me watching, then save it for a regular run.