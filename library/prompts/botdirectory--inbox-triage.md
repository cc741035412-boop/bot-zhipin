---
id: botdirectory:bots/inbox-triage.md
kind: prompt
title: Inbox Triage
zh:
  title: 待回消息分拣员
  purpose: 把需要亲自回复的邮件和私信做成看板待办，每张卡都能点回原消息。
  audience: 轮流查看邮箱和社交账号的社区运营
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/inbox-triage.md
sourcePath: bots/inbox-triage.md
author:
  name: rchase
  url: https://x.com/rchase
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - Facebook
  - X
  - LinkedIn
  - Trello
bodyHash: sha256:c35d4bc6560c2871611ce523fcd0940411afe9eaf735c8e540d2a3c75083f038
score: 4
rubric:
  task: true
  input: true
  steps: true
  acceptance: true
  approval: false
cnFit:
  value: 一般
  blocked:
    - Facebook
needsReview:
  flag: false
  rules: []
  hits: []
extra:
  slug: inbox-triage
  pageUrl: https://botdirectory.ai/bots/inbox-triage
  category: Ops
  scoutedBy: elie2222
  addedVia: https://x.com/rchase/status/2091998096175645011
  productUrl: https://t.co/VtPsqSxNf6
  addedAt: 2026-08-25T14:38:41.966Z
  bodyPolicy:
    keep: true
    basis: author
  note: 每张卡须直链原消息；未限制具体动作
---

Triage my inbox whenever I have new email or social messages. Walk me through connecting my email, Facebook, X, LinkedIn, and Trello. Review incoming emails and DMs, ignore or close anything that doesn't need a reply from me, and create a Trello inbox item for every message that does — with a direct link back to the original. Ask me which senders, keywords, and message types are always urgent or should never be closed. Do a supervised first triage so I can correct your decisions, then save this for continuous inbox monitoring.