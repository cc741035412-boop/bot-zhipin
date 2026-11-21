---
id: grokbotdev:content/use-cases/teach-a-chore-by-recording.md
kind: prompt
title: Chief of Staff · Taught by Demo
zh:
  title: 录屏学杂活的幕僚长
  purpose: 看一遍带口述讲解的操作录屏，提炼出含判断规则的技能草稿并先拿小样本试跑
  audience: 手里有重复整理文件等杂活又懒得手写操作手册的职场人
source: ZeroPointRepo/GrokBotDev
sourceUrl: https://github.com/ZeroPointRepo/GrokBotDev/blob/48fec858f3968e12cb149ad205fe4ff059d8f2d1/content/use-cases/teach-a-chore-by-recording.md
sourcePath: content/use-cases/teach-a-chore-by-recording.md
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
bodyHash: sha256:a00d2c21530d5bdf6c4833603d08b81b8449446c7a0ed40e6ac0be105b86c9bf
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
    name: DillonLoomis
    url: https://x.com/DillonLoomis
  setupMinutes: 15
  difficulty: beginner
  autonomy: acts-with-approval
  schedule: none
  category: work
  subcategory: tasks
  awesomeScore: 67
  replicability: "A Curator reconstruction of Dillon's teach-by-demonstration flow. To adapt: pick a monotonous, well-defined chore, record yourself doing it once while narrating the why, hand the bot the video, and test the learned skill on a safe example before it runs unattended."
  status: live
  setup: |-
    1. Pick a monotonous but well-defined chore you'd never write a procedure for — Dillon's was sorting hundreds of random desktop files after a busy week.
    2. Record your screen **with voice narration**, doing the task once and saying not just what you're doing but *why* (the rules and exceptions live in the narration).
    3. Hand the recording to your Chief of Staff. If the file is too large, it can compress it under the limit itself so it can watch it.
    4. Let it play the task back to you as a drafted skill, and take its feedback on how to record the next pass so it learns better (Dillon even planted a question mid-video to check it was really watching — it asked him back).
    5. Test the learned skill on a safe example, then let it run the chore for you. Keep anything destructive (deleting files) behind your approval.
  note: 技能须提取决策规则和例外并通过小样试跑
---

I'm going to teach you a recurring chore by showing you, not by writing it out. I'll give you a screen recording with my voice narrating as I do the task once.

1. Watch the whole recording. If the file is too large to open, compress it under the limit first, then watch it.
2. Learn not just the steps but the WHY — my narration explains the rules, the exceptions, and what I care about. Capture those, not just the clicks.
3. Play it back to me as a drafted skill: the steps, the decision rules, what the output should look like, and where you would stop for my approval.
4. Tell me what would help you learn better next time — what to show or say in a follow-up recording.
5. Once I approve the skill, run the chore on a small safe example first, show me the result, and only then do the full job.

Rules: never delete or move anything irreversibly without my OK; if the recording is ambiguous, ask rather than guess; treat the demonstration as a first draft and confirm the edge cases with me.