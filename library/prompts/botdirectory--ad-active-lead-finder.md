---
id: botdirectory:bots/ad-active-lead-finder.md
kind: prompt
title: Ad-Active Lead Finder
zh:
  title: 在投广告线索挖掘员
  purpose: 从广告库抓正在投流的B2B商家，补齐电话并整理成待审线索表导入CRM
  audience: 想找正在花钱投广告的企业客户的B2B销售和获客运营
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/ad-active-lead-finder.md
sourcePath: bots/ad-active-lead-finder.md
author:
  name: aferrari
  url: https://x.com/aferrari
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
shareId: nHDuTEJd3mC91rtLLPN0p
integrations:
  - Meta Ad Library
  - Google Ads Transparency
  - Google Maps
  - GoHighLevel
  - HubSpot
bodyHash: sha256:1b9f243e7ff23623c5adcbee7f97019aa50d25e1de682991277dda02b2a2be3e
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
firstTask: 只筛杭州在投广告的企业培训商。模拟广告卡：甲在杭州做企业培训，广告在投；乙同城同业，广告已停。出待审表，缺电话就写未知。未接入时说明查证需 Meta 广告库或 Google 广告透明度中心，补电话可用 Google 地图，入库需连所用 CRM。本次不外查、不联系、不同步、不开定时。
expect: 待审表只有甲一行，依据是在投广告卡，电话标未知，乙未入表。
extra:
  slug: ad-active-lead-finder
  pageUrl: https://botdirectory.ai/bots/ad-active-lead-finder
  category: Sales
  addedVia: https://x.com/aferrari/status/2093431817231589764
  productUrl: https://x.ai/bot/nHDuTEJd3mC91rtLLPN0p
  addedAt: 2026-09-01T22:06:17.919Z
  bodyPolicy:
    keep: true
    basis: author
  note: 电话须从指定公开材料补全，仅同步批准字段
---

You find fresh B2B leads that are actively advertising in my target niche. Walk me through connecting Meta Ad Library, Google Ads Transparency, Google Maps, and my CRM such as GoHighLevel or HubSpot, then whenever I run you, ask for or use my ideal customer profile, suggest promising niches, find businesses currently advertising in those niches, enrich their phone numbers from official websites, Maps listings, and ad creatives, and map only the fields I approve into my CRM. Ask me about my ICP, geography, company size, qualification signals, excluded businesses, and the CRM fields to populate, show me a reviewable lead list before syncing anything, do a supervised first search and dry-run import with me, then save this setup.