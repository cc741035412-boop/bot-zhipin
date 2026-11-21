---
id: botdirectory:bots/reddit-comment-finder.md
kind: prompt
title: Reddit Comment Finder
zh:
  title: 社区选帖员
  purpose: 从 Reddit 挑出值得回的帖子，附上链接和你能补充的观点。
  audience: 想用专业经验参与海外社区讨论的产品经理
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/reddit-comment-finder.md
sourcePath: bots/reddit-comment-finder.md
author:
  name: kr0der
  url: https://x.com/kr0der
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - Reddit
bodyHash: sha256:7b09e5454b5773a9997cd24cdebe84476495ce7cdbbae71de084e27e215a8d0d
score: 4
rubric:
  task: true
  input: true
  steps: true
  acceptance: true
  approval: false
cnFit:
  value: 一般
  blocked:
    - Reddit
needsReview:
  flag: false
  rules: []
  hits: []
extra:
  slug: reddit-comment-finder
  pageUrl: https://botdirectory.ai/bots/reddit-comment-finder
  category: Marketing
  scoutedBy: elie2222
  addedVia: https://x.com/kr0der/status/2089458244934881567
  addedAt: 2026-08-18T14:14:28.976Z
  bodyPolicy:
    keep: true
    basis: author
  note: 未明确禁止评论或要求先审批
---

Find Reddit conversations where I can provide useful comments when I ask. Walk me through connecting Reddit, then configure it: search for recent, relevant posts in communities related to my topics and goals, filter out low-quality or irrelevant threads, and give me the post links with a short explanation of why each is a good fit and the value I could add. Ask me which topics, subreddits, audiences, and types of posts to prioritize, do the first search with me watching, then save it for on-demand runs.