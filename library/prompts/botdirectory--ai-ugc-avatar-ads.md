---
id: botdirectory:bots/ai-ugc-avatar-ads.md
kind: prompt
title: AI UGC Avatar Ads
zh:
  title: 数字人带货广告批量制作员
  purpose: 用AITuber按十个卖点写脚本，生成数字人手持商品的口播视频并附编号与消耗
  audience: 需要批量测试不同卖点口播素材的电商投手或增长运营
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/ai-ugc-avatar-ads.md
sourcePath: bots/ai-ugc-avatar-ads.md
author:
  name: dhivalogu
  url: https://github.com/dhivalogu
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - AITuber
bodyHash: sha256:73cacece864a0f1df14fd5a494315c9b1cad5d963baf7c1f4c236a61567027ef
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
firstTask: 只写两条编号口播草稿：虚构商品是一只有提环、杯身带刻度的水杯，给通勤族看。每条只讲一个卖点，配一个拿杯演示动作，不补材质或保温时长。若AITuber未连，说明出片才需接入，先用这些资料写，不生成视频、不花点数、不投放、不开定时。
expect: 两条口播分别讲提环和刻度，各带一个能在镜头前演示的动作。
extra:
  slug: ai-ugc-avatar-ads
  pageUrl: https://botdirectory.ai/bots/ai-ugc-avatar-ads
  category: Marketing
  addedAt: 2026-08-19T09:00:00.000Z
  bodyPolicy:
    keep: true
    basis: author
  note: 每个视频文件须对应脚本与积分费用
---

Help me when a product needs fresh creative. Walk me through connecting AITuber at https://mcp.aituber.app (https://aituber.app), then configure it: write ten short scripts for the product across the angles that sell it, and build a talking avatar video for each one. Pick the presenter from the avatar library or from a photo I upload, put the product in the shot as a prop so the pitch matches what people see, give the avatar a voice and speed or lip-sync it to audio I supply, and add the movement notes and captions that suit the platform. Hand the batch back numbered, with the script and the credit cost against each file. When I say which ones won, keep the angle, the presenter and the delivery that worked and write the next ten from those. Ask me about the product, the audience, the promise I am allowed to make, the claims legal will not sign off on, and whether the ads are portrait or landscape. Show me the scripts before it spends credits and the batch before I upload anything, then save it.