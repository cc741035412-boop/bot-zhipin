import { existsSync, realpathSync } from 'node:fs'
import { resolve, sep } from 'node:path'
import { resolvePages } from 'vitepress'
import { BOTS_DIR } from '../../scripts/lib/load-bots.mjs'
import { SQUADS_DIR } from '../../scripts/lib/load-squads.mjs'
import { CURATION_FILE } from '../../scripts/lib/load-curation.mjs'
import { PROMPTS_DIR, SKILLS_DIR } from '../../scripts/lib/load-library.mjs'

// VitePress 1.6 动态 paths 不支持 watch 配置。定点监听后重启 dev server，
// 同时刷新动态路由、设计说明和工作区外的数据；不在构建时扫描外部目录。
// 监听五处：Bot 目录、小队目录、策展文件（Bot 摘要带着策展和小队的装饰，哪一处变了都要重来），
// 以及收录的 Prompt、Skill 目录（详情页是动态路由，增删一条要重算路由）。
export function botWatch() {
  const real = (path) => existsSync(path) ? realpathSync(path) : resolve(path)
  const targets = [BOTS_DIR, SQUADS_DIR, CURATION_FILE, PROMPTS_DIR, SKILLS_DIR].map(real)
  return {
    name: 'bot-directory-watch',
    configureServer(server) {
      let timer
      server.watcher.add(targets)
      const changed = (_event, file) => {
        if (!targets.some((target) => file === target || file.startsWith(target + sep))) return
        clearTimeout(timer)
        timer = setTimeout(async () => {
          try {
            const site = server.config.vitepress
            Object.assign(site, await resolvePages(site.srcDir, site.userConfig, site.logger))
            await server.restart()
          } catch (error) {
            server.config.logger.error(`货架数据刷新失败：${error.message}`)
          }
        }, 100)
      }
      server.watcher.on('all', changed)
      server.httpServer?.once('close', () => {
        clearTimeout(timer)
        server.watcher.off('all', changed)
      })
    },
  }
}
