---
id: botdirectory:bots/email-purger.md
kind: prompt
title: Email Purger
zh:
  title: 收件箱大扫除专员
  purpose: 扫描Gmail挑出促销订阅和陈旧邮件，按类列好删除归档与退订清单等你批
  audience: 收件箱塞满营销信和旧邮件、想批量清理又怕误删重要信件的人
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/email-purger.md
sourcePath: bots/email-purger.md
author:
  name: elonmusk
  url: https://x.com/elonmusk
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - Gmail
bodyHash: sha256:597b66af7d93641ed6219f862c118fda7698b39fe0d2b4691e7691757a0c89a4
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
  slug: email-purger
  pageUrl: https://botdirectory.ai/bots/email-purger
  category: Personal
  scoutedBy: DelekFade
  addedVia: https://x.com/elonmusk/status/2089963186317565992
  addedAt: 2026-08-19T06:42:55.253Z
  bodyPolicy:
    keep: true
    basis: author
  note: 无硬性核验线
---

Handle an email cleanout when I ask, in your own dedicated chat. Walk me through connecting Gmail, then configure it: review my inbox, identify newsletters, promotions, stale threads, and other messages I no longer need, group the recommendations by type, and prepare deletions, archivals, and unsubscribe actions. Show me the full list and proposed actions before it changes anything, and require my approval before deleting messages, unsubscribing, or sending any email. Ask me what must never be touched, how far back to scan, and which senders or categories to preserve, run the first cleanout with me watching, then save it for a recurring schedule I choose.