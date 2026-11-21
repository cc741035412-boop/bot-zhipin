---
id: majiayu:packs/casjam-product-heads.md
kind: team
title: CasJam product heads (Head + Growth + Maintainer)
zh:
  title: 产品线分工班底
  purpose: 给每条产品线配三个助手，分别管路线图、增长实验和日常维护。
  audience: 要给多款产品分派工作的独立开发者
source: majiayu000/awesome-grok-bot
sourceUrl: https://github.com/majiayu000/awesome-grok-bot/blob/34ae6ed87f6d1af227c29fa41795014fd9db35d7/packs/casjam-product-heads.md
sourcePath: packs/casjam-product-heads.md
author:
  name: majiayu000
  url: https://github.com/majiayu000
license: CC0-1.0
fetchedAt: 2026-11-21T06:44:43Z
changes: 原文件全文收录，一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
bodyHash: sha256:8e21aa8972212ae9b170a0cb9132fade3f810276ed621cb405c0c0418f2cb9b9
score: 3
rubric:
  task: false
  input: true
  steps: true
  acceptance: false
  approval: true
cnFit:
  value: 好
  blocked: []
needsReview:
  flag: true
  rules:
    - R-upload
  hits:
    - rule: R-upload
      excerpt: Brian Casel's v2 roster, from [this post](https://x.com/CasJam/status/2093762642
extra:
  note: 组织编排非单件产物，未定交付硬验收
---

# Pack: CasJam product heads (Head + Growth + Maintainer)

Brian Casel's v2 roster, from [this post](https://x.com/CasJam/status/2093762642867581359) (29 Aug 2026). There is **no** official `https://x.ai/bot/…` share in the post or the screenshot. Do not invent one. One share still equals one bot, so a roster is assembled, not imported.

Quoted v1 (Chief / Heads / Doers / Reviewers) is [here](https://x.com/CasJam/status/2090852790809620631). v2 dropped the shared bench and reviewers. Each product now owns three seats.

## What the screenshot actually is

One Grok Bot account. Folders per brand. Four brands in his case: Brian Casel, Builder Methods, Flywrite, Mimeo. Each folder has:

| Seat | Job |
| --- | --- |
| Head | Product roadmap, feature orchestration, weekly report to Chief, inbound from you and Chief |
| Growth | Pitch growth experiments, project-manage them, ship them, track, document learnings, report to Chief |
| Maintainer | Recurring chores, admin, maintenance |

Plus one portfolio **Chief** above the folders (intake, priorities, the week).

Quota math: 1 Chief + 4 × 3 = **13 bots**. That is already a quarter of the 50-bot account cap, and they all share one computer. Copy the shape, not his four brands, unless you actually run four products.

## How to assemble (nothing to Add from his post)

1. Create a new Chief, or start from the official CoS starter in [docs/official-starters.md](../docs/official-starters.md). First task is digest only. Do not send mail or change meetings.
2. For **one** product you actually own, create three new bots: Head, Growth, Maintainer. Put the job from the table in each description. Reconnect only the plugins that seat needs.
3. Point Chief at those three in chat once: Heads report weekly, Growth does not ship without Head seeing it, Maintainer does not invent work.
4. Optional imports from this catalog if a seat matches: [Fixer](https://x.ai/bot/jiF_km66YLNm5LBVJ5_Ho) as an operator, [Work](https://x.ai/bot/vOipeiu0AZ7CuC5ynw5h0) as a standing inbox. Still reconnect your own tools.
5. Do not enable routines until the first read-only task on each seat looks right. Do not import twelve random catalog rows to "fill" the org chart.

v1's Doers (builder, designer, writer, video) and Reviewers are extra bots. Add a Doer only when a Head has a named job that week. Reviewers stay gates: they do not ship.

## Why a pack

A public share copies one bot's identity, not a company. CasJam's screenshot is a layout, not a template. The useful part that travels is the three-seat-per-product rule and the cap math.