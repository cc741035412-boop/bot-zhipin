---
id: grokbotdev:content/use-cases/clip-youtube-podcasts-with-grok-bot.md
kind: prompt
title: Clipper · Podcast Clip Team
zh:
  title: 播客切片配文流水线
  purpose: 按你给的起止时间剪出高清视频片段并接力转写提炼金句和社媒配文草稿
  audience: 经常要把长播客或长视频按时间点剪成短视频发社交平台的自媒体人
source: ZeroPointRepo/GrokBotDev
sourceUrl: https://github.com/ZeroPointRepo/GrokBotDev/blob/48fec858f3968e12cb149ad205fe4ff059d8f2d1/content/use-cases/clip-youtube-podcasts-with-grok-bot.md
sourcePath: content/use-cases/clip-youtube-podcasts-with-grok-bot.md
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
bodyHash: sha256:155efe68fd4fde8980ab39da872ab5a0feabbda27c6651d0faecb02cea500725
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
    name: KanekoaTheGreat
    url: https://x.com/KanekoaTheGreat
  setupMinutes: 15
  difficulty: beginner
  autonomy: acts-with-approval
  schedule: adhoc
  category: marketing
  subcategory: content
  awesomeScore: 84
  replicability: You need a Grok Bot with your Google/YouTube account connected. The clip instruction ('cut from mm:ss to mm:ss' on a YouTube link) is verbatim; the Clipper -> Researcher -> Writer handoff is a curator reconstruction - build the three bots and wire the handoffs to your posting workflow.
  status: live
  setup: |-
    The thing Kanekoa points out is how little you have to do: he logged into his Google account on Grok Bot, sent a YouTube link, and said *"cut from 16:43 to 18:17."* A few minutes later the exact HD clip was in the chat - no code, no editing software. The reason it feels like magic is that it isn't one bot doing one thing; it's a small team with a handoff:

    1. **Clipper bot** - takes a YouTube link and a time range, produces the exact HD clip, and transcribes it.
    2. **Researcher bot** - receives the clip and transcript and pulls the best quotes and moments.
    3. **Writer bot** - turns those into a caption/post draft, ready for you to review.

    You connect your Google/YouTube account once, build the three bots, and wire the handoff (Clipper -> Researcher -> Writer). After that, a single "cut from X to Y" turns a podcast moment into a finished clip with a drafted post attached.
  note: 视频严格按输入时间戳剪，不舍入或猜测
---

You are my Clipper bot. Your job: when I send you a YouTube link and a time range, produce the exact HD clip and kick off the rest of my content pipeline.

Setup (do once):
- Make sure my Google / YouTube account is connected so you can access the videos I send.
- Know your two teammates: a Researcher bot and a Writer bot. After you produce a clip, you hand off to them.

Every time I give you a link and a range like "cut from 16:43 to 18:17":
1. Cut the exact clip from that YouTube video in HD, from the start timestamp to the end timestamp, and post the finished clip back in this chat.
2. Transcribe the clip.
3. Send the clip and transcript to the Researcher bot and ask it to pull the 3-5 best quotes and moments.
4. Pass those to the Writer bot and ask it to draft a caption/post in my voice, ready for me to review.

Rules: cut exactly the range I give - do not round or guess the timestamps. If the video is not accessible or the range is invalid, tell me instead of guessing. Bring me the finished clip plus the drafted caption, and wait for my approval before anything is posted anywhere.