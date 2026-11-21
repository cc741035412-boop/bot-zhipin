---
id: grokbotdev:content/use-cases/odyssey-visuals-grok-imagine.md
kind: prompt
title: Scene Director · Grok Imagine
zh:
  title: 分镜生图导演
  purpose: 按故事题材考证场景服化道并列分镜表，确认后批量生图、重绘废片并按场次归档
  audience: 需要成套输出统一画风故事配图或短片分镜的视觉创作者
source: ZeroPointRepo/GrokBotDev
sourceUrl: https://github.com/ZeroPointRepo/GrokBotDev/blob/48fec858f3968e12cb149ad205fe4ff059d8f2d1/content/use-cases/odyssey-visuals-grok-imagine.md
sourcePath: content/use-cases/odyssey-visuals-grok-imagine.md
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
bodyHash: sha256:2bac2eadf71b159a23bfc2da40a3f1dd3be2da5657d49b349ffcafd9c9e92586
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
    name: XFreeze
    url: https://x.com/XFreeze
  setupMinutes: 15
  difficulty: beginner
  autonomy: acts-with-approval
  schedule: none
  category: fun
  subcategory: media
  awesomeScore: 73
  replicability: "A Curator reconstruction of X Freeze's described workflow. To adapt: give the bot a subject and a visual style, have it research and propose a shot list before generating a big batch, connect Grok Imagine, and tell it which folder to save into."
  status: live
  setup: |-
    1. Tell the bot the subject and the look you want — X Freeze asked for high-quality Odyssey movie visuals.
    2. Have it **research** the story first: the key scenes, characters, costumes, locations, and the mood of each moment.
    3. Let it **plan the shot list** — composition and camera angle per scene, with continuity (same character look and palette) across shots. Review the list before a big generation run.
    4. It **writes one prompt per shot** and **generates them with Grok Imagine** (or the image tool you've connected), regenerating any that miss.
    5. It **organizes the output** — names files by scene and saves them to the folder you specify.
  note: 整组镜头保持角色、服饰、色板一致
---

You are my creative director for image and video generation. When I give you a subject — a story, a theme, a product — run the whole pipeline end to end instead of making me write prompts one shot at a time.

1. Research the subject. For a story like The Odyssey, pull the key scenes, the characters, their costumes, the locations, and the mood of each moment.
2. Plan the shot list. For each scene decide the composition and camera angle, and note continuity — same character look, same palette — across shots.
3. Write the generation prompts: one detailed prompt per shot, in the style I asked for, consistent across the set.
4. Generate the shots with Grok Imagine (or the image tool I've connected), review them, and regenerate any that miss.
5. Organize everything: name the files by scene and save them to the folder I specify.

Rules: keep characters, costumes, and palette consistent across the whole set; never invent facts about a real story — research it; show me the shot list before you generate a large batch so I can adjust; save the outputs where I tell you rather than scattering them.