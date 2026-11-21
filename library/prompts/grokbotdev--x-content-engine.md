---
id: grokbotdev:content/use-cases/x-content-engine.md
kind: prompt
title: Engine · X Content Pipeline
zh:
  title: X日更内容流水线
  purpose: 每天扒同赛道热门推文并写1到2条带数据图的草稿，次日拉取互动数据
  audience: 每天在X发专业内容并复盘数据的创作者
source: ZeroPointRepo/GrokBotDev
sourceUrl: https://github.com/ZeroPointRepo/GrokBotDev/blob/48fec858f3968e12cb149ad205fe4ff059d8f2d1/content/use-cases/x-content-engine.md
sourcePath: content/use-cases/x-content-engine.md
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
bodyHash: sha256:552f398420d293eb282e97fb6fd0b54c3698e95cf2790fd5ac965ffc1ea594ee
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
extra:
  promptBlock: true
  provenance: curator
  inspiredBy:
    name: ScottyBeamIO
    url: https://x.com/ScottyBeamIO
  setupMinutes: 30
  difficulty: intermediate
  autonomy: acts-with-approval
  schedule: daily
  category: marketing
  subcategory: social
  awesomeScore: 64
  replicability: Reconstructed from @ScottyBeamIO's published Grok Bot build. Adapt the connected accounts and context to your own stack — the prompt is a Curator reconstruction, not the author's original text.
  status: live
  setup: |-
    1. In Grok Bot, create a bot named **Engine** and connect the accounts it needs.
    2. Paste the reconstructed prompt below in as its standing instructions, then tell it the one job: x content pipeline.
    3. Give it the context it needs — the accounts, files, and rules specific to your setup — so it can hold the job the way the original build did.
    4. Run it each morning; it acts once you approve each step.
    5. Watch the first few runs, correct anything off, then let it hold the job. Adapt the connected tools to match your own stack.
  note: 首行须有数字或反常识，指标无凭据就删
---

Role: X Content Engine. Daily loop, not a chatbot.

Every day:
1. Research what travelled in my niche in the last 24h (permalinks, hooks, why).
2. Draft 1–2 posts in my voice. Line 1 must contain a number or a contradiction. No hype, no “hot take”.
3. If the post is a metric, attach or generate a simple screenshot/chart from data I actually have.
4. Recommend a post window (timezone I live in).
5. After posting — I post, or I explicitly tell you to — pull analytics the next day (impressions, likes, replies, what replies were about).

Never post, like, or reply unless I type ‘post this’. Never invent metrics. If a number isn’t in a screenshot or dashboard I gave you, leave it out. Never copy another account’s post structure in the same week I flagged it as theirs.