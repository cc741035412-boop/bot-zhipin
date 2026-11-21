// 默认用 fixtures 构建并启动本地预览；接口与外链由测试 mock，不接触真实账号。
// 已经有服务在跑时，用 E2E_BASE_URL=http://127.0.0.1:xxxx npm run e2e 指过去。
import { defineConfig } from '@playwright/test'

const baseURL = process.env.E2E_BASE_URL || 'http://127.0.0.1:4175'

export default defineConfig({
  testDir: 'tests/e2e',
  outputDir: 'test-results',
  fullyParallel: false,
  workers: 1,
  use: { baseURL, screenshot: 'only-on-failure', trace: 'retain-on-failure' },
  webServer: process.env.E2E_BASE_URL
    ? undefined
    : {
        command: 'BOTS_DIR=tests/fixtures/bots PROMPTS_DIR=prompts SKILLS_DIR=skills npm run build && npm run preview -- --host 127.0.0.1 --port 4175',
        url: baseURL,
        reuseExistingServer: false,
        timeout: 180_000,
      },
  projects: [{ name: 'chromium', use: { browserName: 'chromium' } }],
})
