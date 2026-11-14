// 真浏览器验收。默认先跑 npm run dev:full（构建 + 本地 D1 + wrangler pages dev，端口 8788）。
// 已经有服务在跑时，用 E2E_BASE_URL=http://127.0.0.1:xxxx npm run e2e 指过去。
import { defineConfig } from '@playwright/test'

const baseURL = process.env.E2E_BASE_URL || 'http://127.0.0.1:8788'

export default defineConfig({
  testDir: 'tests/e2e',
  outputDir: 'test-results',
  fullyParallel: false,
  workers: 1,
  use: { baseURL, screenshot: 'only-on-failure', trace: 'retain-on-failure' },
  webServer: process.env.E2E_BASE_URL
    ? undefined
    : { command: 'npm run dev:full', url: baseURL, reuseExistingServer: true, timeout: 180_000 },
  projects: [{ name: 'chromium', use: { browserName: 'chromium' } }],
})
