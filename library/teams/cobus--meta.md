---
id: cobus:teams/meta/team.yaml
kind: team
title: Meta
zh:
  title: 编队搭建与分派四人组
  purpose: 从目录安装初始团队、裁掉闲置成员、把新活分给唯一负责人并补写缺失岗位契约。
  audience: 手头机器人越建越多、需要精简成员和统一派活的团队管理员
source: cobusgreyling/grok-bot-templates
sourceUrl: https://github.com/cobusgreyling/grok-bot-templates/blob/4f3f28b4e6578cd227ff7f4b78ec91d15fd091b5/teams/meta/team.yaml
sourcePath: teams/meta/team.yaml
author:
  name: Cobus Greyling
  url: https://github.com/cobusgreyling
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 原文件全文收录，一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
bodyHash: sha256:91b74896e3b6accc83f142c00450a20c2abd195026d8463f2a53e68c5a2fa3ee
score: 3
rubric:
  task: false
  input: true
  steps: false
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
  note: 装队、精简、派工、写契约并列，无三步顺序
---

id: meta
name: Meta
lead: installer
bots:
  - installer
  - roster
  - router
  - foundry
why: >
  Standing up a catalog team, cutting a bloated fleet, routing work,
  and minting the next contract are four jobs, not one Setup dump.
group_kickoff: >
  @Setup install the named starter team from the catalog. @Roster Coach
  cut anything that is not earning its slot. @Fleet Router assign
  incoming work to exactly one owner. @Foundry write a share-safe
  contract for the missing job. Do not enable routines. Do not create
  more than four Bots. Do not paraphrase PROFILE.md.
plugins: []
max_bots: 4
autonomy: L1