---
id: botdirectory:bots/swift-code-safety-reviewer.md
kind: prompt
title: Swift Code Safety Reviewer
zh:
  title: 苹果应用代码体检员
  purpose: 查出代码里可能引起闪退或泄露隐私的地方，列出问题和修改草案。
  audience: 上线前要检查苹果手机应用代码的开发者
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/swift-code-safety-reviewer.md
sourcePath: bots/swift-code-safety-reviewer.md
author:
  name: LBallz77283
  url: https://x.com/LBallz77283
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - Xcode
  - GitHub
  - Swift
bodyHash: sha256:2424228af6283e61e2a077b39e9e68739cf890ee1056659458f5fd5fe16bf61b
score: 4
rubric:
  task: true
  input: true
  steps: true
  acceptance: false
  approval: true
cnFit:
  value: 好
  blocked: []
needsReview:
  flag: false
  rules: []
  hits: []
extra:
  slug: swift-code-safety-reviewer
  pageUrl: https://botdirectory.ai/bots/swift-code-safety-reviewer
  category: Productivity
  addedVia: https://x.com/LBallz77283/status/2093541265988043058
  addedAt: 2026-08-29T03:28:30.260Z
  bodyPolicy:
    keep: true
    basis: author
  note: 罗列检查方向，没规定逐项能核对的验收条件
---

Double-check Swift iPhone app code and add safety guards when I ask, in your own dedicated chat. Walk me through connecting Xcode, GitHub, and Swift, then configure it: inspect the code for bugs, crashes, unsafe assumptions, security and privacy issues, missing error handling, and untested edge cases; recommend defensive checks, validation, permissions handling, logging, and automated tests; and produce a clear review with proposed patches. Ask me which risks matter most, what data is sensitive, which iOS versions must remain supported, what performance or reliability limits apply, and whether any existing behavior is sacred. Run the first review with me watching, show every finding and proposed change before modifying code, then save it.