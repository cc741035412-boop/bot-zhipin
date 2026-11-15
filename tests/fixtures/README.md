# 测试用示例数据

`tests/fixtures/bots/` 是三条测试共用的示例 Bot，内容都是虚构的，截图是纯色占位图：

- `demo-prd-reviewer`（岗位：产品）：完整的普通 Bot，有头像、一句 pitch、`about`（介绍、能做的事、第一句话、适合谁）、两个技能、定时任务
- `demo-weekly-digest`（岗位：内容）：没有头像、pitch 和 `about`，有两张截图，`forkedFrom: demo-prd-reviewer`
- `demo-external`（岗位：管家）：外部收录（`external: true`），只有 bot.yaml；有两句 pitch，`about` 里带自带技能和定时任务

旁边两个目录是配套的小队和策展：

- `tests/fixtures/squads/demo-squad/squad.yaml`：三个示例 Bot 组成的小队，带队队形，所有可选字段都写了
- `tests/fixtures/curation/shelf.yaml`：3 个主推、2 个专题、1 条编辑点评

用法：设置环境变量 `BOTS_DIR=tests/fixtures/bots`，校验器、构建和本地预览就会读这里而不是 `bots/`；
小队和策展会自动跟着取它的兄弟目录（`tests/fixtures/squads`、`tests/fixtures/curation/shelf.yaml`），不用另外设。
要单独指定，用 `SQUADS_DIR`、`CURATION_FILE`。例如 `BOTS_DIR=tests/fixtures/bots npm run dev:full`。

改这里的数据会影响多个测试，改之前 grep 一下谁在用。
