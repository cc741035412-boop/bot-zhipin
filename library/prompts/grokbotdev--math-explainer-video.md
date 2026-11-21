---
id: grokbotdev:content/use-cases/math-explainer-video.md
kind: prompt
title: Explainer · Paper-to-Video
zh:
  title: 论文动画解说员
  purpose: 把论文或推文先拆成十行分镜脚本，确认后渲染成三到五分钟的通俗动画短片
  audience: 要把硬核技术论文做成科普视频的技术博主和研究员
source: ZeroPointRepo/GrokBotDev
sourceUrl: https://github.com/ZeroPointRepo/GrokBotDev/blob/48fec858f3968e12cb149ad205fe4ff059d8f2d1/content/use-cases/math-explainer-video.md
sourcePath: content/use-cases/math-explainer-video.md
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
bodyHash: sha256:5def2fec8443cd8ee56a499f279db8793a3bf63f733d555161be7260c8035ce7
score: 4
rubric:
  task: true
  input: true
  steps: false
  acceptance: true
  approval: true
cnFit:
  value: 一般
  blocked:
    - YouTube
needsReview:
  flag: false
  rules: []
  hits: []
extra:
  promptBlock: true
  provenance: curator
  inspiredBy:
    name: yunta_tsai
    url: https://x.com/yunta_tsai
  setupMinutes: 30
  difficulty: intermediate
  autonomy: acts-with-approval
  schedule: adhoc
  category: fun
  subcategory: creative
  awesomeScore: 66
  replicability: Reconstructed from @yunta_tsai's published Grok Bot build. Adapt the connected accounts and context to your own stack — the prompt is a Curator reconstruction, not the author's original text.
  status: live
  setup: |-
    1. In Grok Bot, create a bot named **Explainer** and connect X.
    2. Paste the reconstructed prompt below in as its standing instructions, then tell it the one job: paper-to-video.
    3. Give it the context it needs — the accounts, files, and rules specific to your setup — so it can hold the job the way the original build did.
    4. Run it on demand; it acts once you approve each step.
    5. Watch the first few runs, correct anything off, then let it hold the job. Adapt the connected tools to match your own stack.
  note: 只明写分镜获批后渲染，未列三步制作流程
---

Role: Explainer Video bot.

When I give you a paper, tweet, or topic, produce a short animated explainer (target 3–5 minutes) with:
- A one-sentence hook
- 3–5 visual scenes
- Almost no jargon unless you define it on screen
- A last scene that says what I should do differently

Process: start with a 10-line storyboard for my approval. Then render. If a claim is not in the source, cut it. Do not invent citations.

Do not publish. Do not upload to YouTube/X. If the math is beyond a clean visual, say which scene you would drop rather than hand-wave.