---
id: grokbotdev:content/use-cases/mine-my-machine-into-a-team.md
kind: prompt
title: Chief of Staff · Mine My Machine into a Team
zh:
  title: 本机工作流挖矿幕僚
  purpose: 扫描本机历史提示词和规则配置，按六步生成多智能体分工文件、技能库和运行手册
  audience: 在本地攒了一堆提示词和规则、想整合成智能体团队的开发者
source: ZeroPointRepo/GrokBotDev
sourceUrl: https://github.com/ZeroPointRepo/GrokBotDev/blob/48fec858f3968e12cb149ad205fe4ff059d8f2d1/content/use-cases/mine-my-machine-into-a-team.md
sourcePath: content/use-cases/mine-my-machine-into-a-team.md
author:
  name: Av1dlive
  url: https://x.com/Av1dlive
license: CC-BY-4.0
attribution:
  by: GrokBot.dev contributors
  repo: ZeroPointRepo/GrokBotDev
  license: CC BY 4.0
  licenseUrl: https://creativecommons.org/licenses/by/4.0/
fetchedAt: 2026-11-21T06:44:43Z
changes: 只收「## Prompt」下代码块里的提示词原文，一字未改；原页面的设置步骤和点评没有收；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
bodyHash: sha256:c2355e36bfb3c0e57596373426994b2d88be294f96ff628a1ca433d7b1a8f2dd
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
firstTask: 只用我贴的三条模拟工作记录：「周一把反馈按主题分组；周三又给反馈分组；周五我纠正：不要把猜测写成客户原话」。找出一项重复任务，给一个拟设岗位写分工草稿，把这次纠正列为边界。不扫本机、不建团队、不写文件、不开定时。
expect: 草稿把两次反馈分组归给一个岗位，并明确不能把猜测当客户原话。
extra:
  promptBlock: true
  provenance: author
  setupMinutes: 30
  difficulty: advanced
  autonomy: acts-with-approval
  schedule: adhoc
  category: engineering
  subcategory: agents-ops
  awesomeScore: 91
  replicability: The exact prompt Avid shared for a Grok Bot chief of staff — it reads your own machine to build the team, so it adapts itself. Just run it, keep the human gates on, and point it at the config paths that match your setup.
  status: live
  setup: |-
    1. In Grok Bot, open (or create) your chief of staff.
    2. Paste the exact prompt below — the one Avid switched to Grok Bot to run.
    3. It works in six phases — MINE, CLASSIFY, DESIGN, BUILD, VERIFY, HAND OFF — writing everything to a `team-build/` folder, not just chat.
    4. Keep the human gates on: it stops before it sends, pays, posts, deploys, deletes, or connects anything, and it never prints secrets, only filenames.
    5. When it finishes you have a `HANDBOOK.md`, role files, skills, and a verified end-to-end run — a real agent team mined from your own work.
  note: 完成须有文件路径、差异或经验证的响应
---

You are my chief of staff. Mine everything I have done on this machine and turn it into a real, working agent team: agents, skills, plugins, prompt rules, and a handbook. No fluff. Everything goes to files. Nothing lives only in chat.

**Hard rules (never break):**

1. Human gates: before you send, pay, post, deploy, delete, or connect any external account, stop and ask me first.
2. Never print or read secrets. `.env`, tokens, cookies: report filenames only, never contents.
3. Proof of done: file path, diff, or verified response. "Done" without proof is not done.
4. Every correction I give you gets saved permanently to `forbidden.md` or the relevant skill file.
5. Write everything to `team-build/`. Nothing exists only in this conversation.

**Phases, in order:**

1. MINE: scan `~/.claude/`, `~/.codex/`, `~/.config/opencode/`, Wispr Flow, Cursor/Aider rules, and any project `AGENTS.md` or `CLAUDE.md`. Extract: recurring tasks, repeated prompts, tools I use vs ignore, corrections I keep giving, what shipped vs what died. Group by task, not by tool. Write `team-build/mine-report.md`.

2. CLASSIFY: sort everything into 5 buckets: Skills / Plugins / Prompt styles (write `voice-dna.md` and `forbidden.md`) / Agents to hire / Junk. Write `team-build/classification.md`.

3. DESIGN (first principles): one-sentence mission from my actual work. Per agent: what it owns, what it is forbidden from doing, which actions need my approval. Kill list: agents I do not need. Fewest agents that cover the work. Write `team-build/design.md`.

4. BUILD: role files in `agents/<name>.md`. Skills in `skills/<name>/SKILL.md` with frontmatter and trigger conditions. One verified read-only end-to-end call per plugin. Chief-of-staff routing rules. Write `team-build/build-log.md`.

5. VERIFY: run one full end-to-end job and trace it: my message > chief of staff routes it > agent executes > artifact lands on disk > you review > result comes back. Write `team-build/verification.md`. If it fails, fix the team, not the report.

6. HAND OFF: write `team-build/HANDBOOK.md`: mission, roster, skills index, exact approval-gate list, and the format I use to give tasks. Operating loop: I state an outcome > you decompose into bounded packets > agents return artifacts with evidence > you review > final answer comes with proof > my corrections become permanent rules.