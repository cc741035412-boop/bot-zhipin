---
id: majiayu:packs/chief-of-staff.md
kind: team
title: Chief of Staff + operator + specialists
zh:
  title: 总协调与专岗小组
  purpose: 先配一个总协调出摘要，再给最占时间的那项工作配个专岗。
  audience: 每天忙着在几个助手之间传话的小团队负责人
source: majiayu000/awesome-grok-bot
sourceUrl: https://github.com/majiayu000/awesome-grok-bot/blob/34ae6ed87f6d1af227c29fa41795014fd9db35d7/packs/chief-of-staff.md
sourcePath: packs/chief-of-staff.md
author:
  name: majiayu000
  url: https://github.com/majiayu000
license: CC0-1.0
fetchedAt: 2026-11-21T06:44:43Z
changes: 原文件全文收录，一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
bodyHash: sha256:68d432202da10cf857b6bfa167c680198863de162fb5d242591fa1d98e586a77
score: 1
rubric:
  task: false
  input: false
  steps: false
  acceptance: false
  approval: true
cnFit:
  value: 好
  blocked: []
needsReview:
  flag: true
  rules:
    - R-delete
    - R-pay
  hits:
    - rule: R-pay
      excerpt: "- Read, then ask, before send / pay / delete / production change"
    - rule: R-delete
      excerpt: "- Read, then ask, before send / pay / delete / production change"
extra:
  note: 多角色编排无单品、具体数据源、三步或硬验收
---

# Pack: Chief of Staff + operator + specialists

xAI's documented pattern: a chief of staff on top, one specialist per lane, work in parallel so you are not the middleman. Source: [Use cases](https://docs.x.ai/grok-bot/use-cases) and [Introducing Grok Bot](https://x.ai/news/introducing-grok-bot).

One share cannot install this roster.

## Pieces

| Seat | How to get it | First move |
| --- | --- | --- |
| Chief of Staff | Create a new bot from the official starter. Not a share link. | Digest only. Do not send or change meetings. |
| [Fixer](https://x.ai/bot/jiF_km66YLNm5LBVJ5_Ho) | Community share (`templates/fixer`) | Restate job and approval boundary. Do not message people. |
| Specialists | Official starters in [docs/official-starters.md](../docs/official-starters.md), or a factory like [dr eggbot](https://x.ai/bot/93gOz3op1UQdBdbekQFLK) | One safe task each, then maybe a routine |

Start with CoS + one specialist in the lane that eats your week. Add Fixer when the CoS needs an operator who actually does the work. Do not import a pile of bots on day one (50-bot cap, shared computer).

## Boundaries that must stay in every description

- Read, then ask, before send / pay / delete / production change.
- Mark what was useful and what was noise so the digest stays small.
- Routines wait until retries and failure cases are defined.

Chinese playbook for the same idea (not a native-share catalog): [KinGao294/grok-bot-orange-book](https://github.com/KinGao294/grok-bot-orange-book).