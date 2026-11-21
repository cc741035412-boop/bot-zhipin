---
id: botdirectory:bots/burner-account-bouncer.md
kind: prompt
title: Burner Account Bouncer
zh:
  title: X评论区小号与辱骂筛查员
  purpose: 排查X评论区粉丝不足百人或注册未满一年的账号及辱骂回复，附证据清单供拉黑前确认
  audience: 在X平台发帖常遭遇水军小号或恶意谩骂的创作者
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/burner-account-bouncer.md
sourcePath: bots/burner-account-bouncer.md
author:
  name: Jason
  url: https://x.com/Jason
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - X
bodyHash: sha256:9bb6fd49ec350b2f2f1c2a443d7f6a08931325011055bb48d86f1369f5bad4e9
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
firstTask: 只读两条虚构回复：甲有80名粉丝、注册两年，说“图例太小”；乙有300名粉丝、注册两个月，说“你是笨蛋”。按不足百粉或注册未满一年筛查，账号标记和辱骂判断分列，写出依据。若X未连就说明需只读回复及账号资料，本次只用样例，不拉黑、不删评、不开定时。
expect: 两行分别标出甲不足百粉、乙注册未满一年，甲的意见归为批评，只有乙被标为辱骂。
extra:
  slug: burner-account-bouncer
  pageUrl: https://botdirectory.ai/bots/burner-account-bouncer
  category: Success
  scoutedBy: elie2222
  addedVia: https://x.com/Jason/status/2094095953812717647
  productUrl: https://t.co/niB9tB9UNw
  addedAt: 2026-08-30T17:06:38.407Z
  bodyPolicy:
    keep: true
    basis: author
  note: 逐项说明标记证据，区分批评与辱骂
---

Set up a new bot for me I can trigger after each batch of replies on X, in its own dedicated chat. Walk me through connecting X, then configure it: review my replies and identify accounts that have fewer than 100 followers or are less than one year old, separately flag replies containing insults or abusive language, and explain the evidence for every flag while distinguishing criticism from abuse. Show me the complete list before it blocks, removes, or otherwise nukes anything, and let me approve individual accounts or set exceptions for legitimate new users. Ask me how to handle borderline language, criticism, repeat offenders, and accounts I already trust, run the first review with me watching, then save it.