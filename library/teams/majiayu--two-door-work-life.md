---
id: majiayu:packs/two-door-work-life.md
kind: team
title: Work + Life two-door
zh:
  title: 公私双收件箱
  purpose: 把工作和私事分到两个助手收件箱，工作邮箱只接在工作那边。
  audience: 想把项目消息和家里待办分开管的创业者
source: majiayu000/awesome-grok-bot
sourceUrl: https://github.com/majiayu000/awesome-grok-bot/blob/34ae6ed87f6d1af227c29fa41795014fd9db35d7/packs/two-door-work-life.md
sourcePath: packs/two-door-work-life.md
author:
  name: majiayu000
  url: https://github.com/majiayu000
license: CC0-1.0
fetchedAt: 2026-11-21T06:44:43Z
changes: 原文件全文收录，一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
bodyHash: sha256:fcaed30e7acfb8d46142103a2c8071bc610fc6e2f1748be52bcf772bed971351
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
  flag: false
  rules: []
  hits: []
extra:
  note: 两扇入口和各自试跑并列，无结果硬核对项
---

# Pack: Work + Life two-door

One share installs one bot. Tyler publishes two doors. Import both, then reconnect tools on **your** account. Clones start empty.

| Door | Import | Job |
| --- | --- | --- |
| [Work](https://x.ai/bot/vOipeiu0AZ7CuC5ynw5h0) | `templates/work` | Standing work inbox and work rooms |
| [Life](https://x.ai/bot/6I-yjMRU1BmiYNfZgWXBK) | `templates/life` | Standing life inbox and life rooms |

## Assemble

1. Import Work. Run its first safe task (list connectors, send nothing).
2. Import Life. Run its first safe task (list rooms, spawn nobody).
3. Point each door at the other in chat once: work matters go to Work, life matters go to Life.
4. Reconnect work tools on Work only (mail, calendar, Slack). Reconnect life tools on Life only.
5. Do not enable routines until both first tasks look right.

## Why a pack

The share format cannot express a roster. If you only import one door, the other lane has nowhere to go.

Quota: two of 50 bots. They share one computer.