# 维护者手册：审核投稿

## 投稿从哪来

| 来源 | 样子 | 说明 |
|---|---|---|
| 一链接投稿（默认） | Issue 带 `投稿` 标签，几十秒后 Issue 下出现自动回复；通过的会自动开一个 `submission/issue-<号>` 分支的 PR，作者显示为 github-actions，提交作者是投稿人本人 | `.github/workflows/submission.yml` |
| 自己 fork 提 PR | 普通 PR，只改 `bots/<slug>/` | 外部贡献者改了 `bots/` 以外的文件，CI 的范围检查会直接失败 |

## 审核一个投稿 PR（2026-11-15 真实联调验证过的步骤）

1. 打开 PR。如果页面提示有工作流**等待批准**（自动投稿 PR 和首次贡献者的 PR 都会这样），先点 **Approve and run workflows**，等 `validate-and-build` 通过。
   - 自动投稿还会额外派发一次 CI（workflow_dispatch），它的结果挂在提交上，但**不能代替** PR 上这次检查；以 PR 上的这次为准。
2. 人工核对机器判断不了的：
   - DESIGN.md 是不是真实情况（没有编造效果数据）；
   - 截图是不是这个 Bot 的真实输出，有没有露出密钥、内部信息、隐私；
   - `permissions` 是否如实（对照 ROLE.md 和 SKILL.md 看它会做什么）；
   - `templateUrl` 在**无痕窗口**里能打开；
   - 有没有借投稿夹带推广、引流内容。
3. 没问题就 **Approve**，然后 **Merge**（用普通合并提交，保留投稿人的提交，GitHub 才会把他算成贡献者）。约 10 秒后网站自动更新。
4. 合并新 Bot 后，在仓库根运行 `node scripts/sync-faces.mjs`，检查每个 Bot 的颜色、形状和警告，再运行 `node scripts/sync-faces.mjs --check` 做**离线校验**；确认后把 `site/.vitepress/data/faces.json` 的改动提交上去。抓取失败保留旧条目，没有旧数据则继续 seed 回退，不能把警告当成功。此步是本轮真脸模块落地后的维护流程；构建不联网，不把抓取加进 build。
5. 有问题就在 PR 里留言。一链接投稿的，让投稿人把意见发给他的 AI，改好后编辑原 Issue 的投稿包，自动重新检查、更新同一个 PR。

注意：维护者自己提的 PR（比如改网站代码）作者是你本人，GitHub 不允许自己批准自己，只能用管理员身份绕过规则合并。投稿 PR 的作者不是你，所以走正常的批准流程即可。

## 下架

提一个 PR 删掉 `bots/<slug>/`，合并后约 10 秒首页消失；详情页由 `functions/bots/[slug].ts` 兜底，立即返回 404。

## 计数数据

热度存在 Cloudflare D1 `bot-zhipin` 的 `click_counts`、`click_dedupe` 两张表。要清零（比如上线前清掉测试点击），在 Cloudflare 控制台 D1 → bot-zhipin → Console 执行：

```sql
DELETE FROM click_counts;
DELETE FROM click_dedupe;
```
