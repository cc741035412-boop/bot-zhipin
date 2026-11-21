---
id: grokbotdev:content/use-cases/market-expectations-desk.md
kind: prompt
title: Expectations Desk · Market Pricing
zh:
  title: 期权预期差看板
  purpose: 算个股催化剂前后的期权跨式隐含波动，对比新闻舆论给出三行预期差结论
  audience: 在财报或议息日前看美股预期差的交易员和研究员
source: ZeroPointRepo/GrokBotDev
sourceUrl: https://github.com/ZeroPointRepo/GrokBotDev/blob/48fec858f3968e12cb149ad205fe4ff059d8f2d1/content/use-cases/market-expectations-desk.md
sourcePath: content/use-cases/market-expectations-desk.md
author:
  name: alex_prompter
  url: https://x.com/alex_prompter
license: CC-BY-4.0
attribution:
  by: GrokBot.dev contributors
  repo: ZeroPointRepo/GrokBotDev
  license: CC BY 4.0
  licenseUrl: https://creativecommons.org/licenses/by/4.0/
fetchedAt: 2026-11-21T06:44:43Z
changes: 只收「## Prompt」下代码块里的提示词原文，一字未改；原页面的设置步骤和点评没有收；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
bodyHash: sha256:625c411c7f8a12c1afd81e5ae876b856a4d4d6c5efb2f1113adb82800dc8cd15
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
firstTask: 只做纸面模拟：虚构股票现价100美元，财报后首个到期日的平值看涨、看跌期权每股各报3美元，模拟报道预计涨跌幅约2%。若未连行情源，说明实盘需接股价和期权链。用三行写跨式隐含幅度、报道预期和差距，不查实时价、不下单、不开定时。
expect: 三行分别列出约6美元（6%）、约2%和相差约4个百分点，不把幅度当成上涨预测。
extra:
  promptBlock: true
  provenance: author
  setupMinutes: 5
  difficulty: intermediate
  autonomy: readonly
  schedule: adhoc
  category: personal
  subcategory: money
  awesomeScore: 78
  replicability: Paste Alex's prompt as-is; it needs your Grok Bot's live market connection for quotes, chains and Greeks, plus web search for catalysts. It is read-only - it reports the expected move, never trades. Treat the output as a lens on market expectations, not financial advice.
  status: live
  setup: |-
    The moment Grok Bot could read live prices and option chains, the obvious question was "should I buy NVDA". Alex Prompter's move is smarter and more honest: don't ask the bot to predict - ask it to *read what the options market is already predicting*, and hold that up against the headline narrative.

    1. **Paste the prompt** below. It scopes the bot tightly: a live connection for quotes, chains and Greeks; web search only for catalysts and headlines; nothing else.
    2. **Name your tickers** - the ones with an earnings call or a Fed day coming. For each, the bot pulls the live price and the nearest expiry *after* the catalyst.
    3. **It reads the expected move** from the at-the-money straddle - the options market's own priced-in range for the event - in dollars and percent.
    4. **It compares that to the crowd.** The gap between what the straddle implies and what the headlines are saying is the whole point: it ends every ticker with three lines - what the market is pricing, what the crowd is saying, and which of the two has to be wrong.
    5. **If data is missing, it names it and stops** - no guessing, no invented numbers.
  note: 缺行情就点名缺项并停止，不编数字
---

You are my expectations desk. Your only job: tell me what the market is pricing in for tickers I name. Live connection for quotes, chains, and Greeks. Web search only for catalysts and headlines. Never place an order or invent a number. Per ticker: live price, nearest expiry after the next catalyst, expected move from the ATM straddle in dollars and percent, then the gap between that and what the headlines expect. End with three lines: what the market is pricing, what the crowd is saying, which one has to be wrong. Missing data? Name it and stop. Anything else is outside your scope.