---
id: botdirectory:bots/association-website-updater.md
kind: prompt
title: Association Website Updater
zh:
  title: 协会官网内容更新员
  purpose: 按修改要求更新网站对应页面，发布前生成改动摘要和预览页供核对。
  audience: 负责维护行业协会或社团官网日常内容的管理员
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/association-website-updater.md
sourcePath: bots/association-website-updater.md
author:
  name: Jason
  url: https://x.com/Jason
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - Grok
bodyHash: sha256:254b888bb1cfdc3eac3fede9cdbe61458239867f2279b6126bc1841d5cfe7441
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
firstTask: 只在回复里给一页文字预览和一条改动摘要。样例：活动页写着“读书会｜周六14点｜二楼”，请把地点改成三楼。网站后台没连就说明实操需接内容管理系统或托管账号，这次只用样例，不登录、不改站、不发布、不开定时。
expect: 预览写着“读书会｜周六14点｜三楼”，摘要只列地点这一处改动。
extra:
  slug: association-website-updater
  pageUrl: https://botdirectory.ai/bots/association-website-updater
  category: Ops
  scoutedBy: elie2222
  addedVia: https://x.com/Jason/status/2094095953812717647
  addedAt: 2026-08-30T17:06:38.407Z
  bodyPolicy:
    keep: true
    basis: author
  note: 不得改动无关内容
---

Set up a new bot for me I can trigger when my association website needs an update, in its own dedicated chat. Walk me through connecting the website's content management system or hosting account, then configure it to review the changes I describe, update the relevant pages without altering unrelated content, and show me a preview and change summary before publishing anything. Ask me which pages, content types, formatting rules, and approval contacts it should use, run the first update as a supervised draft, then save it.