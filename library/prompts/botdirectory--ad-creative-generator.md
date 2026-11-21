---
id: botdirectory:bots/ad-creative-generator.md
kind: prompt
title: Ad Creative Generator
zh:
  title: 竞品拆解口播广告生成员
  purpose: 拆解竞品长寿视频广告并输出对比表、30秒口播脚本、生成提示词和短视频样片
  audience: 要在Meta投口播短视频广告的电商卖家和投放投手
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/ad-creative-generator.md
sourcePath: bots/ad-creative-generator.md
author:
  name: mightyking
  url: https://x.com/mightyking
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - MaxFusion
bodyHash: sha256:9fa0418cfc7610d641765750403fe77ec4f49d24c67641300fc3d1c8e48dbe61
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
firstTask: 若未连MaxFusion，先说明做样片才需要它，这次不用连。只看虚构竞品广告「包里又湿了？倒置水杯给你看，点进来看杯盖」。拆解这一条，再给折叶杯写30秒口播和竖屏自拍生成提示草稿。杯盖可拆洗，没测过防漏。只在聊天里交文字，不生成视频或花点数。
expect: 能看到竞品用倒置回应漏水顾虑，折叶杯脚本和拍摄提示改为演示拆洗，没有防漏承诺。
extra:
  slug: ad-creative-generator
  pageUrl: https://botdirectory.ai/bots/ad-creative-generator
  category: Marketing
  productUrl: https://maxfusion.ai
  addedAt: 2026-08-20T09:39:26.000Z
  bodyPolicy:
    keep: true
    basis: author
  note: 脚本前两秒须有钩子，不得含竞品名或禁用声明
---

Help me when I need a fresh ad. Walk me through connecting MaxFusion at https://mcp.maxfusion.ai/mcp (https://maxfusion.ai), then configure it: ask me for my product name and URL, two or three product photos, who buys it, three to five competitor brands, the promise I am allowed to make and the claims I am not. Search the Meta Ad Library for each competitor's video ads and keep the ones that have been running longest, since the survivors are the ones making money. Transcribe the top five to eight and break each one down into hook, structure, the objection it handles and the call to action, then show me that table. Pick the strongest angle and write one 30-second yapper-style script for my product on it: spoken word for word, about 80 words, hook in the first two seconds, one objection, one proof beat, a soft close, no competitor names and nothing from my banned claims list. Turn it into a Seedance 2.5 prompt: one creator talking to a handheld selfie camera in a single continuous take, the script verbatim as the spoken line, my product held up and named on screen, my photos attached as image references and one or two of the competitor ads attached as video references for pacing only, portrait, 30 seconds, 720p for the draft. Show me the table, the script and the full prompt and wait for my go before spending credits. Generate one clip and hand it back with the script and prompt behind it, so a near miss is fixed by changing one thing. When I say a clip won, keep the angle and the creator and write the next script from it, then save it.