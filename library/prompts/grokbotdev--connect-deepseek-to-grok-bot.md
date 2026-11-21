---
id: grokbotdev:content/use-cases/connect-deepseek-to-grok-bot.md
kind: prompt
title: Connect DeepSeek (or any LLM) to your Grok Bot and route work by cost
zh:
  title: 高低模型省钱分流器
  purpose: 把批量提取和调接口等杂活分流给低价外部模型并把复杂推理留给主力模型
  audience: 经常跑大量批处理任务且想省下主力模型高额调用费的团队负责人
source: ZeroPointRepo/GrokBotDev
sourceUrl: https://github.com/ZeroPointRepo/GrokBotDev/blob/48fec858f3968e12cb149ad205fe4ff059d8f2d1/content/use-cases/connect-deepseek-to-grok-bot.md
sourcePath: content/use-cases/connect-deepseek-to-grok-bot.md
author:
  name: thomasheimann
  url: https://x.com/thomasheimann
license: CC-BY-4.0
attribution:
  by: GrokBot.dev contributors
  repo: ZeroPointRepo/GrokBotDev
  license: CC BY 4.0
  licenseUrl: https://creativecommons.org/licenses/by/4.0/
fetchedAt: 2026-11-21T06:44:43Z
changes: 只收「## Prompt」下代码块里的提示词原文，一字未改；原页面的设置步骤和点评没有收；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
bodyHash: sha256:ad7aa2c81085d087968b2795acaa45904bcacd20e1171272fa9690462e54c2f8
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
firstTask: 只在回复里模拟一次模型分工。样例工单是「导出慢」「找不到账单」：给工单打标签是一项任务，判断先改哪个问题是另一项。各选低价模型或主力模型，写一句理由。外部模型接口未接入就注明，只用样例，不索要密钥、不调用接口、不改配置、不开定时。
expect: 分工表有两行，打标签归低价模型，优先级判断归主力模型，每行都有理由。
extra:
  promptBlock: true
  provenance: author
  setupMinutes: 10
  difficulty: intermediate
  autonomy: acts-with-approval
  schedule: none
  category: engineering
  subcategory: agents-ops
  awesomeScore: 82
  replicability: Thomas Heimann's exact directive (below), verbatim. You provide a DeepSeek API key - or swap in any OpenAI-compatible model and endpoint; the bot stores it securely and only asks when ready. 'HighLevel' is just the author's example bot name - sub in any of yours.
  status: live
  setup: |-
    Grok Bot's native model is powerful but it's also the expensive pool. Most agent work - CRM ops, API calls, browser actions, bulk extraction and classification - doesn't need that reasoning depth. This directive makes your orchestrator bot register a cheap, fast model (DeepSeek V4 Flash) as a permanent tool and then route work to it intelligently.

    1. Get a **DeepSeek API key** - or pick any OpenAI-compatible model and endpoint you'd rather route to.
    2. Paste the directive below into your **Chief of Staff / Orchestrator bot**.
    3. When the bot asks, hand it the key. It stores it securely (environment variable or protected secrets file), **never hard-coded or logged**.
    4. From then on the bot **auto-routes**: mechanical ops / tool-use / bulk work goes to the cheap fast model, while native Grok is reserved for deep reasoning - and anything customer-facing or compliance-sensitive still comes back to you for approval.
  note: 工具接收提示与消息，凭据不硬编码或记日志
---

Command for Chief of Staff / Orchestrator Bot:
Please execute the following setup completely and confirm when finished.

1. Add DeepSeek V4 Flash as a permanent tool/model
Register DeepSeek V4 Flash (model ID: deepseek-v4-flash or the exact current official ID) as a callable external model/tool.
Endpoint: https://api.deepseek.com/v1 (OpenAI-compatible).
Ask me for the API key only when you are ready to store it securely (environment variable or protected secrets file on the cloud computer - never hard-code or log it).
Create a clean, reusable tool named call_deepseek_v4_flash that:
- Accepts system prompt + user message (or conversation context).
- Calls the model with sensible defaults for speed and tool-use (temperature ~0.2-0.5, adequate max tokens).
- Returns the full response cleanly so you (and other bots) can use it.
Make this tool permanently available to all bots, especially you.

2. Your new decision rules for when to use DeepSeek V4 Flash
DeepSeek V4 Flash is a very capable, fast, and extremely cost-efficient model that is excellent at tool use, API work, browser actions, and high-volume accurate processing. It is not as strong on pure deep reasoning or high-stakes judgment as native Grok (or future stronger models such as Kimi K3).
Always prefer DeepSeek V4 Flash for these job classes:
- HighLevel ops / API calls / browser work / tool-heavy execution
- Bulk extraction, classification, data processing, and high-volume accurate tasks
- Any fast tool-using or operational work where speed and cost matter more than maximum reasoning depth
Reserve native Grok (or stronger models later) for:
- True high-level strategic reasoning, complex judgment calls, prioritization of major initiatives, nuanced synthesis, and situations where reasoning strength is the primary requirement
- Final customer-facing or compliance-sensitive drafts that need the strongest available model + my approval
Your required decision process:
- Classify the task.
- If it is HighLevel ops, API/browser/tool work, bulk extraction, or classification -> call DeepSeek V4 Flash first.
- If it is deep strategic/judgment work -> use native Grok (or escalate to me).
- You may call DeepSeek in parallel or as a first pass even on borderline tasks if it can handle the mechanical parts efficiently.
- If DeepSeek underperforms twice on the same class of task, note it and escalate one tier.
- Always keep a brief internal log of when and why you chose DeepSeek so we can refine the rules.

3. Make the change permanent
Update your own profile, system instructions, and any relevant routines so these routing rules are always active.
Create a short skill/routine called /deepseek that forces a DeepSeek V4 Flash consultation on the current task.
Ensure other bots know to route HighLevel ops / bulk work through you (or directly to the new tool) rather than burning the native Grok pool.

4. Test and confirm
When the setup is complete, reply with:
- Confirmation that the DeepSeek V4 Flash tool is live and the key is stored securely.
- The exact decision rules you will now follow (copy them back to me).
- A short live example: take a sample HighLevel ops or bulk-extraction task and show the flow of you calling DeepSeek V4 Flash.
- Any remaining steps I need to take (e.g., providing the API key).

Execute this now. Ask me for the DeepSeek API key only when you are ready to store it securely.