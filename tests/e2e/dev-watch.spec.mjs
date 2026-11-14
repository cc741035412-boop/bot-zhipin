import { test, expect } from '@playwright/test'
import { spawn, execFileSync } from 'node:child_process'
import { once } from 'node:events'
import { cp, mkdtemp, readFile, writeFile, rm, mkdir } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'

test('工作区外 BOTS_DIR：首页及动态详情自动刷新，坏 YAML 跳过并警告', async ({ page }) => {
  test.setTimeout(60_000)
  const temp = await mkdtemp(join(tmpdir(), 'p2-watch-'))
  const bots = join(temp, 'bots')
  await cp('tests/fixtures/bots', bots, { recursive: true })
  const server = spawn(process.execPath, ['node_modules/vitepress/bin/vitepress.js', 'dev', 'site', '--host', '127.0.0.1', '--port', '4183', '--strictPort'], {
    cwd: resolve('.'),
    env: { ...process.env, BOTS_DIR: bots },
    stdio: ['ignore', 'pipe', 'pipe'],
  })
  let log = ''
  server.stdout.on('data', (data) => { log += data })
  server.stderr.on('data', (data) => { log += data })
  try {
    await expect.poll(async () => {
      try { return (await fetch('http://127.0.0.1:4183/', { signal: AbortSignal.timeout(1000) })).ok }
      catch { return false }
    }, { timeout: 15_000 }).toBe(true)
    await page.route('**/api/stats', (route) => route.abort())
    await page.goto('http://127.0.0.1:4183/')
    await expect(page.locator('[data-slug="demo-weekly-digest"]')).toContainText('示例·周报整理员')
    const yaml = join(bots, 'demo-weekly-digest/bot.yaml')
    await writeFile(yaml, (await readFile(yaml, 'utf8')).replace('示例·周报整理员', '热刷新测试员'))
    await expect(page.locator('[data-slug="demo-weekly-digest"]')).toContainText('热刷新测试员', { timeout: 15_000 })
    await page.goto('http://127.0.0.1:4183/bots/demo-weekly-digest')
    await expect(page.locator('h1')).toHaveText('热刷新测试员')
    const design = join(bots, 'demo-weekly-digest/DESIGN.md')
    await writeFile(design, (await readFile(design, 'utf8')) + '\n\n## 热刷新设计说明\n\n刷新成功。\n')
    await expect(page.getByTestId('section-design')).toContainText('刷新成功。', { timeout: 15_000 })
    await mkdir(join(bots, 'broken-bot'))
    await writeFile(join(bots, 'broken-bot/bot.yaml'), 'name: [未闭合\n')
    await expect.poll(() => log, { timeout: 15_000 }).toContain('跳过 bots/broken-bot/bot.yaml')
    await page.goto('http://127.0.0.1:4183/')
    await expect(page.getByTestId('bot-card')).toHaveCount(3)
  } finally {
    if (server.exitCode === null) {
      const command = execFileSync('ps', ['-o', 'command=', '-p', String(server.pid)], { encoding: 'utf8' })
      if (!command.includes('vitepress.js dev site') || !command.includes('4183')) throw new Error('开发服务 PID 不匹配，未终止进程')
      const exited = once(server, 'exit')
      server.kill('SIGTERM')
      await exited
    }
    await rm(temp, { recursive: true, force: true })
  }
})
