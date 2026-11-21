---
id: grokbotdev:content/use-cases/agent-run-directory-business.md
kind: prompt
title: Directory Business · Agent-Run
zh:
  title: 垂直导航站建站与招商组
  purpose: 分阶段搭Astro导航站，每天写一篇产品评测并交五行日报，流量达标后招商。
  audience: 想做细分品类评测导航站并靠分销与赞助变现的独立开发者
source: ZeroPointRepo/GrokBotDev
sourceUrl: https://github.com/ZeroPointRepo/GrokBotDev/blob/48fec858f3968e12cb149ad205fe4ff059d8f2d1/content/use-cases/agent-run-directory-business.md
sourcePath: content/use-cases/agent-run-directory-business.md
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
bodyHash: sha256:29ca24cc702f72d57dda2d21169c75c80cb5fa7748a89d8170f1f7fc679be6eb
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
  promptBlock: true
  provenance: curator
  inspiredBy:
    name: startupideaspod
    url: https://x.com/startupideaspod
  setupMinutes: 120
  difficulty: advanced
  autonomy: acts-with-approval
  schedule: daily
  category: marketing
  subcategory: content
  awesomeScore: 76
  replicability: "The podcast gave a six-step playbook, not one prompt, so the starter below is a curator distillation of it. To adapt: pick a niche you genuinely have taste in, keep the hard rule that outreach starts only after real traffic, and keep the roster tiny with five-line daily reports."
  status: live
  setup: |-
    1. **Pick a niche you already have taste in** — pickleball gear, board games that are good for parties, something where you can tell good from bad. The narrower, the better.
    2. **Build the site on Astro** (it's genuinely good at directories) and wire it to GitHub so agents can publish to it.
    3. **Set up a research agent.** Every day it investigates one new brand or product in the niche and writes an excellent, factual page for it as Markdown — what it is, who it's for, the standout details, and an honest verdict.
    4. **A publisher agent** takes each finished page and posts it to the site.
    5. **Rinse and repeat until you're getting thousands of visits a month.** Don't skip ahead: step 6 only works once traffic is real. Nobody gives you a deal on a site with no traffic.
    6. **Add a deals agent.** Once traffic is real, it collects referral/affiliate links for the listed brands and runs small, personalized outbound to turn listings into paid placements and sponsors.

    Then stack a niche newsletter on a subdomain that links back to the directory with your referral link — those warm readers become the sponsors you pitch. One human sets the direction and approves the work; the agents run the ball.
  note: 建站、研究、发布与拓客，不是一项交付
---

You're going to help me run a directory business — a curated website of the best {X} in a niche. Work in stages and check with me at each gate:

1. NICHE: propose 5 niches I'd have real taste in, where a "best {X}" directory could earn affiliate/referral and sponsor money. I'll pick one.
2. SITE: scaffold a fast static directory on Astro (it's great at directories), wired to GitHub, and hand me the repo.
3. RESEARCH AGENT: every day, investigate one new brand/product in the niche and write an excellent, factual directory page for it as Markdown — what it is, who it's for, standout details, and an honest verdict. Hand each finished page to the publisher.
4. PUBLISHER AGENT: take each Markdown page, add it to the site, and deploy it.
5. Repeat daily until we're getting real traffic (thousands of visits/month). Do NOT start outreach before this.
6. DEALS AGENT: once traffic is real, collect referral/affiliate links for listed brands and run small, personalized outbound to turn listings into paid placements and sponsors.

Keep the roster tiny, give each agent one job, and have each file a five-line end-of-day report: what you shipped, what's new, what's blocked.