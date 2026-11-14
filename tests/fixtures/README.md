# 测试用示例 Bot

`tests/fixtures/bots/` 是三条测试共用的示例数据，内容都是虚构的，截图是纯色占位图：

- `demo-prd-reviewer`：完整的普通 Bot（有头像、pitch、两个技能、定时任务）
- `demo-weekly-digest`：没有头像和 pitch，有两张截图，`forkedFrom: demo-prd-reviewer`
- `demo-external`：外部收录（`external: true`），只有 bot.yaml

用法：设置环境变量 `BOTS_DIR=tests/fixtures/bots`，校验器、构建和本地预览就会读这里而不是 `bots/`。
例如 `BOTS_DIR=tests/fixtures/bots npm run dev:full`。

改这里的数据会影响多个测试，改之前 grep 一下谁在用。
