#!/usr/bin/env node
// Same production computation, including 25 real HMAC verifications. No network/DB I/O.
import { mkdtemp, readFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { randomBytes } from 'node:crypto'
import { performance } from 'node:perf_hooks'
import { build } from 'esbuild'
import { pack } from './submission/bundle-core.mjs'
import { buildBotModel } from './lib/bot-model.mjs'

const root = fileURLToPath(new URL('../', import.meta.url))
const temporary = await mkdtemp(join(tmpdir(), 'bz-bench-'))
try {
  const output = join(temporary, 'submit.mjs')
  await build({ entryPoints: [join(root, 'functions/_lib/submit.ts')], outfile: output, bundle: true, platform: 'node', format: 'esm', logLevel: 'silent', banner: { js: "import { createRequire } from 'node:module'; const require = createRequire(import.meta.url);" } })
  const { submitBot } = await import(pathToFileURL(output))
  const sessionOutput = join(temporary, 'session.mjs')
  await build({ entryPoints: [join(root, 'functions/_lib/session.ts')], outfile: sessionOutput, bundle: true, platform: 'node', format: 'esm', logLevel: 'silent' })
  const { sign } = await import(pathToFileURL(sessionOutput))
  const slug = 'bench-demo', now = Date.now(), user = { id: 123, login: 'Alice' }
  const secrets = { SESSION_SECRET: randomBytes(32).toString('hex') }
  const read = (rel) => readFile(join(root, 'tests/fixtures/bots/demo-prd-reviewer', rel), 'utf8')
  const rels = ['bot.yaml', 'ROLE.md', 'DESIGN.md', 'routines.md', 'skills/checklist-review/SKILL.md']
  const files = {}
  for (const rel of rels) {
    let text = (await read(rel)).replaceAll('demo-prd-reviewer', slug)
    if (rel !== 'bot.yaml') {
      const remaining = 102000 - Buffer.byteLength(text) - 1
      const paragraph = 'Ordinary benchmark content without credentials. '.repeat(16) + '\n'
      text += '\n' + paragraph.repeat(Math.ceil(remaining / paragraph.length)).slice(0, remaining)
    }
    files[`bots/${slug}/${rel}`] = text
  }
  const screenshots = Array.from({ length: 25 }, (_, i) => `shot-${i}.png`)
  const bundle = pack({ slug, files, screenshots })
  const textBytes = Object.values(files).reduce((sum, text) => sum + Buffer.byteLength(text), 0)
  if (textBytes < 400000 || textBytes > 409600 || Object.keys(files).length + screenshots.length !== 30) throw new Error('Benchmark fixture is not at the required limits')
  const receipts = await Promise.all(screenshots.map((_, i) => sign(secrets.SESSION_SECRET, {
    t: 'r', v: 1, uid: user.id, sha: (i + 1).toString(16).padStart(40, '0'), size: 2097152, format: 'png', exp: now + 86400000,
  })))
  const templateFiles = await Promise.all(['bot.yaml', 'ROLE.md', 'DESIGN.md', 'routines.md', 'skills/example-skill/SKILL.md'].map(async (rel) => ({
    rel, text: await readFile(join(root, 'bots/_template', rel), 'utf8'),
  })))
  const context = { index: [], templateModel: buildBotModel('_template', { files: templateFiles }) }
  const github = {
    installationToken: async () => '', getRef: async () => ({ object: { sha: '1'.repeat(40) } }),
    getCommit: async () => ({ tree: { sha: '2'.repeat(40) } }), getContent: async () => null,
  }
  const db = { prepare: () => ({ bind: () => ({ first: async () => ({ n: 1, bytes: 0 }), all: async () => ({ results: [] }) }) }) }
  const deps = { github, db, context: async () => context, now, secrets, dryRunUserIds: '123', origin: 'http://127.0.0.1' }
  const input = { bundle, screenshots: receipts, license: true, dryRun: true }
  const run = async () => {
    const result = await submitBot(input, user, deps)
    if (!result.dryRun || result.files.length !== 30) throw new Error('Benchmark did not complete validation')
  }
  for (let i = 0; i < 20; i++) await run()
  const times = [], runs = 400
  for (let i = 0; i < runs; i++) {
    const start = performance.now()
    await run()
    times.push(performance.now() - start)
  }
  times.sort((a, b) => a - b)
  const report = { runs, p50: +times[Math.ceil(runs * 0.5) - 1].toFixed(3), p99: +times[Math.ceil(runs * 0.99) - 1].toFixed(3) }
  if (!process.argv.includes('--json')) console.log(`30 files, ${textBytes} text bytes, 25 signed receipts, 20 warmups; full dryRun orchestration (I/O mocked).`)
  console.log(JSON.stringify(report))
} finally {
  await rm(temporary, { recursive: true, force: true })
}
