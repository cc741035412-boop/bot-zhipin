# library/ 的许可说明

`library/` 是从开源仓库收来的原料，**混合许可**，每一条按它自己的许可走：

- 全文文件（`profiles/`、`prompts/`、`skills/`、`routines/`、`teams/`、`recipes/` 下的 `.md`）以文件头的 `license` 字段为准；CC BY 的条目另有 `attribution` 字段，转载时要一并带上。
- `links.jsonl` 每行的 `sources[].license` 是该来源那一行的许可；`summary`、`summaryZh` 各自带着 `license` 和 `from`，用哪段文字就按哪段的许可署名。
- 分享链接本身、Bot 名字、分享人是谁、链接还能不能打开，这些是事实，不主张任何权利。

这个目录**不适用** `bots/LICENSE`（那是投稿内容的 CC BY 4.0 授权），也**不适用**仓库根目录的 `LICENSE`（MIT，只管本站代码）。每个 Bot 和提示词的权利归原作者，本站只是按原许可转载。

本站另加的字段（`zh`、`rubric`、`score`、`cnFit`、`needsReview`、`firstTask`、`expect`、`changes`）是本站写的，不是原作者写的；它们随所在条目，按该条的许可发布。

## 来源和许可

| 来源 | 提交 | 许可 | 收了什么 | 署名要求 |
|---|---|---|---|---|
| [cobusgreyling/grok-bot-templates](https://github.com/cobusgreyling/grok-bot-templates) | `4f3f28b` | MIT，Copyright (c) 2026 Cobus Greyling | 岗位设定、技能、定时任务、团队、设计模式 | 保留版权声明和 MIT 许可文本，见 `THIRD_PARTY_NOTICES.md` |
| [ZeroPointRepo/GrokBotDev](https://github.com/ZeroPointRepo/GrokBotDev) | `48fec85` | `content/` 为 CC BY 4.0 | 用例提示词、分享链接和介绍、合集分组 | 逐条署名「GrokBot.dev contributors」，注明许可和改动（每个文件的 `attribution`、`changes`） |
| [elie222/botdirectory.ai](https://github.com/elie222/botdirectory.ai) | `447d18f` | MIT，Copyright (c) 2026 Inbox Zero Inc. | Bot 安装提示词、分享链接 | 保留版权声明和 MIT 许可文本 |
| [RongleCat/awesome-grok-bot](https://github.com/RongleCat/awesome-grok-bot) | `e50ac2f` | CC0 1.0 | 中文玩法提示词、分享链接 | 无强制要求，本站仍注明来源 |
| [sit-in/awesome-grokbot-playbooks](https://github.com/sit-in/awesome-grokbot-playbooks) | `a098478` | MIT，Copyright (c) 2026 awesome-grokbot-playbooks contributors | 中文配方 | 保留版权声明和 MIT 许可文本 |
| [majiayu000/awesome-grok-bot](https://github.com/majiayu000/awesome-grok-bot) | `34ae6ed` | 目录数据 CC0 1.0；个别行标 MIT | 分享链接和中英文摘要、团队配方、首个任务写法 | CC0 无强制要求；MIT 行保留版权声明；文字回溯到 GrokBotDev 的行改按 CC BY 署名 |
| [kydlikebtc/awesome-grokbot](https://github.com/kydlikebtc/awesome-grokbot) | `f64dc25` | 逐行：CC0 1.0 或 CC BY 4.0（继承 GrokBotDev） | 分享链接和中英文摘要、失效链接 | CC BY 行带着原署名 |

## 没收的

- botdirectory.ai 里投稿人不是原作者、又没给来源链接的条目：只留标题和链接，不收正文，清单在 `link-only.jsonl`。
- x.ai 分享页上的配置和介绍原文（kydlikebtc 的 `official_summary` 也是），按 `docs/dev/DECISIONS.md` 第 9 条只放链接。
- 要登录、付费才能看的内容，以及没有开放许可的站点文案。

完整的数量、去重和取舍见 `docs/dev/INGEST.md`。
