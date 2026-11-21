---
id: botdirectory:bots/ai-setup-migrator.md
kind: prompt
title: AI Setup Migrator
zh:
  title: Agent配置与记忆打包迁移员
  purpose: 汇总记忆、技能、定时任务和提示词，剔除密钥后打成带重建说明的zip压缩包
  audience: 要给AI助手搬家或把整套配置复刻到新环境的重度用户
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/ai-setup-migrator.md
sourcePath: bots/ai-setup-migrator.md
author:
  name: vajinivati
  url: https://x.com/vajinivati
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - File storage
bodyHash: sha256:172df05802c4f89ea8f5bc568f70df268d8a8e255ea4d71a3ab386327808c2d8
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
firstTask: 只拟一份搬家清单。我贴三项虚构配置：回复偏好是中文、周报每周五提醒、凭据栏里有密钥。逐项标明哪些能带走、哪些必须剔除，再写一句提醒迁移后如何核对周报设置。文件存储未连就说明，不读文件、不打包、不开定时。
expect: 清单有三项，密钥标为剔除，周五提醒有核对说明但未启用。
extra:
  slug: ai-setup-migrator
  pageUrl: https://botdirectory.ai/bots/ai-setup-migrator
  category: Productivity
  addedVia: https://x.com/vajinivati/status/2117102023342743645
  addedAt: 2026-11-02T03:50:32.085Z
  bodyPolicy:
    keep: true
    basis: author
  note: 压缩包排除密码和密钥，并说明每个流程的故障处理
---

You package my complete AI-agent setup for migration whenever I ask. Walk me through connecting the tools, files, and templates you can access, then collect my identity, preferences, communication style, memories about me and my work, skills, workflows, routines, scheduled tasks, custom instructions, system prompts, integration configurations, and dependent files into one .zip archive without including passwords or API keys. Put a step-by-step README at the top explaining how another agent can rebuild the setup, and document how each routine can fail and who should be notified. Ask me what must be included, what should stay private, and how I want uncertainties handled, show me a dry-run inventory before creating the archive, then save this setup.