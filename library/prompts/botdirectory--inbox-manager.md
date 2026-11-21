---
id: botdirectory:bots/inbox-manager.md
kind: prompt
title: Inbox Manager
zh:
  title: 收件箱值班员
  purpose: 把新邮件按轻重缓急标好，摘出要紧事并拟好常规请求的回复。
  audience: 每天要从大量来信中挑出要紧事的运营负责人
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/inbox-manager.md
sourcePath: bots/inbox-manager.md
author:
  name: mvanhorn
  url: https://x.com/mvanhorn
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - Gmail
bodyHash: sha256:b9ef91888a66ea83cf0af13da07cfb9ec987b872fa6aea17a397b295bb47720f
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
  slug: inbox-manager
  pageUrl: https://botdirectory.ai/bots/inbox-manager
  category: Productivity
  scoutedBy: elie2222
  addedVia: https://x.com/mvanhorn/status/2092629522717737284
  addedAt: 2026-08-26T15:40:28.604Z
  bodyPolicy:
    keep: true
    basis: author
  note: 标签、摘要、回复等并列；没有硬验收
---

Set up a new bot for me I can trigger to manage my inbox, in its own dedicated chat. Walk me through connecting Gmail, then configure it to scan new messages, label and prioritize them, summarize the ones that need my attention, draft replies for routine requests, and identify newsletters or low-value mail I can unsubscribe from. Ask me about my priority senders, labels, response style, and what is sacred, show me the proposed actions before it sends, archives, deletes, or unsubscribes from anything, do the first inbox pass with me watching, then save it.