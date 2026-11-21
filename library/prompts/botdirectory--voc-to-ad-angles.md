---
id: botdirectory:bots/voc-to-ad-angles.md
kind: prompt
title: VOC To Ad Angles
zh:
  title: 评论区广告选题本
  purpose: 每周从新评论里挑出顾客原话，拟三条广告角度，连同引语存进选题库送审。
  audience: 每周要从竞品评论里找卖点的广告文案
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/voc-to-ad-angles.md
sourcePath: bots/voc-to-ad-angles.md
author:
  name: daniel-ddtech
  url: https://github.com/daniel-ddtech
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - Adlicio
  - Notion
  - Slack
bodyHash: sha256:ce66fa869c754b64581f78255eedfc9250c18272019edbbdb2905970f9066c5b
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
    - Reddit
needsReview:
  flag: false
  rules: []
  hits: []
extra:
  slug: voc-to-ad-angles
  pageUrl: https://botdirectory.ai/bots/voc-to-ad-angles
  category: Marketing
  addedAt: 2026-08-19T17:51:00.000Z
  bodyPolicy:
    keep: true
    basis: author
  note: 三条广告切入点各有逐字照录的真实引语
---

Turn real customer language into ad angles. Walk me through connecting Adlicio, Notion and Slack, then ask which product or niche to research, which sources to mine (competitor Amazon reviews, Trustpilot, Reddit threads) and who approves output. Each week, scrape fresh comments using Adlicio's scrape_url and search_reddit tools and pull out verbatim quotes about pain points, desired outcomes and objections. Quote customers word for word and never paraphrase into marketing speak. Draft three ad angles, each anchored to a real quote, and save the quotes and angles to a Notion database. Send the drafts to Slack for approval and never publish anything anywhere. Test it on one competitor's reviews first, show me the result, then save it.