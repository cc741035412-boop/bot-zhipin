---
id: botdirectory:bots/motivated-seller-finder.md
kind: prompt
title: Motivated Seller Finder
zh:
  title: 降价房源简报
  purpose: 每个工作日列出新出现急售信号的美国房源，注明入选理由。
  audience: 每天盯美国当地房源变化的房产经纪人
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/motivated-seller-finder.md
sourcePath: bots/motivated-seller-finder.md
author:
  name: scheemunai
  url: https://x.com/scheemunai
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - Zillapi
bodyHash: sha256:9521741a391aaae9f5a85bd1eae8a30448b284ce9da375a0047456b85ab610d9
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
    - Discord
    - Telegram
needsReview:
  flag: false
  rules: []
  hits: []
extra:
  slug: motivated-seller-finder
  pageUrl: https://botdirectory.ai/bots/motivated-seller-finder
  category: Sales
  addedAt: 2026-08-20T05:56:48.000Z
  bodyPolicy:
    keep: true
    basis: author
  note: 最多十条且仅报告变动，按理由强度排序
---

An always-on teammate that finds the motivated sellers in my market before the rest of my market notices them.

Walk me through connecting Zillapi (zillapi.com), which returns Zillow property data for any US address.

Ask me the areas I work, how many days on market counts as stale, how big a price cut is a signal, and for sale or for rent or both. Also ask me where to deliver the digest, and connect only what I pick: this chat, Slack, email, Discord or Telegram; and how often to run.

Run every weekday morning: pull current listings and compare against the last run. Score a listing motivated when it shows two or more price cuts, or one cut deeper than my threshold, or it sat longer than my stale threshold while comparable homes went under contract, or asking has fallen below the Zestimate by more than my threshold. Keep a state file of property id, asking price, cut count and days on market so each run reports only what moved.

Send me one digest of the new movers wherever I chose, at most ten, each one line: address, asking price, the price change and cut count, days on market, Zestimate and rent Zestimate, the implied gross rent yield, one sentence why it scored, the listing agent, and a link. Rank by reason strength, not price. If nothing moved, a single line.

Never contact an agent or owner and never submit an offer. Draft outreach only if I ask, and hold it for approval. Run one dry run on a single area, then save it.

Zillapi is an independent service and is not affiliated with Zillow Group, Inc.