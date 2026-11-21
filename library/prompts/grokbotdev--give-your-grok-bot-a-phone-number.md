---
id: grokbotdev:content/use-cases/give-your-grok-bot-a-phone-number.md
kind: prompt
title: Caller · Bot With a Phone
zh:
  title: 电话外呼与留言助理
  purpose: 接电话接口代打外呼并带回通话结果与录音，把收到的语音留言转写进对话框
  audience: 需要电话预约餐厅诊所或想随时打电话给它留任务的人
source: ZeroPointRepo/GrokBotDev
sourceUrl: https://github.com/ZeroPointRepo/GrokBotDev/blob/48fec858f3968e12cb149ad205fe4ff059d8f2d1/content/use-cases/give-your-grok-bot-a-phone-number.md
sourcePath: content/use-cases/give-your-grok-bot-a-phone-number.md
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
bodyHash: sha256:2704753c332c0460f5f04a3bb97665a271236a0abf9259cfac01c9e5431fc314
score: 4
rubric:
  task: false
  input: true
  steps: true
  acceptance: true
  approval: true
cnFit:
  value: 好
  blocked: []
needsReview:
  flag: true
  rules:
    - R-pay
  hits:
    - rule: R-pay
      excerpt: I pay by the minute
extra:
  promptBlock: true
  provenance: curator
  inspiredBy:
    name: SPCXTSLA
    url: https://x.com/SPCXTSLA
  setupMinutes: 10
  difficulty: beginner
  autonomy: acts-with-approval
  schedule: adhoc
  category: personal
  subcategory: home
  awesomeScore: 85
  replicability: "Peter describes the setup; the prompt below is a curator reconstruction with call-safety rails added. You need a Bland account, a purchased number (~$15), and your API key - the bot reads the docs and wires itself up. Cross-linked: see the Bland plugin page."
  status: live
  setup: |-
    The whole setup, in Peter's words, was: buy a phone number on [Bland](/plugins/bland/) for $15, give the bot the API key, and "it works out the rest." No connector, no configuration - the bot reads the API docs and wires itself up.

    What he got for it:

    - **Outbound calls on instruction.** "Call someone with these instructions" - the bot places the call, has the conversation, and reports back how it went. The recording is there if he asks for it.
    - **A voice of his own.** From a 10-second recording of his voice, it created a new voice that sounded like him.
    - **Inbound voicemail.** He can call the Bland number and leave a voicemail - the bot hears it and adds it to the chat, which turns the number into a way to hand your bot tasks by phone.

    All of it driven from chat. The prompt below reproduces the setup and adds the safety rails a phone-capable bot should have from day one.
  note: 外呼、语音信箱、语音定制是多个任务
---

You now have a phone line. Here is my Bland API key: [API KEY]. My Bland number: [NUMBER, or "look it up"]. Read Bland's docs and wire yourself up to place and receive calls - then confirm what you can do.

How we work from here:
1. When I ask you to call someone with instructions, first show me: who you are calling, the number, and the goal of the call in one line. When I say go, place the call, have the conversation, and report back with how it went. Keep the recording and share it when I ask.
2. Check the number for inbound voicemails. When someone leaves one, transcribe it into our chat - if it is me leaving you a task, treat it like a message from me and confirm what you will do.
3. If I give you a short recording of my voice and explicitly ask, create a voice from it for calls where I want the bot to sound like me. Never clone anyone else's voice, and never use my voice to deceive someone about who is on the line.

Rules that never change: a call reaches a real person - no dialing without my go-ahead on the who and why; be honest that you are an AI assistant calling on my behalf if asked; no calls to emergency services; respect "take me off your list" immediately; and keep calls as short as the job allows - I pay by the minute.