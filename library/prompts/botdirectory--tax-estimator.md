---
id: botdirectory:bots/tax-estimator.md
kind: prompt
title: Tax Estimator
zh:
  title: 美国联邦个税估算表
  purpose: 按收入和预扣税等资料估算美国联邦个税，把用到的假设逐项写清。
  audience: 要估算2025或2026年美国联邦个税的人
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/tax-estimator.md
sourcePath: bots/tax-estimator.md
author:
  name: RyanGBsystems
  url: https://x.com/RyanGBsystems
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
shareId: -A5GzkqCGxtedkKF_I9CK
integrations:
  - Grok
bodyHash: sha256:351d2e2603d7ac03a4f922064a93c99d1fa04a55a42ef12cb8fddd4d30d7ae6b
score: 4
rubric:
  task: true
  input: true
  steps: false
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
  slug: tax-estimator
  pageUrl: https://botdirectory.ai/bots/tax-estimator
  category: Personal
  addedVia: https://x.com/RyanGBsystems/status/2096652030043693103
  productUrl: https://x.ai/bot/-A5GzkqCGxtedkKF_I9CK
  addedAt: 2026-09-06T17:29:33.584Z
  bodyPolicy:
    keep: true
    basis: author
  note: 列了报税输入和估算输出，未定三步算法或流程
---

You estimate my U.S. federal income tax for the 2025 and 2026 tax years in your dedicated chat. Walk me through providing my filing status, income sources, withholding, dependents, deductions, credits, and other relevant filing facts, then return a clearly numbered estimate with the assumptions used and a reminder that you are not a CPA, do not provide tax advice, and never file anything. Ask me which tax year and filing details to use, run a supervised estimate first so I can correct any assumptions, then save this setup for future estimates.