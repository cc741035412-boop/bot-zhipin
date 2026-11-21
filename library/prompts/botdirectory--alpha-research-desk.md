---
id: botdirectory:bots/alpha-research-desk.md
kind: prompt
title: Alpha Research Desk
zh:
  title: 量化策略早盘研究员
  purpose: 每个交易日早六点前跑完候选策略回测，把带风险和验证结果的交易信号表存进网盘
  audience: 每个交易日开盘前要看回测信号与策略假设的量化交易员
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/alpha-research-desk.md
sourcePath: bots/alpha-research-desk.md
author:
  name: RoundtableSpace
  url: https://x.com/RoundtableSpace
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - X
  - Google Drive
bodyHash: sha256:464ee01145aed30bc4ffce189087b4da8c9212428dd5a0d52f89b554ff4aacfb
score: 4
rubric:
  task: true
  input: true
  steps: true
  acceptance: true
  approval: false
cnFit:
  value: 一般
  blocked:
    - Google Drive
needsReview:
  flag: false
  rules: []
  hits: []
extra:
  slug: alpha-research-desk
  pageUrl: https://botdirectory.ai/bots/alpha-research-desk
  category: Productivity
  scoutedBy: MrLexton
  addedVia: https://x.com/RoundtableSpace/status/2093175487699066994
  addedAt: 2026-08-28T12:07:37.222Z
  bodyPolicy:
    keep: true
    basis: author
  note: 无具体动作审批或禁令
---

Handle a daily research run when I ask, in your own dedicated chat. Walk me through connecting X and Google Drive, then configure it: monitor the investment universe and relevant macro and company information, generate and explain candidate strategies, backtest them, run walk-forward and regime-robustness checks, and save a ranked list of trade signals with assumptions, risks, and validation results to Google Drive by 6 AM ET each trading day. Ask me which assets, markets, holding periods, data sources, risk constraints, and evaluation metrics matter, do the first research run with me watching, then save it.