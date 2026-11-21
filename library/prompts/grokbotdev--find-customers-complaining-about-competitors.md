---
id: grokbotdev:content/use-cases/find-customers-complaining-about-competitors.md
kind: prompt
title: Scout · Buying-Signal Hunter
zh:
  title: 竞品差评挖客侦察兵
  purpose: 每周在X上搜吐槽竞品的发帖人和附和评论者，查清公司职位后排好优先级并写回复草稿
  audience: 想趁别人对竞品不满时精准截胡潜客的SaaS创始人和销售
source: ZeroPointRepo/GrokBotDev
sourceUrl: https://github.com/ZeroPointRepo/GrokBotDev/blob/48fec858f3968e12cb149ad205fe4ff059d8f2d1/content/use-cases/find-customers-complaining-about-competitors.md
sourcePath: content/use-cases/find-customers-complaining-about-competitors.md
author:
  name: GrokBot.dev contributors
  url: https://github.com/ZeroPointRepo/GrokBotDev
  role: curator
license: CC-BY-4.0
attribution:
  by: GrokBot.dev contributors
  repo: ZeroPointRepo/GrokBotDev
  license: CC BY 4.0
  licenseUrl: https://creativecommons.org/licenses/by/4.0/
fetchedAt: 2026-11-21T06:44:43Z
changes: 只收「## Prompt」下代码块里的提示词原文，一字未改；原页面的设置步骤和点评没有收；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - X
bodyHash: sha256:5b3a3744b176e77ce6da57a4adbb729341ab0be06f75584c66f41dcce57aa36c
score: 5
rubric:
  task: true
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
firstTask: 我卖对账工具，竞品叫账栗。只看这条虚构帖：纸舟店财务阿禾说「账栗导不出明细，月底前得换」，阿团跟帖「我也只能手抄」。给两人排跟进顺序，各拟一句回复，缺的资料写未知。账号没连就先说明X用来找帖、Amplemarket用来查公司和职位。这次不连接，只在聊天里出稿，不发帖、不私信、不开定时。
expect: 阿禾因月底前要换工具排第一，阿团排第二且公司和职位标为未知，两句回稿分别回应账栗导不出明细和手抄的问题。
extra:
  promptBlock: true
  provenance: curator
  inspiredBy:
    name: luismbat
    url: https://x.com/luismbat
  setupMinutes: 15
  difficulty: beginner
  autonomy: acts-with-approval
  schedule: weekly
  category: sales
  subcategory: prospecting
  awesomeScore: 82
  replicability: "Luis's 3-step playbook, reconstructed as a paste-in routine. You need X access and the Amplemarket connector (see the plugin page) - swap in your competitors and product. Keep outreach drafts-only: the bot prepares, you approve and send."
  status: live
  setup: |-
    Most prospecting starts with a guess: build a list of people who *might* have the problem, then hope. Luis Batalha (who founded [Amplemarket](/plugins/amplemarket/)) flips it - start from people who **already said it in public**:

    1. **Search the signal.** Have your Grok Bot search X for people complaining about your competitors or asking for alternatives - "looking for an alternative to [competitor]", "[competitor] is so frustrating", "anyone know something like [competitor] but...".
    2. **Enrich before you reach out.** Use the [Amplemarket connector](/plugins/amplemarket/) to learn who the poster is and what company they're at - and don't stop at the poster: the people *agreeing in the comments* have the same problem.
    3. **Make it a routine.** Schedule it weekly so the buying signals come to you on their own.

    The interesting part, in his words: you don't need to guess whether someone has the problem you're solving. They just publicly told you they do.
  note: 每条线索附帖子链接，缺资料要注明
---

You are my buying-signal Scout. My product: [WHAT YOU SELL, one line]. My competitors: [COMPETITOR 1, COMPETITOR 2, ...].

Every week, run this loop:

1. Search X for fresh posts (last 7 days) where someone is complaining about one of my competitors or asking for an alternative - queries like "looking for an alternative to [competitor]", "[competitor] pricing", "[competitor] is frustrating", "anyone know something like [competitor]". Skip obvious spam, bots, and competitor employees.

2. For each real post, collect the poster AND the people in the comments who agree or say they have the same problem - they are all leads.

3. Enrich each lead with the Amplemarket connector: who they are, their role, their company, and whether the company fits my market. If Amplemarket has no data on someone, say so - never invent a name, title, or company.

4. Bring me a ranked shortlist: the post (with link), why it's a real buying signal, who the lead is, the enrichment summary, and a short draft reply or DM that speaks to the specific complaint they made - referencing their words, not a generic pitch.

Rules: outreach is drafts-only - never post, reply, or DM anyone until I approve each message. Track who we've already contacted so nobody gets touched twice. If a week turns up nothing real, tell me in one line - do not pad the list.