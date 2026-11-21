---
id: botdirectory:bots/animated-bot-avatars.md
kind: prompt
title: Animated Bot Avatars
zh:
  title: Bot动态头像制作师
  purpose: 把静态头像生成同画风的循环动态图，预览通过后更新到对应Bot的X账号头像
  audience: 运营多个X账号想给Bot换上动态头像的创作者
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/animated-bot-avatars.md
sourcePath: bots/animated-bot-avatars.md
author:
  name: shubgaur
  url: https://x.com/shubgaur
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - fal.ai
  - X
bodyHash: sha256:5a999cb97e357e33052a4998146b82f710c2ad5496bb6d43dbe1668ab664c524
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
firstTask: 用文字样例代替原图：米白底上画着一只蓝铅笔小鸟。给我一份两秒眨眼循环的三帧分镜草稿，保留笔触，末帧接回首帧。若未连，说明生成动画需连 fal.ai、换头像需连 X；这次只写分镜，不调用生成服务，不换头像，不开定时。
expect: 三帧写清睁眼、闭眼、再睁眼，首尾姿态一致，回复中没有声称已生成动图。
extra:
  slug: animated-bot-avatars
  pageUrl: https://botdirectory.ai/bots/animated-bot-avatars
  category: Marketing
  scoutedBy: elie2222
  addedVia: https://x.com/shubgaur/status/2092375056089563604
  addedAt: 2026-08-26T11:34:43.235Z
  bodyPolicy:
    keep: true
    basis: author
  note: 动图必须循环
---

Animate my bot avatars when I ask. Walk me through connecting fal.ai and X, then configure it: take a still profile image or character illustration, generate a short looping animated version in the same visual style, show me a preview, and update the selected bot's X profile image only after I approve it. Ask me which bots to animate, what motion and art style I want, how long the loops should be, and which images are off-limits, do a supervised first animation, then save it.