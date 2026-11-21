---
id: botdirectory:bots/inbox-zero-assistant.md
kind: prompt
title: Inbox Zero Assistant
zh:
  title: 邮箱清理清单
  purpose: 挑出待回邮件，把准备退订或清理的项目列给你过目。
  audience: 订阅邮件积压又怕漏回客户的运营
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/inbox-zero-assistant.md
sourcePath: bots/inbox-zero-assistant.md
author:
  name: jonathan_wilke
  url: https://x.com/jonathan_wilke
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - Gmail
bodyHash: sha256:45e545c7f43800863ab7b77a43a5c934ed01fb3d20a5791d9ef098469e723d39
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
  slug: inbox-zero-assistant
  pageUrl: https://botdirectory.ai/bots/inbox-zero-assistant
  category: Productivity
  scoutedBy: elie2222
  addedVia: https://x.com/jonathan_wilke/status/2090423866040402210
  productUrl: https://getinboxzero.com
  addedAt: 2026-08-23T14:29:29.026Z
  bodyPolicy:
    keep: true
    basis: author
  note: 清理操作多项；未写独立硬验收
---

Handle inbox zero when I ask. Walk me through connecting Gmail, then configure it: organize my inbox, identify messages that need replies, automate routine email handling, and prepare bulk-unsubscribe actions for unwanted newsletters. Show me every proposed unsubscribe, archive, deletion, or reply before it touches anything, and require my approval before sending or permanently changing messages. Ask me which senders and newsletters are sacred, what can be archived automatically, how I want messages categorized, and which replies can use drafts, do a supervised first cleanup with me watching, then save it.