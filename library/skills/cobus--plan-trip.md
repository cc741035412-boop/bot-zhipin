---
id: cobus:skills/plan-trip/SKILL.md
kind: skill
title: Plan Trip
zh:
  title: 差旅行程排雷器
  purpose: 核对邮箱已出票单与日历冲突，比对航班酒店报价并整理成带衔接提醒的行程方案包。
  audience: 出差前要汇总机酒备选并排查日程冲突的商务人士或行政人员
source: cobusgreyling/grok-bot-templates
sourceUrl: https://github.com/cobusgreyling/grok-bot-templates/blob/4f3f28b4e6578cd227ff7f4b78ec91d15fd091b5/skills/plan-trip/SKILL.md
sourcePath: skills/plan-trip/SKILL.md
author:
  name: Cobus Greyling
  url: https://github.com/cobusgreyling
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 原文件全文收录，一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
bodyHash: sha256:2cc0bad4268e763a77e49a8b152263f137898ef813f591d2a7d7fbc0071441e3
score: 5
rubric:
  task: true
  input: true
  steps: true
  acceptance: true
  approval: true
cnFit:
  value: 一般
  blocked:
    - Gmail
    - Google Calendar
needsReview:
  flag: false
  rules: []
  hits: []
extra:
  whenToUse: |
    A trip needs a sanity-checked itinerary — flights, stays, connections, calendar collisions — and must stop before booking or paying.
  note: 报价附网址及抓取时间，缺票注明
---

# Plan Trip

Paste this into Grok Bot after a successful run:

> Save the process we just used as a skill called “Plan Trip”.

A useful skill states the six fields from [Skills and routines](https://docs.x.ai/grok-bot/skills-routines-and-automations).

## 1. When to use it

A trip needs a sanity-checked itinerary — flights, stays, connections, calendar collisions — and must stop before booking or paying.


## 2. Required inputs and access

- Destination, dates, constraints (budget band, airports, party size)
- Gmail for existing tickets, holds, or vendor mail
- Google Calendar for collisions in the travel window

## 3. Sequence of work

1. Restate dates, origin, destination, and constraints. Confirm if any are missing.
2. Search mail for tickets, holds, or hotel mail already in play. Quote confirmation numbers only from those messages.
3. Check calendar for meetings that overlap travel days.
4. Compare public flight and stay options the browser can reach. Quote prices with timestamps. Do not log into a booking site to pay.
5. Build an itinerary sanity pack covering gaps, tight connections, visa/timezone notes, collisions, and a ranked option table.

## 4. How to validate the result

No booking, cart, or payment was completed. Prices have a URL and a fetch time. Calendar was not changed. Missing tickets are listed as missing, not invented.


## 5. What to return

Itinerary pack: proposed days, option table with URLs, collisions, gaps, and a do-not-book reminder. Action log.


## 6. What requires approval

Do not book, pay, hold a card, or email a vendor. Do not change calendar events. Do not apply for visas.


Type `/` in the composer to reference a saved skill. If it does not appear, open **Settings → Plugins → Yours** and enable it for this Bot.