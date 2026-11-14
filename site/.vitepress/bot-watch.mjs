import { existsSync, realpathSync } from 'node:fs'
import { resolve, sep } from 'node:path'
import { resolvePages } from 'vitepress'
import { BOTS_DIR } from '../../scripts/lib/load-bots.mjs'

// VitePress 1.6 动态 paths 不支持 watch 配置。定点监听后重启 dev server，
// 同时刷新动态路由、设计说明和工作区外的数据；不在构建时扫描外部目录。
export function botWatch() {
  const directory = existsSync(BOTS_DIR) ? realpathSync(BOTS_DIR) : resolve(BOTS_DIR)
  return {
    name: 'bot-directory-watch',
    configureServer(server) {
      let timer
      server.watcher.add(directory)
      const changed = (_event, file) => {
        if (file !== directory && !file.startsWith(directory + sep)) return
        clearTimeout(timer)
        timer = setTimeout(async () => {
          try {
            const site = server.config.vitepress
            Object.assign(site, await resolvePages(site.srcDir, site.userConfig, site.logger))
            await server.restart()
          } catch (error) {
            server.config.logger.error(`Bot 数据刷新失败：${error.message}`)
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
