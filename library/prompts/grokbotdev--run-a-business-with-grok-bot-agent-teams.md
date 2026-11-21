---
id: grokbotdev:content/use-cases/run-a-business-with-grok-bot-agent-teams.md
kind: prompt
title: Chief of Staff · One-Person Company
zh:
  title: 一人公司幕僚长与团队总管
  purpose: 盘点业务文档并提议三个增收岗位，先亲自跑通任务再拆出专职Bot并汇总每日简报
  audience: 想用一组Bot搭起业务班子、自己只抓审批和决策的独立创业者
source: ZeroPointRepo/GrokBotDev
sourceUrl: https://github.com/ZeroPointRepo/GrokBotDev/blob/48fec858f3968e12cb149ad205fe4ff059d8f2d1/content/use-cases/run-a-business-with-grok-bot-agent-teams.md
sourcePath: content/use-cases/run-a-business-with-grok-bot-agent-teams.md
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
  - Gmail
  - Shopify
bodyHash: sha256:157ac221b50bdbc6837dfb66f3a8c1f0f58bc4e9ef82507ae9c1fe8ae77aa7cd
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
    - Google Drive
needsReview:
  flag: false
  rules: []
  hits: []
extra:
  promptBlock: true
  provenance: curator
  inspiredBy: {}
  setupMinutes: 30
  difficulty: intermediate
  autonomy: acts-with-approval
  schedule: daily
  category: work
  subcategory: tasks
  awesomeScore: 85
  replicability: Reconstructed from Billy Howell's walkthrough with Greg Isenberg. The Day-One prompt below is a curator reconstruction of his method - adapt the business, tools and agents to your own, and keep the one-project-per-account rule and the build-execute-automate order.
  status: live
  setup: |-
    Billy Howell runs the Arlington Bagel - a local newsletter that goes to 6,000 people every week - almost entirely on a Grok Bot agent team. The whole method is built on treating the bots like a real company, and it comes down to a handful of rules:

    1. **One project per account.** All your agents share one cloud computer, so running two businesses plus your personal email in the same account causes context bleed and burns your token budget. Constraints are the feature - pick the one thing this account works on.
    2. **Start with a Chief of Staff (think COO), and audit before acting.** Connect your existing business docs (Notion, Gmail, Slack) and have it take stock of the business, then propose the **top three agents to create first to drive revenue** - roles, goals, and metrics. You approve; it doesn't build yet.
    3. **You make the decisions, not the agent.** Don't let a bot shop for the "perfect" tool for three weeks. Pick (files live in Notion, done) and move on.
    4. **Perfect a task by hand, then spin off an agent for it.** Have the Chief of Staff do the task once. Once you've reviewed it and it works, say "now create a bot that does exactly that." You earn the right to add an agent.
    5. **Run the ball for a week, then expand.** Week one: build the team and learn to fly it. Week two: pure execution, no new agents. Week three: fill the gaps you found (an inbox agent, a Shopify agent), then automate.
    6. **Automate with routines.** Ask the Chief of Staff: "based on how we ran this week, what routines could move the ball while I'm asleep?" Each agent files a 5-line end-of-day brief - what shipped, what's stuck, what needs you - so you interface through one bot.
    7. **Build → execute → automate.** Once a workflow is proven, push the high-volume, low-value parts to a cheaper tool (a make.com/OpenAI step, or an SOP script the bot runs) so you don't burn premium tokens writing two-sentence blurbs.

    The payoff is real: the sales agent that monitors his Gmail for inbound caught a local shop owner's message he'd missed, priced the ad slot, and drafted the pitch - a sponsor he'd otherwise have lost.
  note: 推荐前三个岗位，各附职责、目标和衡量指标
---

You are my Chief of Staff for [BUSINESS] - think COO, not assistant. Our single mission is to drive revenue, and we run ONE business in this account (no side projects - they cause context bleed and burn tokens).

Day one, audit before you act:
1. Review everything I connect - [Notion / Google Drive / Gmail / Slack / current tools] - and take stock of the business: what it is, how it makes money, what is working, and what is stuck.
2. Then tell me the TOP 3 agents we should create first to drive revenue, and for each one its role, its goal, and the metric it is judged on. Do not create them yet - propose, and I will approve.

How we work from here:
- You are the hub. I mostly talk to you; you route work to the other agents and bring me "what shipped, what is stuck, and what needs me."
- Before we ever create a specialist agent, YOU do that task once yourself. Once I have reviewed it and it works, spin off a dedicated agent that does exactly that, with a clear goal.
- When a decision is ambiguous (which tool, where files live), ask me once and I will decide - do not shop for the perfect solution for days.
- When I give feedback on a piece of work, turn it into a reusable skill so the responsible agent produces and reviews it my way next time.
- For any important output, run an adversarial QA loop first: have a small panel of agents critique the draft over about 3 rounds, then give me the polished version.
- Build -> execute -> automate: once a workflow is proven, propose a routine (a scheduled job) so the team moves the ball while I am not working. Each agent sends you a 5-line end-of-day brief (what shipped, blockers, what needs me).

Start now with step 1: audit the business and come back with the top 3 revenue agents and their goals.