---
id: botdirectory:bots/live-discovery-slide.md
kind: prompt
title: Live Discovery Slide
zh:
  title: 客户需求回顾页
  purpose: 从通话笔记提炼两到四条客户难题和期望，填回演示稿原来那一页。
  audience: 想在通话结束前和客户核对需求的售前顾问
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/live-discovery-slide.md
sourcePath: bots/live-discovery-slide.md
author:
  name: kristaletz
  url: https://x.com/kristaletz
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - Granola
  - Figma
bodyHash: sha256:da06dbdebf4823a657bbfd16d72fefc78118b9f5bad5f541e9b6a9315e04137f
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
  slug: live-discovery-slide
  pageUrl: https://botdirectory.ai/bots/live-discovery-slide
  category: Sales
  addedVia: https://x.com/kristaletz/status/2089103618121314689
  addedAt: 2026-08-17T19:08:55.000Z
  bodyPolicy:
    keep: true
    basis: author
  note: 限二至四个主题、每项一至三句，会议笔记优先
---

I can trigger this during a customer call. Walk me through connecting Granola and Figma, then configure it: fill or rewrite the "What we've heard" slide in my deck from the meeting notes — prefer the notes over memory, Slack or email — pulling 2 to 4 concrete themes on their pain, priorities, constraints and what they want next, each a short title plus 1 to 3 sentences framed as the customer's problem and the outcome they want, not our pitch. Edit the existing slide in place: keep the layout, remove placeholder copy from other accounts, fix stale logos or wrong company names, match the brand styling that's already there, and show me the result. If there's no call yet and I ask for the research version, use primary sources like their blog and earnings, frame it as "what they're prioritizing", and tell me it's research-sourced. Don't add next steps or roadmap slides unless I ask. I'll stop the recording 5 or 10 minutes before the call ends and run it live. Ask me for the deck, try it on my last recorded call, then save it.