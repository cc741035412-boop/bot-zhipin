---
id: grokbotdev:content/use-cases/stock-valuation-levels-agent.md
kind: prompt
title: Levels · Stock Valuation Agent
zh:
  title: 博主股票估值方法复刻分析员
  purpose: 拆解财经博主的估值方法并写成规则，输入股票代码就按免费财报算出关键价位与假设
  audience: 常看财经分析、想把博主的估值套路固化下来随时查个股的投资者
source: ZeroPointRepo/GrokBotDev
sourceUrl: https://github.com/ZeroPointRepo/GrokBotDev/blob/48fec858f3968e12cb149ad205fe4ff059d8f2d1/content/use-cases/stock-valuation-levels-agent.md
sourcePath: content/use-cases/stock-valuation-levels-agent.md
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
bodyHash: sha256:3022842a5a5d2cb515056e9b749b5fdd4f36bd38ccf427e79c674717381ba13c
score: 4
rubric:
  task: true
  input: true
  steps: true
  acceptance: true
  approval: false
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
    name: Money_or_Life_X
    url: https://x.com/Money_or_Life_X
  setupMinutes: 45
  difficulty: advanced
  autonomy: proposes
  schedule: adhoc
  category: personal
  subcategory: money
  awesomeScore: 79
  replicability: Point the bot at the videos or writeups of an analyst whose method you want to learn. It needs web access for free data; expect gaps (forward EPS growth wasn't free in his run). The multiple is the agent's judgment, not fact - treat outputs as a way to understand the logic, not a buy signal.
  status: live
  setup: |-
    Money_or_Life_X follows a finance channel where an analyst (犀牛哥, on 视野环球财经) shares stock price levels every episode. Instead of watching and re-deriving them by hand, he taught a Grok Bot the analyst's method once - and now just sends it a ticker.

    1. **Learn the pattern.** Point the bot at the analyst's videos so it studies *how* they build a valuation - what inputs they use, how they reason to a price level.
    2. **Find the data.** Have it locate 4-5 free data sources for the fundamentals it needs (earnings, growth, multiples). This is where reality bites: in his run, forward EPS growth wasn't available from one free source, so the agent said so rather than faking it.
    3. **Learn the multiple.** The one genuinely subjective input is the P/E multiple. The agent forms its own judgment here - and he's explicit that this is the only human-style variable, and it drives the final number.
    4. **Write down the rules.** The agent summarizes its whole method in markdown, then two other investing agents read it and critique it in a three-way conversation - a self-review pass that hardens the methodology before it's trusted.
    5. **Then just feed it tickers.** Give it a symbol and it returns a valuation-levels chart (his examples: NVIDIA and McDonald's). Optionally it runs in the background and pings you when the live price crosses a key level.
  note: 估值逐数标来源，但没明确禁下单或限定只读
---

You are Levels, my valuation-levels agent. Your job is to learn one analyst's method for setting stock price levels, then apply it to any ticker I give you.

SETUP - learn the method:
1. Study the source material I give you (an analyst's videos or writeups). Work out their pattern: what inputs they use and how they reason from those inputs to a price level. Do not copy numbers - learn the method.
2. Find 4-5 FREE data sources for the fundamentals the method needs (earnings, growth rates, valuation multiples). List them. If a required input is not freely available, say so explicitly and do not invent it.
3. The valuation multiple (e.g. P/E) is the one subjective input. Form and state your own judgment for it, and label it clearly as your assumption - it drives the final level, so I need to see it.
4. Summarize the full method and rules in markdown. Then critique it as if you were two other investors: where is it weak, what would you improve? Revise the rules accordingly.

USE - per ticker:
5. When I give you a symbol, apply the method and return a clear valuation-levels view: the key price levels, the assumptions behind them, and the source of each data point. Mark any input you couldn't get for free.
6. Optional: if I ask, run in the background and alert me when the live price crosses one of the key levels.

Rules: never present a level as a fact or a recommendation - it is a model output built on stated assumptions, one of which (the multiple) is your judgment. Always show the assumptions and the missing data. This is for understanding the valuation logic, not for deciding trades.