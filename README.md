# Bot 直聘

Grok Bot 模板货架：挑一个顺手的直接导入，也欢迎把你做的 Bot 挂上来。

- 网站：上线后补上地址
- 每个 Bot 是 [`bots/`](bots/) 下的一个文件夹，里面有岗位说明、技能、定时任务、截图和作者的设计说明
- 任何人都可以通过 PR 投稿，合并后网站自动更新，投稿者成为项目贡献者

## 怎么用货架上的 Bot

每个 Bot 的卡片和详情页上有两个按钮：

- **一键导入**：打开 x.ai 官方模板页，在那里点 **Add to Grok Bot**。
- **复制安装提示词**：模板链接打不开时的备用办法。点一下会复制一段话，发给你自己的 Grok Bot，它会先告诉你这个 Bot 会做什么、要哪些权限，等你确认后再安装。

导入前请看一眼详情页里的「会用到的权限」和「额度消耗」。

## 我要投稿

把下面这段话原样复制，发给你的 AI 助手（Codex、Claude Code，或者你的 Grok Bot）：

```text
请帮我把我做的 Grok Bot 投稿到「Bot 直聘」：https://github.com/jakob52123/bot-zhipin
1. 先完整读一遍仓库根目录的 AGENTS.md，严格按它的步骤做。
2. 需要我提供的信息（Bot 的模板分享链接、它做什么、截图、我的 GitHub 用户名等），一次性列出来问我，不要自己编。
3. 不要让我把 GitHub 令牌或密码发给你；需要登录 GitHub 时，让我自己在浏览器里完成。
4. 每做完一步告诉我进度，最后把 PR 链接发给我。
```

想自己动手，或者只用网页投稿，看 [CONTRIBUTING.md](CONTRIBUTING.md)。

> **安全提醒**：不要把 GitHub 令牌放进 Grok Bot 的云电脑（第三方模板能读到那台电脑上的所有文件）；需要令牌时用权限最小、能随时撤销的，提交完就撤销；投稿里不要有任何 API 密钥、内部链接或个人数据。

## 开发

需要 Node.js 22 以上。

| 命令 | 作用 |
|---|---|
| `npm ci` | 安装全部依赖 |
| `npm run validate` | 校验所有 Bot |
| `npm run dev` | 本地预览页面 |
| `npm run dev:full` | 本地预览 + 点击计数接口（Cloudflare Pages Functions + 本地 D1） |
| `npm test` | 单元测试 |
| `npm run e2e` | 真浏览器测试 |
| `npm run check` | 提交前检查：validate + test + build |

维护者文档在 [`docs/dev/`](docs/dev/)。

## 授权

- 网站代码：[MIT](LICENSE)
- `bots/` 下的投稿内容：[CC BY 4.0](bots/LICENSE)
- 第三方代码：见 [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md)
