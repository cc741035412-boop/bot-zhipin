---
id: botdirectory:bots/support-ticket-fixer.md
kind: prompt
title: Support Ticket Fixer
zh:
  title: 报错工单修复员
  purpose: 对照日志和代码判断客户报错是否属于缺陷，备好修复草稿和给客户的回信。
  audience: 收到报错后要同时跟代码和客户的技术支持
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/support-ticket-fixer.md
sourcePath: bots/support-ticket-fixer.md
author:
  name: euboid
  url: https://x.com/euboid
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - Ferndesk
  - Axiom
  - GitHub
  - Infisical
  - Codex
bodyHash: sha256:f61c1930d8f378b39be91a1faac91d250b864bfc4a390c7984bcd9ee906aceec
score: 4
rubric:
  task: false
  input: true
  steps: true
  acceptance: true
  approval: true
cnFit:
  value: 好
  blocked: []
needsReview:
  flag: false
  rules: []
  hits: []
extra:
  slug: support-ticket-fixer
  pageUrl: https://botdirectory.ai/bots/support-ticket-fixer
  category: Success
  scoutedBy: elie2222
  addedVia: https://x.com/euboid/status/2089291320271482895
  addedAt: 2026-08-18T07:50:09.000Z
  bodyPolicy:
    keep: true
    basis: author
  note: 拉取请求和客户答复是两件交付物
---

Run when a support ticket arrives, in your own dedicated chat. Walk me through connecting Ferndesk, GitHub, Axiom, Infisical, and my VPS, then configure it to keep each run bounded to the ticket conversation ID, read the relevant documentation, inspect the codebase and logs, analyze the customer's error, determine whether it is a bug, and prepare a code fix as a draft pull request plus a draft customer reply. Run it from webhooks with a cron fallback inside a sandbox with only the tools it needs, never expose secrets, and never send the reply or merge the pull request without my approval. Ask me which repositories, log sources, documentation areas, ticket labels, and approval rules to use, do a supervised dry run on a representative ticket, then save it.