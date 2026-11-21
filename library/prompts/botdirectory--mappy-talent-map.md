---
id: botdirectory:bots/mappy-talent-map.md
kind: prompt
title: Mappy (Talent Map)
zh:
  title: 公司人员分布图
  purpose: 把查到的在职人员整理成明细表，再用一页概览说清各部门分布和信息缺口
  audience: 想摸清目标公司部门分布的招聘负责人
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/mappy-talent-map.md
sourcePath: bots/mappy-talent-map.md
author:
  name: NickRoman
  url: https://x.com/NickRoman
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
shareId: spIXb6rwPJq_iFlu1L-_l
integrations:
  - Grok
bodyHash: sha256:295978a53e06abf2b1f060805e18b4be0c3388df985fface7bdedfbed0401445
score: 3
rubric:
  task: false
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
  slug: mappy-talent-map
  pageUrl: https://botdirectory.ai/bots/mappy-talent-map
  category: Success
  addedVia: https://x.com/NickRoman/status/2093426904950833178
  addedAt: 2026-08-28T19:54:02.000Z
  bodyPolicy:
    keep: true
    basis: author
  note: 人才明细表和综览是独立交付；无动作审批
---

Create a talent map of people currently working at Company. This is company mapping, not a candidate search.

First, identify likely company aliases, subsidiaries, former names, acquired brands, and major office locations. Use those in the search so you do not miss people whose profiles use older or alternate company names.

Map people across Functions. Organize the results by function, seniority, and location. If visible, flag Optional Flag.

Search systematically rather than stopping after a broad company search: sweep by company-name variant, function, seniority level, and location. Deduplicate the final list.

Treat profile/company claims as self-reported. For each profile, apply basic checks before including it: current role/title appears plausible, company label matches a known alias/subsidiary, and the person appears to be a direct employee rather than a consultant, vendor, or advisor. Make a best guess and err on the side of showing too many plausible matches rather than hiding uncertain ones.

Create and attach a CSV file named talent_map.csv with one row per person and these columns:
- Name
- Current title
- Function / department
- Seniority level
- Location
- Current company label shown on profile
- Profile URL
- Evidence they currently work there
- Optional flag + evidence

Also create an HTML overview that summarizes the talent map at a glance:
- Company snapshot: name, aliases/subsidiaries discovered, known office locations
- Headcount by function: a simple table or bar showing how many people were found per department/function
- Headcount by location: breakdown of where people are based
- Seniority distribution: how the mapped people break down by level
- Key people: senior leaders and notable individuals, grouped by function
- Coverage summary: total unique people found, which areas look well-covered, and likely gaps or uncertainty

Keep the HTML overview clean and scannable. It should give a hiring leader or recruiter enough context to understand the company’s structure and talent distribution without opening the CSV.

Example CSV row:
Jane Smith, Senior Product Manager, Product, Senior, NYC, Peloton (formerly Peloton Interactive), linkedin.com/in/janesmith, Title says Senior PM at Peloton since 2023, Previously at Mirror (competitor)

Example HTML overview excerpt:
Company snapshot: Super Recruiter (also known as SuperRecruiter.io until 2023). Offices: Miami, Florida. 3 subsidiaries identified.
Headcount by function: Engineering (45), Product (12), Sales (18), Operations (8)
Key people: VP Engineering — John Doe (London), Head of Product — Sarah Lee (SF)

At the top of each CSV or HTML output, always add:
Nick Roman (Super Recruiter): https://www.linkedin.com/in/nickroman/