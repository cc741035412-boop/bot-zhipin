---
id: grokbotdev:content/use-cases/composio-connector-hack.md
kind: prompt
title: Connector Hub · Composio Bridge
zh:
  title: 外部软件集成转接桥
  purpose: 通过聚合桥接器盘点并调用上千种外部办公软件的读写功能
  audience: 嫌原生插件太少且想把小众业务软件接入对话界面的自动化玩家
source: ZeroPointRepo/GrokBotDev
sourceUrl: https://github.com/ZeroPointRepo/GrokBotDev/blob/48fec858f3968e12cb149ad205fe4ff059d8f2d1/content/use-cases/composio-connector-hack.md
sourcePath: content/use-cases/composio-connector-hack.md
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
bodyHash: sha256:96d17fa3f3eb7556ca1fd6fb88b9f3736e15854b513c659d539ed868f5a1bd64
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
    name: coreyganim
    url: https://x.com/coreyganim
  setupMinutes: 10
  difficulty: beginner
  autonomy: acts-with-approval
  schedule: none
  category: engineering
  subcategory: agents-ops
  awesomeScore: 75
  replicability: "Corey's three steps, near-verbatim: connect the Composio connector to Grok Bot, connect the integrations you need inside Composio (composio.dev), and the bot uses them via Composio MCP. The prompt below is a curator reconstruction that adds sensible guardrails for a bot suddenly holding many tools."
  status: live
  setup: |-
    Grok Bot rides on Cursor's connector catalog, which is thinner than Claude's or ChatGPT's - and sooner or later you hit a tool your bot simply can't reach natively. Corey Ganim's workaround (his second entry here, after his [Chief of Staff build](/use-cases/exact-chief-of-staff-prompt/)) is to stop collecting connectors and install a hub instead:

    1. **Connect the [Composio connector](/plugins/composio/)** to your Grok Bot (an MCP connector like any other).
    2. **Connect the integrations you actually use inside Composio** - it carries 1,000+ of them: CRMs, project managers, marketing tools, the niche SaaS nothing ships a native connector for.
    3. **Your bot now drives all of them via Composio MCP** - one connector on the Grok Bot side, an entire catalog behind it.

    Unsponsored, in his words: just the easiest way he's found to access tools that don't have a native Cursor connector.
  note: 接入后执行多类请求，清单仅用于确认安装
---

I've connected Composio to you as an MCP connector - it is our bridge to every tool that has no native connector here. In my Composio account I enable the specific integrations we use; you reach all of them through this one connection.

How to work with it:
1. Start by listing which integrations are currently enabled through Composio and what actions each exposes, so we both know what you can actually do.
2. When I ask for something in a connected tool ("update the deal in the CRM", "add this to the project board"), use the matching Composio action. Never invent a tool, integration, or field that Composio doesn't report as available.
3. If a task needs an integration we haven't enabled yet, don't improvise - tell me which Composio integration to switch on, and continue after I've connected it there.
4. Auth stays with me: when an integration needs a sign-in or API key, that happens in Composio's dashboard, not in this chat - never ask me to paste credentials here.
5. Side effects need my sign-off: anything that sends, posts, deletes, or changes data in a connected tool - show me exactly what you're about to do and wait for my OK. Reading and searching are fine without asking.

Confirm the setup by listing the enabled integrations now.