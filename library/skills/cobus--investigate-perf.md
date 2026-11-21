---
id: cobus:skills/investigate-perf/SKILL.md
kind: skill
title: Investigate Perf
zh:
  title: 性能瓶颈排查记录器
  purpose: 结合监控面板、调用链与代码提交定位性能热点，输出区分事实与推测的排查简报。
  audience: 看到接口变慢或资源飙高、要对着监控和最近发布找原因的后端研发
source: cobusgreyling/grok-bot-templates
sourceUrl: https://github.com/cobusgreyling/grok-bot-templates/blob/4f3f28b4e6578cd227ff7f4b78ec91d15fd091b5/skills/investigate-perf/SKILL.md
sourcePath: skills/investigate-perf/SKILL.md
author:
  name: Cobus Greyling
  url: https://github.com/cobusgreyling
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 原文件全文收录，一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
bodyHash: sha256:740f0fe9c3a29283c50d54c0016f2ac96138a89a953c1758a44597d79e0ad07b
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
extra:
  whenToUse: |
    A named latency, error, or resource hotspot needs an evidence write-up from dashboards, traces, and code — without touching alerts or production.
  note: 热点附截图或链接，事实假设分标
---

# Investigate Perf

Paste this into Grok Bot after a successful run:

> Save the process we just used as a skill called “Investigate Perf”.

A useful skill states the six fields from [Skills and routines](https://docs.x.ai/grok-bot/skills-routines-and-automations).

## 1. When to use it

A named latency, error, or resource hotspot needs an evidence write-up from dashboards, traces, and code — without touching alerts or production.


## 2. Required inputs and access

- Symptom and time window (e.g. checkout latency since yesterday's release)
- Observability dashboards, traces, or flamegraphs the owner can open
- Source-control links (GitHub) for the suspected change

## 3. Sequence of work

1. Restate the symptom and window. List which dashboards and traces you actually opened.
2. Identify the highest-confidence hotspot with screenshots or direct links.
3. Separate facts (what the chart shows) from hypotheses (why).
4. Map to a commit or PR when the connector shows one. Do not change alerts, flags, or production settings.

## 4. How to validate the result

The hotspot has a link or screenshot. Facts and hypotheses are labeled. Alerts and production settings are unchanged.


## 5. What to return

Short write-up: Symptom, Window, Hotspot, Facts, Hypotheses, Next check, Action log.


## 6. What requires approval

Do not change alerts, feature flags, or production settings. Do not page anyone or merge a "fix" PR.


Type `/` in the composer to reference a saved skill. If it does not appear, open **Settings → Plugins → Yours** and enable it for this Bot.