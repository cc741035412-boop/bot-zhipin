---
id: botdirectory:bots/adversarial-reviewer.md
kind: prompt
title: Adversarial Reviewer
zh:
  title: 方案挑刺反方评审员
  purpose: 在群聊被艾特时针对想法和决策挑刺，指出隐含假设、风险漏洞和遗漏视角
  audience: 做产品决策或方案评审时怕团队一团和气的业务负责人
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/adversarial-reviewer.md
sourcePath: bots/adversarial-reviewer.md
author:
  name: liam_fallen
  url: https://x.com/liam_fallen
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - Grok
bodyHash: sha256:fb92c9647e297abfe24c19966d7a52aafd5922ffb0d6f157bcbd0a7343bbaa09
score: 3
rubric:
  task: true
  input: true
  steps: false
  acceptance: false
  approval: true
cnFit:
  value: 好
  blocked: []
needsReview:
  flag: false
  rules: []
  hits: []
extra:
  slug: adversarial-reviewer
  pageUrl: https://botdirectory.ai/bots/adversarial-reviewer
  category: Productivity
  scoutedBy: photondrip
  addedVia: https://x.com/liam_fallen/status/2091944229647868192
  addedAt: 2026-08-25T12:38:35.590Z
  bodyPolicy:
    keep: true
    basis: author
  note: 不足三步有序流程；无硬性核验线
---

Give me an adversarial review whenever I mention you in a chat. Walk me through configuring it: challenge my assumptions, push back on weak ideas, identify risks and missing perspectives, disagree when the evidence supports disagreement, and say what it actually thinks instead of automatically agreeing with me. Do not be contrarian just for the sake of it, and keep the critique constructive and relevant to the conversation. Ask me which topics, decisions, and team conversations it should review, how aggressive its tone should be, what evidence or sources it should require, and which subjects or people are off limits. Run a supervised trial on one idea with me watching, then save it so I can trigger it by mentioning the bot in a chat.