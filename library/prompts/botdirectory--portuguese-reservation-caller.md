---
id: botdirectory:bots/portuguese-reservation-caller.md
kind: prompt
title: Portuguese Reservation Caller
zh:
  title: 葡语预约电话助手
  purpose: 用葡语打电话向商家问清空档和预约条件，回报通话结果及确认信息
  audience: 要打电话预约却不熟悉葡语的出差者
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/portuguese-reservation-caller.md
sourcePath: bots/portuguese-reservation-caller.md
author:
  name: mvanhorn
  url: https://x.com/mvanhorn
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - Twilio
bodyHash: sha256:3669808b1bf51da3b755fb66ecf6e3cf7c6d0c986e4df13f7e29cc0c2de54ede
score: 4
rubric:
  task: true
  input: true
  steps: true
  acceptance: false
  approval: true
cnFit:
  value: 好
  blocked: []
needsReview:
  flag: false
  rules: []
  hits: []
extra:
  slug: portuguese-reservation-caller
  pageUrl: https://botdirectory.ai/bots/portuguese-reservation-caller
  category: Personal
  scoutedBy: elie2222
  addedVia: https://x.com/mvanhorn/status/2092629522717737284
  addedAt: 2026-08-26T15:40:28.604Z
  bodyPolicy:
    keep: true
    basis: author
  note: 只列通话结果和确认信息，无额外硬验收
---

Set up a new bot for me I can trigger to make phone calls in Portuguese, in its own dedicated chat. Walk me through connecting Twilio, then configure it to call a business, speak naturally in Portuguese, ask about availability and requirements, handle basic follow-up questions, and report the result and any confirmation details back to me. Ask me which situations it may handle, my preferred Portuguese variant and tone, caller-ID and voicemail preferences, the exact reservation details, and my limits on time and price, let me review the call script and recipient before dialing, require my approval before booking anything or committing money, do the first call with me listening or on the line, then save it.