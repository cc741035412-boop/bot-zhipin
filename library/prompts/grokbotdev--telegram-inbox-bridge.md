---
id: grokbotdev:content/use-cases/telegram-inbox-bridge.md
kind: prompt
title: Bridge · Telegram Front Door
zh:
  title: 电报消息收发桥接器
  purpose: 搭建本地监听服务与自定义连接器，把电报机器人的私聊消息落盘转发并回传回复
  audience: 想通过电报跟自家机器人收发私聊消息的个人开发者
source: ZeroPointRepo/GrokBotDev
sourceUrl: https://github.com/ZeroPointRepo/GrokBotDev/blob/48fec858f3968e12cb149ad205fe4ff059d8f2d1/content/use-cases/telegram-inbox-bridge.md
sourcePath: content/use-cases/telegram-inbox-bridge.md
license: CC-BY-4.0
attribution:
  by: GrokBot.dev contributors
  repo: ZeroPointRepo/GrokBotDev
  license: CC BY 4.0
  licenseUrl: https://creativecommons.org/licenses/by/4.0/
fetchedAt: 2026-11-21T06:44:43Z
changes: 只收「## Prompt」下代码块里的提示词原文，一字未改；原页面的设置步骤和点评没有收；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - Telegram
bodyHash: sha256:d93727ba97474963d885934a855dadd8d6c23848bd5b9de1ab06819b105d7126
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
    - Telegram
needsReview:
  flag: true
  rules:
    - R-credential
    - R-upload
  hits:
    - rule: R-credential
      excerpt: Token is read from the token file
    - rule: R-upload
      excerpt: POST /telegram-webhook only
extra:
  promptBlock: true
  provenance: author
  setupMinutes: 60
  difficulty: advanced
  autonomy: acts-with-approval
  schedule: adhoc
  category: engineering
  subcategory: agents-ops
  awesomeScore: 87
  replicability: Reconstructed from Matthew Berman's "11 INSANE Use Cases for Grok Bot" walkthrough. Adapt the connected accounts and context to your own stack; the prompt is the author’s own published text.
  status: live
  setup: |-
    1. Create your own Telegram bot through BotFather and keep the token private.
    2. Paste the reconstructed prompt below — it is the most operationally specific of the three, and it names the fixes for the failures you will hit.
    3. Follow its guidance to run inbound as a **cron** routine draining a spool rather than a webhook routine (the agent cannot see the URL or sender key, and opening a webhook front can crash the UI).
    4. Let it handle the known gotchas it documents: the Cloudflare quick-tunnel resolve failure and smee.io relay, the getUpdates 409 after setWebhook, and the ~5s sendChatAction typing expiry that needs a ~4s refresh loop.
    5. Never print the bot token, webhook secret, or public webhook URL in chat.
  note: 缺密钥拒绝启动，更新落盘后才确认
---

Set up Telegram inbound for this Grok Bot the way an OpenClaw Telegram webhook works. I am not on anyone else’s team. Use my own BotFather bot. Do not print the bot token, webhook secret, or public webhook URL in chat.

Context you should assume:
- Grok Bot has no native Telegram channel. Slack is the native one. Do not wait for a built-in Telegram integration.
- A Grok Bot “webhook” routine is the wrong public front. The agent cannot see the public URL or sender key, and opening that routine can crash the UI (trigger has no platform). Do not create a Grok Bot webhook routine for this.
- OpenClaw’s working pattern: local HTTP listener on 127.0.0.1:8787, path /telegram-webhook, health /healthz, required secret, validate X-Telegram-Bot-Api-Secret-Token with a constant-time compare, persist the update, then 200. Process async. Register with Telegram setWebhook(publicHttpsUrl, { secret_token }). No secret means refuse to start.
- Telegram setWebhook needs public HTTPS. A Cloudflare quick tunnel (*.trycloudflare.com) often fails Telegram’s checker with “Failed to resolve host” even when the tunnel works locally. If that happens, put a public HTTPS relay in front (smee.io works: Telegram POSTs to smee, smee-client forwards to http://127.0.0.1:8787/telegram-webhook including the secret header).
- Once setWebhook is active, getUpdates 409s. Never poll getUpdates in webhook mode.
- Telegram sendChatAction typing lasts about 5 seconds. One shot is not enough. Keep refreshing every ~4s until the inbound update is processed and the reply is sent.

Do this, in order:

1. Ask me for a BotFather token if you do not already have one. Store it in a 0600 file on your computer, e.g. ~/.local/telegram-mcp/token. Prefer a secret-request / credential field over having me paste it in chat. Optional env TELEGRAM_BOT_TOKEN is fine as a fallback.

2. Build a small stdio MCP server on your computer (official @modelcontextprotocol/sdk + Zod, Node). Hand-rolled Python MCP that is not NDJSON/Content-Length compatible will time out when Grok Bot hosts it. Register it as a custom connector. Tools to expose:
   - tg_get_me
   - tg_send_message (chat_id, text)
   - tg_send_chat_action (chat_id, action default typing)
   - tg_list_spool / tg_ack_spool (optional if you also read spool files directly)
   - tg_webhook_info (getWebhookInfo + local /healthz; never return secrets)
   - tg_get_updates only for first-time setup before the webhook is set
   Token is read from the token file. Never log or print it.

3. Call tg_get_me and tell me the bot @username so I can open it. I will send /start. Capture my numeric chat id from that first DM and remember it. Only send to chats I have already messaged, unless I name a chat.

4. Write the OpenClaw-shaped listener (Node is fine, no extra framework required):
   - bind 127.0.0.1:8787
   - GET /healthz → 200 ok
   - POST /telegram-webhook only
   - require a non-empty webhook secret in a 0600 file; mint one with openssl rand -hex 32 if missing
   - reject missing/wrong X-Telegram-Bot-Api-Secret-Token with 401
   - body limit ~1MB
   - atomically write each update to ~/.local/telegram-mcp/spool/<update_id>.json before 200 (idempotent if the file exists)
   - respond 200 quickly after it is durable
   - if the update is from my chat id, start sendChatAction typing immediately, then refresh every 4s until that spool file is gone or 2 minutes pass
   Do not put the secret or token in logs.

5. Get a public HTTPS URL Telegram can resolve. Try a tunnel if you want; if setWebhook returns “Failed to resolve host”, switch to a smee.io (or similar) relay into the local listener. Save the public URL in a 0600 file. Then setWebhook with secret_token and allowed_updates including message. Confirm getWebhookInfo shows a URL and no last_error_message.

6. Add a supervisor that keeps the listener, the public relay/tunnel, and setWebhook healthy. If you restart the listener to pick up code changes, actually kill the old PID. A supervisor that “starts only if pid is dead” will leave stale code serving, and typing keepalive will look broken.

7. Create a Grok Bot scheduled routine (cron), not a webhook routine, that drains the spool. Cadence: every minute during my waking hours in my timezone (default 7:00–23:59 local, all week if this is a personal bot). Prompt the routine to:
   - look up the Telegram connector
   - check /healthz and restart the supervisor if it is down
   - read ~/.local/telegram-mcp/spool/*.json (not spool/done)
   - stay completely silent in the Grok Bot chat if there is nothing new
   - only handle my chat id
   - refresh typing, do the work, reply with tg_send_message as this agent
   - move processed files to spool/done
   - never print token, secret, or public URL
   - never call tg_get_updates while the webhook is set
   Stay quiet in Grok Bot after a normal Telegram reply unless blocked.

8. Set connector custom instructions to match that inbound path.

9. Prove it: send me a short Telegram message asking me to reply, process that reply via webhook → spool → routine, and reply in Telegram. Then tell me in Grok Bot chat that it is live, including the bot @username. Mention the one caveat: this is not instant like OpenClaw’s own gateway; the drain is about once a minute, but typing should hold from the moment the DM lands until the reply.

If something fails, fix that path. Do not fall back to a 2-minute getUpdates poller unless webhook registration is truly impossible, and say so plainly if you do.