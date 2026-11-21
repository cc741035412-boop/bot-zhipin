---
id: grokbotdev:content/use-cases/give-grok-bot-reliable-youtube-access.md
kind: prompt
title: Researcher · YouTube Transcript Access
zh:
  title: 视频转写简报员
  purpose: 读出指定视频的转写稿，把有用的发现写成简报，每条都附上能跳到原处的时间戳。
  audience: 常从海外视频频道搜集产品案例的研究员
source: ZeroPointRepo/GrokBotDev
sourceUrl: https://github.com/ZeroPointRepo/GrokBotDev/blob/48fec858f3968e12cb149ad205fe4ff059d8f2d1/content/use-cases/give-grok-bot-reliable-youtube-access.md
sourcePath: content/use-cases/give-grok-bot-reliable-youtube-access.md
author:
  name: scheemunai
  url: https://x.com/scheemunai
license: CC-BY-4.0
attribution:
  by: GrokBot.dev contributors
  repo: ZeroPointRepo/GrokBotDev
  license: CC BY 4.0
  licenseUrl: https://creativecommons.org/licenses/by/4.0/
fetchedAt: 2026-11-21T06:44:43Z
changes: 只收「## Prompt」下代码块里的提示词原文，一字未改；原页面的设置步骤和点评没有收；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
bodyHash: sha256:b6a7e388425b04a6114aecb30a9b551278157446d771476200a74ee3679a7ad0
score: 3
rubric:
  task: false
  input: true
  steps: true
  acceptance: true
  approval: false
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
  provenance: author
  setupMinutes: 5
  difficulty: beginner
  autonomy: acts-with-approval
  schedule: daily
  category: work
  subcategory: research
  awesomeScore: 85
  replicability: The install and example prompts below are @scheemunai's verbatim text from the article. You need the TranscriptAPI plugin (github.com/ZeroPointRepo/transcriptapi-plugin) and a free TranscriptAPI account - authorize it once, then drive YouTube in plain language.
  status: live
  setup: |-
    @scheemunai's first test for any new agent is YouTube: hand it a video and ask it to read the transcript, summarize, find a moment, or research across channels. Opening YouTube is easy - the question is whether the agent can work with what's *inside* the video.

    With Grok Bot on browser control alone, it couldn't. The video played fine on its computer, but when asked to summarize it the Bot's caption API call was blocked from its IP, YouTube's transcript panel came up empty, and it fell back to scrolling the transcript one piece at a time. After several attempts and two nudges it gave up - and by then the entire Grok Bot trial had been spent on one video.

    The fix is the [TranscriptAPI plugin](/plugins/transcriptapi/): it hands the Bot **timestamped transcripts, YouTube search, channel browsing and playlists in a single request**, instead of making it inspect-click-wait-scroll through YouTube's transcript drawer. To install it, send this to the Bot:
  note: 多个独立应用示例，未设具体动作门禁
---

Install the TranscriptAPI plugin from https://github.com/ZeroPointRepo/transcriptapi-plugin and use it whenever I ask you to work with YouTube. Set it up and test it on the Huberman video in this chat.