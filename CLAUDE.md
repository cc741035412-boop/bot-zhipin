# 维护者说明（给 Claude Code）

这是「Bot 直聘」：给 AI 产品经理学员用的 Grok Bot 模板货架。任何人通过 PR 往 `bots/` 投稿。

## 先读

- `docs/dev/ARCHITECTURE.md`：目录、数据流、约定
- `docs/dev/API.md`：点击计数接口约定（前后端共用）
- `docs/dev/DECISIONS.md`：已经定下的决策，改之前先问
- `docs/dev/TASKS.md`：任务看板
- 根目录 `AGENTS.md` 是**给投稿者的 AI** 看的投稿指南，不是维护说明

## 命令

| 命令 | 作用 |
|---|---|
| `npm run check` | 提交前必须通过：validate + test + build |
| `npm run validate` | 校验所有 Bot |
| `npm test` | vitest 单元测试 |
| `npm run dev` | 只看页面（没有计数后端，热度显示「—」） |
| `npm run dev:full` | 页面 + 计数接口 + 本地 D1，端口 8788 |
| `npm run e2e` | Playwright 真浏览器验收（自动起 dev:full） |
| `npm run new-bot -- <slug>` | 从模板新建 Bot |

## 规则

- 面向用户的文案一律简体中文；报错要写清文件、位置、改法。
- 不复制 fork 来源（原 Grok Bot 教程站）的任何文字、图片、组件代码。
- `site/.vitepress/theme/vendor/bloub/` 是第三方 MIT 代码，不改。
- 不提交任何密钥。线上变量在 Cloudflare 后台，本地在 `.dev.vars`（gitignore）。
- 分类、权限、额度的取值只在 `schema/bot.schema.json` 里定义，代码里通过 `loadEnums()` 读取，不写死。
- 本仓库本地还有 `upstream` 远端（原仓库）。`gh pr create` 一律带 `--repo jakob52123/bot-zhipin`，绝不推送或提 PR 到 upstream。
- 构建产物里不能有 `_worker.js`（会让 Pages 忽略 `functions/`）。
