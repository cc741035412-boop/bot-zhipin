---
id: grokbotdev:content/use-cases/photos-to-3d-printed-materials.md
kind: prompt
title: Lab Team · Photos to Printed Parts
zh:
  title: 看图仿真3D打印组
  purpose: 从参考图提取结构原理跑物理仿真实验，出报告并筛出最优设计导出STL切片待印
  audience: 做仿生结构或新材料验证、想把参考图变成3D打印件的科研人员
source: ZeroPointRepo/GrokBotDev
sourceUrl: https://github.com/ZeroPointRepo/GrokBotDev/blob/48fec858f3968e12cb149ad205fe4ff059d8f2d1/content/use-cases/photos-to-3d-printed-materials.md
sourcePath: content/use-cases/photos-to-3d-printed-materials.md
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
bodyHash: sha256:222947ca539b15fad756a7e7205305573e02fa15f4b4d847516a597d7dfc7a68
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
    name: ProfBuehlerMIT
    url: https://x.com/ProfBuehlerMIT
  setupMinutes: 45
  difficulty: advanced
  autonomy: acts-with-approval
  schedule: none
  category: engineering
  subcategory: agents-ops
  awesomeScore: 88
  replicability: "A Curator reconstruction of Buehler's 3-bot setup. To adapt: give a Chief of Staff two teammates (a simulate-and-report scientist-coder and a slice-and-print operator), feed reference images, and keep the print behind approval. Needs a connected 3D printer."
  status: live
  setup: |-
    1. Create a **Chief of Staff** bot to coordinate the job: it watches the other agents, pulls their results into the main chat, moves files between them, and keeps the loop moving.
    2. Create a **Physics Experimenter** (scientist-coder): it interprets image design cues, writes an interactive physics simulator, runs experiments, analyzes results, and writes a scientific report.
    3. Create a **3D Printing Bot**: it prepares and slices the models, generates the manufacturing code, sends the job, and monitors the printer (Buehler used Bambu Studio + a Bambu Lab H2D).
    4. Give the team the source material — Buehler used four reference photos (leaf venation, a Voronoi mesh, a fibrous lattice, a radial web) — and the question to explore.
    5. Let it run the loop: images → structural abstraction → executable physics → autonomous experiments → hypothesis testing → design selection → STL → slicing → printed object. Keep the actual print behind your approval.
  note: 实验须留出验证样本，只汇报真实结果
---

You are the Chief of Staff of a small lab team with two teammates: a Physics Experimenter (a scientist-coder) and a 3D Printing Bot. Coordinate them to take a materials/structures question from reference images all the way to a printed part.

Given the reference images I attach:

1. Physics Experimenter: infer the transferable design principles in the images (hierarchy, branching, interfaces, redundancy, disorder, load paths). Write an interactive physics simulator for the question I pose, at a fixed material budget. Validate it, then run a batch of experiments (include holdouts). Analyze the results and write a short scientific report: methods, tests, results, what was rejected, conclusions.

2. Select the best designs from the report and export them as STL.

3. 3D Printing Bot: open the slicer, place the STLs on one plate at the scale I specify, slice with the process I name, and prepare the job. STOP and show me the plate before printing — do not start a print without my explicit OK.

Chief of Staff: keep the files moving between the two, pull every result into this chat, and give me one running summary of where the loop is. Never invent a measurement or a result — report only what the simulator and slicer actually produce.