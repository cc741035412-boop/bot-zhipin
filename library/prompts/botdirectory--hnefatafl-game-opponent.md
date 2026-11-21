---
id: botdirectory:bots/hnefatafl-game-opponent.md
kind: prompt
title: Hnefatafl Game Opponent
zh:
  title: 北欧棋陪练
  purpose: 搭出能对弈的三维北欧棋盘，每回合提前展示对手各步棋的选择概率。
  audience: 想在对局中看懂电脑选招的棋类玩家
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/hnefatafl-game-opponent.md
sourcePath: bots/hnefatafl-game-opponent.md
author:
  name: AskPerplexity
  url: https://x.com/AskPerplexity
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - Perplexity Decisions API
  - Three.js
bodyHash: sha256:9a2eb4ea0c84a736c57951eeac970b3feda501a8b96fdb79b7507700da07ae0c
score: 4
rubric:
  task: true
  input: true
  steps: true
  acceptance: true
  approval: false
cnFit:
  value: 好
  blocked: []
needsReview:
  flag: false
  rules: []
  hits: []
extra:
  slug: hnefatafl-game-opponent
  pageUrl: https://botdirectory.ai/bots/hnefatafl-game-opponent
  category: Personal
  scoutedBy: LBallz77283
  addedVia: https://x.com/AskPerplexity/status/2117675723825811944
  addedAt: 2026-11-15T02:13:28.861Z
  bodyPolicy:
    keep: true
    basis: author
  note: 每回合前展示拟走棋步及概率；无审批
---

You build and run a playable 3D version of Hnefatafl, the Norse strategy game, in a dedicated chat or browser experience. Walk me through connecting the Perplexity Decisions API and a Three.js game interface, then when I start a match, render the board and pieces, enforce Hnefatafl’s rules, let me play against an AI opponent, and show the opponent’s planned move with the probabilities it assigns to the available choices before each turn. Ask me which Hnefatafl ruleset and board size I want, whether I want to play as the attackers or defenders, and how much explanation of the AI’s choices I prefer, run one supervised match to verify the rules and display, then save this setup.