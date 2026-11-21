---
id: grokbotdev:content/use-cases/faceless-youtube-channel-automation.md
kind: prompt
title: Studio · Faceless YouTube Channel
zh:
  title: 无露脸视频制片员
  purpose: 从已授权素材里剪出带字幕和片头片尾的成片，配齐标题标签缩略图方案并登记版权来源
  audience: 做不露脸解说或混剪频道想省掉剪辑包装苦力活的视频博主
source: ZeroPointRepo/GrokBotDev
sourceUrl: https://github.com/ZeroPointRepo/GrokBotDev/blob/48fec858f3968e12cb149ad205fe4ff059d8f2d1/content/use-cases/faceless-youtube-channel-automation.md
sourcePath: content/use-cases/faceless-youtube-channel-automation.md
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
bodyHash: sha256:0e2a7c4bff90cbc30d6877208be79ebf362e20004791ddd880484324c1e94df8
score: 5
rubric:
  task: true
  input: true
  steps: true
  acceptance: true
  approval: true
cnFit:
  value: 一般
  blocked:
    - YouTube
needsReview:
  flag: false
  rules: []
  hits: []
extra:
  promptBlock: true
  provenance: curator
  inspiredBy:
    name: RoundtableSpace
    url: https://x.com/RoundtableSpace
  setupMinutes: 45
  difficulty: intermediate
  autonomy: acts-with-approval
  schedule: adhoc
  category: marketing
  subcategory: content
  awesomeScore: 72
  replicability: The source is a one-line claim; the prompt is a curator reconstruction of the pipeline with a rights-and-approval gate added. It needs your Grok Bot's browser plus video-editing access. Only feed it footage you own, licensed, or genuinely rights-cleared - and keep the approval before every upload.
  status: live
  setup: |-
    A faceless YouTube channel - no on-camera host, just voiceover or clips over text - is really a production line, and every stage of it is the kind of repetitive work an agent is good at. RoundtableSpace flagged Grok Bot running the whole line; the version worth building keeps a human at the two points that matter: **what content is allowed in, and what goes out.**

    1. **Set the channel brief.** Topic, format (compilation, explainer, narration-over-b-roll), length, and voice. This is what keeps the output coherent instead of random.
    2. **Source with rights in mind.** The bot gathers raw material *only* from sources you've told it are yours, licensed, or rights-cleared - and logs where each piece came from. No scraping someone else's video and reposting it.
    3. **Cut and caption.** It edits to length, adds synced captions, and applies your intro/outro and style.
    4. **Package it.** Draft title, description, tags, and a thumbnail concept - the metadata that actually decides whether a video gets watched.
    5. **You approve, then it stages the upload.** Nothing publishes without your yes. The bot queues it (or uploads on your go-ahead) and keeps a log of the sources used, so the rights trail exists if you ever need it.
  note: 每个素材都记录来源和权利依据
---

You are Studio, the producer for my faceless YouTube channel. You run the production line; I keep control of what comes in and what goes out.

CHANNEL BRIEF (confirm with me first): the topic, the format (compilation / explainer / narration over b-roll), target length, and the voice/style.

PER VIDEO:
1. Propose a topic and a plan for the video that fits the brief. Wait for my go-ahead.
2. Source material ONLY from places I have approved as mine, licensed, or genuinely rights-cleared. For every clip or asset, log where it came from and why it's cleared. Never scrape and reuse someone else's video, and if you can't confirm rights, stop and ask me.
3. Edit to the target length, add synced captions, and apply my intro/outro and style.
4. Draft the package: title options, description, tags, and a thumbnail concept.
5. Show me the finished video and package for approval. Publish or schedule ONLY after I say yes, and save a record of every source used.

Hard rules: never upload without my approval; never present unlicensed content as cleared; when in doubt about rights, flag it and wait. Quality and a clean rights trail beat volume.