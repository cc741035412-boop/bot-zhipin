# 第一期任务看板

状态：⬜ 未开始 · 🟡 进行中 · ✅ 已验收。每个任务的完整契约和验收命令在维护者本地的派活目录，这里只记摘要。

| # | 任务 | 执行 | 前置 | 写入范围 | 状态 |
|---|---|---|---|---|---|
| H1 | 清场 + 骨架：目录、依赖、schema、模板、共享读取代码、接口约定、CI、许可证 | 维护者 | — | 全仓 | 🟡 |
| M1 | 4 个外部收录 Bot 的数据与文案、默认台词、首页文案 | 维护者 | H1 | `bots/<外部>/`、`site/.vitepress/meta.mjs` | ⬜ |
| M2 | 投稿文档：AGENTS.md、CONTRIBUTING.md、README、PR 模板、安全提醒 | 维护者 | H1 | 根目录文档 | ⬜ |
| M3 | 交互规格 `docs/dev/INTERACTION.md`（实测旧页面 + 补齐缺失状态） | 维护者 | — | `docs/dev/INTERACTION.md` | ⬜ |
| P1 | `npm run validate` 全部规则 + 中文报错 + 样例测试 | 编码 agent | H1 | `scripts/validate.mjs`、`scripts/lib/validate/`、`tests/unit/validate*`、`tests/fixtures/` | ⬜ |
| P2 | 站点功能：首页货架、排序、详情页、两个按钮、复制提示词、默认头像 | 编码 agent | H1 | `site/`（除 vendor）、`tests/e2e/site*` | ⬜ |
| P3 | 计数后端：Functions + D1 迁移 + 去重 + 测试 | 编码 agent | H1 | `functions/`、`migrations/`、`tests/unit/api*`、`scripts/accept-click.sh` | ⬜ |
| P4 | 交互实现（按 M3），单独成任务 | 编码 agent | P2、M3 | `site/.vitepress/theme/`、`tests/e2e/interaction*` | ⬜ |
| P5 | 投稿流程实测：零上下文 agent 只拿 README 提示词，照 AGENTS.md 做示例 Bot | 编码 agent | P1、M2 | `bots/<示例>/`（验收后删除） | ⬜ |
| P6 | 集成验收 1–3 + 独立代码审查 + 交付清单 | 维护者 | 全部 | — | ⬜ |
| P7 | 真实用户测试：上线后用真实 Grok Bot 走完「从货架导入 / 复制提示词安装」和「让 Bot 替我投稿上架」两条路径 | 维护者 | P6、上线 | — | ⬜ |

## 第一期验收（来自需求）

1. `npm run validate` 和 `npm run build` 本地通过。
2. 用 `_template` 做示例 Bot，本地能看到卡片和详情页；删掉一个必填字段，validate 给出清楚的中文错误；验收完删掉示例。
3. 本地 `npm run dev:full` 下点按钮热度增加、刷新后排序跟着变；同一 IP 重复点击不重复计数。

## 第一期不做

AI 自动审核、贴链接自动填信息、线上版本比对、点赞评论、作者主页、贡献者榜、需求板、分类筛选、多语言、登录系统，以及除点击计数以外的任何后端。
