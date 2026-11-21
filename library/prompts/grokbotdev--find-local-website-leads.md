---
id: grokbotdev:content/use-cases/find-local-website-leads.md
kind: prompt
title: Lead Finder · Web Design
zh:
  title: 建站潜客搜寻员
  purpose: 按指定地区和行业搜出官网老旧或损坏的本地商家，附网址问题、联系方式和开发信
  audience: 接企业建站或改版外包、需要批量找本地潜客的设计师和工作室
source: ZeroPointRepo/GrokBotDev
sourceUrl: https://github.com/ZeroPointRepo/GrokBotDev/blob/48fec858f3968e12cb149ad205fe4ff059d8f2d1/content/use-cases/find-local-website-leads.md
sourcePath: content/use-cases/find-local-website-leads.md
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
bodyHash: sha256:5cfa0187f4720c0a28be5078d81193734120b06124e306e8b8132c7915f77291
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
firstTask: 只用两条虚构的杭州花店记录模拟筛选：甲店的手机端预约按钮被遮住，联系页是 a.invalid/contact；乙店手机预约正常。按记录挑一家，注明问题和联系路径，写一封待确认问题的短邮件草稿。别说你看过网站，不查店、不联系、不开定时。
expect: 只列甲店和样例联系页，附一封询问手机预约按钮是否被遮挡的邮件草稿。
extra:
  promptBlock: true
  provenance: curator
  inspiredBy:
    name: bennash
    url: https://x.com/bennash
  setupMinutes: 15
  difficulty: beginner
  autonomy: readonly
  schedule: none
  category: sales
  subcategory: prospecting
  awesomeScore: 58
  replicability: "A Curator reconstruction of Ben's run. To adapt: tell the bot your service, target area, and what 'needs a new website' means (none, outdated, not mobile-friendly). Treat the drafted emails as first drafts — his leads were strong but the copy needed his rewrite."
  status: live
  setup: |-
    1. Tell the bot what you sell (web design/redevelopment) and your target: area, business types, and what 'needs a new website' means — no site, an outdated one, not mobile-friendly, slow, broken.
    2. Have it search for local businesses matching that and qualify each against your criteria — Ben's run returned 50 strong leads.
    3. For each lead, have it capture the useful details (name, what's wrong with the current site, contact) and draft a short outreach email.
    4. Treat the emails as first drafts — Ben's point is the leads were exactly right but the copy needed his personal rewrite before sending.
    5. Review, personalize, and send the ones worth pursuing yourself.
  note: 逐条写核实的网站问题及查看的网址
---

Find me local businesses that need a new or better website, and draft outreach for each. I offer web design.

1. Search my target area and business types (I'll give them to you) for businesses whose web presence is weak: no website, an outdated or not-mobile-friendly one, slow, or broken.
2. Qualify each against that — only include real, checkable cases, and note specifically what's wrong with their current site (with the URL you looked at).
3. For each qualified lead, capture: business name, the problem with their current site, and a contact path.
4. Draft a short, specific outreach email for each — reference the actual problem you found, not a generic pitch.

Rules: never invent a business, a URL, or a problem you didn't verify — a lead I can't check is worse than no lead. Give me the leads as a list I can scan, with the drafted email under each. I'll personalize and send them myself.