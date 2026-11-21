# 第三方代码声明

## bloub

- 用途：按 slug 生成默认头像（`site/.vitepress/theme/vendor/bloub/`）
- 来源：https://github.com/jeremy-prt/bloub （提交 `b4bb3c1b5f93c7b87a2e8d620f667c4093d97749`，目录 `src/bot/`）
- 许可证：MIT，Copyright (c) 2026 Jérémy Perret，全文见 `site/.vitepress/theme/vendor/bloub/LICENSE`
- 本站 `LiveBot.vue` 的渲染方式、`live/gaze.ts` 的视线参数参考了 jeremy-prt/bloub 的 `src/components/BloubBot.vue` 和 `src/ui/gaze.ts`（MIT，提交 `b4bb3c1`）。

## VitePress

- 用途：站点生成器（npm 依赖，不随仓库分发）
- 许可证：MIT

## Noto Sans SC

- 用途：分享图的 Medium 和 Bold 字体（随仓库分发静态 OTF 子集）
- 来源：https://github.com/notofonts/noto-cjk/releases/tag/Sans2.004 （简体中文 Noto Sans CJK SC）
- 许可证：OFL-1.1，全文见 `scripts/og/fonts/OFL.txt`

## satori

- 用途：将分享图文字转为 SVG 路径（npm 依赖，不随仓库分发）
- 许可证：MPL-2.0

## @resvg/resvg-js

- 用途：将分享图 SVG 光栅化为 PNG（npm 依赖，不随仓库分发）
- 许可证：MPL-2.0
