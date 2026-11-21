import { expect } from '@playwright/test'
import { mkdtemp, mkdir, writeFile, rm } from 'node:fs/promises'
import { join } from 'node:path'
import { tmpdir } from 'node:os'
import { spawn, execFileSync } from 'node:child_process'
import { once } from 'node:events'
import YAML from 'yaml'
import { summary, skill } from './library-data.mjs'

// 真实库没有双命令与缺 usage 的记录。在临时目录造差异，不改源 YAML 或生产页面。
export async function exerciseEdges(page, copy) {
  const root = await mkdtemp(join(tmpdir(), 'library-edge-'))
  const sentinel = 'DETAIL_BODY_SENTINEL'
  const p = {
    ...summary,
    titleOriginal: undefined,
    usage: undefined,
    copyright: '版权归原作者，原页未声明许可',
    author: { name: '匿名' },
    license: '未声明',
    licenseUrl: undefined,
    body: sentinel,
  }
  const install = [
    { agent: skill.agents[0], command: skill.install[0].command },
    { agent: '通用', command: 'printf "example"\n  printf "two"\n' },
  ]
  const s = { ...skill, install, requires: [] }
  const file = (dir, i) => join(root, dir, i.slug + '.yaml')
  try {
    for (const [dir, i] of [
      ['prompts', p],
      ['skills', s],
    ]) {
      await mkdir(join(root, dir))
      await writeFile(file(dir, i), YAML.stringify(i))
    }
    await withLibraryServer(root, checkPages)
  } finally {
    await rm(root, { recursive: true, force: true })
  }
  async function checkPages(base) {
    const resources = []
    page.on('response', (r) => {
      if (['script', 'document'].includes(r.request().resourceType())) resources.push(r.text().catch(() => ''))
    })
    await page.goto(`${base}/prompts/${p.slug}`)
    await expect(page.locator('.ix-title h1')).toHaveText(p.title)
    await expect(page.locator('.ix-orig,.lib-page dd a')).toHaveCount(0)
    await expect(page.locator('.ix-meta small')).toHaveText(p.copyright)
    await expect(page.locator('#body')).toHaveText(sentinel)
    await expect(page.locator('.copy')).toHaveCount(2)
    await expect(page.locator('.ix-body h2')).toHaveText(['正文', '摘要', '适用场景', '来源'])
    expect((await Promise.all(resources)).join('')).toContain(sentinel)
    await page.goto(`${base}/skills/${s.slug}`)
    const buttons = page.locator('.copy')
    await expect(buttons).toHaveCount(2)
    await expect(page.locator('.ix-term p')).toHaveCount(0)
    await expect(page.locator('.ix-body h2')).toHaveText(['安装', '摘要', '适用场景', '来源'])
    await copy(page, buttons.nth(0), 'Enter', install[0].command)
    await expect(buttons.nth(1)).toHaveText('复制')
    await copy(page, buttons.nth(1), 'Space', install[1].command)
    await expect(buttons.nth(0)).toHaveText('已复制')
    await rm(file('prompts', p))
    await expect(async () => {
      await page.goto(base + '/prompts/')
      await expect(page.locator('.lib-empty')).toBeVisible({ timeout: 1500 })
    }).toPass({ timeout: 10000 })
    await page.getByRole('button', { name: '看看全部' }).click()
    await expect(page.locator('#library-search')).toBeFocused()
    await expect(page.locator('.bz-count')).toHaveText('共 0 条')
  }
}

// 和正式库的 4205 预览隔离，只在指定目录加载测试数据。
export async function withLibraryServer(root, use) {
  const base = 'http://127.0.0.1:4192'
  const server = spawn(process.execPath, [
    'node_modules/vitepress/bin/vitepress.js', 'dev', 'site', '--host', '127.0.0.1', '--port', '4192', '--strictPort',
  ], {
    env: { ...process.env, BOTS_DIR: 'tests/fixtures/bots', PROMPTS_DIR: join(root, 'prompts'), SKILLS_DIR: join(root, 'skills') },
    stdio: 'ignore',
  })
  try {
    await expect.poll(async () => {
      try { return server.exitCode === null && (await fetch(base + '/prompts/')).ok }
      catch { return false }
    }, { timeout: 15000 }).toBe(true)
    await use(base)
  } finally {
    if (server && server.exitCode === null && server.signalCode === null) {
      const command = execFileSync('ps', ['-o', 'command=', '-p', String(server.pid)], { encoding: 'utf8' })
      if (!command.includes('vitepress.js dev site') || !command.includes('4192')) throw Error('测试进程不匹配')
      const done = once(server, 'exit')
      server.kill('SIGTERM')
      await done
    }
  }
}
