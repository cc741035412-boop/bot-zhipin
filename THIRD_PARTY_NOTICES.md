# 第三方代码声明

## Prompt 与 Skills 收录内容

每个条目页面标明原作者、具体出处与许可证；转载的 Prompt 正文遵循原许可证，不因收录而改用本站代码的许可证。转载正文的 Prompt 在各自页面上标出原许可证和原版权行。没有明确转载许可的只提供自写摘要和原文链接。Skill 不转载 SKILL.md 全文。

## bloub

- 用途：按 slug 生成默认头像（`site/.vitepress/theme/vendor/bloub/`）
- 来源：https://github.com/jeremy-prt/bloub （提交 `b4bb3c1b5f93c7b87a2e8d620f667c4093d97749`，目录 `src/bot/`）
- 许可证：MIT，Copyright (c) 2026 Jérémy Perret，全文见 `site/.vitepress/theme/vendor/bloub/LICENSE`
- 本站 `LiveBot.vue` 的渲染方式、`live/gaze.ts` 的视线参数参考了 jeremy-prt/bloub 的 `src/components/BloubBot.vue` 和 `src/ui/gaze.ts`（MIT，提交 `b4bb3c1`）。

## VitePress

- 用途：站点生成器（npm 依赖，不随仓库分发）
- 许可证：MIT
