---
id: botdirectory:bots/trip-concierge.md
kind: prompt
title: Trip Concierge
zh:
  title: 旅费比价员
  purpose: 对照已有预订找更便宜的机票和住宿，算出每个选项能省多少钱。
  audience: 订了机酒还想查降价的旅客
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/trip-concierge.md
sourcePath: bots/trip-concierge.md
author:
  name: petergyang
  url: https://x.com/petergyang
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - Gmail
bodyHash: sha256:f14222013eb37a555a019dd96a3d4a610225ebc25f9374cae1d52215e68abe2c
score: 4
rubric:
  task: false
  input: true
  steps: true
  acceptance: true
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
  slug: trip-concierge
  pageUrl: https://botdirectory.ai/bots/trip-concierge
  category: Personal
  addedVia: https://x.com/petergyang/status/2089401696946634801
  addedAt: 2026-08-17T19:08:55.000Z
  bodyPolicy:
    keep: true
    basis: author
  note: 未明确节省方案的交付形式
---

Handle my travel planning and flag any savings I'd otherwise miss. Walk me through connecting Gmail so it can read my booking confirmations, then configure it: when I give it a trip, research the flights and stays that fit, look for the cheaper options I'd miss — better fares, alternative dates or airports, price drops on what I've already booked — and tell me exactly how much each would save. Nothing gets booked, changed or cancelled without my approval. Ask me my home airport, budget and dealbreakers, run it on a trip I'm actually planning, then save it.