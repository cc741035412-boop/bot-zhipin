---
id: grokbotdev:content/use-cases/marketing-os.md
kind: prompt
title: Marketing OS · Full Marketing Department
zh:
  title: 开源营销部套件
  purpose: 按品牌档案跑文案投放等十四类营销模块，输出带百制评分和盲区说明的方案
  audience: 一个人管多渠道内容投放和增长方案的独立开发者或市场负责人
source: ZeroPointRepo/GrokBotDev
sourceUrl: https://github.com/ZeroPointRepo/GrokBotDev/blob/48fec858f3968e12cb149ad205fe4ff059d8f2d1/content/use-cases/marketing-os.md
sourcePath: content/use-cases/marketing-os.md
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
bodyHash: sha256:9a51f3857c7ed4a7d3e2f144fcc789c6026a30a52866599e2a0be21b0f7ee02b
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
    name: vladdubchak_x
    url: https://x.com/vladdubchak_x
  setupMinutes: 10
  difficulty: intermediate
  autonomy: proposes
  schedule: adhoc
  category: marketing
  subcategory: content
  awesomeScore: 93
  replicability: Maxfusion open-sourced this as a real skill — github.com/holy-templar/marketing-agi. Give Grok Bot the repo link to install it, then fill in brand-context so every module writes for your brand. Adapt the modules you actually use to your own marketing.
  status: live
  setup: |-
    1. Open Grok Bot and give it this link — **github.com/holy-templar/marketing-agi**, the open-source Marketing OS by Maxfusion — and ask it to read the repo and set the skill up.
    2. It installs fourteen modules: audit, GEO, copy, hooks, paid-ads, email, social, launch, positioning, competitive, app-store and analytics, plus a slop-pattern catalogue and scoring rubrics.
    3. Copy `brand-context.template.md` to `brand-context.md`, fill in your brand, and give it to the bot — every module reads it, so the output is written for you and not for everyone.
    4. If you want it to produce ad assets, connect an ad-generation MCP (for example MaxFusion AI); otherwise it stops at the brief.
    5. From then on, ask for the marketing job you need — an audit, a hook matrix, an email sequence, a launch plan — and the right module runs it, scored, with an honest note on what it could not determine.
  note: 审计、文案和投放等任意选，交付不固定
---

Set yourself up as my marketing team using the open-source Marketing OS by Maxfusion.

1. Read this repository and install it as a skill: https://github.com/holy-templar/marketing-agi
2. It is fourteen modules — audit, GEO, copy, hooks, paid-ads, email, social, launch, positioning, competitive, app-store, analytics, plus a slop-pattern catalogue and scoring rubrics. Load the router first; load each module only when its task comes up.
3. Ask me to fill in brand-context (copy brand-context.template.md to brand-context.md). Read it before writing anything, so everything is in my brand's voice, not generic.
4. When I give you a marketing job, run the matching module, score the output 0-100 against its rubric, run the slop-pattern check on all prose, and tell me plainly what you could not determine.

Rules: use the repo's real modules and rubrics — never invent a module, a score, or a metric. Do not publish, send, or spend without showing me first. If an ad-generation MCP is connected you may produce the briefed assets; otherwise stop at the brief.