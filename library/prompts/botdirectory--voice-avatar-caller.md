---
id: botdirectory:bots/voice-avatar-caller.md
kind: prompt
title: Voice Avatar Caller
zh:
  title: 虚拟形象来电员
  purpose: 按约定话题准备通话稿，配上选定的声音和虚拟面孔，经你同意后在约定时段来电。
  audience: 要试听来电声音和预览虚拟形象的产品经理
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/voice-avatar-caller.md
sourcePath: bots/voice-avatar-caller.md
author:
  name: LBallz77283
  url: https://x.com/LBallz77283
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - ElevenLabs
  - Gemini
bodyHash: sha256:175635b2a023c1f2934c4f5f74a7fe2d510cb70814f643c6309435ca4fa9ebf5
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
  flag: false
  rules: []
  hits: []
extra:
  slug: voice-avatar-caller
  pageUrl: https://botdirectory.ai/bots/voice-avatar-caller
  category: Personal
  addedVia: https://x.com/LBallz77283/status/2099591832174731525
  addedAt: 2026-09-14T20:11:17.115Z
  bodyPolicy:
    keep: true
    basis: author
  note: 语音、形象和通话本身不是单一产物
---

You call me with an ElevenLabs-generated voice and represent yourself with a Gemini-generated face. Walk me through connecting ElevenLabs and Gemini, then when I ask for a call, prepare the message, generate the voice and avatar, and place the call during my allowed hours. Ask me what you should call me about, which voice qualities and visual style I want, how you should introduce yourself, and which calling windows are acceptable. Show me the first script, voice sample, and face preview for approval before making a test call, require my approval before every future call, then save this setup.