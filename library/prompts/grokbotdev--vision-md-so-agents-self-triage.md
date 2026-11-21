---
id: grokbotdev:content/use-cases/vision-md-so-agents-self-triage.md
kind: prompt
title: Maintainer · Vision-Aligned Triage
zh:
  title: 开源仓库愿景分诊维护员
  purpose: 先梳理仓库方向写出愿景文档，再照此给每个工单和合并请求打三类标签并拟处理方案
  audience: 被大量开源工单和代码提交淹没、没法逐条审阅的项目作者
source: ZeroPointRepo/GrokBotDev
sourceUrl: https://github.com/ZeroPointRepo/GrokBotDev/blob/48fec858f3968e12cb149ad205fe4ff059d8f2d1/content/use-cases/vision-md-so-agents-self-triage.md
sourcePath: content/use-cases/vision-md-so-agents-self-triage.md
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
  - GitHub
bodyHash: sha256:7ec2abb01b6f6ba42bc0ffcb47a0eddce00f84d154f035847921317652e74354
score: 4
rubric:
  task: false
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
    name: kunchenguid
    url: https://x.com/kunchenguid
  setupMinutes: 20
  difficulty: intermediate
  autonomy: acts-with-approval
  schedule: adhoc
  category: engineering
  subcategory: issues
  awesomeScore: 77
  replicability: Reconstructed from @kunchenguid's posts on VISION.md and his /vision skill. Write the repo's VISION.md first (where the project should go, not what it is), then point your bot at it as the triage rubric. Pairs with his Grok Ship factory for actually shipping the aligned work.
  status: live
  setup: |-
    Kun Chen maintains open-source projects that total 24k+ GitHub stars, and the incoming issues and PRs had buried him. What finally moved the queue wasn't reviewing faster - it was changing the layer he operates at:

    1. **Write an explicit VISION.md for each repo** (he's renaming it STRATEGY.md). It states where the project should *go* - not what it currently is. His `/vision` skill drafts one by reading what the project already does; you then edit it until it's right.
    2. **Make VISION.md the triage rubric.** Point your Grok Bot at it and every incoming issue, PR and feature request gets judged against it: vision-aligned or not. The aligned ones get built; the rest are declined or set aside - without you reading each one.
    3. **Let the factory ship the aligned work.** This is the steering layer that sits on top of a build system like his [Grok Ship software factory](/use-cases/grok-ship-factory/); he also invites maintainers to help specifically on issues triaged as vision-aligned.

    The point, in his words: as agents do more, you can't review all the code, then you can't review all the plans, and eventually you can't even review 1,000 feature requests a day. So your influence has to move up a level - you define the vision, and it becomes the judgment call that decides what belongs.
  note: 愿景文档、筛选、发货是多项交付
---

I want you to help me steer [REPO] by its vision instead of me reviewing every issue.

Step 1 - Draft a VISION.md. Look at what the project already is (README, recent PRs, the issues people file) and write an explicit VISION.md that states where this project should GO - its purpose, who it is for, the kind of changes that belong, and the kind that do not. This is about direction, not a feature list. Show it to me and refine it with my edits until it is right, then save it as VISION.md in the repo.

Step 2 - Use it as the triage rubric. From now on, for every open issue and PR, judge it against VISION.md and label it: vision-aligned, off-vision, or needs-my-call. For vision-aligned items, propose a short plan and - once I approve the batch - start shipping them. For off-vision items, draft a kind closing comment explaining it does not fit the direction. Bring the "needs-my-call" ones to me as a short list.

Rule: VISION.md is the source of truth for what belongs. When you are unsure whether something is aligned, ask me - and if it is a real gap, propose an edit to VISION.md rather than guessing. Never close or merge anything without my go-ahead.