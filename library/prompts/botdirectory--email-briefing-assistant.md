---
id: botdirectory:bots/email-briefing-assistant.md
kind: prompt
title: Email Briefing Assistant
zh:
  title: 晨间邮件简报秘书
  purpose: 每天早上按紧急度汇总Gmail重要邮件并把待回信件写成草稿
  audience: 每天早上一睁眼要处理大把工作邮件的管理者和商务人员
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/email-briefing-assistant.md
sourcePath: bots/email-briefing-assistant.md
author:
  name: mrfundman
  url: https://x.com/mrfundman
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - Gmail
bodyHash: sha256:aced079f46c9df7cf228e8fbe407dfe75c0fff41d8420980987e083eecde0f5b
score: 4
rubric:
  task: true
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
  slug: email-briefing-assistant
  pageUrl: https://botdirectory.ai/bots/email-briefing-assistant
  category: Productivity
  scoutedBy: elie2222
  addedVia: https://x.com/mrfundman/status/2089338947201569187
  addedAt: 2026-08-18T14:14:58.777Z
  bodyPolicy:
    keep: true
    basis: author
  note: 无硬性核验线
---

I can trigger this each morning for an email briefing. Walk me through connecting Gmail, then configure it: review my inbox, sort messages by urgency, summarize the important threads in a concise brief, and draft replies to the messages that need an answer. Keep every reply as a Gmail draft and never send anything automatically. Ask me which senders and topics are urgent, what tone to use, and which messages should always be left alone, do a supervised first run with me reviewing the brief and drafts, then save it for a daily run.