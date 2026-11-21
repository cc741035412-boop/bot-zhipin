---
id: grokbotdev:content/use-cases/reply-guard.md
kind: prompt
title: Screen your X replies for burners and insults
zh:
  title: 评论区小号骂人筛查器
  purpose: 按粉丝数、注册时长和人身攻击规则筛查X评论，分成标记清单和正常互动清单
  audience: X账号评论区杂音多、想先筛掉水军小号再集中回复的创作者
source: ZeroPointRepo/GrokBotDev
sourceUrl: https://github.com/ZeroPointRepo/GrokBotDev/blob/48fec858f3968e12cb149ad205fe4ff059d8f2d1/content/use-cases/reply-guard.md
sourcePath: content/use-cases/reply-guard.md
author:
  name: GrokBot.dev contributors
  url: https://github.com/ZeroPointRepo/GrokBotDev
  role: curator
license: CC-BY-4.0
attribution:
  by: GrokBot.dev contributors
  repo: ZeroPointRepo/GrokBotDev
  license: CC BY 4.0
  licenseUrl: https://creativecommons.org/licenses/by/4.0/
fetchedAt: 2026-11-21T06:44:43Z
changes: 只收「## Prompt」下代码块里的提示词原文，一字未改；原页面的设置步骤和点评没有收；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - X
bodyHash: sha256:8d279e4a42319d1336cdae2d0e555aa00e22a79cc5da25bcf25f10dcf0ba4fe7
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
  provenance: curator
  inspiredBy:
    name: Jason
    url: https://x.com/Jason
  setupMinutes: 10
  difficulty: intermediate
  autonomy: proposes
  schedule: adhoc
  category: marketing
  subcategory: social
  replicability: Point it at your own X account and set your thresholds — the follower floor, the account-age cutoff, and what counts as an insult. It flags for review; keep hiding, blocking or muting behind your approval until you trust the calls.
  status: live
  setup: |-
    A large account's replies are a firehose, and the worst of it is low-effort. This is the triage layer.

    1. Connect your X account (the X plugin) so the bot can read the replies to your posts.
    2. Set your thresholds: the follower floor (Jason uses 100), the account-age cutoff (under a year), and what counts as an insult versus a strong opinion.
    3. Paste the prompt below. Point it at a post; it scores each replier against your rules and returns two lists — the burners and insults separated from the genuine conversation.
    4. Review the flags. Keep hiding, muting or blocking behind your own approval until the calls have earned your trust.
  note: 标记附链接和缘由，不确定项放清洁列并解释
---

You screen the replies to my X posts. For each reply, look up the replier's account and flag it if it meets any of my rules: fewer than 100 followers, an account created less than a year ago, or a reply that carries a personal insult or slur aimed at me or at another user.

Return two lists.
- FLAGGED: the reply, a link to it, and the reason (burner / new account / insult).
- CLEAN: genuine replies worth engaging, including people who simply disagree with me.

Judge insults by intent, not by heat. Disagreement, criticism and strong opinions are CLEAN. Contempt aimed at a person — name-calling, slurs, dehumanising language — is FLAGGED. When you are unsure, put it in CLEAN and tell me why you hesitated.

Do not hide, mute, block or reply to anyone on your own. Your job is the flagged list; the action is mine.