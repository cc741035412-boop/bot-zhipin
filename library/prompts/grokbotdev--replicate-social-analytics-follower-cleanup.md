---
id: grokbotdev:content/use-cases/replicate-social-analytics-follower-cleanup.md
kind: prompt
title: Pruner · Follower Cleanup
zh:
  title: X关注列表分批清理器
  purpose: 读取X导出数据包给关注和粉丝贴活跃度与互关标签，按待删建议分批做取关清理
  audience: 关注列表太杂、不想买付费工具清理僵尸号的X重度用户
source: ZeroPointRepo/GrokBotDev
sourceUrl: https://github.com/ZeroPointRepo/GrokBotDev/blob/48fec858f3968e12cb149ad205fe4ff059d8f2d1/content/use-cases/replicate-social-analytics-follower-cleanup.md
sourcePath: content/use-cases/replicate-social-analytics-follower-cleanup.md
author:
  name: kloss_xyz
  url: https://x.com/kloss_xyz
license: CC-BY-4.0
attribution:
  by: GrokBot.dev contributors
  repo: ZeroPointRepo/GrokBotDev
  license: CC BY 4.0
  licenseUrl: https://creativecommons.org/licenses/by/4.0/
fetchedAt: 2026-11-21T06:44:43Z
changes: 只收「## Prompt」下代码块里的提示词原文，一字未改；原页面的设置步骤和点评没有收；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
bodyHash: sha256:b6d08ab0263ce458dc3c582e3a2317cdbe5f40ccc0197bf48f45e1758fa5ac03
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
extra:
  promptBlock: true
  provenance: author
  setupMinutes: 20
  difficulty: intermediate
  autonomy: acts-with-approval
  schedule: adhoc
  category: marketing
  subcategory: social
  awesomeScore: 77
  replicability: Request your X data archive first (Settings → download an archive; it emails you a link), then hand the bot data/following.js and data/follower.js. The prompt is kloss's verbatim - its guardrails (approve every batch, ≤100/day, keep backups) are what make it safe on a real account.
  status: live
  setup: |-
    Social-analytics tools charge a subscription to do something your own data already supports: tell you who's worth following back. kloss_xyz did the math - $600/yr for one, $50/mo for Circleboom - and had Grok Bot replicate the useful part from his X data archive instead.

    1. **Request your X data archive** (Settings → Your account → Download an archive). It takes a while and arrives as an email link. Inside are `data/following.js` and `data/follower.js` - the two files the bot needs.
    2. **Hand those files to the bot** and paste the prompt below. It sorts every account into mutuals, people you've ever replied to or DM'd, and buckets like inactive, overactive/spam, not-following-back, and smart follower.
    3. **It tags the confident calls** - `cut now`, `cut probably`, `keep` - across both your following and follower lists, so you're triaging suggestions, not raw names.
    4. **You approve every batch.** Nothing is unfollowed without your say-so, capped at 50-100 a day so you never trip X's limits or nuke your graph by accident.
    5. **It keeps a backup** of the original files first, so a bad call is always reversible.
  note: 每日取消关注不超100，原文件须备份
---

download an archive of account data from X and wait for the email download. you'll need data/following.js and data/follower.js.

please sort and categorize all into mutuals, anyone I've ever replied or DM'd with, and use clear labels like inactive, overactive/spam, not following back, mutuals, smart follower, etc.

only I will approve the batches before any action, 50 to 100 unfollows a day. never would we go over 100 in a day.

please also help me with tagging the highest confidence suggestions with labels like cut now, cut probably, and keep for both lists.

keep a backup of all our original files too in case anything goes wrong.