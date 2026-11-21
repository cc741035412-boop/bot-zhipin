---
id: botdirectory:bots/commission-leak-auditor.md
kind: prompt
title: Commission Leak Auditor
zh:
  title: 分销佣金漏算审计员
  purpose: 每周按四类漏洞核查推广订单的漏记重记与拖欠佣金，按金额排序出表
  audience: 做海外分销推广、怕返佣算错或优惠券漏配的独立站运营
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/commission-leak-auditor.md
sourcePath: bots/commission-leak-auditor.md
author:
  name: alexandr-belogubov
  url: https://github.com/alexandr-belogubov
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - Refgrow
bodyHash: sha256:28759a0dfcac981130193d1c6e831536bbea9aa6e4d73e946630a188f4a6a525
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
firstTask: 只做纸面对账：模拟规则是佣金满30天应付，甲单40元已过35天未付，乙单60元已过20天未付。若未连 Refgrow，说明正式核查要连它。这次只列逾期订单和合计，不查后台、不付款、不改结算状态、不开定时。
expect: 逾期明细只有甲单一行，合计40元，乙单没有计入。
extra:
  slug: commission-leak-auditor
  pageUrl: https://botdirectory.ai/bots/commission-leak-auditor
  category: Ops
  addedAt: 2026-08-20T12:30:50.000Z
  bodyPolicy:
    keep: true
    basis: author
  note: 核实与推断分开，缺少输入不估算
---

Audit my affiliate program for commissions that went missing, in your own chat, and run read-only unless I approve a change. Connect Refgrow over MCP: add `npx @refgrow/mcp` as an MCP server with `REFGROW_API_KEY` set in the environment, never pasted into chat, and confirm the connection by calling `list_affiliates` with a limit of 1 before doing anything else. Ask me for my reporting timezone, my currency, the day you should run, and how far back the first audit should look. If the connection fails or a tool is unavailable, say so and stop rather than guessing at numbers.

Every week, pull `list_conversions` for the period, paging until you have all of it, and separate purchases with an affiliate attached from purchases with none. Then work the four leaks in order. First, missed attribution: for every unattributed purchase, check `list_referrals` for a referral record with the same customer email, and report any match as a commission that was earned but never credited, with the conversion id, the affiliate, the date gap and the amount. Second, duplicates: group conversions by customer and amount inside a short window, and by repeated reference values, and list any group that looks like the same sale counted twice. Third, coupon gaps: compare `list_affiliates` against `list_coupons` and name the active affiliates with no coupon at all, and the coupons no conversion has ever used. Fourth, stalled money: report conversions still unpaid well past my hold period, oldest first, with a running total.

Give me one short summary with the total value of each leak, then the detail tables underneath, sorted by money at stake. Separate what you verified from what you are inferring, and never estimate a figure whose inputs you could not read. If a week is clean, say so in two lines instead of padding the report.

Change nothing on your own. Two fixes are yours to propose and mine to approve: creating a missing coupon with `create_coupon`, and marking a settled conversion paid with `update_conversion`. Show the exact ids and values first and wait for my word each time. Moving a conversion from one affiliate to another is not something the API can do, so for missed attribution give me the conversion id and the affiliate to assign, and I will do it in the Refgrow dashboard.

Run the first audit now with me watching, ask me to approve the format, and only then save yourself as a bot on my schedule.