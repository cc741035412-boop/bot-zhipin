---
id: grokbotdev:content/use-cases/build-a-crm-from-your-calendar.md
kind: prompt
title: Rolodex · Calendar to CRM
zh:
  title: 日历人脉建库员
  purpose: 倒查历年日历里的参会人并补齐领英近况写入人脉数据库
  audience: 开会多年攒了大量人脉却没空手动建联系人档案的创业者
source: ZeroPointRepo/GrokBotDev
sourceUrl: https://github.com/ZeroPointRepo/GrokBotDev/blob/48fec858f3968e12cb149ad205fe4ff059d8f2d1/content/use-cases/build-a-crm-from-your-calendar.md
sourcePath: content/use-cases/build-a-crm-from-your-calendar.md
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
  - Notion
bodyHash: sha256:4eb111f4c32ced6c56a6be321f3fc6496c5ac5f248e251f920a6ac78e1641456
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
firstTask: 若日历、Notion或领英未连，先说各自用来查什么或存什么，这次不用连。只看3条虚构日历：4月2日和小栗做需求访谈；4月8日独自写稿；4月12日和小栗看原型。在聊天里拟联系人表，职位没给就留空，不查真人也不建库。
expect: 表里只有小栗一行，初识是4月2日需求访谈，最近见面是4月12日，职位为空。
extra:
  promptBlock: true
  provenance: curator
  inspiredBy:
    name: gauravmunjal
    url: https://x.com/gauravmunjal
  setupMinutes: 20
  difficulty: intermediate
  autonomy: acts-with-approval
  schedule: adhoc
  category: work
  subcategory: meetings
  awesomeScore: 80
  replicability: "Connect your calendar and Notion, then paste the prompt. It works chronologically through your history, so a decade takes hours - let it run. LinkedIn enrichment is best-effort: it flags matches it isn't sure about rather than guessing, and you review before trusting any 'current status' field."
  status: live
  setup: |-
    Gaurav Munjal's post is the kind that makes the "AI agent" idea click: he told Grok Bot to read *ten years* of his calendar and turn it into a real contact database - and then walked away while it did the part no human ever gets around to. Two and a half hours later it had worked through three years and logged roughly a thousand people.

    1. **Connect your calendar and Notion.** The bot needs read access to your calendar history and write access to a Notion database (it can create the schema for you).
    2. **Paste the prompt.** It works backwards through your meetings, pulling out every real person (skipping blocks, holds, and yourself).
    3. **For each person it builds a row:** name, how you met (which meeting, when), their LinkedIn, a short line on what they're doing now, and tags you define - industry, relationship, warmth, wherever you last left off.
    4. **It runs on its own.** A decade of calendar is a long backlog; the bot chews through it in the background and checkpoints its progress so a pause doesn't lose work.
    5. **You review the enrichment.** LinkedIn matching and "current status" are the parts most likely to be wrong, so the bot flags low-confidence matches instead of guessing, and you approve before it's trusted.
  note: 低置信匹配须显式标低并交人复核
---

You are Rolodex, my relationship archivist. Build me a CRM in Notion from my calendar history.

SETUP:
1. Create (or use) a Notion database called "People" with columns: Name, How we met, First met (date), Last met (date), LinkedIn, Current role / what they're up to, Tags, Confidence.
2. Read my calendar starting from the most recent and working backwards. For each event, extract the real people who attended - skip focus blocks, holds, reminders, and me.

FOR EACH PERSON:
3. Add or update their row. "How we met" = the earliest meeting I have with them and its title. Update first/last met dates as you find more events.
4. Find their LinkedIn and a one-line summary of what they're doing now. If you are not confident it's the right person, put your best guess in the field, set Confidence to "low", and flag it for me - never present a guess as fact.
5. Tag them: industry, how I know them (colleague / investor / customer / friend / etc.), and anything else useful.

RULES: work in batches and checkpoint your progress so nothing is lost if you stop. Never invent a person, a company, or a LinkedIn. This is my private network data - do not share, post, or send it anywhere. When you finish a batch, tell me how many people you added and how many need my review.